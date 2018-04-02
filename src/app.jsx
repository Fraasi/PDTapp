import React, { Component } from 'react';
import Calendar from './components/Calendar.jsx';
// import { ipcRenderer } from 'electron'
const { notify } = require('./js/notification.js')
// const store = require('electron').remote.getGlobal('store')
// const wc = require('electron').remote.webContents.getAllWebContents()
// console.log(store, wc);


export default class App extends Component {

	componentDidMount() {
		notify('app sez', 'component did mount')
	}

	render() {
		return (
			<div>
				<Calendar />
			</div>);
	}
}
