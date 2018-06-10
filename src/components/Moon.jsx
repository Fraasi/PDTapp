import React, { Component } from 'react'
import { shell } from 'electron';

function getZodiacSign(day, month) {
	if ((month === 1 && day <= 20) || (month === 12 && day >= 22)) {
		return 'capricorn';
	} else if ((month === 1 && day >= 21) || (month === 2 && day <= 18)) {
		return 'aquarius';
	} else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
		return 'pisces';
	} else if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) {
		return 'aries';
	} else if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) {
		return 'taurus';
	} else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
		return 'gemini';
	} else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
		return 'cancer';
	} else if ((month === 7 && day >= 23) || (month === 8 && day <= 23)) {
		return 'leo';
	} else if ((month === 8 && day >= 24) || (month === 9 && day <= 23)) {
		return 'virgo';
	} else if ((month === 9 && day >= 24) || (month === 10 && day <= 23)) {
		return 'libra';
	} else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
		return 'scorpio';
	} else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
		return 'sagittarius';
	}
}


export default class Moon extends Component {
	constructor() {
		super()
		const date = new Date()
		const day = date.getDate()
		const month = date.getMonth() + 1

		this.zodiac = getZodiacSign(day, month)
		this.handleClick = this.handleClick.bind(this)
	}

	getPhase(p) {
		if (p === 0) return 'New Moon'
		else if (p < 0.25) return 'Waxing Crescent'
		else if (p === 0.25) return 'First Quarter'
		else if (p < 0.5) return 'Waxing Gibbous'
		else if (p === 0.5) return 'Full Moon'
		else if (p < 0.75) return 'Waning Gibbous'
		else if (p === 0.75) return 'Last Quarter'
		else if (p < 1) return 'Waning Crescent'
		return 'New Moon'
	}

	p5Map(n, start1, stop1, start2, stop2) {
		return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
	}

	calculateMoon(angle, num, start1, stop1, start2, stop2) {
		let mapped = this.p5Map(num, start1, stop1, start2, stop2)
		const isWaning = Math.sign(angle) > 0
		// const isWaning = false
		const result = isWaning ? mapped : mapped = -(mapped)

		// console.log('isw', isWaning)
		// console.log('illumination', mapped)
		return result
	}

	handleClick() {
		shell.openExternal('https://www.timeanddate.com/moon/phases/')
	}

	render() {
		if (this.props.weatherData === null || !this.props.weatherData.name) {
			return (
				<div className="mooninfo">
					<fieldset>
						<legend>Fetching mooninfo</legend>
						<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}

		const {
			goldenHour, goldenHourEnd, sunriseEnd, sunsetStart
		} = this.props.weatherData.Sun
		const { phase, fraction, angle } = this.props.weatherData.Moon.illumination
		const { rise, set } = this.props.weatherData.Moon.moonTimes
		const { parallacticAngle } = this.props.weatherData.Moon.moonPosition
		const illumination = this.calculateMoon(angle, fraction, 0, 1, 0, 30) // moon 30px wide
		const zenithAngle = angle - parallacticAngle
		// const rotation = this.calculateMoon(angle, fraction, 0, 1, 0, 150) // 150 looks good in F
		// const rotation = (angle - parallacticAngle) * (180 / Math.PI) // radians to degrees
		// console.log('angle', angle)
		// console.log('parangle', parallacticAngle)
		// console.log('rot', zenithAngle)

		return (

			<div className="mooninfo">
				<fieldset>
					<legend onClick={this.handleClick}>Moon info</legend>
					<div className="moon" style={{ boxShadow: `inset ${illumination}px 0 whitesmoke`, transform: `rotate(${zenithAngle}rad)` }} />
					<p className="m-list">
						Phase: {this.getPhase(phase)} <br />
						Illumination: {(fraction * 100).toFixed(1)}% <br />
						Morning golden hour: <br />{sunriseEnd.toLocaleTimeString()} - {goldenHourEnd.toLocaleTimeString()}<br />
						Evening golden hour: <br />{goldenHour.toLocaleTimeString()} - {sunsetStart.toLocaleTimeString()} <br />
						Moonrise: {rise.toLocaleTimeString()} <br />
						Moonset: {set.toLocaleTimeString()} <br />
						Zodiac: {this.zodiac} <br />
					</p>
				</fieldset>
			</div>
		)
	}
}

