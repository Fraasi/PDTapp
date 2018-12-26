import React, { Component } from 'react'
import Store from 'electron-store'
import dotenv from 'dotenv'
import Github from './Github.jsx'
import Quote from './Quote.jsx'
import Pic from './Pic.jsx'
import NextGigs from './nextGigs.jsx'
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
					<NextGigs gigsObject={this.props.gigsObject} />
				</div>
				<div className="grid right">
					<Pic pictureFolder={this.props.pictureFolder} />
					<Quote dailyQuote={this.props.dailyQuote} />
				</div>

			</div>
		)
	}
}

