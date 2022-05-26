const metadata = require('../mongo/model');
const express = require('express');

const app = express();
app.get("/all_songs", async (request, response)=>{
    try{
	const result = await metadata.find({}, {_id:0, __v:0});
	response.send(result);
    }catch(error){
	response.status(500).send(error);
    }
});

app.post("/add_song", (request, response)=>{
    metadata.countDocuments({$or:[{song_id:request.body.song_id}, {image_id:request.body.image_id}]}, async (err, count)=>{
	if(err){
	    response.status(500).send(err);
	}else if(count > 0){
	    response.status(409).send({msg:"Song already exists"});
	}else{
	    const song = new metadata(request.body);
	
	    try{
		await song.save();
		console.log("Song added successfully");
		response.send(song);
	    }catch(error){
		response.status(500).send(error);
	    }
	}
    });
});

app.post("/emotion_songs", async (request, response) =>{
    try{
	var emotion = JSON.parse(request.body).type;
	const songs = await metadata.find({type:emotion}, {_id:0, __v:0});
	response.send(songs);
    }catch(error){
	response.status(500).send(error);
    }
});

module.exports = app;
