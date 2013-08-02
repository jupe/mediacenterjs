MediacenterJS
=============

__A NodeJS based Mediacenter__ ![dependencies] (screenshots/dependencies.png)

Website: http://www.mediacenterjs.com

Screenshots (Pre-Alpha GUI): 
========

![Dashboard] (screenshots/dashboard.png)

![Movies] (screenshots/movies.png)

![Player] (screenshots/player.png)

More screenshots in the screenshot folder.

Status: 
=======

__Heavy work in progress, pre-alpha, not ready for use__

Changelog 
=================

__version 0.021(Spotify works)__

- Basic spotify playback is working now. You can add your credentials in the settings menu and tracks will play directly through the speakers.
  Playback controls and song information will be inplemented later.

__version 0.020(INI)__

- Config is stored in INI file
- Updated all the modules
- Fixed Jade warnings
- Added Spotify credentials to settings

__version 0.019(Music player & Settings)__

- Music is now seekable!
- Added settings as an 'app' instead of a seperate link to improve keyboard accessibility.
- Fixed undefined error when playing music

Why use it (once it is ready)?
===========
* Lightning fast
* Extremely versatile
* Works on everything
		
What currently works?
===========

* Basic Routing
* Basic MVC 'App' Framework
* Clientside initial setup
* Show time and date on dashboard
* Dynamic dashboard
* Basic keyboard controls
* Onscreen keyboard
* Movie indexing
* Multi-language support (English and Dutch)
* Display movies with Poster, Backdrop and information 
* Local caching of information and images
* Basic transcoding and playback of movies and music
* Weather information based on location
* Basic transcoding of movies and music
* Retrieving of tv show information
* Basic screensaver
* lazy loading of movie and music items

What's coming up
=================

* Database integration
* More RESTfull interface

Known issues (Updated)
==================
* Movie Buffer size needs tweaking
* Subfolder support is laking (App setup needs to be more RESTfull)
* Music and videos need to be based on arrays/DB entries instead of the current DOM dependencies
* Database support needs to be implemented
* Current Movie encoding setup is not crossdevice (currently based on flash because WebM has a bug, not parsing the duration)

What still needs to be done
==================

* Full progress and todo list: https://trello.com/b/czjyYsFi/mediacenterjs

What's the MCJS?
=========================

MediacenterJS is/will be a mediacenter like for instance XBMC but based 100% on frontend techniques and languages (HTML5/CSS/Javascript).
The backend is based on Nodejs/ExpressJS 3x with jade templates producing easy to use code. 
The goal is to make it possible to add an 'app' to MCJS even with limited knowledge of said front end techniques. 

Basic feature list:

* Multiple apps like YouTube, weather, Spotify etc.
* Movie, tv and music database with information and playback
* Easy to use app framework

What do I need to have installed to run this? 
==========================

* FFmpeg installed
* NodeJS installed
* A modern browser like Chrome or Firefox
* An internet connection

Partial documentation 
==========================
I'm writing the documentation as I'm coding so the documentation may not always be complete or coherent. 
A complete documentation will be available when the project reaches Beta status.

Setup
-------------

Download this application with NPM:

