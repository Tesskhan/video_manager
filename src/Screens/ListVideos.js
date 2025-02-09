import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../App.css';

function ListVideos() {
  const { listId } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!userId || !listId) return;

      try {
        const videosRef = collection(db, 'users', userId, 'lists', listId, 'videos');
        const querySnapshot = await getDocs(videosRef);
        const fetchedVideos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [userId, listId]);

  const handleAddVideo = async () => {
    if (!newVideoTitle || !newVideoUrl) return;

    const embedUrl = convertToEmbedUrl(newVideoUrl);

    try {
      const docRef = await addDoc(collection(db, 'users', userId, 'lists', listId, 'videos'), {
        title: newVideoTitle,
        url: embedUrl,
      });

      setVideos([...videos, { id: docRef.id, title: newVideoTitle, url: embedUrl }]);
      setNewVideoTitle('');
      setNewVideoUrl('');
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const toggleFavorite = async (videoId, isLiked) => {
    try {
      const videoRef = doc(db, 'users', userId, 'lists', listId, 'videos', videoId);
      await updateDoc(videoRef, { liked: !isLiked });
  
      // Update local state
      setVideos(videos.map(video => video.id === videoId ? { ...video, liked: !isLiked } : video));
    } catch (error) {
      console.error("Error updating favorite status: ", error);
    }
  };
  

  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteDoc(doc(db, 'users', userId, 'lists', listId, 'videos', videoId));
      setVideos(videos.filter((video) => video.id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="YourVideos">
      <h2>Your Videos</h2>

      <div className="management-card">
        <h3>Manage Videos</h3>
        <div className="create-list-form">
          <input
            type="text"
            placeholder="Video Title"
            value={newVideoTitle}
            onChange={(e) => setNewVideoTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Video URL"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
          />
        </div>
        <button onClick={handleAddVideo}>Add Video</button>
        <button onClick={() => setDeleteMode(!deleteMode)}>
          {deleteMode ? 'Cancel' : 'Remove Video'}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list-container">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div className="card" key={video.id}>
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
                  <button onClick={() => toggleFavorite(video.id, video.liked)} class="favorite-btn">
                    {video.liked ? '★' : '☆'}
                  </button>
                  {deleteMode && (
                    <button onClick={() => handleDeleteVideo(video.id)} className="delete-list-btn">X</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No videos available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ListVideos;