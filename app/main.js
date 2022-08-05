process.on('unhandledRejection', (err) => {
	console.log('unhandledRejection', err)
	throw err;
})
const path = require('path')
// const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
require('electron-reload')(__dirname)

delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

const {
	app, BrowserWindow, Menu, dialog, globalShortcut, Tray, shell, Notification, clipboard
} = require('electron')
const Store = require('electron-store')

const store = new Store({
	name: 'pdtapp-config',
	defaults: {
		storePath: app.getPath('userData'),
		bounds: {
			width: 700,
			height: 550,
			x: 250,
			y: 70,
		},
		notes: [{
			title: 'Untitled',
			dateCreated: 0,
			rawText: '<!-- Untitled, first word on first line will be the title -->  \n\n- [x] github flavored markdown supported  \n- [x] saves automatically  \n- [ ] check About -> Shortcuts for hotkeys'
		}],
		pictureFolder: app.getPath('pictures'),
		storeView: 'home',
	}
})

const shortcuts = require('./src/js/shortcuts.js')

const isDevMode = process.execPath.match(/[\\/]electron/)
if (isDevMode) {
	require('electron-context-menu')({
		prepend: params => [{
			label: 'Rainbow',
			visible: params.mediaType === 'image',
		}],
			showInspectElement: true
	})
}

let win
let trayIcon
const launchedAt = new Date().toLocaleString('en-GB', { hour12: false })

async function createWindow() {
	app.setAppUserModelId('PDTapp')

	win = new BrowserWindow({
		width: store.get('bounds.width'),
		height: store.get('bound.height'),
		minWidth: 600,
		x: store.get('bounds.x'),
		y: store.get('bounds.y'),
		title: `${app.getName()} launched at ${launchedAt}`,
		resizable: true,
		backgroundColor: '#525252',
		icon: path.join(__dirname, 'src/assets/icons/32x32.png'),
		show: false,
		// titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			contextIsolation: false,
			preload: path.join(__dirname, 'src', 'preload.js')
		}
	}).on('ready-to-show', () => {
		win.show()
		win.focus()
	})
	// app\index.html
	// win.loadURL(`file://${__dirname}/index.html`)
	win.loadFile(path.join(__dirname, '../build/index.html'))
	if (isDevMode) {
		// await installExtension(REACT_DEVELOPER_TOOLS)
		win.webContents.openDevTools({ mode: 'right' })
	}
	win.webContents.openDevTools({ mode: 'right' })

	win.on('closed', () => {
		win = null
	})

	const menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)

	globalShortcut.register('CommandOrControl+Alt+P', () => {
		win.focus()
	})

	app.on('will-quit', () => {
		globalShortcut.unregisterAll()
		store.set('lastLaunched', launchedAt)
	})

	const trayIconPath = path.join(__dirname, 'src/assets/icons/32x32.png')
	trayIcon = new Tray(trayIconPath)

	const trayIconContextMenu = Menu.buildFromTemplate([
		{
			label: 'Remove tray icon',
			click: () => {
				trayIcon.destroy()
			},
		}, {
			label: 'Quit app',
			click() {
				trayIcon.destroy()
				app.quit()
			}
		}
	])

	trayIcon.setToolTip('PDTapp')
	trayIcon.setContextMenu(trayIconContextMenu)

	app.on('window-all-closed', () => {
		if (trayIcon) trayIcon.destroy()
		if (process.platform !== 'darwin') app.quit()
	})

	let timer
	function debounced() {
		clearTimeout(timer)
		timer = setTimeout(() => {
			win.webContents.send('windowMove/Resize', {
				store: store.store
			})
		}, 1000)
	}

	win.on('move', () => {
		debounced()
	})

	win.on('resize', () => {
		debounced()
	})

	const ret = globalShortcut.register('CommandOrControl+Alt+V', () => {
		const clipboardText = clipboard.readText()
		const notif = new Notification({
			title: 'Clipboard to note',
			body: clipboardText,
			icon: path.join(__dirname, 'src/assets/icons/32x32.png'),
		})
		notif.show()
		const notes = store.get('notes')
		notes.push({
			title: clipboardText.match(/\w+/),
			dateCreated: Date.now(),
			rawText: clipboardText,
		})
		store.set('notes', notes)
		notif.on('click', () => {
			win.focus()
			switchView({ label: 'Notebook' })
		})
	})

	if (!ret) {
		const notif = new Notification({
			title: 'Clipboard to note',
			body: 'Shortcut registration failed!',
			icon: path.join(__dirname, 'src/assets/icons/32x32.png'),
		})
		notif.show()
	}

	// protocol.registerFileProtocol('local', (request, callback) => {
	// 	const url = request.url.substr(8)
	// 	callback({ path: path.normalize(url) })
	// }, (error) => {
	// 	if (error) {
	// 		console.log('failed to register protocol')
	// 	}
	// })
}

app.on('ready', createWindow)


function switchView(item) {
	win.webContents.send('switchView', item)
}

const menuTemplate = [
	{
		label: 'Views',
		submenu: [{
			label: 'Home',
			accelerator: 'CmdOrCtrl+H',
			click(item) {
				switchView(item)
			}
		}, {
			label: 'Calendar',
			accelerator: 'CmdOrCtrl+K',
			click(item) {
				switchView(item)
			}
		}, {
			label: 'Notebook',
			accelerator: 'CmdOrCtrl+N',
			click(item) {
				switchView(item)
			}
		}, {
			label: 'Compass',
			accelerator: 'CmdOrCtrl+G',
			click(item) {
				switchView(item)
			}
		}, {
			label: 'Terminal',
			accelerator: 'CmdOrCtrl+T',
			click(item) {
				switchView(item)
			}
		}, {
			label: 'Stats',
			accelerator: 'CmdOrCtrl+I',
			click(item) {
				switchView(item)
			}
		}, {
			label: 'Settings',
			accelerator: 'CmdOrCtrl+S',
			click(item) {
				switchView(item)
			}
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
			label: `About PDTapp ${app.getVersion()}`,
			role: 'about',
			accelerator: 'Shift+CmdOrCtrl+A',
			click(item, focusedWindow) {
				if (focusedWindow) {
					const options = {
						type: 'info',
						icon: path.join(__dirname, 'src/assets/icons/32x32.png'),
						buttons: ['Ok', 'Github repo'],
						defaultId: 0,
						browserWindow: true,
						title: 'About',
						message: `${app.getName()} ${app.getVersion()}`,
						detail: 'PDTapp is a side project to build a little personal desktop app with electron.',
					}
					dialog.showMessageBox(focusedWindow, options, (response) => {
						if (response === 1) {
							shell.openExternal('https://github.com/Fraasi/PDTapp')
						}
					})
				}
			}
		}, {
			label: 'ShortCuts',
			accelerator: 'CmdOrCtrl+Shift+S',
			click() {
				const options = {
					type: 'info',
					icon: path.join(__dirname, 'src/assets/icons/32x32.png'),
					buttons: ['Ok'],
					browserWindow: true,
					title: 'Shortcuts',
					message: shortcuts,

				}
				dialog.showMessageBox(options)
			}
		}, {
			type: 'separator',
		}, {
			label: 'Electron docs',
			click() { shell.openExternal('https://electronjs.org/docs') },
		},
		],
	},
]
