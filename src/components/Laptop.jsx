import React, { Component } from 'react'
import { shell } from 'electron'
import { exec } from 'child_process'
// import fs from 'fs'
// import path from 'path'


export default class Laptop extends Component {
	constructor() {
		super()
		this.state = {
		}
	}

	componentDidMount() {
	}

	handleLinkClick() {
		shell.openExternal(this.state.picPath.substring(8))
	}

	handleEnterPress(e) {
		if (e.ctrlKey && e.key === 'Enter') {
			console.log('run code')
			exec('cd g:\\downs & start "" "C:\\Program Files\\Git\\bin\\sh.exe" --login', (err, stdout, stderr) => {
				console.log('stdout', stdout, stderr);
			})
		}
	}

	render() {
		return (
			<div className="view-container" id="laptop">
				<div className="pic">
					<fieldset>
						<legend>
							<img src="./assets/img/external-link-alt.svg" alt="" className="laptop-img" />
						</legend>
						Quick links here<br />
						* Recursive search for a folder & open it, bash or start
					</fieldset>
				</div>

				<div className="pic">
					<fieldset>
						<legend>
							<img src="./assets/img/terminal.svg" alt="" className="laptop-img" />
						</legend>
						<textarea id="terminal" defaultValue="Terminal$" onKeyUp={this.handleEnterPress} />
					</fieldset>
				</div>
			</div>
		)
	}
}

