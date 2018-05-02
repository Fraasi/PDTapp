import React, { Component } from 'react'

export default class Weather extends Component {
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

		const {
			name, clouds, visibility, wind, main, weather, sys
		} = this.props.weatherData
		return (
			<div className="weather">
				<fieldset>
					<legend>{name} weather</legend>
					<ul className="w-list">
						<li>Clouds {clouds.all}%</li>
						<li>Visibility {visibility}m</li>
						<li>Wind {wind.deg}&deg; / {wind.speed} m/s
						<img className="fa-icon long-arrow-alt-down.svg" src="./assets/img/long-arrow-alt-down.svg" alt="long-arrow-alt-down.svg" style={{ transform: `rotate(${wind.deg}deg)` }} />
						</li>
						<li>Humidity {main.humidity}%</li>
						<li>Pressure {main.pressure} hPa</li>
						<li>Temp {main.temp}&deg;C</li>
						{
							weather.map((el, i) => (
								<li key={i}>{el.description}
									<img src={`https://openweathermap.org/img/w/${el.icon}.png`} alt={el.icon} />
								</li>))
						}
						<li>Sunrise {new Date(sys.sunrise * 1000).getHours()}:{new Date(sys.sunrise * 1000).getMinutes()}</li>
						<li>Sunset {new Date(sys.sunset * 1000).getHours()}:{new Date(sys.sunset * 1000).getMinutes()}</li>
					</ul>
				</fieldset>
			</div>
		)
	}
}
