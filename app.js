require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');
const announcementsRouter = require('./routes/announcements');
const searchRouter = require('./routes/search');
const contactRouter = require('./routes/emergencyContact');
const newsRouter = require('./routes/news');
const resourcePostsRouter = require('./routes/resource-posts');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/announcements', announcementsRouter);
app.use('/api/search', searchRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/news', newsRouter);
app.use('/api/resource-posts', resourcePostsRouter);

module.exports = app;
