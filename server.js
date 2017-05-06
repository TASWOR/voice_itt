var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path =require('path');
var bodyParser = require('body-parser')
var json =  './users/';
var replies = '/replies/';


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
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
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

}
else
  {

    var namespace = io.of(namespaceName);
    var filename = `./users/${req.params.name}/replies`;
    fs.watch(filename, function(event, filename){
      if(event =='rename')
      {
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

    var sound =contents.replykey;
    var error = contents.error;
    console.log(contents)
    if (contents.words[0]==undefined){

      res.status(200).send({replyText:'Empty Text', likelihoodText:'Empty Text', error, sound,contents,name})
    }

    else{
    var text ="Say: "+ contents.words[0].txt + " ";
    var name =contents.username;

    var likelihood =" likelihood: "+ contents.words[0].likelihood;

    res.status(200).send({replyText:text,likelihoodText:likelihood,error,sound,contents,name})
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
