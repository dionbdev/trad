var mongoose = require("mongoose");

var tallySchema = new mongoose.Schema({
   exercise: Number,
   weight: Number,
   image: String,
   description: String,
   health: Number,
   dated: { 
      type: Date, 
      default: Date.now 
   }, 
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Tally", tallySchema);