const API_KEY = 'YOUR_API_KEY'; // Replace with your YouTube API key
const player = document.getElementById('player');
const videoTitle = document.getElementById('video-title');
const videoMeta = document.getElementById('video-meta');
const videoDescription = document.getElementById('video-description');
const commentsContainer = document.getElementById('comments-container');
const relatedVideos = document.getElementById('related-videos');

const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('v');

async function loadVideo() {
  // Load video player
  player.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;

  // Fetch video details
  const videoResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
  );
  const videoData = await videoResponse.json();
  const video = videoData.items[0];
  videoTitle.textContent = video.snippet.title;
  videoMeta.textContent = `${video.snippet.channelTitle} • ${formatViews(video.statistics.viewCount)} views • ${formatLikes(video.statistics.likeCount)} likes`;
  videoDescription.textContent = video.snippet.description;

  // Fetch comments
  const commentsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=10&key=${API_KEY}`
  );
  const commentsData = await commentsResponse.json();
  displayComments(commentsData.items);

  // Fetch related videos
  const relatedResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=5&key=${API_KEY}`
  );
  const relatedData = await relatedResponse.json();
  displayRelatedVideos(relatedData.items);

  // GSAP Animation for video player
  gsap.from('.main-video', { opacity: 0, y: 50, duration: 0.5, ease: 'power2.out' });
  gsap.from('.related-videos', { opacity: 0, x: 50, duration: 0.5, delay: 0.2, ease: 'power2.out' });
}

function displayComments(comments) {
  commentsContainer.innerHTML = '';
  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
      <p><strong>${comment.snippet.topLevelComment.snippet.authorDisplayName}</strong></p>
      <p>${comment.snippet.topLevelComment.snippet.textDisplay}</p>
    `;
    commentsContainer.appendChild(commentElement);
  });
}

function displayRelatedVideos(videos) {
  relatedVideos.innerHTML = '';
  videos.forEach(video => {
    const videoElement = document.createElement('div');
    videoElement.className = 'video-card';
    videoElement.innerHTML = `
      <a href="watch.html?v=${video.id.videoId}">
        <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
        <div class="video-card-content">
          <h3 class="video-title">${video.snippet.title}</h3>
          <p class="video-meta">${video.snippet.channelTitle}</p>
        </div>
      </a>
    `;
    relatedVideos.appendChild(videoElement);
  });
}

function formatViews(views) {
  return parseInt(views).toLocaleString();
}

function formatLikes(likes) {
  return parseInt(likes).toLocaleString();
}

loadVideo();