const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect('mongodb://localhost:27017/contact_manager')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Schema جهات الاتصال
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});

const Contact = mongoose.model('Contact', contactSchema);

// مسار فحص السيرفر
app.get('/', (req, res) => {
    res.send('Backend is running successfully! 🚀');
});

// 1. GET: جلب جميع جهات الاتصال
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST: إضافة جهة اتصال جديدة
app.post('/api/contacts', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        const saved = await newContact.save();
        res.json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. PUT: تعديل جهة اتصال
app.put('/api/contacts/:id', async (req, res) => {
    try {
        const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. DELETE: حذف جهة اتصال
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));