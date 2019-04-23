import React, { Component } from 'react';

export default class Navbar extends Component {
	handleClick(e) {
		if (e.target.classList[1] !== undefined) {
			// console.log('view', e.target.classList[1])
			this.props.handleStateChange({
				view: e.target.classList[1]
			})
			e.stopPropagation()
		}
	}

	render() {
		return (
			<div
				id="navbar"
				onClick={this.handleClick.bind(this)}
			>
				<img className="fa-icon home" src="./assets/img/home.svg" alt="home.svg" />
				<img className="fa-icon calendar" src="./assets/img/calendar-alt.svg" alt="calendar-alt.svg" />
				<img className="fa-icon notebook" src="./assets/img/file-alt.svg" alt="file-alt.svg" />
				<img className="fa-icon gigs" src="./assets/img/compass.svg" alt="compass.svg" />
				<img className="fa-icon terminal" src="./assets/img/laptop-code.svg" alt="laptop-code.svg" />
				<img className="fa-icon settings" src="./assets/img/cog.svg" alt="cog.svg" />
			</div>
		)
	}
}

