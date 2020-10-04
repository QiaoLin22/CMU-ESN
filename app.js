const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const socketServer = require('socket.io')(5000);
const routes = require('./routes');
const User = require('./models/user');

require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);

app.listen(3000);

socketServer.on('connection', (socket) => {
    User.find()
    .then((res) => {
        socket.emit('users',res)
    })
    .catch((err) => {
         console.log(err);
    }) 

    socket.on('login', () => {
        User.find()
        .then((res) => {
            socketServer.emit('users',res)
        })
        .catch((err) => {
            console.log(err);
        }) 
    });
    socket.on('logout', () => {
        User.find()
        .then((res) => {
            socketServer.emit('users',res)
        })
        .catch((err) => {
            console.log(err);
        }) 
    });
})
    
        


