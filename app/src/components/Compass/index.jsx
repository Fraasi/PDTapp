import React from 'react'
import { shell } from 'electron'
import './styles.css'

export default function Compass() {

	const handleClick = (url) => {
		shell.openExternal(url)
	}

	return (
		<div className="view-container" id="compass">

		<iframe src="https://pispala.events" title="Pispalan tapahtumat" id="tapahtumat"></iframe>

		</div>
	)
}
