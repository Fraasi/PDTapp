import React, { Component } from 'react'
import fs from 'fs'
import path from 'path'
import { shell } from 'electron'

export default class Pic extends Component {
	constructor() {
		super()
		this.state = {
			picPath: '',
			randomPic: '',
			emptyDir: false
		}
		this.handleImageClick = this.handleImageClick.bind(this)
	}

	componentDidMount() {
		const { pictureFolder } = this.props
		if (!pictureFolder) return
		const dir = pictureFolder
		const files = []

		fs.readdir(dir, (err, list) => {
			if (err) throw err
			list.forEach((file) => {
				if (path.extname(file) === '.png' || path.extname(file) === '.jpg') {
					files.push(file)
				}
			})
			const randomPic = files[Math.floor(Math.random() * files.length)]
			if (!randomPic) {
				this.setState({
					emptyDir: true
				})
				return
			}
			this.setState({
				picPath: `local://${path.join(dir, randomPic)}`,
				randomPic,
				emptyDir: false
			})
		})
	}

	handleImageClick() {
		const { picPath } = this.state
		shell.openExternal(picPath.substring(8))
	}

	render() {
		const { emptyDir, picPath, randomPic } = this.state
		if (emptyDir) {
			return (
				<div className="pic">
					<fieldset>
						<legend>404</legend>
						No .jpg or .png files in currently chosen directory
					</fieldset>
				</div>
			)
		}

		if (picPath === '') {
			return (
				<div className="pic">
					<fieldset>
						<legend>No folder selected</legend>
						<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}

		return (
			<div className="pic">
				<fieldset>
					<legend>Pic of the day</legend>
					<img src={picPath} title={randomPic} alt="pic" style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'pointer' }} onClick={this.handleImageClick} />
				</fieldset>
			</div>
		)
	}
}
