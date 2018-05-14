import React, { Component } from 'react'
import { shell } from 'electron'


export default class Github extends Component {
	constructor() {
		super()
		this.state = {
			gitNotifications: []
		}
	}
	componentDidMount() {
		// if (this.state.gitNotifications) return
		const now = new Date()
		const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
		// eslint-disable-next-line
		fetch(`https://api.github.com/notifications?since=${monthAgo.toISOString()}`, {
			headers: { Authorization: `token ${process.env.GIT_OAUTH_TOKEN}` }
		})
			.then(resp => resp.json())
			.then((json) => {
				this.setState({
					gitNotifications: json,
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
						<legend>Fetching notifications</legend>
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
									const url = el.subject.url.replace(/api\.|repos\//g, '')
									return (
										<li key={i + 1}>
											{i + 1}. <br />Repo: {el.repository.full_name}<br />
											{el.subject.type}: <span className="linkstyle" onClick={this.handleClick.bind(this, url)}>{el.subject.title}</span><br />
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
