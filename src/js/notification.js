const path = require('path')

// only in reneder process
exports.notify = (title, body) => {
	const notification = {
		title: title || 'PDTapp says...',
		body: body || 'PDTapp ready to go',
		detail: 'Details go here',
		icon: path.join(__dirname, '../assets/img/32x32.png')
	}
	// eslint-disable-next-line
	const myNotification = new window.Notification(notification.title, notification)

	myNotification.onclick = () => {
		console.log('Notification clicked')
	}
}
