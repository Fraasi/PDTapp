import React, { Component } from 'react'
import Store from 'electron-store'

const store = new Store({ name: 'pdtapp-config' })

export default class Home extends Component {

	render() {
		return (
			<div className="view-container" id="home">
				{`Home, last visit was ${store.get('lastLaunched')}`}
			</div>
		)
	}
}
