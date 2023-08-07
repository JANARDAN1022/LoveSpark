require('dotenv').config({path:"C:/Users/janar/OneDrive/Desktop/LoveSpark/backend/Config/config.env"});
const app = require('./app.js');
require('./Config/authConfig.js');



process.on('uncaughtException',(err)=>{
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to uncaughtException');
    server.close(()=>{
        process.exit(1);
    })
 })


require('./Config/Database.js');



const Port = process.env.PORT || 4000;
const HostName = process.env.HOSTNAME;





app.listen(Port, HostName, (err) => {
  if (err) throw err;
  console.log(`Server is Running at http://${HostName}:${Port}`);
})

process.on('unhandledRejection',(err)=>{
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1);
    })
});