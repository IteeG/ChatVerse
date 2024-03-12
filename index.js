const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const {Server} = require('socket.io');

const { saveOneToOneMessage, saveGroupMessage, getOneToOneMessages, getGroupMessages } = require('./dbHelper');

const app = express();
const server = createServer(app);
const io = new Server(server);



app.set('view engine', 'ejs');
app.set('views',join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'login.html'));
});
app.get('/chat',(req,res)=>{
  console.log("req from the params",req.query);

  let { roomId, userId } = req.query;
  decodeURIComponent(roomId = roomId);

  res.render('index', { roomId: roomId, userId: userId });
});

//mongodb connection
const mongoose = require('mongoose');
let mongoDB = 'mongodb://localhost:27017/ChatDatabase';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true})
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Error connecting to MongoDB:', err));


//socket connection apis
io.on('connection', (socket) => {
  console.log('client connected with id ', socket.id);
  socket.on('disconnect',()=>{
    console.log('client disonnected with Id ',socket.id);
  })

  socket.on('subscribe room',(userId, roomId)=>{
    console.log("roomId and userId for subcribe room", userId, roomId);
    socket.join(roomId);
    socket.join(userId);
  })

  socket.on('chat message',async(msg, toUserId, fromUserId)=>{
    console.log('message from client is ',msg, socket.id, toUserId);
    io.to(toUserId).emit('chat message', msg, toUserId, fromUserId);
    await saveOneToOneMessage(fromUserId, toUserId, msg);
    // socket.broadcast.emit('chat message', msg);
  })
  socket.on('group message',async(msg,roomId,fromUserId)=>{
    console.log("group message from client is ",msg, socket.id, roomId);
    io.to(roomId).emit('group message', msg, roomId, fromUserId); 
    await saveGroupMessage(fromUserId, roomId, msg);  
  })

  socket.on('get chat message', async(senderId, receipentId, callback)=>{
    try{
      const data = await getOneToOneMessages(senderId, receipentId);
      callback(data);
    }
    catch(e){
      console.log("error in receiving data", e);
      callback(e);
    }
  })

  socket.on('get group message', async(roomId, callback)=>{
    try{
      console.log("get group message for the roomId and ",roomId)
      const data = await getGroupMessages(roomId);
      console.log("data from the group message is",data)
      callback(data);
    }
    catch(e){
      console.log("error in receiving data", e);
      callback(e);
    }
  })

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});