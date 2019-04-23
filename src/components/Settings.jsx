import React, { Component } from 'react'
import { remote } from 'electron'
import Store from 'electron-store'
import { uptime, networkInterfaces } from 'os'
import { secondsToDHMS } from 'futility'
const store = new Store({ name: 'pdtapp-config' })

export default class Settings extends Component {
	constructor() {
		super()
		this.chooseFolder = this.chooseFolder.bind(this)
		this.saveChanges = this.saveChanges.bind(this)
		this.clearSettings = this.clearSettings.bind(this)
		this.onViewChange = this.onViewChange.bind(this)
	}

	onViewChange(event) {
		this.saveChanges('storeView', event.target.value)
	}

	chooseFolder() {
		const pathArray = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
		if (pathArray === undefined) return
		this.saveChanges('pictureFolder', pathArray[0])
	}

	clearSettings() {
		const win = remote.getCurrentWindow()
		win.center()
		store.set('pictureFolder', null)
		this.props.handleStateChange({
			pictureFolder: null,
			storeView: 'home'
		})
	}

	saveChanges(key, value) {
		store.set(key, value)
		this.props.handleStateChange({
			[key]: value
		})
	}

	render() {
		const cell = Object.keys(networkInterfaces())[0]
		const { address, mac, family } = networkInterfaces()[cell][0]
		const { pictureFolder, views, storeView } = this.props

		return (
			<div className="view-container" id="settings">

				<div className="folder-dialog">
					<fieldset>
						<legend>Current folder for pic of the day</legend>
						{
							pictureFolder.match(/\\[a-zA-Z0-9_ ]+$/)
								? pictureFolder.match(/\\[a-zA-Z0-9_ ]+$/)[0]
								: pictureFolder
						}
						<br />
						<button className="button" onClick={this.chooseFolder}>
							Choose a folder
						</button>
					</fieldset>
				</div>

				<div className="view-setting">
					<fieldset>
						<legend>Opened view on app launch</legend>
						{storeView.charAt(0).toUpperCase() + storeView.slice(1)}
						<br />
						<select id="view-select" defaultValue={storeView} onChange={this.onViewChange}>
							{
								views.map(view => (
									<option key={view} value={view}>
										{view.charAt(0).toUpperCase() + view.slice(1)}
									</option>
								))
							}
						</select>
					</fieldset>
				</div>

				<div className="clear-settings">
					<fieldset>
						<legend>Clear settings</legend>
						Located at {store.get('storePath')} <br />
						(picFolder & window position & size, does NOT erase notes)
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
					<br />
					<div>
						{`${family}: ${address}  -  ${mac}`} <br />
						{`Uptime: ${secondsToDHMS(uptime(), true)}`}
					</div>
				</div>

			</div>
		)
	}
}
