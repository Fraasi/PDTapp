import React from 'react'
import { remote } from 'electron'
import Store from 'electron-store'
import { uptime, networkInterfaces } from 'os'
import { secondsToDHMS } from 'futility'
import gigScrape from '../../js/gigscraper.js'
import './styles.css'
import './atomspinner.css'

const store = new Store({ name: 'pdtapp-config' })

export default function Settings({
	handleStateChange, pictureFolder, views, storeView
}) {

	const onViewChange = (event) => {
		saveChanges('storeView', event.target.value)
	}

	const chooseFolder = () => {
		const pathArray = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
		if (pathArray === undefined) return
		saveChanges('pictureFolder', pathArray[0])
	}

	const scrapeHappenings = () => {
		// alert('Not yet working\nStill thinking about this...')
		try {
			gigScrape(handleStateChange)
		} catch (err) {
			throw new Error('Scrape Failed!', err)
		}
	}

	const clearSettings = () => {
		const win = remote.getCurrentWindow()
		win.center()
		store.set('pictureFolder', null)
		handleStateChange({
			pictureFolder: null,
			storeView: 'home'
		})
	}

	const saveChanges = (key, value) => {
		store.set(key, value)
		handleStateChange({
			[key]: value
		})
	}

	const cell = Object.keys(networkInterfaces())[0]
	const { address, mac, family } = networkInterfaces()[cell][0]

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
					<button className="button" type="button" onClick={chooseFolder}>
						Choose a folder
					</button>
				</fieldset>
			</div>

			<div className="view-setting">
				<fieldset>
					<legend>Opened view on app launch</legend>
					{storeView.charAt(0).toUpperCase() + storeView.slice(1)}
					<br />
					<select id="view-select" defaultValue={storeView} onChange={onViewChange}>
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

			<div className="scrape-setting">
				<fieldset>
					<legend>Scrape happenings</legend>
						<button type="button" onClick={scrapeHappenings}>Go!</button>
				</fieldset>
			</div>

			<div className="clear-settings">
				<fieldset>
					<legend>Clear settings</legend>
					Located at:
					<br />
					{store.get('storePath')}
					<br />
					(picFolder & window position & size, does NOT erase notes)
					<br />
					<button className="button" type="button" onClick={clearSettings}>
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
					{`${family}: ${address}  -  ${mac}`}
					<br />
					{`Uptime: ${secondsToDHMS(uptime(), true)}`}
				</div>
			</div>

		</div>
	)
}
