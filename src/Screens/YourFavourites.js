import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; // Importing Firebase services
import { getDocs, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // To track the authentication state
import '../App.css'; // Assuming you've created your CSS

function Favorites() {
  const [favoriteVideos, setFavoriteVideos] = useState([]); // To store liked videos
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check if the user is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Store the user's ID
      } else {
        setUserId(null); // No user is logged in
      }
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  useEffect(() => {
    const fetchFavoriteVideos = async () => {
      if (!userId) return;

      try {
        const userListsRef = collection(db, 'users', userId, 'lists');
        const listsSnapshot = await getDocs(userListsRef);
        const allFavoriteVideos = [];

        for (const listDoc of listsSnapshot.docs) {
          const listId = listDoc.id;
          const videosRef = collection(db, 'users', userId, 'lists', listId, 'videos');
          const videosSnapshot = await getDocs(videosRef);

          videosSnapshot.forEach((videoDoc) => {
            const videoData = videoDoc.data();
            if (videoData.liked) {
              allFavoriteVideos.push({
                id: videoDoc.id,
                listId,
                ...videoData,
              });
            }
          });
        }

        setFavoriteVideos(allFavoriteVideos);
      } catch (error) {
        console.error("Error fetching favorite videos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteVideos();
  }, [userId]);

  const toggleFavorite = async (videoId, listId, isLiked) => {
    try {
      const videoRef = doc(db, 'users', userId, 'lists', listId, 'videos', videoId);
      await updateDoc(videoRef, { liked: !isLiked });
      setFavoriteVideos(favoriteVideos.map(video => video.id === videoId ? { ...video, liked: !isLiked } : video));
    } catch (error) {
      console.error("Error updating favorite status: ", error);
    }
  };

  const convertToEmbedUrl = (url) => {
    try {
      let videoId = '';
  
      // Handle YouTube watch URLs
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v'); // Extract the video ID from ?v= parameter
      }
      // Handle youtu.be shortened URLs
      else if (url.includes('youtu.be')) {
        videoId = url.split('/').pop();
      }
      // Handle already embedded URLs
      else if (url.includes('youtube.com/embed/')) {
        return url; // Already an embed URL
      }
  
      // If a valid videoId is found, return embed URL
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
  
      // If URL format is invalid, return original URL
      return url;
    } catch (error) {
      console.error("Error converting URL:", error);
      return url; // Fallback to original URL
    }
  };

  return (
    <div className="YourFavourites">
      <h2>Your Favorites</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="video-container">
          {favoriteVideos.length > 0 ? (
            favoriteVideos.map((video) => (
              <div className="card" key={video.videoId}>
                <h3>{video.title}</h3>
                <iframe
                  src={convertToEmbedUrl(video.url)}
                  title={video.title}
                  width="560"
                  height="315"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div class="card-buttons">
                  <button onClick={() => toggleFavorite(video.id, video.listId, video.liked)} className="favorite-btn">
                    {video.liked ? '★' : '☆'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No favorite videos available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Favorites;
