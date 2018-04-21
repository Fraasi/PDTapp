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
			gitNotifications: [],
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
			// console.log('bounds', {
			// 	bounds,
			// 	msg
			// })
		})
	}

	componentDidMount() {
		this.fetchNotifications()
	}

	fetchNotifications() {
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
				/>
			</div>);
	}
}

