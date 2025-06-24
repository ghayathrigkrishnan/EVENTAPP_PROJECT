// var mongoose = require("mongoose")
// var studentSchema = mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     college: String,
//     event: String,
//     participationType: String,  // default
//     teamSize: Number
// });
// var studentModel = mongoose.model("participant",studentSchema);
// module.exports = studentModel;

var mongoose = require("mongoose");

var studentSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 👈 this is new!
    name: { type: String, required: true },
    email: { type: String, required: true },
    college: String,
    event: String,
    participationType: String,
    teamSize: Number
});

var studentModel = mongoose.model("participant", studentSchema);
module.exports = studentModel;
