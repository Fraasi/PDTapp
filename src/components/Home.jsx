import React, { Component } from 'react'
import Store from 'electron-store'
import dotenv from 'dotenv'
import Weather from './Weather.jsx'
import Github from './Github.jsx'
import Quote from './Quote.jsx'
import Pic from './Pic.jsx'
import Moon from './Moon.jsx'
dotenv.config()

const store = new Store({ name: 'pdtapp-config' })

export default class Home extends Component {
	render() {
		return (
			<div className="view-container" id="home">
				<div className="lastvisit">
					{`Home, last visit was ${store.get('lastLaunched')}`}
				</div>
				<div className="grid left">
					<Github />
					<Pic pictureFolder={this.props.pictureFolder} />
				</div>
				<div className="grid right">
					<Weather weatherData={this.props.weatherData} weatherCity={this.props.weatherCity} />
					<Moon weatherData={this.props.weatherData} />
				</div>
				<Quote dailyQuote={this.props.dailyQuote} />
			</div>
		)
	}
}

