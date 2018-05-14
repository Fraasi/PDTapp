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
			view: 'settings',
			loading: true,
			weatherData: null,
			dailyQuote: { quote: null, author: null },
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
		this.fetchQuote()
	}

	fetchWeather() {
		if (this.state.weatherData) return
		// forecast api.openweathermap.org/data/2.5/forecast?id=524901
		const url = `http://api.openweathermap.org/data/2.5/weather?lat=${61.5}&lon=${23.75}&appid=${process.env.OPENWEATHER_APIKEY}&units=metric`
		// eslint-disable-next-line
		fetch(url).then((data) => data.json())
			.then((json) => {
				console.log('Weather fetched:', json)
				this.setState({
					weatherData: json
				})
			})
	}

	fetchQuote() {
		if (this.state.dailyQuote.quote) return
		// eslint-disable-next-line
		fetch('https://ms-rq-api.herokuapp.com/')
			.then(d => d.json())
			.then((json) => {
				console.log('Quote fetched:', json)
				this.setState({
					dailyQuote: {
						quote: json[Object.keys(json)[0]],
						author: Object.keys(json)[0]
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
					weatherData={this.state.weatherData}
					dailyQuote={this.state.dailyQuote}
					pictureFolder={this.state.pictureFolder}
				/>
			</div>);
	}
}

