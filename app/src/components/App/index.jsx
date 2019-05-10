import React, { Component } from 'react'
import { ipcRenderer, remote } from 'electron'
import Store from 'electron-store'
import dotenv from 'dotenv'
import Home from '../Home'
import Navigation from '../Navigation'
import Calendar from '../Calendar'
import Settings from '../Settings'
import Notebook from '../Notebook'
import Compass from '../Compass'
// import Terminal from '../Terminal'
import Stats from '../Stats'
import gigScrape from '../../js/gigscraper.js'
import './styles.css'
dotenv.config()


const store = new Store({ name: 'pdtapp-config' })

const components = {
	home: Home,
	calendar: Calendar,
	notebook: Notebook,
	compass: Compass,
	// terminal: Terminal,
	stats: Stats,
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
			gigsObject: 'noscrape',
		}

		this.handleStateChange = this.handleStateChange.bind(this)
		console.count('App constructor runs...')
		ipcRenderer.on('switchView', (sender, msg) => {
			console.log('msg:', msg)
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
		if (this.state.gigsObject === null) {
			try {
				gigScrape(this.handleStateChange)
			} catch (err) {
				console.error('gigscrape err: ', err)
			}
		}
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
				// console.log('Quote fetched:', json)
				// fallback quote
				// {quote: 'Without dreams you can\'t fucking live.', author: 'Ann'}
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
			<div className="app-container">
				<Navigation handleStateChange={this.handleStateChange} views={views} />
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
