import osmosis from 'osmosis'

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
	},
	visitTre: {
		Url: 'https://visittampere.fi/tapahtumakalenteri/',
		Find: '.event-block',
		Set: {
			date: '.event-date',
			happening: 'h4',
			link: '@href',
			location: '.event-location'
		}
	}
};

export default function scrape(url, find, set, pub) {
	return new Promise((resolve) => {
		const dataArr = {
			[pub]: []
		}
		osmosis.get(url)
			.find(find)
			.set(set)
			.data((data) => {
				dataArr[pub].push(data)
			})
			// .log(console.log)
			// .debug(console.log)
			.error((err) => {
				dataArr[pub].push(`${err.replace(/"/g, '\\"')}`);
				console.log('Osmosis Err', err);
				// reject('osmosis err', err)
			})
			.done(() => {
				console.log(`Pushed ${pub} data!`);
				resolve(dataArr)
			})
	})
}

export function handleScrapedData(dataObject) {
	function _id(id) {
		return document.getElementById(id);
	}

	const dogs = _id('dogs');
	const vastis = _id('vastis');
	const huurus = _id('huurus');
	const kujis = _id('kujis');
	const hietis = _id('hietis');
	const maanis = _id('maanis');
	const visitTre = _id('visittre');
	const date = new Date();
	// const monthName = date.toLocaleString('en-us', {month: 'short'});
	const regDate = new RegExp(/^\d+\.\d+/);

	dataObject.dogs.forEach((dog) => {
		const str = dog.html || '';
		if (regDate.test(str)) {
			const strMonth = regDate.exec(str)[0].match(/\d\d?$/)[0];
			const gigDate = new Date(date.getFullYear(), strMonth - 1, str.match(/\d\d?/));
			if (gigDate >= date) {
				dogs.innerHTML += `<li>${str.replace(/\.\s/, '. - ')}</li>`;
			}
		}
	})

	let prevDate;
	dataObject.vastis.forEach((vasta) => {
		if (vasta.date === undefined) vasta.date = prevDate;
		prevDate = vasta.date;
		if (vasta.time === undefined) vasta.time = '';
		if (vasta.details === undefined) vasta.details = '';
		if (vasta.loc === undefined) vasta.loc = '';

		vastis.innerHTML += `<li>${vasta.date} - ${vasta.gig} - ${vasta.loc} ${vasta.time} - ${vasta.details}</li>`;
	})

	dataObject.huurus.forEach((huuru) => {
		huurus.innerHTML += `<li>${huuru.date} - <a href="${huuru.url}" target="_blank">${huuru.hap}</a></li>`;
	})

	dataObject.hietis.forEach((hieti) => {
		if (Object.keys(hieti).length === 0) return;
		const splitted = hieti.gig.split(' ');
		const gigDate = splitted.shift().slice(0, -1);
		const gig = splitted.join(' ');
		hieti.target = '_blank'
		const link = hieti.aHref.replace(/\d\d?\..*(?=<)/, gig);
		hietis.innerHTML += `<li>${gigDate} - ${link}</li>`;
	})

	dataObject.kujis.forEach((kuji) => {
		if (kuji.gig && !kuji.gig.includes('visa')) {
			kujis.innerHTML += `<li>${kuji.time.replace(/\(|\)/g, '')} - ${kuji.gig}</li>`;
		} else {
			kujis.innerHTML += `<li>${kuji}</li>`;
		}
	})

	dataObject.maanis.forEach((maani) => {
		if (typeof maani === 'string') {
			maanis.innerHTML += `<li>${maani}</li>`;
		} else {
			maanis.innerHTML += `<li>${maani.date} - <a target="_blank" href="${maani.link}">${maani.gig}</a></li>`;
		}
	})

	const visits = dataObject.visitTre.sort((a, b) => {
		const aDate = new Date(a.date.slice(6, 10), a.date.slice(3, 5), a.date.slice(0, 2))
		const bDate = new Date(b.date.slice(6, 10), b.date.slice(3, 5), b.date.slice(0, 2))
		return aDate - bDate
	})

	visits.forEach((visit) => {
		visitTre.innerHTML += `<li>${visit.date} - <a target="_blank" href="${visit.link}">${visit.happening}</a> (${visit.location})</li>`
	})
}
