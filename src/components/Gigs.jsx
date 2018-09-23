import React, { Component } from 'react'
import { shell } from 'electron'
import { handleScrapedData } from '../js/gigscraper'
// process.setMaxListeners(15) // some err comes from gigscraper promises,  default 10 exceeded

export default class Gigs extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			// dataLoaded: (this.props.gigsObject.dogs.length > 1),
		}
	}

	componentDidMount() {
		if (this.props.gigsObject) handleScrapedData(this.props.gigsObject)
	}

	handleClick(url) {
		shell.openExternal(url)
	}

	render() {
		return (
			<div className="view-container" id="gigscraper">

				<div id="puppeteertime">Puppeteer crawl time: {this.props.gigsObject !== null ? this.props.gigsObject.puppeteerTime : ''} min</div><br />

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

				<div>
					<a href="#" onClick={this.handleClick.bind(this, 'https://visittampere.fi/tapahtumakalenteri/')}>Visit Tampere kohokohdat</a>
					<ul id="visitTre" />
				</div>

				{this.state.loading && <img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" />}
			</div >
		)
	}
}
