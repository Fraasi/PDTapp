import React, { Component } from 'react'
import { remote } from 'electron'
import Store from 'electron-store'
import { uptime, networkInterfaces } from 'os'
import { secondsToDhms } from 'futility'
const store = new Store({ name: 'pdtapp-config' })

// console.log('networkInterfaces', networkInterfaces())

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
		const city = document.getElementById('city').value
		this.saveChanges('weatherCity', city)
		this.props.fetchWeather(city)
	}

	clearSettings() {
		store.set('weatherCity', null)
		store.set('pictureFolder', null)
		const win = remote.getCurrentWindow()
		win.center()
		this.props.handleStateChange({
			weatherCity: null,
			weatherData: null,
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
		const { address, mac, family } = networkInterfaces()['Cellular 2'][0]
		return (
			<div className="view-container" id="settings">

				<div className="folder-dialog">
					<fieldset>
						<legend>Current folder for pic of the day</legend>
						{
							this.props.pictureFolder.match(/\\[a-zA-Z0-9_ ]+$/) ?
								this.props.pictureFolder.match(/\\[a-zA-Z0-9_ ]+$/)[0]
								: this.props.pictureFolder
						}
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

				<div className="os">
					<div id="atomspinner">
						<div id="dot1" />
						<div id="dot2" />
						<div id="circle1" />
						<div id="circle2" />
					</div>
					<div>
						{`${family}: ${address}  -  ${mac}`} <br />
						{`Uptime: ${secondsToDhms(uptime(), true)}`}
					</div>
				</div>

			</div>
		)
	}
}
