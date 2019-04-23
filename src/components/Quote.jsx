import React from 'react'

export default function Quote({ dailyQuote: { quote, author } }) {

		if (quote === undefined) {
			return (
				<div className="quote">
					<fieldset>
						<legend>Fetching quote</legend>
						<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
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
