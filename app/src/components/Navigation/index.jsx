/* eslint-disable import/no-unresolved */
import React from 'react'
import home from 'Images/home.svg'
import calendar from 'Images/calendar-alt.svg'
import notebook from 'Images/file-alt.svg'
import gigs from 'Images/compass.svg'
import terminal from 'Images/laptop-code.svg'
import settings from 'Images/cog.svg'
import styles from './styles.css'
import './style.test.css'
const imgs = {
	home,
	calendar,
	notebook,
	gigs,
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
		<div className={styles.navbar} onClick={handleClick}>
			{
				views.map((view, i) => (
					<img className={`${styles.faIcon} ${view}`} src={imgs[view]} alt={`${view}.svg`} key={i} />
				))
			}
		</div>
	)
}
