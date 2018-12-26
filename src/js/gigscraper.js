const puppeteer = require('puppeteer-core')
const apiOptions = require('./apiOptions.js')
const fetch = require('node-fetch')

const dataToSave = {
  puppeteer: {
    hietis: [],
    kujis: [],
    vastis: [],
    visitTre: []
  },
  twitApi: {}
}

const pupScrapeInfo = {
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
}


export default async function gigScrape(handleStateChange) {
  const startTime = new Date()
  puppeteer.launch({
    // these args seems to resolve all errors
    args: ["--proxy-server='direct://'", '--proxy-bypass-list=*'],
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  }).then(async (browser) => {
    let pupCount = 0
    const pupToCount = Object.keys(dataToSave.puppeteer).length
    async function puppeteer(url, selector, pub) {
      const page = await browser.newPage()
      page.setDefaultNavigationTimeout(60000 * 5)
      page.addListener('pageerror', (err) => {
        console.log('pageError', err.toString())
      })
      page.addListener('error', (err) => {
        console.log(`Error: ${err.toString()}`)
      })
      await page.goto(url)

      const result = await page.evaluate((url, selector) => {
        const happenings = document.querySelectorAll(selector)
        if (url.includes('kujakolli')) {
          const arr = Array.from(happenings).map((e) => {
            const s = e.innerText.split('(')
            return `${s[1].slice(0, -2)} ${s[0]}`
          })
          return arr
        } else if (url.includes('vastavirta')) {
          const arr = Array.from(happenings).map(e => e.innerText)
          return arr
        } else if (url.includes('hiedanranta')) {
          const arr = Array.from(happenings).map(e => e.innerText).filter(string => /\d/.test(string))
          return arr
          // return 'hietis'
        } else if (url.includes('tampere')) {
          const arr = Array.from(happenings).map((el) => {
            const link = el.querySelector('a').href
            const title = el.querySelector('h4').innerText
            const date = el.querySelector('.event-date').innerText
            const location = el.querySelector('.event-location')
              ? el.querySelector('.event-location').innerText.split(',')
              : ''
            const string = `${date} <a href="${link}" class="linkstyle">${title}</a>, ${location}`
            return string
          })
          const sorted = arr.sort((a, b) => {
            // a & b are e.g '12.09.2018 etc...', turn to '20180912' to compare
            const aa = a.slice(0, 10).split('.').reverse().join('')
            const bb = b.slice(0, 10).split('.').reverse().join('')
            return aa - bb
          })
          return sorted
        }
      }, url, selector)
      .catch((err) => {
        console.log('caught: ', err)
      })

      await page.close()
      dataToSave.puppeteer[pub] = result
      pupCount++
    //  console.log(`Puppeteered ${pub}, ${pupCount}/${pupToCount}`);
      if (pupCount === pupToCount) {
        browser.close()
        const stopTime = new Date()
        const time = new Date(stopTime - startTime)
        const took = time.toLocaleTimeString('us', { hour12: false }).slice(4)
        dataToSave.puppeteerTime = took
        console.log('puppeteering took: ', took, dataToSave)
        handleStateChange({
          gigsObject: dataToSave
        })
      }
    }

    Object.keys(dataToSave.puppeteer).forEach((pub) => {
      const url = pupScrapeInfo[pub].Url
      const selector = pupScrapeInfo[pub].Selector
      puppeteer(url, selector, pub)
    })


  // twitbook scrape
  // let twitCount = 0
  // const twitCountTo = Object.keys(apiOptions).length

  function scrapeTwitApi(pub) {
    fetch('https://www.facebook.com/api/graphql/', apiOptions[pub])
      .then(blob => blob.json())
      .then((json) => {
        const tempArr = []
        const data = json.data.page.upcoming_events.edges
        data.forEach((event) => {
          const result = {
            event: event.node.name,
            startingDateTime: new Date(event.node.startTimestampForDisplay * 1000).toLocaleString('us', { hour12: false }).slice(0, -3),
            guests: event.node.suggested_event_context_sentence.text,
            shortTime: event.node.shortTimeLabel,
          }
          tempArr.push(result)
        })
        dataToSave.twitApi[pub] = tempArr
      })
      .catch((err) => {
        console.log('scrapeTwitApi err', err.toString())
      })
  }
    Object.keys(apiOptions).forEach((pub) => {
      scrapeTwitApi(pub)
    })
  })
}

export function handleScrapedData({ twitApi, puppeteer }) {
	Object.keys(twitApi).forEach((pub) => {
      const pubEl = document.getElementById(pub)
      twitApi[pub].forEach((event) => {
        pubEl.innerHTML += `<li>${event.startingDateTime} ${event.shortTime.includes('-') ? `<b>(${event.shortTime}) </b>` : '-'} ${event.event} - ${event.guests}</li>`
      })
	})
	Object.keys(puppeteer).forEach((pub) => {
      const pubEl = document.getElementById(pub)
      puppeteer[pub].forEach((happening) => {
        pubEl.innerHTML += `<li>${happening}</li>`
      })
	})
}
