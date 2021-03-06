import React from 'react'
import Store from 'electron-store'
import Github from './components/Github.jsx'
import Npm from './components/Npm.jsx'
import Analytics from './components/Analytics.jsx'
import Quote from './components/Quote.jsx'
import Pic from './components/Pic.jsx'
import './styles.css'

const store = new Store({ name: 'pdtapp-config' })

export default function Home({ npm, fetchNpmStats, pictureFolder, dailyQuote, analyticsReports }) {
	return (
		<div className="view-container" id="home">
			<div className="lastvisit">
				{`Home, last visit was ${store.get('lastLaunched')}`}
			</div>
			<div className="grid left">
				<Github />
				<Npm npm={npm} fetchNpmStats={fetchNpmStats}/>
				<Analytics analyticsReports={analyticsReports}/>
			</div>
			<div className="grid right">
				<Pic pictureFolder={pictureFolder} />
				<Quote dailyQuote={dailyQuote} />
			</div>
		</div>
	)
}