[![NPM](https://nodei.co/npm/mediacenterjs.png?downloads=true)](https://nodei.co/npm/mediacenterjs/)

Or download it directly from Github of course. 

After you have downloaded MediacenterJS, click on the .bat file (in Windows) to start the project. 
Or browsed to the root directory of MediaCenterJS in the terminal/command prompt and type:

	node server

If you close this window, MCJS will stop working. You can also see useful information about what the server is doing, including error messages and other useful information.

__Please make sure you've installed NodeJS and FFmpeg first!__

User guide for installing FFmpeg on Windows: (http://www.wikihow.com/Install-FFmpeg-on-Windows)

User guide for installing FFmpeg on Linux: (http://linuxers.org/tutorial/how-install-ffmpeg-linux)

Install NodeJS: http://nodejs.org/download/

The program will boot in setup mode, being accessible on localhost:3000 or 'IP of the server':3000.


Setup issues
-----------------

**Windows and node-gyp**

When you download this application through git (Either through zip or a GIT clone) It's possible you will get an error when trying to start the application.
This is due to the fact that some modules have dependencies that need to be installed. So you need to run the install again. 

	npm install lame 
	or/and
	npm install sqlite3
	
If you run Windows it's likely this install will fail. Especially on a x64 machine because to install the dependencies, NPM uses a module called node-gyp.
Which, in it's turn has dependencies as well. You need to install the following:

Windows 32 bits needs Microsoft Visual Studio C++ 2010 Express. Download here: (http://go.microsoft.com/?linkid=9709949)

Windows (7/8) 64 bits needs Microsoft Windows SDK 7.1 which includes visual studio. Download here: (http://www.microsoft.com/en-us/download/details.aspx?id=8279)
	
If you continue to have trouble installing the modules, Please read the documentation: (https://github.com/TooTallNate/node-gyp)

**I Already have visual studio installed but it's a different version than 2010**

An example of installing lame with visual studio 2012 on Windows:

	npm install lame --msvs_version=2012
	
	
**Version mismatch**

If you get the following message:

	Error: Module version mismatch. Expected 11, got 1.
	
You are running a different version of nodeJs then a certain module expects. You simply need to reinstall the module giving the error.
for example:

	Error: Module version mismatch. Expected 11, got 1.
	    at Module.load (module.js:356:32)
	    at Function.Module._load (module.js:312:12)
	    at Module.require (module.js:364:17)
	    at require (module.js:380:17)
	    at bindings (C:\Users\Jan\Documents\GitHub\mediacenterjs\node_modules\lame\node_modules\bindings\bindings.js:76:44)
	    at Object.<anonymous> (C:\Users\Jan\Documents\GitHub\mediacenterjs\node_modules\lame\lib\bindings.js:1:99)
	    at Module._compile (module.js:456:26)
	    at Object.Module._extensions..js (module.js:474:10)
	    at Module.load (module.js:356:32)
	    at Function.Module._load (module.js:312:12

Indicates that the module Lame is generating the error. so simply type the following to reinstall the module:

	npm install lame
	

Running MediacenterJS
-------------
After the initial setup has been completed MediacenterJS will be available on the port you have specified and the language you have chosen.
the server.js will make sure you do not have to restart the actual application (index.js) every time the configuration file changes.

Of course, if you change the port, you need to use that port after the initial setup.
	
What can the movie browser/player do? 
-------------

Once you specify the location of your movies, the movie browser can get all the information you might need including runtime, plot, genre, backdrop and movie poster (more to come). 
Once you browse your movie collection, the system will download all the information and store it locally. This means that the building of the movie list index only takes a couple of milliseconds.
After that the only slight loading time the system has, is when a movie is requested for the first time (because the data has to be downloaded).

When a playback is requested, the server transcodes the movie so the HTML5 player can play the movie in the browser.


How should I format my movie library and files?
-------------

###Directory conventions###

MediacenterJS will look in the specified directory for video files. It will look in subdirectories of the specified dir for additional video files. But only one level deep to keep performance up.
so the possible directories can be:

	specifiedPath/fight club.avi
	
or  

	specifiedPath/f/fight club.avi
	
###Filename conventions###
On the basis of the name of the file, MCJS will try to get the movie details. This way the server does not have to look inside the files to get the metadata, which speeds up the process.
To specify the movie, you can add the year after the title in brackets. Like so:
	
	Fight Club (1999).avi
	
Messy filenames will be cleaned up. Additional text like release group names,dividers,file type or quality will be filtered out of the filename on the server.
so:

	Fight.Club.iMMORTALS.(1999).xvid-R5.torrent.avi 
	
will become 

	Fight Club (1999).avi
	
But it is best to avoid messy names in the first place.
If a movie is split into multiple pieces, you can specify it in the filename as well. It is best to format it like this:

	Fight Club (1999) CD1.avi
	
What can the music player do? 
-------------

Once you specify the location of your music, the music will look in the specified directory for mp3 files. 
The idea behind the player is that it will use the folder name and file names to index the albums provided. This of course, has some advantages and disadvantages, 
but it will mainly force you to use proper naming conventions and give you enormous freedom and transparency with what the system does and presents your files.

If you add an image in the directory and name it appropriately this image will be used by the music player.

So if it is a single like a live recording or a mixtape, just add an image with exactly the same name as the mp3 in the same directory. For example:

	01 - Giorgio Moroder - Output - Brooklyn - N.Y.C.jpg
	
If you have an album, the music player will look for a image file with the following names: "cover", "front", "album" or "art"
This image will be copied to the cache of MCJS so it can be used without restrictions. So you can even delete the image in the local dir and as long as you don't clear the cache, the image will be used.

If no image is provided, the player will contact the website Discogs and try to get the art there. 

Once you start playback, the eq icon and header will change their color according to the dominant color of the album art. 


What is a MCJS App and how will it work?
-------------

An 'app' in this case is basically a wrapper for a feature you can use within MCJS.

An App consists of two parts. A public part and a Model View Controller. When you look in the root of MCJS you'll see a folder called 'Apps'. 
In this folder you can create a new folder or copy the hello world example and rename it.

This is the MVC of your app. With and index.js file to control all the incoming route requests, a folder called Views which contains the actual client side HTML. 
And finally you can extend the basic routing with the route.js file.

__index.js__

If we look at the hello world example, you will see the following contents

	// Choose your render engine. The default choice is JADE:  http://jade-lang.com/
	exports.engine = 'jade';

	// Render the index page
	exports.index = function(req, res, next){
		res.render('hello');
	};
	
* The render engine is the way the view is written down. Currently only JADE is supported.
* The exports.index is the initial route to the app. And in this case will render the hello.jade file in the views folder.
* The 'index' is the key used by the routing to assign te proper handeling. Another example is 'post'.

__The public part of an App / Making it public__

When we go back to the root folder you will also see a folder called public. Everything in this folder is accessible from the client. Add a folder with the same name. 
If you want your app to show up in the dashboard, all you need to do is add a tile.png to your public folder. This will alert MCJS that you want your app to be accessible from the dashboard, and it will automatically add it.

So in theory, you can make a background app that hooks on an existing app, or just runs in the background, without having it showing up in the dashboard simply by not adding the tile.

__route.js__ 

You can extend the basic routing table with your own custom routes by adding this JSON file and defining your routes. 
The 'NAME' will be replaced with the app name (folder name). You do not have to hard code it. But you can also add route outside your app namespace. For Example:

	{
		"track": [{
			"method": "get",
			"path": "/NAME/track/:album/:track"
		}],
		"album": [{
			"method":"post",
			"path": "/NAME/album"
		}],
		"lookup": [{
			"method":"get",
			"path": "/configuration"
		}]
	}
	
__Building an App__

There are thousands of useful node libraries you can use to build your app. Simply install the module you want with NPM and start using it. 
In the future there will be a handy package installer to export your app with and I will add example apps.

Translation
-------------
For now, all the translation files are stored in the public/translation folder.

###Credits###

This app makes heavy use of:

* Express (https://github.com/visionmedia/express)
* Node-Fluent-FFmpeg (https://github.com/schaermu/node-fluent-ffmpeg)
* Node-XMLHttpRequest (https://github.com/driverdan/node-XMLHttpRequest)
* VideoJS (http://www.videojs.com/)


This app also makes use of the following modules:

* express
* fs.extra
* dateformat
* downloader
* fluent-ffmpeg
* jade
* lingua
* node-ffprobe
* node-html-encoder
* redis
* request
* require
* rimraf
* feedparser
* util
* trakt
* spotify
* colors
* lame
* sqlite3


What is the beta version going to have?
=======================================

On the todo list for MCJS are:

* Fast transcoding 
* Cross Browser compatibility
* Easy to add/change themes
* And a set of ready made apps like youtube and google music.
* Multilanguage support
* App import/export functionality

This application will run on Windows and Linux based systems. 
There will be a specific Linux distro using a kiosk, debian distro.

I'm building MCJS in my free time so if you want to encourage me to continue this enormous project, feel free to do so.

[![Donate] (screenshots/paypal-donate.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=DHV3M4SST8C5L)

For questions/contributions feel free to email me at: jansmolders86@gmail.com
This application uses the GNU General Public License. See <http://www.gnu.org/licenses/>.

Copyright (C) 2013 - Jan Smolders
