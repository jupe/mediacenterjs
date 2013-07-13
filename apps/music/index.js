
/* Modules */
var express = require('express')
, app = express()
, fs = require('fs.extra')
, downloader = require('downloader')
, rimraf = require('rimraf')
, request = require("request")
, helper = require('../../lib/helpers.js')
, Encoder = require('node-html-encoder').Encoder
, colors = require('colors')
, Lame = require('lame')
, scan = require('../../lib/scan.js')
, Speaker = require('speaker');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mediacenterjs');

var db = require('./mongoose/model.js')('music');

//var speaker = new Speaker();
//var lameDecoder = new Lame.Decoder;


// entity type encoder
var encoder = new Encoder('entity');

exports.engine = 'jade';

var configfile = []
,configfilepath = './configuration/setup.js'
,configfile = fs.readFileSync(configfilepath)
,configfileResults = JSON.parse(configfile);	
 
// Choose your render engine. The default choice is JADE:  http://jade-lang.com/
exports.engine = 'jade';

//this dedicated background operation scan music folder
// --> @TODO a lot of optimization!!
function handleNewMusics(){
  if( configfileResults.musicpath ) {
    scan( configfileResults.musicpath, 
                            new RegExp("\.(mp3)","g"), 
                            function(error, items){
        if(items.length>0){
          //console.log('Found %d new files.', items.length);
          items.forEach( function(file){
            var item = {title: file.file};
            item.href = file.href.substr( configfileResults.musicpath.length );
            var doc = new db(item);
            doc.save(); //this will fail, if it not exists already because href is unique
          });
        }
        //reload folder
        setTimeout( function() { handleNewMusics(); }, 5000);
    });
  }
}
setTimeout( function() {
  handleNewMusics();
}, 500);
// Render the indexpage
exports.index = function(req, res, next){	
	var dir = configfileResults.musicpath
	, writePath = './public/music/data/musicindex.js'
	, getDir = true
	, fileTypes = new RegExp("\.(mp3)","g");
  
  console.log(req.params);
  
  db.find( {}, function(error, docs){
    res.render('music',{
			music: docs,
			selectedTheme: configfileResults.theme,
			status:null
		});
  });
  
  /*
	helper.getLocalFiles(req, res, dir, writePath, getDir, fileTypes, function(status){
		var musicfiles = []
		,musicfilepath = './public/music/data/musicindex.js'
		,musicfiles = fs.readFileSync(musicfilepath)
		,musicfileResults = JSON.parse(musicfiles)	
		res.render('music',{
			music: musicfileResults,
			selectedTheme: configfileResults.theme,
			status:status
		});
	});*/
};

exports.album = function(req, res, next){
	var incomingFile = req.body
	, dir = configfileResults.musicpath+encoder.htmlDecode(incomingFile.album)+'/'
	, writePath = './public/music/data/'+encoder.htmlEncode(incomingFile.album)+'/album.js'
	, getDir = false
	, fileTypes = new RegExp("\.(mp3)","g");

	helper.getLocalFiles(req, res, dir, writePath, getDir, fileTypes, function(status){
		var musicfiles = []
		, musicfiles = fs.readFileSync(writePath)
		, musicfileResults = JSON.parse(musicfiles)	
		
		res.send(musicfileResults);
	});
};

exports.track = function(req, res, next){
  db.findById( req.params.track, function(error, track){
    if( error ) {
      res.send(500, error);
    } else if( track ) {
      console.log('Streaming track:',track.title);
      var stat = fs.statSync(configfileResults.musicpath+track.href)
      var stream = fs.createReadStream(configfileResults.musicpath+track.href);
      if( req.params.output === 'server' ) {
        stream.pipe(lameDecoder)
        .on('format', console.log)
        .pipe(speaker);
        res.json({});
      } else {
        res.writeHead(200, {
          'Content-Type':'audio/mp3',
          'Content-Length':stat.size
        });
        stream.pipe(res);
      }
      
    } else { 
      res.send(404);
    }
  });
};

