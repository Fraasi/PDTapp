import React, { Component } from 'react';
import calendar from '../js/calendar.js'
// console.log('cal', require('electron').remote.getGlobal('store'))
// NOTE:  props.loading needed only if i change spinner code

export default class Calendar extends Component {

	componentDidMount() {
		this.props.changeSpinnerState(false)
		setTimeout(() => {
			calendar()
			// eslint-disable-next-line
			document.getElementById('spinner').remove()
		}, 1)
	}

	componentWillUnmount() {
		this.props.changeSpinnerState(true)
	}

	render() {
		// console.log('rend', this.props.loading);
		return (
			<div className="view-container" id="calendar">
				<div id="tooltip" />
				<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" />
			</div>
		)
	}
}
