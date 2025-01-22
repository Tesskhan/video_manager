import React, { useState } from 'react';

function YourProfile() {
  const [items, setItems] = useState(['Learn React', 'Write Code', 'Review Projects']);
  const [newItem, setNewItem] = useState('');

  // Add a new item to the list
  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  // Remove an item from the list
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="YourProfile">
      <h2>Your Profile</h2>
    </div>
  );
}

export default YourProfile;
