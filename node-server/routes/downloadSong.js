const os = require('os');
const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

async function downloadSong(fileId){

    const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const drive = google.drive({
	version: 'v3',
	auth: oauth2Client,
    });

    drive.files.get({
	fileId: fileId,
	alt: 'media'
    }, {responseType: 'stream'}).then(
	res => {
	  return new Promise((resolve, reject) => {
	    const filePath = path.join(os.tmpdir(), 'video.mp4');
	    console.log(`writing to ${filePath}`);
	    const dest = fs.createWriteStream(filePath);
	    let progress = 0;

	    res.data.on('end', () => {
		console.log('\nDone downloading file.');
		resolve(filePath);
	      })
	      .on('error', err => {
		console.error('Error downloading file.');
		reject(err);
	      })
	      .on('data', d => {
		progress += d.length;
		if (process.stdout.isTTY) {
		  process.stdout.clearLine();
		  process.stdout.cursorTo(0);
		  process.stdout.write(`Downloaded ${progress} bytes`);
		}
	      })
	      .pipe(dest);
	  });
	}
    );
}

module.exports = downloadSong;
