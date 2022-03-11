import {app, BrowserWindow, Menu, Tray, ipcMain} from 'electron'
import '../renderer/store'


const path = require('path');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
console.log(__static, '!!!!!!!!!!!!!!!!!!!!')
console.log(__dirname, '!!!!!!!!!!!!!!!!!!!!')
/*去除控制台警告*/
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:9080`
	: `file://${__dirname}/index.html`

//托盘对象
var appTray = null;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 600,
		// resizable: true,
		useContentSize: true,
		title: '将应用程序添加至系统托盘',
		skipTaskbar: false
	})
	//系统托盘右键菜单
	var trayMenuTemplate = [
		{
			label: '设置',
			click: function () {
			} //打开相应页面
		},
		{
			label: '意见反馈',
			click: function () {
			}
		},
		{
			label: '帮助',
			click: function () {
			}
		},
		{
			label: '退出应用',
			click: function () {
				//ipc.send('close-main-window');
				app.quit();
			}
		}]
	//系统托盘图标目录
	var trayIcon = path.join(__static, './img')
	appTray = new Tray(path.join(trayIcon, 'icon.jpg'))
	//图标的上下文菜单
	const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
	//设置此托盘图标的悬停提示内容
	appTray.setToolTip('This is my application.')
	//设置此图标的上下文菜单
	appTray.setContextMenu(contextMenu);

	mainWindow.loadURL(winURL)

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})

/*主线程消息闪烁*/
ipcMain.on('twinkle-msg', twinkle)
function twinkle (event, arg) {
	console.log('收到了消息', arg)
	mainWindow.webContents.send('asynchronous-message', 'pong');
	//系统托盘图标闪烁
	var count = 0,timer = null;
	timer=setInterval(function() {
		count++;
		var trayIcon = path.join(__static, './img')
		if (count%2 == 0) {
			appTray.setImage(path.join(trayIcon, 'icon.jpg'))
		} else {
			appTray.setImage(path.join(trayIcon, 'ticon.png'))
		}
	}, 600);

	//单点击 1.主窗口显示隐藏切换 2.清除闪烁
	appTray.on("click", function(){
		if(!!timer){
			var trayIcon = path.join(__static, './img')
			appTray.setImage(path.join(trayIcon, 'icon.jpg'))
			clearInterval(timer)
			//主窗口显示隐藏切换
			mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
		}
	})
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */


