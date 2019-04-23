import React, { Component } from 'react'
import { ipcRenderer, remote } from 'electron'
import Store from 'electron-store'
// import Calendar from './components/Calendar.jsx'
import dotenv from 'dotenv'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Settings from './components/Settings.jsx'
import Notebook from './components/Notebook.jsx'
import Gigs from './components/Gigs.jsx'
import Terminal from './components/Terminal.jsx'
dotenv.config()
// import gigScrape from './js/gigscraper.js'


const store = new Store({ name: 'pdtapp-config' })

const components = {
	home: Home,
	// calendar: Calendar,
	notebook: Notebook,
	gigs: Gigs,
	terminal: Terminal,
	settings: Settings,
}

const views = Object.keys(components)

export default class App extends Component {
	constructor() {
		super()
		this.state = {
			view: store.get('storeView'),
			storeView: store.get('storeView'),
			loading: true,
			dailyQuote: {},
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
		this.fetchQuote()
		// if (this.state.gigsObject === null) gigScrape(this.handleStateChange)
	}

	fetchQuote() {
		const { dailyQuote: { author } } = this.state
		if (author) return
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
		const {
			view, loading, gigsObject, dailyQuote, pictureFolder, storeView
		} = this.state
		const View = components[view]

		return (
			<div id="app-container">
				<Navbar handleStateChange={this.handleStateChange} />
				<View
					loading={loading}
					handleStateChange={this.handleStateChange}
					gigsObject={gigsObject}
					dailyQuote={dailyQuote}
					pictureFolder={pictureFolder}
					views={views}
					storeView={storeView}
				/>
			</div>
		)
	}
}
