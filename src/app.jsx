import React, { Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import Store from 'electron-store';
import Calendar from './components/Calendar.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import Notebook from './components/Notebook.jsx';
import Gigs from './components/Gigs.jsx';
import gigScrape from './js/gigscraper.js'

const store = new Store({ name: 'pdtapp-config' })

const components = {
	home: Home,
	calendar: Calendar,
	notebook: Notebook,
	gigs: Gigs,
	settings: Settings
}

export default class App extends Component {
	constructor() {
		super()
		this.state = {
			view: 'home',
			loading: true,
			dailyQuote: { quote: 'Without dreams you can\'t fucking live.', author: 'Ann' },
			pictureFolder: store.get('pictureFolder'),
			gigsObject: null,
		}

		this.handleStateChange = this.handleStateChange.bind(this)
		console.count('App constructor runs...')
		ipcRenderer.on('switchView', (sender, msg) => {
			this.setState({
				view: msg.label.toLowerCase(),
				loading: (msg.label === 'Calendar')
			})
		})
		ipcRenderer.on('windowMove/Resize', () => {
			const bounds = remote.getCurrentWindow().getBounds()
			store.set({ bounds })
		})
	}

	componentDidMount() {
		// this.fetchQuote()
		if (this.state.gigsObject === null) gigScrape(this.handleStateChange)
	}

	fetchQuote() {
		if (this.state.dailyQuote.author) return
		fetch('https://ms-rq-api.herokuapp.com/')
			.then((data) => {
				// console.log('qdata: ', data)
				if (data.status !== 200) return data
				return data.json()
			})
			.then((json) => {
				console.log('Quote fetched:', json)
				this.setState({
					dailyQuote: {
						quote: json.statusText || json[Object.keys(json)[0]],
						author: json.status || Object.keys(json)[0]
					}
				})
			})
	}

	handleStateChange(newState) {
		this.setState(newState)
	}

	render() {
		const View = components[this.state.view]

		return (
			<div id="app-container">
				<Navbar handleStateChange={this.handleStateChange} />
				<View
					loading={this.state.loading}
					handleStateChange={this.handleStateChange}
					gigsObject={this.state.gigsObject}
					dailyQuote={this.state.dailyQuote}
					pictureFolder={this.state.pictureFolder}
				/>
			</div>);
	}
}

