const video = document.getElementById('webcam');
const emotionStatus = document.getElementById('emotion-status');
const loadingOverlay = document.getElementById('loading-overlay');
const spotifyIframe = document.getElementById('spotify-iframe');
const body = document.body;

// Emotion to Spotify Playlist Mappings
const playlists = {
    neutral: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M", // Today's Top Hits (Neutral)
    happy: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC",   // Happy Hits
    sad: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3YSRoSdA634",     // Life Sucks (Sad)
    angry: "https://open.spotify.com/embed/playlist/37i9dQZF1DX1tyCD9QhIWF",   // Rage Beats
    surprised: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO",// Peaceful Piano
    fearful: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZq91oLsHSvy", // Ambient Relaxation
    disgusted: "https://open.spotify.com/embed/playlist/37i9dQZF1DX1s9knjP51Oa",// Punk Unleashed
};

// Emotion settings (Colors & Icons)
const emotionConfig = {
    neutral: { icon: 'fa-face-meh', color: 'var(--color-neutral)', name: 'Neutral' },
    happy: { icon: 'fa-face-smile', color: 'var(--color-happy)', name: 'Happy' },
    sad: { icon: 'fa-face-frown', color: 'var(--color-sad)', name: 'Sad' },
    angry: { icon: 'fa-face-angry', color: 'var(--color-angry)', name: 'Angry' },
    surprised: { icon: 'fa-face-surprise', color: 'var(--color-surprised)', name: 'Surprised' },
    fearful: { icon: 'fa-face-grimace', color: 'var(--color-fearful)', name: 'Fearful' },
    disgusted: { icon: 'fa-face-dizzy', color: 'var(--color-disgusted)', name: 'Disgusted' }
};

let currentEmotion = 'neutral';
let modelLoaded = false;

// Load FaceAPI Models from jsdelivr CDN
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'),
    faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'),
    faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/')
]).then(startVideo).catch(err => console.error(err));

function startVideo() {
    modelLoaded = true;
    loadingOverlay.style.opacity = '0';
    setTimeout(() => loadingOverlay.style.display = 'none', 500);

    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Camera access denied or unavailable", err);
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.opacity = '1';
            loadingOverlay.innerHTML = '<p style="color:red">Camera access required</p>';
        });
}

video.addEventListener('play', () => {
    const canvas = document.getElementById('overlay');
    const displaySize = { width: video.clientWidth, height: video.clientHeight };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        // Run detection every 1000ms
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw standard boxes
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (detections.length > 0) {
            const expressions = detections[0].expressions;
            // Get highest probability emotion
            const topEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            updateUI(topEmotion);
        }

    }, 1500); // Check every 1.5s to avoid flickering and heavy CPU load
});


function updateUI(emotion) {
    if (emotion === currentEmotion || !emotionConfig[emotion]) return;
    
    currentEmotion = emotion;

    // Update body attribute for CSS background
    body.setAttribute('data-emotion', emotion);

    // Update badge UI
    const config = emotionConfig[emotion];
    emotionStatus.style.borderColor = config.color;
    emotionStatus.style.color = config.color;
    emotionStatus.innerHTML = `<i class="fa-solid ${config.icon}"></i> <span>${config.name}</span>`;

    // Add a pulsing effect
    emotionStatus.style.transform = 'scale(1.1)';
    setTimeout(() => emotionStatus.style.transform = 'scale(1)', 300);

    // Update Spotify Playlist
    const newSrc = playlists[emotion];
    if(spotifyIframe.src !== newSrc) {
        document.querySelector('.player-container').classList.remove('fade-in');
        
        setTimeout(() => {
            spotifyIframe.src = newSrc;
            document.querySelector('.player-container').classList.add('fade-in');
        }, 50);
    }
}
