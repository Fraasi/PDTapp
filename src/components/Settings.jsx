import React, { Component } from 'react';
import { shell } from 'electron'

export default class Settings extends Component {
	handleGitClick() {
		shell.openExternal('https://github.com/fraasi/pdtapp')
	}
	render() {
		return (
			<div className="view-container" id="settings">
				<span className="linkstyle" onClick={this.handleGitClick}>
					<img src="./assets/img/github.svg" alt="github.svg" width="33px" style={{ verticalAlign: 'middle' }} onClick={this.handleGitClick} />
					PDTapp @ github
				</span>

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
