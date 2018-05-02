import React, { Component } from 'react'
import { shell } from 'electron'


export default class Github extends Component {
	handleClick(url) {
		shell.openExternal(url)
	}
	render() {
		if (this.props.gitNotifications === null) {
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
						Notifications at GH: {this.props.gitNotifications.length}
					</legend>
					<ul>
						{
							this.props.gitNotifications.length < 1 ?
								null :
								this.props.gitNotifications.map((el, i) => {
									const url = el.subject.url.replace(/api\.|repos\//g, '')
									return (
										<li key={i + 1}>
											{i + 1}. <br />Repo: {el.repository.full_name}<br />
											{el.subject.type}: <span className="linkstyle" onClick={this.handleClick.bind(this, url)}>{el.subject.title}</span>
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
