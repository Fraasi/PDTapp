const path = require('path')

// only in reneder process
exports.notify = (title, body) => {
	const notification = {
		title: title || 'PDapp says...',
		body: body || 'PDapp ready to go',
		// detail: 'wuzzuuup',
		icon: path.join(__dirname, '../assets/img/2017-03-18_1200.png')
	}
	// eslint-disable-next-line
	const myNotification = new window.Notification(notification.title, notification)

	myNotification.onclick = () => {
		console.log('Notification clicked')
	}
}
