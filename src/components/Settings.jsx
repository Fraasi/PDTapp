import React, { Component } from 'react';
import { remote } from 'electron'
import Store from 'electron-store';

const store = new Store({ name: 'pdtapp-config' })

export default class Settings extends Component {
	constructor() {
		super()
		this.chooseFolder = this.chooseFolder.bind(this)
	}
	chooseFolder() {
		const pathArray = remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
		console.log('folderpath', pathArray)
		if (pathArray === undefined) return

		store.set('pictureFolder', pathArray[0])
		this.props.handleStateChange({
			pictureFolder: pathArray[0]
		})
	}

	render() {
		return (
			<div className="view-container" id="settings">

				<div className="folder-dialog">
					Current folder for pic of the day: {this.props.pictureFolder ? this.props.pictureFolder.match(/\\[a-zA-Z0-9_ ]+$/)[0] : 'Not set'}
					<br />
					<button className="button" onClick={this.chooseFolder}>
					Choose a folder
					</button>
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
