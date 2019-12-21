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
import Terminal from '../Terminal'
import Stats from '../Stats'
import './styles.css'
dotenv.config()


const store = new Store({ name: 'pdtapp-config' })

const components = {
	home: Home,
	calendar: Calendar,
	notebook: Notebook,
	compass: Compass,
	terminal: Terminal,
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
			npm: {
				time: 'last-week',
				stats: null,
				loading: true
			}
		}

		this.handleStateChange = this.handleStateChange.bind(this)
		this.fetchNpmStats = this.fetchNpmStats.bind(this)
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
		// if (this.state.dailyQuote.author === undefined) this.fetchQuote()
		if (this.state.npm.stats === null) {
			this.fetchNpmStats(this.state.npm.time)
		}
	}

	async	fetchNpmStats(timePeriod) {
		this.setState({ npm: { loading: true } })
		const repos = await fetch('https://api.npms.io/v2/search?q=maintainer:fraasi').then(d => d.json())
		const repoStats = await Promise.all(repos.results.map(repo => {
			return fetch(`https://api.npmjs.org/downloads/point/${timePeriod}/${repo.package.name}`).then(d => d.json())
		}))
		this.setState({
			npm: {
				time: timePeriod,
				stats: repoStats,
				loading: false
			}
		})
	}

	fetchQuote() {
		const { dailyQuote: { author } } = this.state
		if (author) return
		fetch('https://ms-rq-api.herokuapp.com/')
			.then((data) => {
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
			view, loading, dailyQuote, pictureFolder, storeView, npm
		} = this.state

		const View = components[view]
		const Terminal = components['terminal']

		return (
			<div className="app-container">
				<Navigation handleStateChange={this.handleStateChange} views={views} />
				{view !== 'terminal' &&
					<View
						loading={loading}
						handleStateChange={this.handleStateChange}
						dailyQuote={dailyQuote}
						pictureFolder={pictureFolder}
						views={views}
						storeView={storeView}
						view={view}
						npm={npm}
						fetchNpmStats={this.fetchNpmStats}
					/>
				}
				{/* uh, this seem to work, just render others over terminal.. */}
					<Terminal />
			</div>
		)
	}
}
