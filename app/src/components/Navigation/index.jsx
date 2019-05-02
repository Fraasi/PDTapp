/* eslint-disable import/no-unresolved */
import React from 'react'
import home from 'Images/home.svg'
import calendar from 'Images/calendar-alt.svg'
import notebook from 'Images/file-alt.svg'
import compass from 'Images/compass.svg'
import terminal from 'Images/laptop-code.svg'
import settings from 'Images/cog.svg'
import './styles.css'

const imgs = {
	home,
	calendar,
	notebook,
	compass,
	terminal,
	settings
}

export default function Navbar({ handleStateChange, views }) {

	const handleClick = (e) => {
		if (e.target.classList[1] !== undefined) {
			handleStateChange({ view: e.target.classList[1] })
			e.stopPropagation()
		}
	}

	return (
		<div className="navbar" onClick={handleClick}>
			{
				views.map((view, i) => (
					<img className={`fa-icon ${view}`} src={imgs[view]} alt={`${view}.svg`} key={i} />
				))
			}
		</div>
	)
}
