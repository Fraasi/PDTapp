import React, { Component } from 'react'
import Note from './Note.jsx'

export default class Notebook extends Component {
	componentDidMount() {
		// fetch notes
	}
	componentWillUnmount() {
		// save notes
	}

	render() {
		return (
			<div className="view-container" id="notebook">
				<Note />
			</div>
		)
	}
}
