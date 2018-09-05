import React, { Component } from 'react'
import { shell } from 'electron'


export default class Github extends Component {
	constructor() {
		super()
		this.state = {
			gitNotifications: [],
			loading: true
		}
	}
	componentDidMount() {
		if (!process.env.GIT_OAUTH_TOKEN) {
			this.setState({
				gitNotifications: null
			})
			return
		}

		const now = new Date()
		const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
		fetch(`https://api.github.com/notifications?since=${monthAgo.toISOString()}`, {
			headers: { Authorization: `token ${process.env.GIT_OAUTH_TOKEN}` }
		})
			.then(resp => resp.json())
			.then((json) => {
				console.log('Git fetched', json)
				this.setState({
					gitNotifications: json,
					loading: false
				})
			})
	}

	handleClick(url) {
		shell.openExternal(url)
	}

	render() {
		if (this.state.gitNotifications === null) {
			return (
				<div className="gits">
					<fieldset>
						<legend>No git token :(</legend>
						<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}
		if (this.state.loading) {
			return (
				<div className="gits">
					<fieldset>
						<legend>Fetching git notifications</legend>
						<img src="./assets/img/spinner.svg" alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}

		return (
			<div className="gits">
				<fieldset>
					<legend>
						Notifications at GH: {this.state.gitNotifications.length}
					</legend>
					<ul>
						{
							this.state.gitNotifications.length < 1 ?
								null :
								this.state.gitNotifications.map((el, i) => {
									const url = el.subject.url.replace(/api\.|repos\//g, '').replace('pulls', 'pull')
									return (
										<li key={i + 1}>
											{i + 1}. <br />Repo: {el.repository.full_name}<br />
											{el.subject.type}:
											<span
												className="linkstyle"
												onClick={() => this.handleClick(url)}
											>{el.subject.title}
											</span><br />
											Reason: {el.reason}
										</li>
									)
								})
						}
					</ul>
				</fieldset>
			</div>
		)
	}
}
