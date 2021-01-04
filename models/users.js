const { Schema, model } = require('mongoose');

const users = Schema({
    Guild: String,
    Users: Array,
});

module.exports = model('users', users);