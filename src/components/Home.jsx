import React, { Component } from 'react'
import Store from 'electron-store'
import dotenv from 'dotenv'
dotenv.config()

const store = new Store({ name: 'pdtapp-config' })

export default class Home extends Component {
	constructor() {
		super()
		this.state = {
			notifications: undefined
		}
	}

	componentDidMount() {
		if (this.state.notifications === undefined) {
			// eslint-disable-next-line
			fetch(`https://api.github.com/notifications?access_token=${process.env.GIT_OAUTH_TOKEN}`)
				.then(r => r.json())
				.then((arr) => {
				console.log(arr)
					this.setState({
						notifications: arr
					})
				})
		}
	}
	render() {
		return (
			<div className="view-container" id="home">
				{`Home, last visit was ${store.get('lastLaunched')}`}
				<br />
				{
					this.state.notifications === undefined ?
						'Notifications at GH: null' :
						`Notifications at GH: ${this.state.notifications.length}`
				}
			</div>
		)
	}
}
