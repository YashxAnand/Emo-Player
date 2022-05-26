const cors = require('cors');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const downloadSong = require('./routes/downloadSong');
const dbconnect = require('./mongo/dbconnect');
const router = require('./routes/routes');

const app = express();

dotenv.config({path:'./.env'});

dbconnect();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.text());
app.use(cors({
    origin: '*'
}));

app.use("/api", router);

app.listen(process.env.PORT, '0.0.0.0', ()=>{
    console.log(`Server is up and running on port: ${process.env.PORT}!`);
});
