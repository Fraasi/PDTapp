import React from 'react'
import { shell } from 'electron'
import styles from './styles.css'
// import './styles.css'

export default function Compass({ gigsObject }) {

	const handleClick = (url) => {
		shell.openExternal(url)
	}

	if (gigsObject == null) {
		return (
			<div className={`view-container ${styles.gigscraper}`}>
				Dev mode, gig fetch disabled.
			</div>
		)
	}

	const { twitBook, cheerio, scrapeTime } = gigsObject
	return (
		<div className={`view-container ${styles.gigscraper}`}>
			<div id="scrapeTime">
				Crawl time: {gigsObject !== null ? scrapeTime : ''}
			</div><br />

			{(gigsObject === null) && <img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" />}

			<div>
				<a href="#" onClick={() => { handleClick('http://dogshome.fi/index.php?id=4') }}>Dogshome</a>&nbsp;
					<a href="#" onClick={() => { handleClick('https://www.facebook.com/pg/Dogs-Home-262278600483790/events/?ref=page_internal') }}>face</a>
				<ul id="dogs">
					{
						twitBook.dogs.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: `${event.startingDateTime} ${event.shortTime.includes('-') ? `<b>(${event.shortTime}) </b>` : '-'} ${event.event} - ${event.guests}` }} />)
					}
				</ul>
			</div>

			<div>
				<a href="#" onClick={() => { handleClick('http://huurupiilo.fi/') }}>Huurupiilo</a>
				<ul id="huurus">
					{
						cheerio.huurus.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
				</ul>
			</div>

			<div>
				<a href="#" onClick={() => { handleClick('https://www.kujakolli.fi/') }}>Kujakolli</a>
				<ul id="kujis">
					{
						cheerio.kujis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
				</ul>
			</div>

			<div>
				<a href="#" onClick={() => { handleClick('http://valiaikainenhiedanranta.fi/tapahtumat/tulevat-tapahtumat') }}>Hiedanranta</a>
				<ul id="hietis">
					{
						cheerio.hietis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
				</ul>
			</div>

			<div>
				<a href="#" onClick={() => { handleClick('http://vastavirta.net/') }}>Vastavirta</a>
				<ul id="vastis">
					{
						cheerio.vastis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
				</ul>
			</div>

			<div>
				<a href="#" onClick={() => { handleClick('http://maanalainen.net/tapahtumat/') }}>Maanalainen</a>
				<ul id="maanis">
					{
						twitBook.maanis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: `${event.startingDateTime} ${event.shortTime.includes('-') ? `<b>(${event.shortTime}) </b>` : '-'} ${event.event} - ${event.guests}` }} />)
					}
				</ul>
			</div>

			<div>
				<a href="#" onClick={() => { handleClick('https://visittampere.fi/tapahtumakalenteri/') }}>Visit Tampere kohokohdat</a>
				<ul id="visitTre">
					{
						cheerio.visitTre.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
				</ul>
			</div>

			<div>
				<a href="#" onClick={() => { handleClick('https://www.facebook.com/pg/Hirvitalo-Pispalan-Nykytaiteen-Keskus-202287073132009/events/') }}>Hirvis face</a>
				<ul id="hirvis">
					{
						twitBook.hirvis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: `${event.startingDateTime} ${event.shortTime.includes('-') ? `<b>(${event.shortTime}) </b>` : '-'} ${event.event} - ${event.guests}` }} />)
					}
					{
						cheerio.hirvis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
				</ul>
			</div>

		</div>
	)
}
