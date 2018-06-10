import React, { Component } from 'react'

export default class Quote extends Component {
	render() {
		const { quote, author } = this.props.dailyQuote

		if (quote === null) {
			return (
				<div className="quote">
					<fieldset>
						<legend>Fetching quotes</legend>
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
}
