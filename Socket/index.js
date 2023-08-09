const io = require('socket.io')(8800, {
    cors: {
      origin: 'https://love-spark-frontend.vercel.app',// Replace with your frontend URL
      credentials: true,
    }
  });


  
let activeUsers = []; // Change to let, as this variable will be updated
console.log('started')
io.on("connection", (socket) => {
console.log("A user connected:", socket.id);
  
  socket.on("user-connected", (newUserId) => {
    console.log("User connected with UserID:", newUserId);
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
        unreadMessages: 0, // Initialize the unread messages count to 0
      });
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverUserId } = data;
    console.log("Received message:", receiverUserId,'Data',data);
  
    const user = activeUsers.find((user) => user.userId === receiverUserId);
    if (user) {
      console.log("User found:", user);
      user.unreadMessages++; // Increment the unread messages count for the user
      sender = data.sender;
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  socket.on("mark-messages-as-read", (receiverUserId) => {
    const user = activeUsers.find((user) => user.userId === receiverUserId);
    if (user) {
      user.unreadMessages = 0; // Mark all messages as read
      io.emit("get-users", activeUsers); // Update the unread messages count for all users
    }
  });

  socket.on("call-user",(data)=>{
    console.log('Recieved Call Req')
    const {calledId,UserName,UserId,VideoCall} = data;
    const user = activeUsers.find((user) => user.userId === calledId);
    if(user){
      console.log('CalledUser',user);
      if(VideoCall===false){
      var Message = `Accept Call From ${UserName} Type=Call`
      }else{
         Message = `Accept VideoCall From ${UserName} Type=Video`
      }
      io.to(user.socketId).emit('call-recieved',Message,calledId,UserId);
    }
  });

  socket.on('call-Answer',(data)=>{
    
   const {CallAccepted,calledId,CallerID} = data;
   console.log('Call-Answer-Data:',data);
   const user = activeUsers.find((user) => user.userId === calledId);
   const Caller = activeUsers.find((user) => user.userId === CallerID);
   console.log('User:',user,'Caller:',Caller);
   if(user && Caller){
    console.log('ResponseUser:',user,'ResponseCaller',Caller);
   if(CallAccepted==='Accepted'){
    console.log('Accept');
    io.to(user.socketId).emit('call-Accepted');
   }else{
    console.log('Denied');
    io.to([user.socketId,Caller.socketId]).emit('call-Denied');
}
  }
  });

    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      io.emit('get-users', activeUsers);
    });
  });



