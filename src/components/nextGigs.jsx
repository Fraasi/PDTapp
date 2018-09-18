import React, { Component } from 'react'

export default class NextGigs extends Component {
  render() {
    const { gigsObject } = this.props
		if (gigsObject.dogs[0] === undefined) {
			return (
				<div className="next-gigs">
					<fieldset>
						<legend>Fetching gigs (takes around a minute)</legend>
						<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
    }

    const nextGigs = []
    Object.keys(gigsObject).forEach((pub) => {
      if (pub !== 'puppeteerTime') nextGigs.push(gigsObject[pub][0])
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