exports.post = function(req, res, next){	
	var incomingFile = req.body
	, albumRequest = incomingFile.albumTitle
	, albumTitle = null
	, title = 'No data found...'
	, thumb = '/music/css/img/nodata.jpg'
	, year = 'No data found...'
	, genre = 'No data found...';
  
  db.find({}, function(error, docs){
    res.json(docs);
  });
  /*
	if (fs.existsSync('./public/music/data/'+albumRequest)) {
		checkDirForCorruptedFiles(albumRequest)
	} else {
		fs.mkdir('./public/music/data/'+albumRequest, 0777, function (err) {
			if (err) {
				console.log('Error creating folder',err .red);
			} else {
				console.log('Directory for '+albumRequest+' created' .green);

				var filename = albumRequest
				, year = filename.match(/\(.*?([0-9]{4}).*?\)/)
				, stripped = filename.replace(/\.|_|\/|\-|\[|\]|\-/g," ")
				, noyear = stripped.replace(/([0-9]{4})|\(|\)|\[|\]/g,"")
				, types = noyear.replace(/320kbps|192kbps|128kbps|mp3|320|192|128/gi,"")
				, albumTitle = types.replace(/cd [1-9]|cd[1-9]/gi,"");

				// mandatory timeout from discogs api
				setTimeout(function(){
					var single = false
					if (albumRequest !== undefined ){
						if (albumRequest.match(/\.(mp3)/gi)){
							var dir = configfileResults.musicpath;
							single = true 
						}else {
							var dir = configfileResults.musicpath+encoder.htmlDecode(albumRequest)+'/';
							single = false 
						}
						fs.readdir(dir,function(err,files){
							if (err){
								console.log('Error looking for album art',err .red);
								discogs(albumTitle, function(title,thumb,year,genre){
									writeData(title,thumb,year,genre);
								});
							}else{
								files.forEach(function(file){
									if (file.match(/\.(jpg|jpeg|png|gif)/gi)){
										if (single == true){
											var title = albumRequest.replace(/\.(mp3)/gi,"")
											if (file.match(title,"g")){
												var localDir = configfileResults.musicpath+file
												copyImageFileToCache(localDir,albumRequest,file, function(){
													writeData(title,thumb,year,genre);
												});
											}
										} else if (file.match(/cover|front/gi)){
											var localDir = dir+file
											copyImageFileToCache(localDir,albumRequest,file, function(){
												writeData(title,thumb,year,genre);
											});
										} else if (file.match(/\bAlbumArt|Large/gi)){
											var localDir = dir+file
											copyImageFileToCache(localDir,albumRequest,file, function(){
												writeData(title,thumb,year,genre);
											});
										} 
									} else{
										discogs(albumTitle, function(title,thumb,year,genre){
											writeData(title,thumb,year,genre);
										});
									}
								});
								discogs(albumTitle, function(title,thumb,year,genre){
									writeData(title,thumb,year,genre);
								});
							};
						});

					}else {
						console.log('Unknown file or album, writing fallback',albumRequest .yellow)
						discogs(albumTitle, function(title,thumb,year,genre){
							writeData(title,thumb,year,genre);
						});
					}
				}, 1200);	
			};
		});
		
		function copyImageFileToCache(localDir,albumRequest,file, callback){
			console.log('local cover found',file);
			fs.copy(localDir, './public/music/data/'+albumRequest+'/'+file, function (err) {
			  if (err) {
				console.log('Error copying image to cache',err .red);
			  }
			  console.log('Copied cover to cache succesfull' .green);
			});		
			thumb = '/music/data/'+albumRequest+'/'+file;	
			callback(thumb);	
		};
		
		function discogs(albumTitle, callback){		
			helper.xhrCall("http://api.discogs.com/database/search?q="+albumTitle+"&type=release&callback=", function(response) {

				var requestResponse = JSON.parse(response)
				,requestInitialDetails = requestResponse.results[0];
				
				if (requestInitialDetails !== undefined && requestInitialDetails !== '' && requestInitialDetails !== null) {
					downloadCache(requestInitialDetails,function(cover) {
						
						var localImageDir = '/music/data/'+albumRequest+'/'
						, localCover = cover.match(/[^/]+$/)
						, title = requestInitialDetails.title
						, thumb = localImageDir+localCover
						, year = requestInitialDetails.year
						, genre = requestInitialDetails.genre		
					
						callback(title,thumb,year,genre);						
					});

				} else {
					console.log('Unknown file or album, writing fallback' .yellow)
					
					var title = 'No data found...'
					, thumb = '/music/css/img/nodata.jpg'
					, year = 'No data found...'
					, genre = 'No data found...';
					
					callback(title,thumb,year,genre);		
				}
			});	
		};
		
		function writeData(title,thumb,year,genre){		
			var scraperdata = new Array()
			,scraperdataset = null;
			
			scraperdataset = { title:title, thumb:thumb, year:year, genre:genre}						
			scraperdata[scraperdata.length] = scraperdataset;
			var dataToWrite = JSON.stringify(scraperdata, null, 4);
			var writePath = './public/music/data/'+albumRequest+'/data.js';
			
			helper.writeToFile(req,res,writePath,dataToWrite);
		};
		
		
		function downloadCache(response,callback){	
			var responseImage = response.thumb
			, downloadDir = './public/music/data/'+albumRequest+'/'
			, cover = responseImage.replace(/-90-/,"-150-");
			
			console.log('cover', cover)
			
			downloader.on('done', function(msg) { console.log('done', msg); });
			downloader.on('error', function(msg) { console.log('error', msg); });
			downloader.download(cover, downloadDir);
			callback(cover);
		};
	
		function checkDirForCorruptedFiles(albumRequest){
			var checkDir = './public/music/data/'+albumRequest

			if(fs.existsSync('./public/music/data/'+albumRequest+'/data.js')){
				fs.stat('./public/music/data/'+albumRequest+'/data.js', function (err, stats) {		
					if(stats.size == 0){
						helper.removeBadDir(req, res, checkDir)
					} else {
						fs.readFile('./public/music/data/'+albumRequest+'/data.js', 'utf8', function (err, data) {
							if(!err){
								res.send(data);
							}else if(err){
								helper.removeBadDir(req, res, checkDir)
							}
						});
					}
				});
			} else {
				helper.removeBadDir(req, res, checkDir)
			}
		};
		
	};
  */
};
