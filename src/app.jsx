// const store = require('electron').remote.getGlobal('store')
// import { notify } from './js/notification.js'
import React, { Component } from 'react';
import Calendar from './components/Calendar.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Settings from './components/Settings.jsx';
import Notebook from './components/Notebook.jsx';

const components = {
	home: Home,
	calendar: Calendar,
	notebook: Notebook,
	settings: Settings
}

export default class App extends Component {
	constructor() {
		super()
		this.state = {
			view: 'settings',
			loading: true
		}
		this.handleViewChange = this.handleViewChange.bind(this)
	}


	handleViewChange(view) {
		this.setState({
			view
		})
	}

	render() {
		const View = components[this.state.view]

		return (
			<div id="app-container">
				<Navbar handleViewChange={this.handleViewChange} />
				<View loading={this.state.loading} />

			</div>);
	}
}
