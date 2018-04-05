import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import Calendar from './components/Calendar.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import Notebook from './components/Notebook.jsx';
import Gigs from './components/Gigs.jsx';

const Store = require('electron').remote.require('electron-store');
const store = new Store()
store.openInEditor()

console.log(store, store.store)

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
			// console.log(msg.label)
			this.setState({
				view: msg.label.toLowerCase(),
				loading: (msg.label === 'Calendar')
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

// function listen(app) {
// 	ipcRenderer.on('switchView', (sender, msg) => {
// 		console.log(sender, msg, app)
// 		// this.setState({
// 		// 	view: msg.label.toLowerCase()
// 		// })
// 	})
// }
