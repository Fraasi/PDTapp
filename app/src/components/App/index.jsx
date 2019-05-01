import React, { Component } from 'react'
import { ipcRenderer, remote } from 'electron'
import Store from 'electron-store'
// import Calendar from './components/Calendar.jsx'
import dotenv from 'dotenv'
// import Gigs from 'components/Gigs.jsx'
import Calendar from '../ReactCalendar.jsx'
import Navigation from '../Navigation'
import Home from '../Home.jsx'
import Settings from '../Settings.jsx'
import Notebook from '../Notebook.jsx'
import Compass from '../Compass'
// import Terminal from './components/Terminal.jsx'
// import gigScrape from './js/gigscraper.js'
import styles from './styles.css'
// import './styles.css'
dotenv.config()


const store = new Store({ name: 'pdtapp-config' })

const components = {
	home: Home,
	calendar: Calendar,
	notebook: Notebook,
	gigs: Compass,
	// terminal: Terminal,
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
			<div className={styles.appContainer}>
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
