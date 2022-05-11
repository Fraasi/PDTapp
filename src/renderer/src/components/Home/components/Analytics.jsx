import React, { useState, useEffect } from 'react'
import spinner from 'Images/spinner.svg'


export default function Analytics({ analyticsReports }) {

	if (analyticsReports.length === 0) {
		return (
			<div className="analytics">
				<fieldset>
					<legend>Tapahtumat analytics</legend>
					<img src={spinner} alt="spinner.svg" id="spinner" style={{ position: 'inherit' }} />
				</fieldset>
			</div>
		)
	}

	return (
		<div className="analytics">
			<fieldset>
				<legend>Tapahtumat analytics</legend>
				<ol>
					<li>
						Last week/last year
					</li>
					{
						analyticsReports.map((report, i) => {
							const { columnHeader, data } = report
							const { metricHeader: { metricHeaderEntries } } = columnHeader
							const names = metricHeaderEntries.map(entry => entry.name).join('/')
							// const dees = data.rows.map(report => {
								// return report.dimensions.join('/')
							// })
							const tots = data.totals.map(tot => {
								return tot.values.map(t => t.slice(0, 6)).join(' - ')
							})

							return (
								<li key={i + 1}>
									{
										`${names}
										${tots.join(', ')}`
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
