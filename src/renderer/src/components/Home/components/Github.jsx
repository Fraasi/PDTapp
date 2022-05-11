import React, { Component } from 'react'
import { shell } from 'electron'
import spinner from 'Images/spinner.svg'


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
				this.setState({
					gitNotifications: json,
					loading: false
				})
			})
	}

	handleIssueClick(url) {
		shell.openExternal(url)
	}

	handleTitleClick() {
		shell.openExternal('https://github.com/Fraasi/')
	}

	render() {
		const { loading, gitNotifications } = this.state
		if (gitNotifications === null) {
			return (
				<div className="gits">
					<fieldset>
						<legend onClick={this.handleGitClick}>No git token :(</legend>
						<img src={spinner} alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}
		if (loading) {
			return (
				<div className="gits">
					<fieldset>
						<legend onClick={this.handleGitClick}>Fetching git notifications</legend>
						<img src={spinner} alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
					</fieldset>
				</div>
			)
		}

		return (
			<div className="gits">
				<fieldset>
					<legend onClick={this.handleTitleClick} title="Github">
						Notifications at GH: {gitNotifications.length}
					</legend>
					<ul>
						{
							gitNotifications.length < 1
								? null
								: gitNotifications.map((el, i) => {
									const url = el.subject.url.replace(/api\.|repos\//g, '').replace('pulls', 'pull')
									return (
										<li key={i + 1}>
											{i + 1}. <br />Repo: {el.repository.full_name}<br />
											{el.subject.type}:
											<span
												className="linkstyle"
												onClick={() => this.handleIssueClick(url)}
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
