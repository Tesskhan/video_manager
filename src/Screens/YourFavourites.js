import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig'; // Importing Firebase services
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
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
      if (!userId) return; // Wait until the user is logged in

      try {
        const userListsRef = collection(db, 'users', userId, 'lists');
        const listsSnapshot = await getDocs(userListsRef);
        
        const allFavoriteVideos = [];

        for (const listDoc of listsSnapshot.docs) {
          const listId = listDoc.id;
          const videosRef = collection(db, 'users', userId, 'lists', listId, 'videos');
          const videosSnapshot = await getDocs(videosRef);

          // Check each video for the "liked" field
          videosSnapshot.forEach((videoDoc) => {
            const videoData = videoDoc.data();
            if (videoData.liked) {
              allFavoriteVideos.push({
                videoId: videoDoc.id,
                ...videoData,
              });
            }
          });
        }

        setFavoriteVideos(allFavoriteVideos); // Set state with all liked videos
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorite videos: ", error);
        setLoading(false);
      }
    };

    fetchFavoriteVideos();
  }, [userId]); // Re-run the fetch when userId changes

  return (
    <div className="YourFavourites">
      <h2>Your Favorites</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list-container">
          {favoriteVideos.length > 0 ? (
            favoriteVideos.map((video) => (
              <div className="card" key={video.videoId}>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                {/* Add other video fields here if needed */}
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
