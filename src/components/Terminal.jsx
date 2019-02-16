import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import { Terminal as XTerminal } from 'xterm'
import * as fit from 'xterm/lib/addons/fit/fit'
const pty = require('node-pty') // only require works


export default class Terminal extends Component {
	constructor() {
		super()
		this.xterm = new XTerminal({
			cursorStyle: 'bar',
			cursorBlink: true,
			cols: 60,
			rows: 20,
		})
		XTerminal.applyAddon(fit)
		this.ptyProcess = pty.spawn('bash.exe', [], {
			name: 'xterm',
			cols: 60,
			rows: 20,
			cwd: process.cwd(),
			env: process.env,
		})
		this.terminalRef = React.createRef()
		ipcRenderer.on('windowMove/Resize', (s, d) => {
			// console.log('d:', d)
			// console.log(this.xterm._core.renderer.dimensions.actualCellWidth)
			this.xterm.fit()
		})
		this.handlePaste = this.handlePaste.bind(this)
	}

	componentDidMount() {
		this.xterm.open(this.terminalRef.current)
		this.xterm.focus()
		console.log('xterm PID:', this.xterm.pid)
		this.xterm.on('key', (key) => {
			this.ptyProcess.write(key)
		})
		this.ptyProcess.on('data', (data) => {
			this.xterm.write(data)
		});
	}

	componentWillUnmount() {
		this.xterm.dispose()
		this.ptyProcess.kill()
	}

	async handlePaste() {
		const clipboard = await navigator.clipboard.readText()
		this.ptyProcess.write(clipboard)
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
					<div id="terminal" ref={this.terminalRef} onDoubleClick={this.handlePaste} />
				</fieldset>
			</div>
		)
	}
}

