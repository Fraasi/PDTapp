## PDTapp personal desktop app (WIP)

PDTapp is a 'little' *sideventure*<sup>tm</sup> to learn & build a little personal desktop app with electron.
I have no idea what the end product will be like. I'm making this shit up as I go along.  
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
  - [x] weather
    - [x] rotating arrow for wind
	- [ ] forecast?
  - [x] make random quote api in heroku & fetch a quote
  - [x] random image
  - [x] github notifications
    - [ ] timer fetch every 30 mins, notificate?
- [x] **Nav bar**
  - [x] hotkeys for views
- [x] **Calendar** 
  - [x] listview hover
  - [x] monthview recurring shit
  - [x] week month hover full text
  - [x] tooltip
  - [ ] fit height fix
  - [ ] buttons?
  - [ ] listview, events coming month with diff color
- [x] **Gigs page**
  - [x] styling
  - [x] promises promises...
  - [x] put gigs in app state so need only load once  
- [x] **Notebook page**
  - [x] markdown support
  - [ ] put to store to keep notes between launches 
  - [x] hotkeys for save & views
  - [ ] add example note with hotkeys & info
  - [ ] test it out, complicated enough to have a bug somewhere
- [x] **Settings page**
  - [x] choose pic of the day folder & save it to store
  - [ ] clear settings file button
  - [ ] choose weather city
- [x] **Main.js + other**
	- [ ] window.titleBar customation possible?
	- [x] design an icon (preferably(?) a nice one?)
	- [x] system tray
	- [x] taskbar right click icon. No icon but app name is correct after build
	- [x] to menu or not to menu
	- [x] settings file
		- [x] save window position/size
		- [ ] win resize/repos occasionally hangs the whole thing, should call only once on resize end etc.
	- [x] loader/spinner
		- [x] bonus: projects first ugly hack
		- [ ] modulerize the doohickey 
	- [x] notification script  (propably waste of time)
	- [x] (esLint, airBnB) => new Promise().resolve(hell)  

#### Screenshot of the home page so far  
![2018-05-02_0951.png](src/assets/img/2018-05-13_2350.png)

### Some thoughts
* need to start thinking about program architecture as my apps are getting bigger
* learn how to 'modulerize' **everything**