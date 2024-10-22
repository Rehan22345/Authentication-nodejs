const mongoose = require("mongoose");
const schema = mongoose.Schema({
    title :  String,
    subtitle : String,
    description : String,
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming your user ID is stored as ObjectId
        ref: 'User', // Reference the User model
      },
})
const model = mongoose.model("Blogs-model", schema);
module.exports = model