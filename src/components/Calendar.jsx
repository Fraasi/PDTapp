import React, { Component } from 'react';
import calendar from '../js/calendar.js'

export default class Calendar extends Component {

	componentDidMount() {
		setTimeout(() => {
			calendar()
			this.props.changeSpinnerState(false)
		}, 10)
	}

	componentWillUnmount() {
		this.props.changeSpinnerState(true)
	}

	render() {
		return (
			<div className="view-container" id="calendar">
				<div id="tooltip" />
				{this.props.loading && <img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" /> }
			</div>
		)
	}
}
