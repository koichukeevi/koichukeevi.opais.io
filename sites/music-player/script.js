const playlist = [
    {
        title: "Summer Vibes",
        artist: "Ocean Waves",
        src: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
        title: "Urban Landscape",
        artist: "City Sounds",
        src: "https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop"
    },
    {
        title: "Mountain Echo",
        artist: "Nature Beats",
        src: "https://assets.mixkit.co/music/preview/mixkit-relax-in-the-meadow-394.mp3",
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop"
    },
    {
        title: "Digital Dreams",
        artist: "Synth Masters",
        src: "https://assets.mixkit.co/music/preview/mixkit-futuristic-robotic-278.mp3",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
        title: "Jazz Night",
        artist: "Smooth Cats",
        src: "https://assets.mixkit.co/music/preview/mixkit-slow-trip-hop-185.mp3",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop"
    }
];

const audioPlayer = document.getElementById('audioPlayer');
let currentSongIndex = 0;
let isPlaying = false;

function initPlayer() {
    loadPlaylist();
    loadSong(currentSongIndex);
    setupEventListeners();
}

function loadPlaylist() {
    const playlistElement = document.getElementById('playlist');
    playlistElement.innerHTML = '';

    playlist.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = 'playlist-item';
        songElement.innerHTML = `
            <img src="${song.image}" alt="${song.title}">
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
        `;
        songElement.onclick = () => playSong(index);
        playlistElement.appendChild(songElement);
    });
}

function loadSong(index) {
    const song = playlist[index];
    document.getElementById('songTitle').textContent = song.title;
    document.getElementById('songArtist').textContent = song.artist;
    document.getElementById('albumImage').src = song.image;
    
    audioPlayer.src = song.src;
    
    updatePlaylistHighlight(index);
}

function updatePlaylistHighlight(index) {
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

function setupEventListeners() {
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    
    const volumeSlider = document.getElementById('volume');
    volumeSlider.addEventListener('input', updateVolume);
    
    const progressBar = document.querySelector('.progress-bar');
    progressBar.addEventListener('click', seek);
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong(currentSongIndex);
    }
}

function playSong(index) {
    if (index !== currentSongIndex) {
        currentSongIndex = index;
        loadSong(index);
    }
    
    audioPlayer.play();
    isPlaying = true;
    document.getElementById('playBtn').textContent = '⏸️';
    document.querySelector('.album-art').classList.add('playing');
}

function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    document.getElementById('playBtn').textContent = '▶️';
    document.querySelector('.album-art').classList.remove('playing');
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        audioPlayer.play();
    }
}

function updateProgress() {
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = percent + '%';
    
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    duration.textContent = formatTime(audioPlayer.duration);
}

function updateDuration() {
    document.getElementById('duration').textContent = formatTime(audioPlayer.duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateVolume() {
    const volume = document.getElementById('volume').value;
    audioPlayer.volume = volume / 100;
    document.getElementById('volumeValue').textContent = volume + '%';
}

function seek(e) {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const width = progressBar.offsetWidth;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickPosition / width) * duration;
}

initPlayer();
