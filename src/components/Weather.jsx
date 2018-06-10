import React, { Component } from 'react'
import { shell } from 'electron';

export default class Weather extends Component {
	constructor() {
		super()
		this.handleClick = this.handleClick.bind(this)
	}
	parseTime(time) {
		return (time < 10) ? `0${time}` : time;
	}
	handleClick() {
		shell.openExternal(`https://openweathermap.org/city/${this.props.weatherData.id}`)
	}

	render() {
		if (this.props.weatherData === null) {
			return (
				<div className="weather">
					<fieldset>
						<legend>Fetching weather</legend>
						<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}

		if (this.props.weatherData.ok === false) {
			return (
				<div className="weather">
					<fieldset>
						<legend>{this.props.weatherData.status} weather</legend>
						{`Error: ${this.props.weatherData.statusText}`}
						<br />
						{'Check your city in the settings!'}
					</fieldset>
				</div>
			)
		}

		const {
			name, clouds, visibility, wind, main, weather, sys
		} = this.props.weatherData

		return (
			<div className="weather">
				<fieldset>
					<legend onClick={this.handleClick}>{name} weather</legend>
					<ul className="w-list">
						<li>Temp {main.temp.toFixed(1)}&deg;C</li>
						{
							weather.map((el, i) => (
								<li key={i}>{el.description}
									<img src={`https://openweathermap.org/img/w/${el.icon}.png`} alt={el.icon} />
								</li>))
						}
						<li>Clouds {clouds.all}%</li>
						<li>Visibility {visibility}m</li>
						<li>Wind {wind.speed} m/s @ {Math.round(wind.deg)}&deg;
						<img className="fa-icon long-arrow-alt-down" src="./assets/img/long-arrow-alt-down.svg" alt="long-arrow-alt-down.svg" style={{ transform: `rotate(${wind.deg}deg)` }} />
						</li>
						<li>Humidity {main.humidity}%</li>
						<li>Pressure {main.pressure} hPa</li>
						<li>Sunrise {this.parseTime(new Date(sys.sunrise * 1000).getHours())}:{this.parseTime(new Date(sys.sunrise * 1000).getMinutes())}</li>
						<li>Sunset {this.parseTime(new Date(sys.sunset * 1000).getHours())}:{this.parseTime(new Date(sys.sunset * 1000).getMinutes())}</li>
					</ul>
				</fieldset>
			</div>
		)
	}
}
