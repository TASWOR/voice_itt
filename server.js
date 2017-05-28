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
  fs.readdir(json,(err,files)=> //все файлы показывает в пути
  {

    if(err)
    {
      res.status(500).send();
    }
    else {
      res.status(200).send({userNames:files});
    }
  });
});

var replyInformation = function(name ,filename)
{
  var timestamp=filename;
  var content =   fs.readFileSync('./users/'+name+'/replies/'+filename)
  var contents = JSON.parse(content);
  var likelihood = 'Empty text';
  var text = 'Empty text';
  var sound = contents.replykey;

  if (contents.words[0]!=undefined){
     text = contents.words[0].txt;
     likelihood = contents.words[0].likelihood;
  }
  return {
    timestamp,
    likelihood,
    text,
    sound

  }
}

app.get('/users/:name/recognize/:recognizeFileName', function(req,res)
{
  fs.readFile("./users/"+req.params.name+"/recognize/"+req.params.recognizeFileName, function (err,data) {
    if (err) {

      console.log(contents)
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
})

app.get('/users/:name/replies', (req,res) =>
{
  var namespaceName=`/users/${req.params.name}/replies`;
  console.log(namespaceName);
  if(io.nsps[namespaceName]!=undefined)
  {
    console.log(`${namespaceName} is already created`);
  }
  else
  {
    console.log(`creating ${namespaceName}`);
    var namespace = io.of(namespaceName);
    var filename = `./users/${req.params.name}/replies`;
    fs.watch(filename, function(event, filename){
      console.log(event)
      if(event =='rename')
      {
        setTimeout(()=>{
          namespace.emit('update',replyInformation(req.params.name,filename))
        }, 500);
      }

    });
  }

  fs.readdir(json+req.params.name+replies,(err,fileUser)=>
  {
    if(err)
    {
      res.status(500).send();
    }
    else {
      var goodJson=[];
      for(var i=0;i<fileUser.length;i++)
      {
        if(fileUser[i].endsWith(".json"))
        {
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
        var sr = 16000
        var vad_off_time_in_samples = recognize.vad_off_time_in_samples / sr
        var vad_on_time_in_samples = recognize.vad_on_time_in_samples /sr
        var jsonInfo = {
          contents,
          vad_on_time_in_samples,
          vad_off_time_in_samples
        }
        res.status(200).send({replyText:text,likelihoodText:likelihood,name,error,sound,jsonInfo})
      });
    }
  });
})

const port = process.env.PORT || 3333;

server.listen(port, function () {
  console.log(`Example app listening on port ${port} !`);
});

module.exports = app;
