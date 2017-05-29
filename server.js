var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path =require('path');
var bodyParser = require('body-parser')
var json =  './users/';
var replies = '/replies/';

app.use(express.static("client/build/"))

app.get('/users/names' , (req,res) =>{
  fs.readdir(json,(err,files)=> {

    if(err) {
      res.status(500).send();
    }
    else {
      res.status(200).send({userNames:files});
    }
  });
});

var replyInformation = function(name ,filename){
  var contents = JSON.parse(fs.readFileSync('./users/'+name+'/replies/'+filename));
  var likelihood = 'Empty text';
  var text = 'Empty text';
  if (contents.words[0]!=undefined){
     text = contents.words[0].txt;
     likelihood = contents.words[0].likelihood;
  }
  return {
    timestamp:filename,
    likelihood,
    text,
    sound:contents.replykey
  }
}

app.get('/users/:name/recognize/:recognizeFileName', function(req,res){
  fs.readFile("./users/"+req.params.name+"/recognize/"+req.params.recognizeFileName, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
})

app.get('/users/:name/replies', (req,res) =>{
  var namespaceName=`/users/${req.params.name}/replies`;
  if(io.nsps[namespaceName]!=undefined){
  }
  else{
    var namespace = io.of(namespaceName);
    var filename = `./users/${req.params.name}/replies`;
    fs.watch(filename, function(event, filename){
      if(event =='rename'){
        setTimeout(()=>{
          namespace.emit('update',replyInformation(req.params.name,filename))
        }, 500);
      }
    });
  }
  fs.readdir(json+req.params.name+replies,(err,fileUser)=>{
    if(err){
      res.status(500).send();
    }
    else {
      var goodJson=[];
      for(var i=0;i<fileUser.length;i++){
        if(fileUser[i].endsWith(".json")){
          goodJson.push(replyInformation(req.params.name,fileUser[i]));
        }
      }
      res.status(200).send({fileNames:goodJson});
    }
  });
})

app.get('/users/:name/replies/:repliesFileName', function(req,res)
{
  fs.readFile('./users/'+req.params.name+'/replies/'+req.params.repliesFileName, (err, data) => {  //читает файлы
    var contents = JSON.parse(data);
    var sound =contents.replykey;
    var error = contents.error;
    if (contents.words[0]==undefined){
      res.status(200).send({replyText:'Empty Text', likelihoodText:'Empty Text'})
    }
    else {
      var text ="Say: "+ contents.words[0].txt + " ";
      var name =contents.username;
      var likelihood =" likelihood: "+ contents.words[0].likelihood;
      fs.readFile('./users/'+req.params.name+'/recognize/'+contents.replykey+'.json', (err,data) =>{
        var recognize = JSON.parse(data);
        var jsonInfo = {
          contents,
          vad_on_time_in_samples:recognize.vad_on_time_in_samples /16000,
          vad_off_time_in_samples:recognize.vad_off_time_in_samples / 16000
        }
        res.status(200).send({replyText:text,likelihoodText:likelihood,name,error,sound,jsonInfo})
      });
    }
  });
})

const port = process.env.PORT || 3333;

server.listen(port, function () {
  console.log(`Server connecting to port ${port}!`);
});

module.exports = app;
