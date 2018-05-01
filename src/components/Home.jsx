import React, { Component } from 'react'
import Store from 'electron-store'
import { shell } from 'electron'
import dotenv from 'dotenv'
import Weather from './Weather.jsx'
dotenv.config()

const store = new Store({ name: 'pdtapp-config' })

export default class Home extends Component {
	handleClick(url) {
		shell.openExternal(url)
	}

	render() {
		return (
			<div className="view-container" id="home">
				<div className="lastvisit">
					{`Home, last visit was ${store.get('lastLaunched')}`}
					<hr />
				</div>
				<br />
				<div className="gits">
					<fieldset>
						<legend>
							Notifications at GH: {this.props.gitNotifications.length}
						</legend>
						<ul>
							{
								this.props.gitNotifications.map((el, i) => {
									const url = el.subject.url.replace(/api\.|repos\//g, '')
									return (
										<li key={i + 1}>
											{i + 1}. <br />repo: {el.repository.full_name}<br />
											{el.subject.type}: <span className="linkstyle" onClick={this.handleClick.bind(this, url)}>{el.subject.title}</span>
										</li>
									)
								})
							}
						</ul>
					</fieldset>
				</div>
				<Weather weatherData={this.props.weatherData} />
			</div>
		)
	}
}

