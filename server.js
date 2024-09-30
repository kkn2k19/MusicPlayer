const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Path to songs directory
const songsDir = path.join(__dirname, 'songs');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve the index.html file for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to recursively scan folders for mp3 files
function getSongs(dirPath) {
    let songs = {};
    
    // Read all folders inside the songs directory
    const folders = fs.readdirSync(dirPath);

    folders.forEach(folder => {
        const folderPath = path.join(dirPath, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.mp3'));
            
            // For each folder, store the files in an array under the folder name
            songs[folder] = files.map(file => path.join('songs', folder, file));
        }
    });

    return songs;
}

// Route to fetch the list of songs
app.get('/songs', (req, res) => {
    const songs = getSongs(songsDir);
    res.json(songs);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
