'use strict';

const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'keyfile.json',
  scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
})

const analyticsreporting = google.analyticsreporting({
  version: 'v4',
  auth
})


async function fetchAnalyticsData() {

  const res = await analyticsreporting.reports.batchGet({
    requestBody: {
      reportRequests: [
        {
          viewId: process.env.VIEW_ID,
          hideValueRanges: true,
          dateRanges: [
            {
              startDate: '30daysAgo',
              endDate: 'yesterday',
            },
            {
              startDate: '365daysAgo',
              endDate: 'yesterday',
            }
          ],
          dimensions: [
            {
              name: 'ga:userType'
            }
          ],
          metrics: [
            {
              expression: 'ga:users',
            },
            {
              expression: 'ga:percentNewSessions'
            },
          ]
        },
        {
          viewId: process.env.VIEW_ID,
          hideValueRanges: true,
          dateRanges: [
            {
              startDate: '30daysAgo',
              endDate: 'yesterday',
            },
            {
              startDate: '365daysAgo',
              endDate: 'yesterday',
            }
          ],
          // dimensions: [
          //   {
          //     name: 'ga:pagePath'
          //   }
          // ],
          metrics: [
            {
              expression: 'ga:pageviews'
            }
          ]
        },
        {
          viewId: process.env.VIEW_ID,
          hideValueRanges: true,
          dateRanges: [
            {
              startDate: '30daysAgo',
              endDate: 'yesterday',
            },
            {
              startDate: '365daysAgo',
              endDate: 'yesterday',
            }
          ],
          dimensions: [
            {
              name: 'ga:eventCategory'
            },
            {
              name: 'ga:eventAction'
            },
          ],
          metrics: [
            {
              expression: 'ga:uniqueEvents'
            },
            {
              expression: 'ga:totalEvents'
            },
          ]
        }
      ],
    },
  }).catch((e) => {
    console.error('Analytics fetch error:', e)
  })
    return res.data
}

export default fetchAnalyticsData
