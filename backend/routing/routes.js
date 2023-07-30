const express = require('express');
const { login, register, addContact, allContact, sendMessage, getMessage, unsendMessage, logout } = require('./controllers');
const { authenticateToken } = require('../authentication/auth');

const Routing = express();



Routing.route('/').post(login);

Routing.route('/register').post(register);

Routing.route('/contact').get( authenticateToken, allContact).post(authenticateToken, addContact);

Routing.route('/chat').get(authenticateToken, getMessage).post(authenticateToken, sendMessage).put(authenticateToken, unsendMessage);

Routing.route('/logout').post(logout)

module.exports = Routing;