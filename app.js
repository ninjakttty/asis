var express = require('express'),
fs = require('fs'),
_ = require('underscore'),
path= require('path')
walk = require('walk'),
fs = require('fs');


var publicPath = path.resolve(process.argv[2]||'.');

console.log("Watching: ", publicPath)

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.favicon())
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);

});
var   type = {
  'gif': 'image/gif',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png'
};

var dirs = ['/'],
files = []

walker = walk.walk(publicPath);

walker.on("directory", function (root, dirStatsArray, next) {
  console.log(root + '/' + dirStatsArray.name);
  dirs.push('/' +dirStatsArray.name)
  next();
});

walker.on("file", function (root, fileStats, next) {
  var fileName = root.split(publicPath)[1] + "/" +fileStats.name;
  if(isImage(fileName)){
    files.push(fileName)
    console.log("FILE:", encodeURI( fileName ) )
  } 
  next();
});



function isImage(name){
  return type[name.split('.').pop().toLowerCase()] ? true : false;
}

app.get(/(jpg|png|gif)/, function(req, res){
  _.each(files, function(file){
    if(encodeURI(file).match(req.url)){
      try{
        var img = fs.readFileSync(publicPath +  file);
        res.end(img, 'binary'); 
      }catch(e){
        console.log(e)
      }
    }
  });
});


app.get('/*', function(req, res){
  var url = req.url;
  var fileList = files;

  fileList = _.map(files, function(file){

    if(encodeURI(file).match(req.url) ){
      console.log("File", file, file.split('/').length, req.url.split('/').length)
      return file
    }
  });
  fileList = _.compact(fileList); 

  var data = {
    dirs: dirs,
    files: fileList
  }
  res.render('index', data)
});


app.listen(3000, function(){
  console.log("Asis server listening on port %d", app.address().port);
});
