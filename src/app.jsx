import React, { Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import Store from 'electron-store';
import Calendar from './components/Calendar.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import Notebook from './components/Notebook.jsx';
import Gigs from './components/Gigs.jsx';


const store = new Store({ name: 'pdtapp-config' })
// store.openInEditor()
// console.log(store.store)
// console.log(store.get('bounds.width'))

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
			view: 'notebook',
			loading: true,
			gitNotifications: null,
			weatherData: null,
			gigsObject: {
				dogs: [],
				vastis: [],
				huurus: [],
				kujis: [],
				hietis: [],
				maanis: []
			}
		}

		this.handleStateChange = this.handleStateChange.bind(this)

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
		this.fetchGitNotifications()
		this.fetchWeather()
		// this.fetchQuote()
	}

	fetchGitNotifications() {
		if (this.state.gitNotifications === null) {
			// fetch(`https://api.github.com/notifications?access_token=${process.env.GIT_OAUTH_TOKEN}`)
			// eslint-disable-next-line
			fetch('https://api.github.com/notifications', { headers: { 'Authorization': `token ${process.env.GIT_OAUTH_TOKEN}` } })
				.then(r => r.json())
				.then((arr) => {
					console.log('git fetched:', arr)
					this.setState({
						gitNotifications: arr
					})
				})
		}
	}

	fetchWeather() {
		if (this.state.weatherData) return

		// forecast api.openweathermap.org/data/2.5/forecast?id=524901
		const url = `http://api.openweathermap.org/data/2.5/weather?lat=${61.5}&lon=${23.75}&appid=${process.env.OPENWEATHER_APIKEY}&units=metric`
		// eslint-disable-next-line
		fetch(url).then((data) => data.json())
			.then((json) => {
				console.log('weather fetched:', json)
				this.setState({
					weatherData: json
				})
			})
	}

	// fetchQuote() {
	// 	const url = 'dfg'
	// 	// eslint-disable-next-line
	// 	fetch(url).then((data) => data.json())
	// 		.then((json) => {
	// 			console.log('quote fetched:', json)
	// 			this.setState({
	// 				weatherData: json
	// 			})
	// 		})
	// }


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
					gitNotifications={this.state.gitNotifications}
					gigsObject={this.state.gigsObject}
					weatherData={this.state.weatherData}
				/>
			</div>);
	}
}

