import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import { Terminal as XTerminal } from 'xterm'
import * as fit from 'xterm/lib/addons/fit/fit'
import exLink from 'Images/external-link-alt.svg'
import terminal from 'Images/terminal.svg'
const pty = require('node-pty') // only require works
// G:\Code\GitHub\PDTapp\node_modules\node-pty\build\Release
// const pty = require('../../../../node_modules/node-pty/build/Release/pty.node')
console.log('pty', pty)
import './styles.css'


export default class Terminal extends Component {
	constructor() {
		super()
		this.xterm = new XTerminal({
			cursorStyle: 'bar',
			cursorBlink: true,
			cols: 60,
			rows: 20,
		})
		// this.ptyProcess = pty.spawn('bash.exe', [], {
		// 	name: 'xterm',
		// 	cols: 60,
		// 	rows: 20,
		// 	cwd: process.cwd(),
		// 	env: process.env,
		// })
		// console.log('this.ptyProcess:', this.ptyProcess)

		XTerminal.applyAddon(fit)
		ipcRenderer.on('windowMove/Resize', () => {
			this.xterm.fit()
		})
		this.terminalRef = React.createRef()
		this.handlePaste = this.handlePaste.bind(this)
	}

	componentDidMount() {
		// console.log('pty PID:', this.ptyProcess.pid)
		this.xterm.open(this.terminalRef.current)
		this.xterm.focus()
		// this.xterm.on('key', (key) => {
			// this.ptyProcess.write(key)
		// 	console.log('this.ptyProcess.write(key)')
		// })
		// this.ptyProcess.on('data', (data) => {
		// 	this.xterm.write(data)
		// });
	}

	componentWillUnmount() {
		this.xterm.dispose()
		// this.ptyProcess.kill()
	}

	async handlePaste() {
		// const clipboard = await navigator.clipboard.readText()
		// this.ptyProcess.write(clipboard)
	}

	render() {
		return (
			<div className="view-container" id="laptop">
				<fieldset className="links">
					<legend>
						<img src={exLink} alt="" className="laptop-img" />
					</legend>
					Quick links here<br />
				</fieldset>

				<fieldset className="terminal">
					<legend>
						<img src={terminal} alt="" className="laptop-img" /> <span className="pid">pty PID: </span>
						{/* <span className="pid">pty PID: {this.ptyProcess.pid}</span> */}
					</legend>
					<div id="terminal" ref={this.terminalRef} onDoubleClick={this.handlePaste} />
				</fieldset>
			</div>
		)
	}
}
