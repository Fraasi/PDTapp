import React, { Component } from 'react';
import { ipcRenderer, remote } from 'electron';
import Calendar from './components/Calendar.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import Notebook from './components/Notebook.jsx';
import Gigs from './components/Gigs.jsx';

const { store } = require('./main.js')

// const Store = remote.require('electron-store');
// const eStore = new Store()
// eStore.openInEditor()

console.log(store)

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
			loading: true
		}
		this.handleViewChange = this.handleViewChange.bind(this)
		this.changeSpinnerState = this.changeSpinnerState.bind(this)

		ipcRenderer.on('switchView', (sender, msg) => {
			this.setState({
				view: msg.label.toLowerCase(),
				loading: (msg.label === 'Calendar')
			})
		})
		ipcRenderer.on('windowMove/Resize', (s, msg) => {
			const bounds = remote.getCurrentWindow().getBounds()
			console.log('bounds', {
				bounds,
				msg

			})
		})
	}

	handleViewChange(view) {
		this.setState({ view })
	}


	changeSpinnerState(boolean) {
		this.setState({ loading: boolean })
	}

	render() {
		const View = components[this.state.view]

		return (
			<div id="app-container">
				<Navbar handleViewChange={this.handleViewChange} />
				<View loading={this.state.loading} changeSpinnerState={this.changeSpinnerState} />
			</div>);
	}
}

