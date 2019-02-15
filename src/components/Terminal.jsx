import React, { Component } from 'react'
// import { shell } from 'electron'
// import { exec } from 'child_process'
import { Terminal as XTerminal } from 'xterm'
import * as fit from 'xterm/lib/addons/fit/fit'
const pty = require('node-pty') // only require works

// import fs from 'fs'
// import path from 'path'


export default class Terminal extends Component {
	constructor() {
		super()
		this.state = {
		}
		this.xterm = new XTerminal({
			cursorStyle: 'bar',
			cursorBlink: true,
			cols: 55,
			rows: 20
		})
		XTerminal.applyAddon(fit)
		this.ptyProcess = pty.spawn('bash.exe', [], {
			name: 'xterm',
			cols: 55,
			rows: 20,
			cwd: process.cwd(),
			env: process.env,
		})
	}

	componentDidMount() {
		this.xterm.open(document.getElementById('terminal'))
		this.xterm.fit()
		this.xterm.on('key', (key) => {
			this.ptyProcess.write(key)
		})
		this.ptyProcess.on('data', (data) => {
			this.xterm.write(data)
		});

		// ptyProcess.resize(100, 40);
		// ptyProcess.write('ls\r');
	}

	render() {
		return (
			<div className="view-container" id="laptop">
				<fieldset className="links">
					<legend>
						<img src="./assets/img/external-link-alt.svg" alt="" className="laptop-img" />
					</legend>
					Quick links here<br />
				</fieldset>

				<fieldset className="terminal">
					<legend>
						<img src="./assets/img/terminal.svg" alt="" className="laptop-img" />
					</legend>
					<div id="terminal" />
				</fieldset>
			</div>
		)
	}
}

