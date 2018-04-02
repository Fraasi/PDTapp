import React, { Component } from 'react';
import calendar from '../js/calendar.js'
// console.log('cal', require('electron').remote.getGlobal('store'))

export default class Calendar extends Component {

	componentDidMount() {
		calendar()
	}

	render() {
		return (
			<div id="calendar-container">
				<div className="calendar" />
				<div id="tooltip" />
			</div>
		);
	}
}
