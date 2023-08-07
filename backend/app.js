const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const ErrorHandler = require('./Middlewares/ErrorHandler.js');
//const fileupload = require('express-fileupload');
const passport = require('passport');
const cookieSession = require('cookie-session');
//const session = require('express-session');
const cors = require('cors');
const UserRoutes = require('./Routes/UserRoutes.js');
const GoogleRoutes = require('./Routes/GoogleRoutes.js');
const ChatRoutes = require('./Routes/ChattingRoutes/ChatRoute.js');
const MessageRoutes = require('./Routes/ChattingRoutes/MessageRoute.js');
const SwipedRoutes = require('./Routes/swipeRoutes.js');
const MatchedRoutes = require('./Routes/MatchesRoutes.js');
const ReportRoutes = require('./Routes/ReportRoutes.js');
const app = express();



app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieSession({name:'Session',keys:[process.env.SessionKey],maxAge:process.env.Age}));
/*app.use(session({
    secret:process.env.SessionKey,
    resave: false,
    saveUninitialized: true
  }));*/
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({  
origin: 'http://localhost:3000',
methods:"GET, POST, PUT, DELETE",
credentials: true,
}
 ));

app.use(express.json());
app.use(cookieParser());


app.use('/api/Users/',UserRoutes);
app.use('/auth/',GoogleRoutes);
app.use('/api/chat/',ChatRoutes);
app.use('/api/Messages/',MessageRoutes);
app.use('/api/Swipe/',SwipedRoutes);
app.use('/api/Matches/',MatchedRoutes);
app.use('/api/Reports/',ReportRoutes);
app.use(ErrorHandler);




module.exports = app;