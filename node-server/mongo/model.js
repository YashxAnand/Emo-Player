const mongoose = require('mongoose');

const metadataSchema = mongoose.Schema({
    name:{
	type:String,
	required: true
    },
    type:{
	type:String,
	required: true
    },
    artist:{
	type:String,
	required: true
    },
    movie:{
	type:String,
	required: true
    },
    released:{
	type:String,
	required: true
    },
    song_id:{
	type:String,
	required: true
    },
    image_id:{
	type:String,
	required: true
    }
});

const metadata = mongoose.model("metadatas", metadataSchema);

module.exports = metadata;
