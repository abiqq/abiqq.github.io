const API_KEY = 'AIzaSyArjDxw1aswD5efWgRAWmvYxBxwz7_MjF8'; // Replace with your YouTube API key
const videoContainer = document.getElementById('video-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

async function fetchVideos(query = 'trending') {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}`
    );
    const data = await response.json();
    if (data.items) {
      displayVideos(data.items);
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
}

async function fetchVideoStats(videoId) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`
  );
  const data = await response.json();
  return data.items[0]?.statistics || { viewCount: '0', likeCount: '0' };
}

function displayVideos(videos) {
  videoContainer.innerHTML = '';
  videos.forEach(async (video, index) => {
    const stats = await fetchVideoStats(video.id.videoId);
    const videoElement = document.createElement('div');
    videoElement.className = 'video-card';
    videoElement.innerHTML = `
      <a href="watch.html?v=${video.id.videoId}">
        <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
        <div class="video-card-content">
          <h3 class="video-title">${video.snippet.title}</h3>
          <p class="video-meta">${video.snippet.channelTitle}</p>
          <p class="video-meta">${formatViews(stats.viewCount)} views • ${formatLikes(stats.likeCount)} likes</p>
        </div>
      </a>
    `;
    videoContainer.appendChild(videoElement);

    // GSAP Animation
    gsap.from(videoElement, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });
}

function formatViews(views) {
  return parseInt(views).toLocaleString();
}

function formatLikes(likes) {
  return parseInt(likes).toLocaleString();
}

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) fetchVideos(query);
});

// Initialize with trending videos
fetchVideos();
