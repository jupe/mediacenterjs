
var downloader = require('downloader')
, fs = require('fs.extra')
, helper = require('../../lib/helpers.js')
, scan = require('../../lib/scan.js')


var db = require('./mongoose/model.js')('music');
   
var configfile = []
,configfilepath = './configuration/setup.js'
,configfile = fs.readFileSync(configfilepath)
,configfileResults = JSON.parse(configfile);	

//this dedicated background operation scan music folder
var mediascanner = function() {
 
  // --> @TODO a lot of optimization!!
  
  /* */
  function downloadCache(response,callback){	
    var responseImage = response.thumb
    , downloadDir = './temp/'
    , cover = responseImage.replace(/-90-/,"-150-");
    
    console.log('cover', cover)
    
    //downloader.on('done', function(msg) { console.log('done', msg); });
    downloader.on('error', function(msg) { console.log('error', msg); });
    downloader.download(cover, downloadDir);
    callback(cover);
  };
  
  
  function getAlbumDetails( resource_url, callback ) {
    helper.xhrCall(resource_url, function(response) {
      //console.log(response);
      var requestResponse = JSON.parse(response)
      callback(requestResponse);
    });
  }
  function getTrackDetails(albumTitle, callback){
    helper.xhrCall("http://api.discogs.com/database/search?q="+albumTitle+"&type=release&callback=", function(response) {
      //console.log(response);
      var requestResponse = JSON.parse(response);
      if( requestResponse.results.length > 0 ) {
        var details = requestResponse.results[0]; //assumed that first reslut was right!?..
        getAlbumDetails(details.resource_url, function(album){
          details.artist = album.artists[0].name;
          details.album = album.title;
          callback(details);
        });
      } else callback();
    });
  }
  
  function discogs(albumTitle, callback){
    /*helper.xhrCall("http://api.discogs.com/database/search?q="+albumTitle+"&type=release&callback=", function(response) {
      //console.log(response);
      var requestResponse = JSON.parse(response)
      ,requestInitialDetails = requestResponse.results[0]; //assumed that first reslut was right!?..
    */
    getTrackDetails( albumTitle, function(details){
      console.log(details);    
      if (details !== undefined && details !== '' && details !== null) {
        details.year = parseInt(details.year);
        callback(null, details);
      } else {
        var thumb = '/music/css/img/nodata.jpg';
        console.log('Unknown file or album, writing fallback' .yellow)
        callback('no found', { thumb: thumb });		
      }
    });	
  };
  function handleMusicItem(item){
    var filename = item.href
    , year = filename.match(/\(.*?([0-9]{4}).*?\)/)
    , stripped = filename.replace(/\.|_|\/|\-|\[|\]|\-/g," ")
    , noyear = stripped.replace(/([0-9]{4})|\(|\)|\[|\]/g,"")
    , types = noyear.replace(/320kbps|192kbps|128kbps|mp3|320|192|128/gi,"")
    , albumTitle = types.replace(/cd [1-9]|cd[1-9]/gi,"");
    var meta = {title: item.file, year: year, album: albumTitle, href: item.href.substr( item.musicpath.length ) };
    db.find( {href: item.href.substr( item.musicpath.length )}, function(error, doc){
      if(error){
        console.log(error);
      } else if( doc.length>0 ) {
        //console.log(doc);
      } else {
        discogs( meta.href, function(nofound, details){
          if(nofound){ console.log( nofound ); }
          else{ 
            meta = details;
            meta.href = item.href.substr( item.musicpath.length );
          }
          console.log(meta);
          var doc = new db(meta);
          doc.save( ); //this will fail, if it not exists already because href is unique
          
        });
      }
    });
    
  }
  function handleMusicPath(musicpath){
    if( musicpath ) {
      scan( musicpath, 
            new RegExp("\.(mp3)","g"), 
            function(error, items){
          if(items.length>0){
            //console.log('Found %d new files.', items.length);
            items.forEach( function(item){
              item.musicpath = musicpath;
              handleMusicItem(item);
            });
          }
          //reload folder
          setTimeout( function() { handleMusicPath(configfileResults.musicpath); }, 5000);
      });
    }
  }
  setTimeout( function() {
    handleMusicPath(configfileResults.musicpath);
  }, 500);
  
  return this;
}

module.exports = mediascanner;