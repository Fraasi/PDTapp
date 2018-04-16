const { dialog, shell } = require('electron')
const path = require('path')


module.exports.template = [
	{
		label: 'Views',
		submenu: [{
			label: 'Home',
			accelerator: 'CmdOrCtrl+H',
			// click(item) {
			// 	switchView(item)
			// }
		}, {
			label: 'Calendar',
			accelerator: 'CmdOrCtrl+C',
			// click(item) {
			// 	switchView(item)
			// }
		}, {
			label: 'Notebook',
			accelerator: 'CmdOrCtrl+N',
			// click(item) {
			// 	switchView(item)
			// }
		}, {
			label: 'Gigs',
			accelerator: 'CmdOrCtrl+G',
			// click(item) {
			// 	switchView(item)
			// }
		}, {
			label: 'Settings',
			accelerator: 'CmdOrCtrl+S',
			// click(item) {
			// 	switchView(item)
			// }
		}]
	}, {
		role: 'editMenu'
	}, {
		label: 'DevTools',
		submenu: [
			{ role: 'reload' },
			{ role: 'forcereload' },
			{ role: 'toggledevtools' },
			{ role: 'resetzoom' },
			{ role: 'pasteandmatchstyle' }
		]
	}, {
		label: 'About',
		submenu: [{
			label: `About PDapp ${global.store.version || 'N/A'}`,
			role: 'about',
			accelerator: 'Shift+CmdOrCtrl+A',
			click(item, focusedWindow) {
				if (focusedWindow) {
					const options = {
						type: 'info',
						icon: path.join(__dirname, '../assets/icons/32x32.png'),
						buttons: ['Ok', 'Github repo'],
						defaultId: 0,
						browserWindow: true,
						title: 'About',
						message: `${global.store.name || 'N/A'} ${global.store.version || 'N/A'}`,
						detail: 'PDapp is a side project to build a little personal desktop app with electron.',
					}
					dialog.showMessageBox(focusedWindow, options, (response) => {
						if (response === 1) {
							shell.openExternal('https://github.com/fraasi')
						}
					})
				}
			}
		}, {
			label: 'ShortCuts',
			accelerator: 'CmdOrCtrl+S',
			click() {
				const options = {
					type: 'info',
					icon: path.join(__dirname, '../assets/icons/64x64.png'),
					buttons: ['Ok'],
					browserWindow: true,
					title: 'Shortcuts',
					message: 'Ctrl+H: Home\n Ctrl+C: Calendar\n Ctrl+N: Notebook\n Ctrl+G: gigs\n Ctrl+S: Settings',

				}
				dialog.showMessageBox(options)
			}
		}, {
			type: 'separator',
		}, {
			label: 'Electron docs',
			click() { shell.openExternal('https://electronjs.org/docs'); },
		},
		],
	},
];

