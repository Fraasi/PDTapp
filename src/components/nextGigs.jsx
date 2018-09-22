import React, { Component } from 'react'

export default class NextGigs extends Component {
	render() {
		const { gigsObject } = this.props
		if (gigsObject === null) {
			return (
				<div className="next-gigs">
					<fieldset>
						<legend>Fetching gigs (should take around 30 sec)</legend>
						<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}

		const nextGigs = []
		Object.keys(gigsObject).forEach((pub) => {
			if (pub !== 'puppeteerTime') {
				Object.keys(gigsObject[pub]).forEach((name) => {
					gigsObject[pub][name].forEach((el, i) => {
						if (typeof el === 'string' && i === 0) {
							nextGigs.push(el)
						} else if (typeof el === 'object' && i === 0) {
							const string = `${el.startingDateTime} ${el.shortTime.includes('-') ? `<b>(${el.shortTime}) </b>` : '-'} ${el.event} - ${el.guests}`
							nextGigs.push(string)
						}
					})
				})
			}
		})

		return (
			<div className="next-gigs">
				<fieldset>
					<legend>Next gigs</legend>
					<ul>
						{
							nextGigs.map((gig, i) => <li key={i} dangerouslySetInnerHTML={{ __html: gig }} />)
						}
					</ul>
				</fieldset>
			</div>
		)
	}
}
