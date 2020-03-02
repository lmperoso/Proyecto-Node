var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var contador =0;
var siofu = require("socketio-file-upload");
/* 
app.get('./public', function(req, res){
    res.sendFile(__dirname + '/index.html');
  }); */

app.use(express.static(__dirname + '/public'));
//Conexion
io.on('connection', socket => {
  console.log("conectado usuario");
  var uploader = new siofu();
  uploader.dir = "/public/file";
  uploader.on("complete", function(e){console.log("Envia archivos" + e.event.name)})
  uploader.listen(socket);

  socket.on("stream",function(data){
    socket.broadcast.emit("stream", data)
  })
  app.use(siofu.router).use(express.static(__dirname+"/public"));

  //usuarios
  socket.on('usuario', function(nombre){
    contador++;
    console.log(nombre);
    socket.broadcast.emit('usuario', nombre)
    console.log(contador);
    io.emit('contador', contador)

  socket.on('mensaje', function(m){
    console.log(m);
    io.emit('mensaje', {"usuario":nombre, "mensaje":m});
         });
      
    });
//Desconectar
socket.on('disconnect', function(){
  if(contador >=0){
    contador--;
  }
      console.log('user disconnected');
      io.emit('contador', contador)
    });
  })
//Puerto
http.listen(3000, function(){
  console.log('listening on *:3000');
});