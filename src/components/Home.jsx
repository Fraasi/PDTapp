import React from 'react'
import Store from 'electron-store'
import Github from './Github.jsx'
import Quote from './Quote.jsx'
import Pic from './Pic.jsx'
import NextGigs from './NextGigs.jsx'

const store = new Store({ name: 'pdtapp-config' })

export default function Home({ gigsObject, pictureFolder, dailyQuote }) {
	return (
		<div className="view-container" id="home">
			<div className="lastvisit">
				{`Home, last visit was ${store.get('lastLaunched')}`}
			</div>
			<div className="grid left">
				<Github />
				<NextGigs gigsObject={gigsObject} />
			</div>
			<div className="grid right">
				<Pic pictureFolder={pictureFolder} />
				<Quote dailyQuote={dailyQuote} />
			</div>
		</div>
	)
}
