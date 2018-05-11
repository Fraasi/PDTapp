import React, { Component } from 'react'
import Store from 'electron-store'
import dotenv from 'dotenv'
import Weather from './Weather.jsx'
import Github from './Github.jsx'
import Quote from './Quote.jsx'
import Pic from './Pic.jsx'
dotenv.config()

const store = new Store({ name: 'pdtapp-config' })

export default class Home extends Component {
	render() {
		return (
			<div className="view-container" id="home">
				<div className="lastvisit">
					{`Home, last visit was ${store.get('lastLaunched')}`}
					<hr />
				</div>
				<br />
				<Github gitNotifications={this.props.gitNotifications} />
				<Weather weatherData={this.props.weatherData} />
				<Quote />
				<Pic />
			</div>
		)
	}
}

