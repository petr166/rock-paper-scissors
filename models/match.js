const mongoose = require('mongoose');

// player Schema (sub-document for Match)
const PlayerSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true
  }
});


// match Schema
const MatchSchema = mongoose.Schema({
  player1: {
    type: PlayerSchema,
    required: true
  },
  player2: {
    type: PlayerSchema,
    required: true
  },
  winner: {
    type: String,
    required: true,
    trim: true
  }
});

// static functions
MatchSchema.statics.getMatchById = (id, callback) => {
  Match.findById(id, callback);
}

MatchSchema.statics.addMatch = (matchToAdd, callback) => {
  matchToAdd.save(callback);
}


const Match = mongoose.model("Match", MatchSchema);
module.exports = Match;
