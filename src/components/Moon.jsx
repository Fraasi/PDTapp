import React, { Component } from 'react'
import MoonInfo from '../js/moonobject.js'

export default class Moon extends Component {
	constructor() {
		super()
		const date = new Date()
		const day = date.getDate()
		const month = date.getMonth() + 1
		const year = date.getFullYear()

		this.moonInfo = new MoonInfo(day, month, year)
		console.log(this.moonInfo)
	}
	render() {
		const { zodiac, illumination, phase } = this.moonInfo
		return (
			<div className="mooninfo">
				<fieldset>
					<legend>Moon info</legend>
					<p>
					Zodiac: {zodiac} <br />
					Illumination: {illumination}% <br />
					phase: {phase} <br />
					and here a css pic with ill%
					</p>
				</fieldset>
			</div>
		)
	}
}
