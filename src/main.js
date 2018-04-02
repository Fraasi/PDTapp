// $ .\node_modules\.bin\electron .
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import { app, BrowserWindow, Menu, dialog, globalShortcut, Tray } from 'electron';
import path from 'path'


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

global.store = {
	version: app.getVersion(),
	name: app.getName(),
	path: app.getAppPath(),
}

async function createWindow() {
	win = new BrowserWindow({
		width: 900,
		height: 600,
		minWidth: 600,
		x: 0,
		y: 140,
		title: `${app.getName()} launched at ${new Date().toLocaleString('en', { hour12: false })} `,
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
		// win.destroy();
		win = null;
	});

	const menu = Menu.buildFromTemplate(require('./js/main-menu-template.js').template);
	// const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);

	globalShortcut.register('CommandOrControl+Alt+K', () => {
		dialog.showMessageBox({
			type: 'info',
			message: 'Success!',
			detail: 'You pressed the registered global shortcut keybinding.',
			buttons: ['OK'],
		});
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

