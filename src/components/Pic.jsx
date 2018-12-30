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
		if (!this.props.pictureFolder) return
		const dir = this.props.pictureFolder
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
		shell.openExternal(this.state.picPath.substring(8))
	}

	render() {
		if (this.state.emptyDir) {
			return (
				<div className="pic">
					<fieldset>
						<legend>404</legend>
						No .jpg or .png files in currently chosen directory
					</fieldset>
				</div>
			)
		}

		if (this.state.picPath === '') {
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
					<img src={this.state.picPath} title={this.state.randomPic} alt="pic" style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'pointer' }} onClick={this.handleImageClick} />
				</fieldset>
			</div>
		)
	}
}
