import React, { Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import SunCalc from 'suncalc'
import Store from 'electron-store';
import Calendar from './components/Calendar.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import Notebook from './components/Notebook.jsx';
import Gigs from './components/Gigs.jsx';

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
			weatherCity: store.get('weatherCity'),
			weatherData: null,
			dailyQuote: { quote: 'Without dreams you can\'t fucking live.', author: 'Ann' },
			pictureFolder: store.get('pictureFolder'),
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
		this.fetchWeather = this.fetchWeather.bind(this)

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
		this.fetchWeather()
		// this.fetchQuote()
	}

	getMoondata(lat, lon) {
		const date = new Date()
		return {
			illumination: SunCalc.getMoonIllumination(date),
			moonTimes: SunCalc.getMoonTimes(date, lat, lon),
			moonPosition: SunCalc.getMoonPosition(date, lat, lon)
		}
	}

	getSundata(lat, lon) {
		return SunCalc.getTimes(new Date(), lat, lon)
	}

	fetchWeather(city) {
		// if (this.state.weatherData.name) return
		const url = `http://api.openweathermap.org/data/2.5/weather?q=${city || this.state.weatherCity}&appid=${process.env.OPENWEATHER_APIKEY}&units=metric`
		// eslint-disable-next-line
		fetch(url)
			.then((response) => {
				if (!response.ok) throw response
				return response.json()
			})
			.then((json) => {
				const data = Object.assign(
					json,
					{
						Sun: this.getSundata(json.coord.lat, json.coord.lon),
						Moon: this.getMoondata(json.coord.lat, json.coord.lon)
					}
				)
				console.log('Weather fetched:', data)
				this.setState({
					weatherData: data
				})
			})
			.catch((err) => {
				console.error(err)
				this.setState({
					weatherData: err
				})
			})
	}

	fetchQuote() {
		if (this.state.dailyQuote.quote) return
		// eslint-disable-next-line
		fetch('https://ms-rq-api.herokuapp.com/')
			.then((data) => {
				console.log('qdata: ', data)
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
					weatherCity={this.state.weatherCity}
					weatherData={this.state.weatherData}
					dailyQuote={this.state.dailyQuote}
					pictureFolder={this.state.pictureFolder}
					fetchWeather={this.fetchWeather}
				/>
			</div>);
	}
}

