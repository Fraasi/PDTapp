const puppeteer = require('puppeteer-core');

const dataToSave = {
  dogs: [],
  maanis: [],
  huurus: [],
  hietis: [],
  kujis: [],
  vastis: [],
  visitTre: []
}

const scrapeInfo = {
  dogs: {
    Url: 'https://www.facebook.com/pg/Dogs-Home-262278600483790/events/',
    Selector: '#upcoming_events_card ._24er table',
  },
  maanis: {
    Url: 'https://www.facebook.com/pg/Maanalainen/events/',
    Selector: '#upcoming_events_card ._24er table',
  },
  huurus: {
    Url: 'https://www.facebook.com/pg/huurupiilo/events/',
    Selector: '#upcoming_events_card ._24er table',
  },
  hietis: {
    facceUrl: 'https://www.facebook.com/pg/hiedanranta/events/',
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

export default async function pupScrape(handleStateChange) {
  const startTime = new Date()

  const browser = await puppeteer.launch({
    // these args seems to resolve all errors
    args: ["--proxy-server='direct://'", '--proxy-bypass-list=*'],
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  })

  let count = 0
  const toCount = Object.keys(dataToSave).length

  async function scrape(url, selector, pub) {
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(60000 * 5)
    page.addListener('pageerror', (err) => {
      const theTempValue = err.toString()
      console.log('pageError', theTempValue)
    })
    page.addListener('error', (err) => {
      const theTempValue = err.toString()
      console.log('Error:', theTempValue)
    })
    await page.goto(url)

    const result = await page.evaluate((url, selector) => {
      const happenings = document.querySelectorAll(selector)
      if (url.includes('facebook')) {
        const arr = Array.from(happenings).map(e => e.innerText.replace(/(\r\n|\r|\n|\t)/g, ' ').replace(/(osallistujaa|guests).+/, 'G'))
        return arr
      } else if (url.includes('kujakolli')) {
        const arr = Array.from(happenings).map((e) => {
          const s = e.innerText.split('(')
          return `${s[1].slice(0, -1)} ${s[0]}`
        })
        return arr
      } else if (url.includes('vastavirta')) {
        const arr = Array.from(happenings).map(e => e.innerText)
        return arr
      } else if (url.includes('hiedanranta')) {
        const arr = Array.from(happenings).map(e => e.innerText).filter(string => !(isNaN(string[0]) || string[0] === '\n' || string[0] === ' '))
        return arr
      } else if (url.includes('tampere')) {
        const arr = Array.from(happenings).map((el) => {
          const link = el.querySelector('a').href
          const title = el.querySelector('h4').innerText
          const date = el.querySelector('.event-date').innerText
          const location = el.querySelector('.event-location').innerText.split(',')
          const string = `${date} <a href="${link}" class="linkstyle">${title}</a>, ${location[0]}`
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

    await page.close()
    dataToSave[pub] = result
    count++
    // console.log(`Puppeteered ${pub}, ${count}/${toCount}`);
    if (count === toCount) {
      browser.close()
      const stopTime = new Date()
      const time = new Date(stopTime - startTime)
      const took = time.toLocaleTimeString('de').slice(3)
      dataToSave.puppeteerTime = took
      console.log('puppeteering took: ', took, dataToSave)
      handleStateChange({
				gigsObject: dataToSave
			})
    }
  }

  const pubs = Object.keys(dataToSave)
  pubs.forEach((pub) => {
    const url = scrapeInfo[pub].Url
    const selector = scrapeInfo[pub].Selector
    scrape(url, selector, pub)
  })
}

export function handleScrapedData(gigsObject) {
	Object.keys(gigsObject).forEach((pub) => {
		if (pub !== 'puppeteerTime') {
      const pubEl = document.getElementById(pub)
      gigsObject[pub].forEach((happening) => {
        pubEl.innerHTML += `<li>${happening}</li>`
      })
    }
	})
}
