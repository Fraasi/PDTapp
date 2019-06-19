const fetch = require('node-fetch')
const cheerio = require('cheerio')
const apiOptions = require('./apiOptions.js')


const dataToSave = {
  cheerio: {
    hietis: [],
    kujis: [],
    vastis: [],
    visitTre: [],
    hirvis: [],
    huurus: []
  },
  twitBook: {},
  scrapeTime: null
}

const cheerioScrapeInfo = {
  hietis: {
    Url: 'https://valiaikainenhiedanranta.fi/tapahtumat/tulevat-tapahtumat',
    Selector: 'article a',
  },
  kujis: {
    Url: 'https://www.kujakolli.fi/',
    Selector: '.tiedote dt',
  },
  vastis: {
    Url: 'http://vastavirta.net/en/',
    Selector: '.event-list-view li',
  },
  visitTre: {
    Url: 'https://visittampere.fi/tapahtumakalenteri/',
    Selector: '.events-container .event-block',
  },
  hirvis: {
    Url: 'https://www.facebook.com/Hirvitalo-Pispalan-Nykytaiteen-Keskus-202287073132009/',
    Selector: '.userContentWrapper'
  },
  huurus: {
    Url: 'http://www.huurupiilo.fi/tapahtumat-events/',
    Selector: '.events-table tr',
  }
}

let cheerioCount = 0
const cheerioCountTo = Object.keys(dataToSave.cheerio).length
let twitCount = 0
const twitCountTo = Object.keys(apiOptions).length

export default function gigScrape(handleStateChange) {
  const startTime = new Date()
  async function cheerioi(url, selector, pub) {
    const result = await fetch(url)
      .then(data => data.text())
      .then((html) => {
        const $ = cheerio.load(html)
        if (url.includes('kujakolli')) {
          const arr = $(selector).map((i, el) => {
            const s = $(el).text().replace(/\n\t/g, '').split('(')
            return `${s[1].slice(0, -1)} ${s[0]}`
          }).get()
          return arr
        }
        if (url.includes('vastavirta')) {
          const arr = $(selector).map((i, el) => $(el).text()).get()
          return arr
        }
        if (url.includes('hiedanranta')) {
          const arr = $(selector).map((i, el) => $(el).text()).get().filter(string => !(isNaN(string[0]) || string[0] === '\n'))
          return arr
        }
        if (url.includes('tampere')) {
          const arr = $(selector).map((i, el) => {
            const link = $('a', el).attr('href')
            const title = $('h4', el).text()
            const date = $('.event-date', el).text()
            const location = $('.event-location', el)
              ? $('.event-location', el).text().split(',')
              : ''
            const string = `${date} <a href="${link}">${title}</a>, ${location}`
            return string
          }).get()
          const sorted = arr.sort((a, b) => {
            // a & b are e.g '12.09.2018 etc...', turn to '20180912' to compare
            const aa = a.slice(0, 10).split('.').reverse().join('')
            const bb = b.slice(0, 10).split('.').reverse().join('')
            return aa - bb
          })
          return sorted
        }
        if (url.includes('Hirvi')) {
          // const arr = $(selector).text()
          const date = $('[data-testid="story-subtitle"] a abbr').attr('data-utime')
          const hap = $('[data-ad-preview="message"]').text()
          const nDate = new Date()
          const arr = new Date(date * 1000) > nDate.setDate(nDate.getDate() - 7)
          ? [`${new Date(date * 1000).toLocaleString('en-GB')} - ${hap}`]
          : ['No recent post from Hirvari']
          console.log('arr', arr);

          return arr

          // return [arr.replace('SpSonsSoroSituS', ' ')]
        }
        if (url.includes('huuru')) {
          const arr = $(selector).map((i, el) => $(el).text()).get()
          arr.shift()
          return arr
        }
      }).catch((err) => {
        console.log('scrapeCheerioData err', err.toString())
      })

    dataToSave.cheerio[pub] = result
    cheerioCount++
    if (cheerioCount === cheerioCountTo) writeDataToFile('Cheerio')
  }

  function scrapeTwitApi(pub) {
    fetch('https://www.facebook.com/api/graphql/', apiOptions[pub])
      .then(blob => blob.json())
      .then((json) => {
        const tempArr = []
        if (json.data.page.upcoming_events === undefined) {
          tempArr.push({
            event: `No upcoming events at ${pub}`,
            startingDateTime: '',
            guests: '',
            shortTime: '',
          })
        } else {
          const data = json.data.page.upcoming_events.edges
          data.forEach((event) => {
            const result = {
              event: event.node.name,
              startingDateTime: new Date(event.node.startTimestampForDisplay * 1000).toLocaleString('en-GB').slice(0, -3),
              guests: event.node.suggested_event_context_sentence.text,
              shortTime: event.node.shortTimeLabel,
            }
            tempArr.push(result)
          })
        }

        dataToSave.twitBook[pub] = tempArr
        twitCount++
        if (twitCount === twitCountTo) writeDataToFile('Twitbook')
      })
      .catch((err) => {
        console.log('scrapeTwitApi err', err.toString());
      })
  }

  Object.keys(dataToSave.cheerio)
    .forEach((pub) => {
      const url = cheerioScrapeInfo[pub].Url
      const selector = cheerioScrapeInfo[pub].Selector
      cheerioi(url, selector, pub)
    })

  Object.keys(apiOptions).forEach((pub) => { scrapeTwitApi(pub) })

  function writeDataToFile() {
    if ((cheerioCount === cheerioCountTo) && (twitCount === twitCountTo)) {
      const stopTime = new Date()
      dataToSave.scrapeTime = `${(stopTime - startTime) / 1000}s`
      console.log('Scraping done:', dataToSave)
      handleStateChange({
        gigsObject: dataToSave
      })
    }
  }
}
