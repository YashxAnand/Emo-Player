var mode = 1;

var next_song_pos = 0;
var song_queue = [];
var song_source = "https://drive.google.com/uc?export=view&id=";
var home_html = ``;

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "http://localhost:5000/api/all_songs", false);
xmlhttp.send(null);

const data = JSON.parse(xmlhttp.responseText);
var songs = {};
var categorywise_songs = {
    "Angry":[],
    "Happy":[],
    "Sad":[],
    "Neutral":[]
};

var songs_parent = document.getElementsByClassName("songs")[0];

for(var i = 0; i<data.length; i++){
    let song = data[i];
    let song_id = song.song_id;
    let image_id = song.image_id;
    let song_desc = `Artist:${song.artist}<br>Movie:${song.movie}<br>Released:${song.released}`;

    songs[song_id] = song;

    var ins=document.createElement("div");
    ins.id='b'+i;

    songs_parent.appendChild(ins);
    ins.setAttribute("class", "song");
    var html = `<div id="pic" style='background-image: url("https://drive.google.com/uc?export=view&id=${image_id}");'>  <input type="button" id="a${i}" class="play" > <input type="button" id="c${i}" class="add">  </div><div id="data"><br><br>${song_desc}</div>`;
    document.getElementById('b'+i).innerHTML=html;
    document.getElementById('a'+i).onclick=function(){
	loadTrack(song_id);
    };
    document.getElementById('c'+i).onclick=function(){
	add_in_queue(-1, song_id);
    };	
}

home_html = songs_parent.innerHTML;
let now_playing = document.querySelector(".now-playing");
let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek-slider");
let volume_slider = document.querySelector(".volume-slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let isPlaying = false;
let updateTimer;

let curr_track = document.createElement('audio');

function random_background() {

  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  document.body.style.background = bgColor;
}

function loadTrack(song_id) {
    var song = songs[song_id];

    var source = song_source+song_id;

    const song_name_div = document.querySelector("#song-name");
    const emoji_img = document.querySelector("#emotion-emoji");
    const label = song_name_div.querySelector("label");

    emoji_img.src = "./emojis/"+song.type+".gif";
    emoji_img.alt = song.type;
    emoji_img.style.display = "inline";
    label.innerHTML = song.name;
    clearInterval(updateTimer);
    resetValues();
    curr_track.src = source;
    curr_track.load();

    updateTimer = setInterval(seekUpdate, 1000);
    curr_track.addEventListener("ended", nextTrack);
    random_background();
    playTrack();
}

function setmode(elem){
    mode = elem.value;
}

function add_in_queue(pos, song_id){
    if(pos == -1){
	song_queue.push(song_id);
    }else{
	song_queue.splice(pos, song_queue.length - next_song_pos, song_id);
    }
}

function prevTrack(){
    next_song_pos = next_song_pos - 2<0?0:next_song_pos-2;
    loadTrack(song_queue[next_song_pos++]);
}

function loadHomeSongs(){
    songs_parent.innerHTML = home_html;
    const home_btn = document.querySelector("#home-btn");
    home_btn.style.display = "none";
}

function change_home(emotion){
    const home_btn = document.querySelector("#home-btn");
    home_btn.style.display = "flex";
    var data = categorywise_songs[emotion];
    songs_parent.innerHTML = `<h1 class="emotion_title">${emotion} Songs</h1><br>`;

    for(var i = 0; i<data.length; i++){
	let song = data[i];
	let song_id = song.song_id;
	let image_id = song.image_id;
	let song_desc = `Artist:${song.artist}<br>Movie:${song.movie}<br>Released:${song.released}`;

	songs[song_id] = song;

	var ins=document.createElement("div");
	ins.id='b'+i;

	songs_parent.appendChild(ins);
	ins.setAttribute("class", "song");
	html = `<div id="pic" style='background-image: url("https://drive.google.com/uc?export=view&id=${image_id}");'>  <input type="button" id="a${i}" class="play" > <input type="button" id="c${i}" class="add">  </div><div id="data"><br><br>${song_desc}</div>`;
	document.getElementById('b'+i).innerHTML=html;
	document.getElementById('a'+i).onclick=function(){
	    loadTrack(song_id);
	};
	document.getElementById('c'+i).onclick=function(){
	    add_in_queue(-1, song_id);
	};	
    }
}

function nextTrack(){
    if(mode == 2){
	var promise = get_song_on_emotion();

	promise.then(emotion=>{
	    change_home(emotion);

	    var index = parseInt(Math.random()*categorywise_songs[emotion].length);
	    songs[categorywise_songs[emotion][index].song_id] = categorywise_songs[emotion][index];
	    add_in_queue(next_song_pos, categorywise_songs[emotion][index].song_id);
	    loadTrack(song_queue[next_song_pos++]);
	}).catch(error=>{
	    console.log(error);
	})
    }else if(next_song_pos != song_queue.length || mode == 3){
	if(mode == 3){
	    var index = parseInt(Math.random()*Object.keys(songs).length);
	    add_in_queue(next_song_pos, Object.keys(songs)[index]);
	}

	loadTrack(song_queue[next_song_pos++]);
    }
}

function get_song_on_emotion(){
    return new Promise(async (resolve, reject)=>{
	var emotion = await eel.getEmotion()();

	if(!categorywise_songs[emotion].length){
	    xmlhttp.open("POST", "http://localhost:5000/api/emotion_songs", false);
	    xmlhttp.send(JSON.stringify({
		type: emotion
	    }));
	    var song_list = JSON.parse(xmlhttp.responseText);
	    categorywise_songs[emotion] = categorywise_songs[emotion].concat(song_list); 
	}
	resolve(emotion);
    });
}

function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpauseTrack() {
    if (!isPlaying) {
	if(!curr_track.src.length){
	    nextTrack();
	}else if(curr_track.currentTime == curr_track.duration){
	    if(next_song_pos == song_queue.length)
		return;
	    nextTrack();
	}else{
	    playTrack();
	}
    }else{
	pauseTrack();
    }
}

function playTrack() {
    curr_track.play();
    isPlaying = true;
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-2x"></i>';
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-2x"></i>';;
}

function seekTo() {
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

function setVolume() {
    curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
    let seekPosition = 0;

    if (!isNaN(curr_track.duration)) {
	if(curr_track.currentTime == curr_track.duration){
	    pauseTrack();
	}
	seekPosition = curr_track.currentTime * (100 / curr_track.duration);

	seek_slider.value = seekPosition;

	let currentMinutes = Math.floor(curr_track.currentTime / 60);
	let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
	let durationMinutes = Math.floor(curr_track.duration / 60);
	let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

	if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
	if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
	if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
	if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

	curr_time.textContent = currentMinutes + ":" + currentSeconds;
	total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

