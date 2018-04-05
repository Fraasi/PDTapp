// $ .\node_modules\.bin\electron .
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import { app, BrowserWindow, Menu, dialog, globalShortcut, Tray, shell } from 'electron';
import path from 'path'
const Store = require('electron-store');
const store = new Store({
	name: 'pdtapp'
});
store.set('unicorn', '🦄');
store.set('uni', 'inu');


const isDevMode = process.execPath.match(/[\\/]electron/);
if (isDevMode) {
	enableLiveReload({ strategy: 'react-hmr' });
	// comment 'electron-context-menu' before build
	require('electron-context-menu')({
		prepend: params => [{
			label: 'Rainbow',
			visible: params.mediaType === 'image',
		}],
	});
}

let win;
let trayIcon

async function createWindow() {
	app.setAppUserModelId('app.setAppUserModelId')
	app.setUserTasks([
		{
			program: process.execPath,
			arguments: '--new-window',
			iconPath: process.execPath,
			iconIndex: 0,
			title: 'New Window',
			description: 'Create a new window'
		}
	])

	win = new BrowserWindow({
		width: 900,
		height: 600,
		minWidth: 600,
		x: 0,
		y: 140,
		title: `${app.getName()} launched at ${new Date().toLocaleString('en', { hour12: false })}`,
		resizable: true,
		backgroundColor: '#525252',
		icon: path.join(__dirname, 'assets/icons/64x64.png'),
		show: false,
		titleBarStyle: 'hidden',
	}).on('ready-to-show', () => {
		win.show();
		win.focus();
	})

	win.loadURL(`file://${__dirname}/index.html`);
	if (isDevMode) {
		await installExtension(REACT_DEVELOPER_TOOLS);
		win.webContents.openDevTools({ mode: 'right' });
	}

	win.on('closed', () => {
		win = null;
	});
	// eslint-disable-next-line
	const menu = Menu.buildFromTemplate(menuTemplate);
	// const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);

	globalShortcut.register('CommandOrControl+Alt+P', () => {
		win.focus()
	});

	app.on('will-quit', () => {
		globalShortcut.unregisterAll();
	});

	const trayIconPath = path.join(__dirname, './assets/icons/24x24.png')
	trayIcon = new Tray(trayIconPath);

	const trayIconContextMenu = Menu.buildFromTemplate([
		{
			label: 'Remove tray icon',
			click: () => {
				trayIcon.destroy();
			},
		}, {
			label: 'Quit app',
			click() {
				trayIcon.destroy()
				app.quit()
			}
		}
	]);

	trayIcon.setToolTip('PDapp in the tray');
	trayIcon.setContextMenu(trayIconContextMenu);

	app.on('window-all-closed', () => {
		if (trayIcon) trayIcon.destroy();
		if (process.platform !== 'darwin') app.quit();
	});

	win.webContents.on('did-finish-load', () => {
		// notify('main sez', 'webcontents finished loading')
	})
}


app.on('ready', createWindow);

function switchView(item) {
	win.webContents.send('switchView', item)
}
// eslint-disable-next-line
var menuTemplate = [
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
			accelerator: 'Shift+CmdOrCtrl+C',
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
			label: 'Gigs',
			accelerator: 'CmdOrCtrl+G',
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
			label: `About PDapp ${app.getVersion()}`,
			role: 'about',
			accelerator: 'Shift+CmdOrCtrl+A',
			click(item, focusedWindow) {
				if (focusedWindow) {
					const options = {
						type: 'info',
						icon: path.join(__dirname, '../assets/icons/64x64.png'),
						buttons: ['Ok', 'Github repo'],
						defaultId: 0,
						browserWindow: true,
						title: 'About',
						message: `${app.getName()} ${app.getVersion()}`,
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

