const { Schema, model } = require('mongoose');

const games = Schema({
    Guild: String,
    Game: Array,
});

module.exports = model('games', games);