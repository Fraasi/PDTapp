import React, { Component } from 'react'
import fs from 'fs'
import path from 'path'
import { shell } from 'electron'

export default class Pic extends Component {
	constructor() {
		super()
		this.state = { picPath: null }
	}

	componentDidMount() {
		// dir in store = null, needs err handling
		// if null, ask to set folder in settings & return
		// need to think about this
		const dir = this.props.pictureFolder
		const files = []

		fs.readdir(dir, (err, list) => {
			if (err) throw err
			list.forEach((el) => {
				if (path.extname(el) === '.png' || path.extname(el) === '.jpg') {
					files.push(el);
				}
			});
			const randomPic = files[Math.floor(Math.random() * files.length)]
			this.setState({
				picPath: path.join(dir, randomPic)
			})
		})
	}

	handleImageClick(picPath) {
		shell.openExternal(picPath)
	}

	render() {
		if (this.state.picPath === null) {
			return (
				<div className="pic">
					<fieldset>
						<legend>Fetching pic</legend>
						<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}
		return (
			<div className="pic">
				<fieldset>
					<legend>Pic of the day</legend>
					<img src={this.state.picPath} alt="pic" style={{ maxWidth: '100%', maxHeight: '100%' }} onClick={this.handleImageClick.bind(this, this.state.picPath)} />
				</fieldset>
			</div>
		)
	}
}
