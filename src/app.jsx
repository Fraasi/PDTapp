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
			view: 'home',
			loading: true,
			gitNotifications: [],
			weatherData: null,
			weatherDatatest: {
				coord: {
				  lon: 23.75,
				  lat: 61.5
				},
				weather: [
				  {
					id: 701,
					main: 'Mist',
					description: 'mist',
					icon: '50d'
				  }
				],
				base: 'stations',
				main: {
				  temp: 5.44,
				  pressure: 1008,
				  humidity: 100,
				  temp_min: 5,
				  temp_max: 6
				},
				visibility: 2600,
				wind: {
				  speed: 3.6,
				  deg: 90
				},
				clouds: {
				  all: 90
				},
				dt: 1525193400,
				sys: {
				  type: 1,
				  id: 5045,
				  message: 0.0088,
				  country: 'FI',
				  sunrise: 1525140789,
				  sunset: 1525199568
				},
				id: 634964,
				name: 'Tampere',
				cod: 200
			  },
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
	}

	fetchGitNotifications() {
		if (false) {
			// if (this.state.gitNotifications.length < 1) {
			// eslint-disable-next-line
			fetch(`https://api.github.com/notifications?access_token=${process.env.GIT_OAUTH_TOKEN}`)
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
		const metric = '&units=metric'
		const appid = `&appid=${process.env.OPENWEATHER_APIKEY}`

		// forecast api.openweathermap.org/data/2.5/forecast?id=524901
		// const cors1 = 'https://crossorigin.me/'
		// const cors2 = 'https://cors-anywhere.herokuapp.com/'
		const url = `http://api.openweathermap.org/data/2.5/weather?lat=${61.5}&lon=${23.75}${appid}${metric}`
		// get accurate
		// const url = `http://api.openweathermap.org/data/2.5/find?q=Tampere&type=accurate${appid}${metric}`

		// eslint-disable-next-line
		fetch(url).then((data) => data.json())
			.then((json) => {
				// const json = json.list[0]
				this.setState({
					weatherData: json
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
					gitNotifications={this.state.gitNotifications}
					gigsObject={this.state.gigsObject}
					weatherData={this.state.weatherData}
				/>
			</div>);
	}
}

