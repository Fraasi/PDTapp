import React from 'react'
// eslint-disable-next-line import/no-unresolved
import spinner from 'Images/spinner.svg'

export default function Quote({ dailyQuote: { quote, author } }) {

		if (quote === undefined) {
			return (
				<div className="quote">
					<fieldset>
						<legend>Fetching quote</legend>
						<img src={spinner} alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}

		return (
			<div className="quote">
				<fieldset>
					<legend>Quote of the day</legend>
					<p>
						{quote}
					</p>
						<span style={{ display: 'block', textAlign: 'right', fontStyle: 'italic' }}>
							- {author}
						</span>
				</fieldset>
			</div>
		)
	}
