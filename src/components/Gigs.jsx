import React, { Component } from 'react';
import { shell } from 'electron';
import scrape, { scrapeInfo, handleScrapedData } from '../js/gigscraper.js';
process.setMaxListeners(15) // some err comes from gigscraper promises,  default 10 exceeded

export default class Gigs extends Component {
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
			},
			loading: false,
			dataLoaded: false
		}
		this.handleScrape = this.handleScrape.bind(this)
		// this.handleClick = this.handleClick.bind(this)
	}

	handleScrape() {
		this.setState({
			loading: true
		}, () => {
			const promises = []
			const pubs = Object.keys(this.state.dataObject);
			pubs.forEach((pub) => {
				const url = scrapeInfo[pub].Url;
				const find = scrapeInfo[pub].Find;
				const set = scrapeInfo[pub].Set;
				promises.push(scrape(url, find, set, pub, this.state.dataObject))
			})
			Promise.all(promises)
				.then((data) => {
					const obj = {}
					data.forEach((el) => {
						const pub = Object.keys(el)[0]
						obj[pub] = el[pub]
					})
					handleScrapedData(obj)
					this.setState({
						dataObject: obj,
						loading: false,
						dataLoaded: true
					})
				})
		})
	}

	handleClick(url) {
		console.log(url, typeof url)
		shell.openExternal(url)
	}

	render() {
		return (
			<div className="view-container" id="gigscraper">

				{!this.state.dataLoaded && <button onClick={this.handleScrape}>Scrape data</button>}

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://dogshome.fi/index.php?id=4')}>Dogshome</a>
					<ul id="dogs" />
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://huurupiilo.fi/')}>Huurupiilo</a>
					<ul id="huurus" />
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'https://www.kujakolli.fi/')}>Kujakolli</a>
					<ul id="kujis" />
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://valiaikainenhiedanranta.fi/tapahtumat/tulevat-tapahtumat')}>Hiedanranta</a>
					<ul id="hietis" />
				</div >

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://vastavirta.net/')}>Vastavirta</a>
					<ul id="vastis" />
				</div>

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'http://maanalainen.net/tapahtumat/')}>Maanalainen</a>
					<ul id="maanis" />
				</div>

				{this.state.loading && <img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" />}
			</div >
		)
	}
}
