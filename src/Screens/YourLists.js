import React, { useState } from 'react';

function YourLists() {
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
    <div className="YourLists">
      <h2>Your Lists</h2>
      <p>Manage your items below:</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}{' '}
            <button onClick={() => removeItem(index)} style={{ marginLeft: '10px' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new item"
        />
        <button onClick={addItem} style={{ marginLeft: '10px' }}>
          Add Item
        </button>
      </div>
    </div>
  );
}

export default YourLists;
