import React, { Component } from 'react'

export default class Quote extends Component {
	constructor() {
		super()
		this.state = { quote: null, author: null }
	}

	componentDidMount() {
		// eslint-disable-next-line
		fetch('https://ms-rq-api.herokuapp.com/')
			.then(d => d.json())
			.then((json) => {
				this.setState({
					quote: json[Object.keys(json)[0]],
					author: Object.keys(json)[0]
				})
			})
	}

	render() {
		if (this.state.quote === null) {
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
						{this.state.quote}
					</p>
						<p style={{ textAlign: 'right', fontStyle: 'italic' }}>
							- {this.state.author}
						</p>
				</fieldset>
			</div>
		)
	}
}
