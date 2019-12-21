import React, { useState, useEffect } from 'react'
import { shell } from 'electron'
import spinner from 'Images/spinner.svg'


export default function Npm({ npm: {loading, stats, time}, fetchNpmStats }) {

	const handleTitleClick = () => {
		shell.openExternal('https://www.npmjs.com/~fraasi')
	}
	const handleTimePeriodClick = () => {
		if (time === 'last-week') {
			fetchNpmStats('last-month')
		} else {
			fetchNpmStats('last-week')
		}
	}

	if (stats === null || loading) {
		return (
			<div className="npm">
				<fieldset>
					<legend onClick={handleTitleClick}>Npm stats</legend>
					<img src={spinner} alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
				</fieldset>
			</div>
		)
	}

	return (
		<div className="npm">
			<fieldset>
				<legend><span onClick={handleTitleClick} title="Npm">
					Npm stats </span><span onClick={handleTimePeriodClick} title="Change time period">{`(dls/${time})`}</span>
					</legend>
				<ol>
					{
						stats.map((repo, i) => {
							return (
								<li key={i + 1}>
									{
										`${repo.package + repo.downloads.toString().padStart(22 - repo.package.length, '.')}`
									}
								</li>
							)
						})
					}
				</ol>
			</fieldset>
		</div>
	)
}
