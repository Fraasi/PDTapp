// import { shell } from 'electron';
const osmosis = require('osmosis');


export const scrapeInfo = {
	vastis: {
		Url: 'http://vastavirta.net/',
		Find: '.event-list li',
		Set: {
			date: '.event-date',
			gig: '.event-title',
			time: '.event-time',
			loc: '.event-location',
			details: '.event-details'
		}
	},
	huurus: {
		Url: 'http://www.huurupiilo.fi/tapahtumat-events/',
		Find: 'tbody tr',
		Set: {
			date: 'td:first',
			hap: 'td:last',
			url: 'td:last @href'
		}
	},
	dogs: {
		Url: 'http://www.dogshome.fi/index.php?id=4',
		Find: '.innertube p',
		Set: 'html'
	},
	hietis: {
		Url: 'http://valiaikainenhiedanranta.fi/tapahtumat/tulevat-tapahtumat',
		Find: '.article__body p',
		Set: {
			aHref: 'a:source',
			gig: 'a',
			lastA: 'a:last-of-type'
		}
	},
	kujis: {
		Url: 'https://www.kujakolli.fi/',
		Find: '.tiedote dt',
		Set: {
			gig: 'a',
			time: 'span'
		}
	},
	maanis: {
		Url: 'https://maanalainen.net/tapahtumat/',
		Find: '.event_details',
		Set: {
			date: '.event_date',
			gig: '.event_title',
			link: '.event_desc @href'
		}
	}
};

// let count = 0;
export default function scrape(url, find, set, arr, dataObject) {

	return new Promise((resolve rehect) => {

		let d;
		osmosis.get(url)
			.find(find)
			.set(set)
			.data((data) => {
				dataObject[arr].push(data);
				d = data
				return data
			})
			// .log(console.log)
			// .debug(console.log)
			.error((err) => {
				console.log(err);
			})
			.done(() => {
				console.log(`Pushed ${arr} data!`, d);
				resolve(d)
				// count++
				// if (count === Object.keys(dataObject).length) handleData();
			})
	})
	// return d
}


export function handleScrapeData(dataObject) {
	/* eslint-disable */
	function id(id) {
		return document.getElementById(id);
	}

	const dogs = id('dogs');
	const vastis = id('vastis');
	const huurus = id('huurus');
	const kujis = id('kujis');
	const hietis = id('hietis');
	const maanis = id('maanis');
	const date = new Date();
	// const monthName = date.toLocaleString('en-us', {month: 'short'});
	const regDate = new RegExp(/^\d+\.\d+/);
	// console.log(dataObject);

	dataObject.dogs.forEach((dog) => {
		// console.log(dog.html)
		const str = dog.html || '';
		if (regDate.test(str)) {
			const strMonth = regDate.exec(str)[0].match(/\d\d?$/)[0];
			const gigDate = new Date(date.getFullYear(), strMonth - 1, str.match(/\d\d?/));
			if (gigDate > date) {
				dogs.innerHTML += `<li>${str.replace(/\.\s/, '. - ')}</li>`;
			}
		}
	})

	let prevDate;
	dataObject.vastis.forEach((vasta) => {
		if (vasta.date == undefined) vasta.date = prevDate;
		prevDate = vasta.date;
		if (vasta.time == undefined) vasta.time = '';
		if (vasta.details == undefined) vasta.details = '';
		if (vasta.loc == undefined) vasta.loc = '';

		vastis.innerHTML += `<li>${vasta.date} - ${vasta.gig} - ${vasta.loc} ${vasta.time} - ${vasta.details}</li>`;
	})

	dataObject.huurus.forEach((huuru) => {
		huurus.innerHTML += `<li>${huuru.date} - <a href="${huuru.url}">${huuru.hap}</a></li>`;
	})

	dataObject.hietis.forEach((hieti) => {
		if (Object.keys(hieti).length === 0) return;

		const splitted = hieti.gig.split(' ');
		const gigDate = splitted.shift().slice(0, -1);
		const gig = splitted.join(' ');
		const link = hieti.aHref.replace(/\d\d?\..*(?=<)/, gig);

		hietis.innerHTML += `<li>${gigDate} - ${link}</li>`;
	})

	dataObject.kujis.forEach((kuji) => {
		if (!kuji.gig.includes('visa')) {
			kujis.innerHTML += `<li>${kuji.time.replace(/\(|\)/g, '')} - ${kuji.gig}</li>`;
		}
	})

	dataObject.maanis.forEach((maani) => {
		maanis.innerHTML += `<li>${maani.date} - <a href="${maani.link}">${maani.gig}</a></li>`;
	})
}



