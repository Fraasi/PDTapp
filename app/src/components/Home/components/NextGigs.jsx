import React from 'react'
// eslint-disable-next-line import/no-unresolved
import spinner from 'Images/spinner.svg'

export default function NextGigs({ gigsObject }) {

	if (gigsObject === null) {
		return (
			<div className="next-gigs">
				<fieldset>
					<legend>Fetching gigs (5 ~ 15 sec)</legend>
					<img src={spinner} alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
				</fieldset>
			</div>
		)
	}

	if (typeof gigsObject === 'string') {
		return (
			<div className="next-gigs">
				<fieldset>
					<legend>{gigsObject}</legend>
				</fieldset>
			</div>
		)
	}

	const { scrapeTime, cheerio, twitBook } = gigsObject
	const nextGigs = []

	Object.keys(cheerio).forEach((pub) => {
		nextGigs.push(cheerio[pub][0])
	})

	Object.keys(twitBook).forEach((pub) => {
		nextGigs.push(twitBook[pub][0].event)
	})

	return (
		<div className="next-gigs">
			<fieldset>
				<legend>Next happenings, {scrapeTime}</legend>
				<ul>
					{
						nextGigs.map((gig, i) => <li key={i} dangerouslySetInnerHTML={{ __html: gig }} />)
					}
				</ul>
			</fieldset>
		</div>
	)
}
