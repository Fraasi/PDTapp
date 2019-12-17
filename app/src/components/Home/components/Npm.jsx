import React, { useState, useEffect } from 'react'
import { shell } from 'electron'
import spinner from 'Images/spinner.svg'


export default function Npm() {

	const [npmData, setNpmData] = useState(null)
	const [loading, setLoadingState] = useState(true)

	useEffect(() => {
		const getData = async () => {

			const repos = await fetch('https://api.npms.io/v2/search?q=maintainer:fraasi').then(d => d.json())
			const downloads = await Promise.all(repos.results.map(repo => {
				return fetch(`https://api.npmjs.org/downloads/point/last-week/${repo.package.name}`).then(d => d.json())
			}))
			// TODO: put to global state, so only need to load once per app start
			setNpmData(downloads)
			setLoadingState(false)
		}
		getData()
	}, [])

	const handleTitleClick = () => {
		shell.openExternal('https://www.npmjs.com/~fraasi')
	}

	if (npmData === null || loading) {
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
				<legend onClick={handleTitleClick} title="Npm">
					Npm stats (dls/week)
					</legend>
				<ol>
					{
						npmData.map((repo, i) => {
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
