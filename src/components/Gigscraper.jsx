import React, { Component } from 'react';
import { shell } from 'electron';
import scrape, { scrapeInfo, handleScrapeData } from '../js/gigscraper.js';


export default class Home extends Component {
	constructor() {
		super()
		this.state = {
			dataObject: {
				dogs: [],
				vastis: [],
				huurus: [],
				kujis: [],
				hietis: [],
				maanis: []
			}
		}
		this.handleScrape = this.handleScrape.bind(this)
		// console.log('const', this.state.dataObject)
	}


	handleScrape() {
		console.log('scrape')
		const promises = []
		const pubs = Object.keys(this.state.dataObject);
		pubs.forEach((pub) => {
			const url = scrapeInfo[pub].Url;
			const find = scrapeInfo[pub].Find;
			const set = scrapeInfo[pub].Set;
			promises.push(scrape(url, find, set, pub, this.state.dataObject))
		})
		Promise.all(promises)
		.then( data => {
			console.log('all', data)
			console.log(promises)
			})
		
		// handleScrapeData(this.state.dataObject)
		
		this.setState({
			dataObject: this.state.dataObject
		})
		// console.log('setstate')
		// console.log(this.state.dataObject);
	}

	render() {
		return (
			<div className="view-container" id="gigscraper">
				<button onClick={ this.handleScrape }>Get scraping</button>

				<div><a href="http://dogshome.fi/index.php?id=4">Dogshome</a><ul id="dogs" /></div>

				<div><a href="http://huurupiilo.fi/">Huurupiilo</a><ul id="huurus" /></div>

				<div><a href="https://www.kujakolli.fi/">Kujakolli</a><ul id="kujis" /></div>

				<div><a href="http://valiaikainenhiedanranta.fi/tapahtumat/tulevat-tapahtumat">Hiedanranta</a><ul id="hietis" /></div >

				<div><a href="http://vastavirta.net/">Vastavirta</a><ul id="vastis" /></div>

				<div><a href="http://maanalainen.net/tapahtumat/">Maanalainen</a><ul id="maanis" /></div>

			</div >
		)
	}
}
