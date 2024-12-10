const clientId = "YOUR_CLIENT_ID";
const clientSecret = "YOUR_CLIENT_SECRET";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");

// Function to get the access token
async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(clientId + ":" + clientSecret)}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

// Function to search for artists
async function searchArtists(query, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.artists.items;
}

// Render artist data
function renderArtists(artists) {
  resultsDiv.innerHTML = "";
  artists.forEach((artist) => {
    const card = document.createElement("div");
    card.classList.add("artist-card");

    card.innerHTML = `
      <img src="${artist.images[0]?.url || 'https://via.placeholder.com/150'}" alt="${artist.name}">
      <h2>${artist.name}</h2>
      <p>Genres: ${artist.genres.join(", ") || "N/A"}</p>
      <p>Popularity: ${artist.popularity}</p>
      <button onclick="viewTopTracks('${artist.id}')">View Top Tracks</button>
    `;

    resultsDiv.appendChild(card);
  });
}

// Fetch top tracks for an artist
async function viewTopTracks(artistId) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  alert(
    data.tracks
      .map((track) => `${track.name} (${track.preview_url ? "Preview Available" : "No Preview"})`)
      .join("\n")
  );
}

// Event listener for form submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  const token = await getAccessToken();
  const artists = await searchArtists(query, token);
  renderArtists(artists);
});
const tracksContainer = document.getElementById("tracks-container");
let currentAudio = null; // Keep track of the currently playing audio

// Fetch and display top tracks
async function viewTopTracks(artistId) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  renderTopTracks(data.tracks);
}

// Render top tracks
function renderTopTracks(tracks) {
  tracksContainer.innerHTML = ""; // Clear previous tracks
  tracks.forEach((track) => {
    const trackItem = document.createElement("div");
    trackItem.classList.add("track-item");

    const trackName = document.createElement("span");
    trackName.textContent = track.name;

    const playButton = document.createElement("button");
    playButton.textContent = "Play";

    // Handle play/pause functionality
    playButton.addEventListener("click", () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        playButton.textContent = "Play";
      }

      if (!currentAudio || currentAudio.src !== track.preview_url) {
        currentAudio = new Audio(track.preview_url);
        currentAudio.play();
        playButton.textContent = "Pause";

        currentAudio.onended = () => {
          playButton.textContent = "Play";
          currentAudio = null;
        };
      }
    });

    trackItem.appendChild(trackName);
    trackItem.appendChild(playButton);
    tracksContainer.appendChild(trackItem);
  });
}
