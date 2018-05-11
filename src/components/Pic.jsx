import React, { Component } from 'react'
import fs from 'fs'
import path from 'path'
import { shell } from 'electron'

export default class Pic extends Component {
	constructor() {
		super()
		this.state = { picDir: null }
	}

	componentDidMount() {
		const dir = 'G:/Pics/icanread'
		const files = []

		fs.readdir(dir, (err, list) => {
			if (err) throw err
			list.forEach((el) => {
				if (path.extname(el) === '.png' || path.extname(el) === '.jpg') {
					files.push(el);
				}
			});
			const rand = files[Math.floor(Math.random() * files.length)]
			this.setState({
				picDir: path.join('G:/Pics/icanread', rand)
			})
		})
	}

	handleImageClick(picPath) {
		shell.openExternal(picPath)
	}

	render() {
		if (this.state.picDir === null) {
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
					<img src={this.state.picDir} alt="pic" style={{ maxWidth: '100%', maxHeight: '100%' }} onClick={this.handleImageClick.bind(this, this.state.picDir)} />
				</fieldset>
			</div>
		)
	}
}
