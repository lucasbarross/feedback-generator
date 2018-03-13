const mongoose = require ("mongoose");

var listSchema = mongoose.Schema({
	totalScore: Number,
	theHuxleyId: Number,
	title: String,
	endDate: Date,
	problems: [{name:String, theHuxleyId:Number , score:Number}]
});

module.exports = mongoose.model("List", listSchema);
