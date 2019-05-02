## PDTapp personal desktop app 2.x.x

PDTapp is a 'little' *sideventure*<sup>tm</sup> to learn & build a little personal desktop app with electron.
I have no idea what the end product will be like. I'm making this shit up as I go along & modifying/changing things as I see fit.  

### dependencies so far
* react
* react-calendar
* react-datepicker
* electron-store
* dotenv
* showdown
* cheerio
* [futility](https://github.com/Fraasi/futility)
* xterm + node-pty

### todo (or maybe not to, do):

* [x] **Startpage**
  - [x] ~~weather & moon info~~, removed because I built [Saeae](https://github.com/Fraasi/Saeae)
  - [x] make random quote api in heroku & fetch a quote
  - [x] random image from a folder
  - [x] github notifications
  - [x] next happenings quick look
- [x] **Nav bar**
  - [x] hotkeys for views
- [x] **Calendar** 
  - [x] week month tooltip full text
  - [x] monthview recurring shit
  - [ ] listview, events coming month with diff color
  - [ ] add google calendar support (if possible?, or maybe find a different calendar)
- [x] **Gigs page**
  - [x] styling
  - [x] promises promises...
  - [x] put gigs in app state so need only load once  
- [x] **Notebook page**
  - [x] markdown support
  - [x] put to store to keep notes between launches 
  - [x] hotkeys for save, delete & views
    - [ ] ctrl+L conflict
  - [x] add example note with info on first launch
- [x] **Settings page**
  - [x] choose pic of the day folder
  - [x] clear settings file button
  - [x] select which view opens when launched
- [x] **Terminal page**
 (offline untill node-pty updates to work with node 12)
  - [ ] Quick links
  - [x] terminal emulator
- [x] **Main.js + other**
  - [x] icon
  - [x] system tray
  - [x] taskbar right click icon. No icon but app name is correct after build
  - [x] menu
  - [x] settings file
  - [x] loader/spinner
  - [x] notification script
  - [x] (esLint, airBnB) => new Promise().resolve(hell)  
  - [x] global shortcut to copy clipboard to a note
  - [ ] Error alert, use notification?

#### Screenshot of the early home page    
![2018-06-10_2009.png](app/src/assets/images/2018-06-10_2009.png)


<!-- Cool little app you've got there, the design is kinda boring I would've changed fonts, colors and try to setup a structored way to display data, removed the borders and made background colors instead, removed the top "Home" and putting the date at the bottom since it should not be the key focus. -->