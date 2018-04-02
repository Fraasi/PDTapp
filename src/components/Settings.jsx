/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import { shell } from 'electron'

export default class Settings extends Component {

	handleGitClick() {
		shell.openExternal('https://github.com/fraasi/pdtapp')
	}
	render() {
		return (
			<div className="view-container" id="settings">
				<span style={{ cursor: 'pointer' }} onClick={this.handleGitClick}>
					<img src="./assets/img/github.svg" alt="github.svg" width="33px" style={{ verticalAlign: 'middle' }} onClick={this.handleGitClick} />
					PDTapp @ github
				</span>
				{ this.props.loading && <img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" /> }
			</div>
		)
	}
}
