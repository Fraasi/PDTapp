## PDTapp personal desktop app (WIP)

PDTapp is a 'little' side project to build a little personal desktop app with electron.
I have no idea what the end product will be like. Im making this shit up as I go along.
edit: Looks like I'm dumping all my little projects inside electron here...

### dependencies so far
* react
* fullcalendar.js
* node-osmosis
* electron-store
* dotenv
* showdown

### todo (or maybe not to, do):

* [x] **Startpage**
  - [ ] content?
  - [x] fetch github notifications
  - [ ] timer fetch every 30 mins, notificate?
- [x] **Nav bar**
  - [x] add some awesome icons
  - [x] hotkeys for views?  
  - [x] evenly space out icons
- [x] **Calendar** 
  - [x] listview hover
  - [x] monthview recurring shit
  - [x] week month hover full text
  - [x] tooltip
  - [x] fit height fix
  - [ ] style buttons?
  - [ ] listview, events coming month with diff color
- [x] **Gigs page**
  - [x] styling
  - [x] promises promises...
  - [x] put gigs in app state so need only load once  
- [ ] **Notebook page**
  - [ ] similar to vivaldi extension, but modulerize to have more than one & editable title to each
  - [ ] draggable?
  - [ ] put to store to keep notes between launches
  - [ ] new note button
  - [ ] menu button with dropdown noteslist
- [x] **Settings page**
- [x] **Main.js + other**
	- [ ] window.titleBar customation possible?
	- [x] design an icon (preferably(?) a nice one?)
	- [x] system tray
	- [x] taskbar right click icon. No icon but app name is correct after build
	- [x] to menu or not to menu
	- [x] settings file
		- [x] save window position/size
		- [ ] win resize/repos hangs the whole thing, call only on resize end etc.
	- [x] loader/spinner
		- [x] bonus: projects first ugly hack
		- [ ] modulerize the doohickey 
	- [x] notification script  (propably waste of time)
	- [x] (esLint, airBnB) => new Promise().resolve(hell)