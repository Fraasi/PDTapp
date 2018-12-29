import React, { Component } from 'react'
import { shell } from 'electron'
// import gigScrape from '../js/gigscraper'

export default class Gigs extends Component {
	handleClick(url) {
		shell.openExternal(url)
	}

	render() {
		const { twitBook, cheerio } = this.props.gigsObject

		return (
			<div className="view-container" id="gigscraper">

				<div id="scrapeTime">Crawl time: {this.props.gigsObject !== null ? this.props.gigsObject.scrapeTime : ''}</div><br />

				{(this.props.gigsObject === null) && <img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" />}

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://dogshome.fi/index.php?id=4')}>Dogshome</a>&nbsp;
					<a href="#" onClick={this.handleClick.bind(this, 'https://www.facebook.com/pg/Dogs-Home-262278600483790/events/?ref=page_internal')}>face</a>
					<ul id="dogs">
						{
							twitBook.dogs.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: `${event.startingDateTime} ${event.shortTime.includes('-') ? `<b>(${event.shortTime}) </b>` : '-'} ${event.event} - ${event.guests}` }} />)
						}
					</ul>
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://huurupiilo.fi/')}>Huurupiilo</a>
					<ul id="huurus">
					{
							cheerio.huurus.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
					</ul>
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'https://www.kujakolli.fi/')}>Kujakolli</a>
					<ul id="kujis">
					{
							cheerio.kujis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
					</ul>
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://valiaikainenhiedanranta.fi/tapahtumat/tulevat-tapahtumat')}>Hiedanranta</a>
					<ul id="hietis">
					{
							cheerio.hietis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
					</ul>
				</div >

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://vastavirta.net/')}>Vastavirta</a>
					<ul id="vastis">
					{
							cheerio.vastis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
					</ul>
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://maanalainen.net/tapahtumat/')}>Maanalainen</a>
					<ul id="maanis">
					{
							twitBook.maanis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: `${event.startingDateTime} ${event.shortTime.includes('-') ? `<b>(${event.shortTime}) </b>` : '-'} ${event.event} - ${event.guests}` }} />)
						}
					</ul>
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'https://visittampere.fi/tapahtumakalenteri/')}>Visit Tampere kohokohdat</a>
					<ul id="visitTre">
					{
							cheerio.visitTre.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
					</ul>
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'https://www.facebook.com/pg/Hirvitalo-Pispalan-Nykytaiteen-Keskus-202287073132009/events/')}>Hirvis face</a>
					<ul id="hirvis">
					{
							twitBook.hirvis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: `${event.startingDateTime} ${event.shortTime.includes('-') ? `<b>(${event.shortTime}) </b>` : '-'} ${event.event} - ${event.guests}` }} />)
					}
					{
							cheerio.hirvis.map((event, i) => <li key={i} dangerouslySetInnerHTML={{ __html: event }} />)
					}
					</ul>
				</div>

			</div >
		)
	}
}
