## PDTapp personal desktop app (WIP)

PDTapp is a 'little' side project to build a little personal desktop app with electron.
I have no idea what the end product will be like. Im making this shit up as I go along.
edit: Looks like I'm dumping all my little projects inside electron here...

### dependencies so far
* react
* fullcalendar.js
* node-osmosis
* electron-store

### todo (or maybe not to, do):

* [x] startpage
  - [ ] content?
  - [ ] fetch github notifications?
- [x] nav bar
  - [x] hotkeys for views?  
  - [x] evenly space out icons
- [x] calendar 
  - [x] listview hover
  - [x] monthview recurring shit
  - [x] week month hover full text
  - [x] tooltip
  - [ ] style buttons
  - [ ] fit height fix
  - [ ] listview, next event diff color
- [x] gigs page
  - [x] styling
  - [x] promises promises...
  - [ ] fix title all links
  - [ ] put gigs in app state so need only load once  
- [ ] notebook page
- [ ] design an icon (preferably(?) a nice one?)
- [x] system tray
  - [x] temp icon works
- [x] taskbar right click icon. No icon but app name is correct after build
- [x] to menu or not to menu
- [x] add some awesome icons
- [x] settings file
	- [x] save window position/size
	- [ ] notes
- [x] loader/spinner
  - [x] bonus: projects first ugly hack
  - [ ] modulerize the doohickey 
- [x] notification module (propably waste of time)
- [x] (esLint, airBnB) => new Promise().resolve(hell)