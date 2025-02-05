import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { auth, db } from '../firebaseConfig'; // Importing Firebase services
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // To track the authentication state
import '../App.css';

function YourLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

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
    const fetchLists = async () => {
      if (!userId) return; // Wait until the user is logged in

      try {
        const querySnapshot = await getDocs(collection(db, 'users', userId, 'lists'));
        const listsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLists(listsData); // Update state with fetched lists
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lists: ", error);
        setLoading(false);
      }
    };

    fetchLists();
  }, [userId]); // Re-run the fetch when userId changes

  // Handle creating a new list
  const handleCreateList = async () => {
    if (!newListTitle || !newListDescription) return; // Make sure both fields are filled

    try {
      await addDoc(collection(db, 'users', userId, 'lists'), {
        title: newListTitle,
        description: newListDescription,
      });
      setNewListTitle('');
      setNewListDescription('');
      alert('List created successfully!');
    } catch (error) {
      console.error("Error creating list: ", error);
      alert('Error creating list');
    }
  };

  // Handle deleting a list
  const handleDeleteList = async (listId) => {
    try {
      await deleteDoc(doc(db, 'users', userId, 'lists', listId));
      setLists(lists.filter(list => list.id !== listId)); // Remove deleted list from state
      alert('List deleted successfully!');
    } catch (error) {
      console.error("Error deleting list: ", error);
      alert('Error deleting list');
    }
  };

  // Handle navigating to the ListVideos page
  const handleNavigateToListVideos = (listId) => {
    navigate(`/list-videos/${listId}`);
  };

  return (
    <div className="YourLists">
      <h2>Your Lists</h2>

      {/* Management Card (Fixed to the Right) */}
      <div className="management-card">
        <h3>Manage Lists</h3>
        <div className="create-list-form">
          <input
            type="text"
            placeholder="List Title"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            className="input"
          />
          <textarea
            placeholder="List Description"
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
            className="input"
          />
          <button onClick={handleCreateList} className="create-list-btn">Create List</button>
        </div>
        <button onClick={() => setDeleteMode(!deleteMode)} className="toggle-delete-mode-btn">
          {deleteMode ? 'Cancel' : 'Remove List'}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="list-container">
          {lists.length > 0 ? (
            lists.map((list) => (
              <div className="card" key={list.id} onClick={() => handleNavigateToListVideos(list.id)}>
                <h3>{list.title}</h3>
                <p>{list.description}</p>
                {deleteMode && (
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }} className="delete-list-btn">X</button>
                )}
              </div>
            ))
          ) : (
            <p>No lists available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default YourLists;
