let currentSongIndex = 0;
let currentGenre = null;

const audio = document.getElementById('audio');
const playlist = document.getElementById('playlist');
const searchInput = document.getElementById('search');
const volumeControl = document.getElementById('volume');
const playPauseButton = document.getElementById('play-pause');

let songs = {}; // To hold the fetched song list

// Fetch song list from the server
async function loadSongs() {
    try {
        const response = await fetch('/songs');
        songs = await response.json();
        loadPlaylist(songs);
    } catch (error) {
        console.error('Error loading songs:', error);
    }
}

// Function to load playlist
function loadPlaylist(songs) {
    playlist.innerHTML = '';
    Object.keys(songs).forEach(genre => {
        const genreHeader = document.createElement('h3');
        genreHeader.textContent = genre;
        playlist.appendChild(genreHeader);

        songs[genre].forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.textContent = song.split('/').pop(); // Display just the file name
            songItem.addEventListener('click', () => playSong(song, genre, index));
            playlist.appendChild(songItem);
        });
    });
}

// Function to play selected song
function playSong(song, genre, index) {
    currentGenre = genre;
    currentSongIndex = index;
    audio.src = song;
    audio.play();
    playPauseButton.textContent = '⏸️'; // Change button to pause icon
}

// Control button functionality
playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseButton.textContent = '⏸️'; // Change to pause icon
    } else {
        audio.pause();
        playPauseButton.textContent = '▶️'; // Change to play icon
    }
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentGenre) {
        currentSongIndex = (currentSongIndex - 1 + songs[currentGenre].length) % songs[currentGenre].length;
        playSong(songs[currentGenre][currentSongIndex], currentGenre, currentSongIndex);
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentGenre) {
        currentSongIndex = (currentSongIndex + 1) % songs[currentGenre].length;
        playSong(songs[currentGenre][currentSongIndex], currentGenre, currentSongIndex);
    }
});

// Volume control
volumeControl.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    playlist.innerHTML = '';

    Object.keys(songs).forEach(genre => {
        const genreHeader = document.createElement('h3');
        genreHeader.textContent = genre;
        playlist.appendChild(genreHeader);

        songs[genre].forEach((song) => {
            const songItem = document.createElement('div');
            const fileName = song.split('/').pop();
            songItem.textContent = fileName;

            if (fileName.toLowerCase().includes(query)) {
                songItem.addEventListener('click', () => playSong(song, genre, currentSongIndex));
                playlist.appendChild(songItem);
            }
        });
    });
});

// Initial load
loadSongs();
