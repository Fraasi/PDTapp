// const store = require('electron').remote.getGlobal('store')
// import { notify } from './js/notification.js'
import React, { Component } from 'react';
import Calendar from './components/Calendar.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import Notebook from './components/Notebook.jsx';
import Gigscraper from './components/Gigscraper.jsx';

const components = {
	home: Home,
	calendar: Calendar,
	notebook: Notebook,
	gigscraper: Gigscraper,
	settings: Settings
}

export default class App extends Component {
	constructor() {
		super()
		this.state = {
			view: 'gigscraper',
			loading: true
		}
		this.handleViewChange = this.handleViewChange.bind(this)
		this.changeSpinnerState = this.changeSpinnerState.bind(this)
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
