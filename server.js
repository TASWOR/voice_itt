var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path =require('path');
var bodyParser = require('body-parser')
var json =  './users/';
var replies = '/replies/';

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/client/public/index.html');
// })

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

  if (contents.words[0]!=undefined){
     text = contents.words[0].txt;
     likelihood = contents.words[0].likelihood;

  }
  return {
    timestamp,
    likelihood,
    text,

  }
}

app.get('/users/:name/recognize/:recognizeFileName', function(req,res)
{
  console.log("SJDHGAJSHAJSHDGJASDAJ");
  fs.readFile("./users/"+req.params.name+"/recognize/"+req.params.recognizeFileName, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.setHeader("Content-Type", "audio/vnd.wave");
    res.writeHead(200);
    res.end(data);
  });
})

app.get('/users/:name/replies' ,(req,res) =>
{
// io.on('connection', function(socket){
// console.log(socket);
// });
var namespaceName=`/users/${req.params.name}/replies`;
if(io.nsps[namespaceName]!=undefined)
{
  console.log('ds')
}
else
  {
    console.log('no')
    console.log(io.nsps)
    var namespace = io.of(namespaceName);
    var filename = `./users/${req.params.name}/replies`;
    fs.watch(filename, function(event, filename){
      if(event =='rename')
      {
      console.log('From watch, event: ' + event);
      console.log('From watch: ' + filename);
      namespace.emit('update',replyInformation(req.params.name,filename))
}
    });
          namespace.emit('forceDisconnect');
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
    var content= data.toString();
    var contents = JSON.parse(content);
    if (contents.words[0]==undefined){

      console.log('Empty Text')
      res.status(200).send({replyText:'Empty Text'},{likelihoodText:'Empty Text'})
    }
    else{
    var text = req.params.name+" say: "+ contents.words[0].txt + " ";
    console.log(text);
    var likelihood = req.params.name+" likelihood: "+ contents.words[0].likelihood;
        console.log(likelihood);
        var error = req.params.name+" error: "+ contents.error;
            console.log(error);
    res.status(200).send({replyText:text,likelihoodText:likelihood,error:error})
}


  });


})
//redirect index.html
//express authorization
//express work with session/cookies

server.listen(3333, function () {
  console.log('Example app listening on port 3333!');
//  var filepath = './users/demo_ebony/replies/'
  // fs.watch(filepath, function(event, filename){
  //  console.log(event)
  //  console.log(filename)
  // });
});

module.exports = app;
