import React, { Component } from 'react';
import { remote } from 'electron'
import Store from 'electron-store';

const store = new Store({ name: 'pdtapp-config' })

export default class Settings extends Component {
	constructor() {
		super()
		this.chooseFolder = this.chooseFolder.bind(this)
		this.submitCity = this.submitCity.bind(this)
		this.saveChanges = this.saveChanges.bind(this)
		this.clearSettings = this.clearSettings.bind(this)
	}

	chooseFolder() {
		const pathArray = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
		if (pathArray === undefined) return
		this.saveChanges('pictureFolder', pathArray[0])
	}

	submitCity() {
		// eslint-disable-next-line
		const city = document.getElementById('city').value
		console.log(city)
		this.saveChanges('weatherCity', city)
		this.props.fetchWeather(city)
	}

	clearSettings() {
		store.set('weatherCity', null)
		store.set('pictureFolder', null)
		const win = remote.getCurrentWindow()
		win.center()
		console.log(this.props)
		this.props.handleStateChange({
			weatherCity: null,
			pictureFolder: null
		})
	}

	saveChanges(key, value) {
		store.set(key, value)
		this.props.handleStateChange({
			[key]: value
		})
	}

	render() {
		return (
			<div className="view-container" id="settings">

				<div className="folder-dialog">
					<fieldset>
						<legend>Current folder for pic of the day</legend>
						{this.props.pictureFolder ? this.props.pictureFolder.match(/\\[a-zA-Z0-9_ ]+$/)[0] : 'Not set'}
						<br />
						<button className="button" onClick={this.chooseFolder}>
							Choose a folder
						</button>
					</fieldset>
				</div>

				<div className="weather-dialog">
					<fieldset>
						<legend>Current city for weather</legend>
						{this.props.weatherCity ? this.props.weatherCity : 'Not set'}
						<br />
						<input id="city" type="text" placeholder="city" />
						<br />
						<button className="button" onClick={this.submitCity}>
							Submit
						</button>
					</fieldset>
				</div>

				<div className="clear-settings">
					<fieldset>
					<legend>Clear settings</legend>
						Located at {store.get('storePath')} <br />
						(picFolder, weatherCity & window position & size, does NOT erase notes)
						<br />
						<button className="button" onClick={this.clearSettings}>
							Clear
						</button>
					</fieldset>
				</div>


				<div id="atomspinner">
					<div id="dot1" />
					<div id="dot2" />
					<div id="circle1" />
					<div id="circle2" />
				</div>

			</div>
		)
	}
}
