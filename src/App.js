import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editId, setEditId] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/contacts/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/contacts', form);
      }
      setForm({ name: '', email: '', phone: '' });
      fetchContacts();
    } catch (err) {
      console.error('Error saving contact:', err);
    }
  };

  const handleEdit = (contact) => {
    setForm({ name: contact.name, email: contact.email, phone: contact.phone });
    setEditId(contact._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  return (
    <div className="App">
      <h2>Contact Manager App</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Name" value={form.name} 
          onChange={e => setForm({ ...form, name: e.target.value })} required 
        />
        <input 
          type="email" placeholder="Email" value={form.email} 
          onChange={e => setForm({ ...form, email: e.target.value })} required 
        />
        <input 
          type="text" placeholder="Phone" value={form.phone} 
          onChange={e => setForm({ ...form, phone: e.target.value })} required 
        />
        <button type="submit">
          {editId ? 'Update Contact' : 'Add Contact'}
        </button>
      </form>

      <h3>Contact List</h3>
      <ul>
        {contacts.length === 0 ? (
          <p style={{ color: '#777', textAlign: 'center' }}>No contacts found. Add your first contact above!</p>
        ) : (
          contacts.map(c => (
            <li key={c._id}>
              <div>
                <strong>{c.name}</strong> <br />
                <span style={{ fontSize: '12px', color: '#666' }}>{c.email} | {c.phone}</span>
              </div>
              <div>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;