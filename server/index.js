const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./Model/User');
const Complaint = require('./Model/Complaint');

const app = express();
const PORT = 8001;
const SECRET_KEY = 'secret123';

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

app.use(cors({
    origin: ["https://complaint-management-frontend.vercel.app"],
    methods: ["GET","POST"],
    credentials: true
  }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/user')
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Database connection failed', err));

app.get('/', async(req,res) =>{
     res.send("Hello")
})

app.post('/register', async (req, res) => {
  const { mail, name, phoneno, password } = req.body;

  try {
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, mail, phoneno, password: hashedPassword });
    await user.save();
    res.status(200).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred, please try again' });
  }
});

app.post('/login', async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id, mail: user.mail, name: user.name }, SECRET_KEY, { expiresIn: '24h' });
    res.status(200).json({ token, user: { name: user.name } });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'An error occurred, please try again' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.post('/addcomplaint', authenticateToken, async (req, res) => {
  const { subject, message } = req.body;

  try {
    const complaint = new Complaint({
      name: req.user.name,
      email: req.user.mail,
      subject,
      message,
      user: req.user.id,
    });
    await complaint.save();
    res.status(200).json({ message: 'Complaint registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred, please try again' });
  }
});


app.get('/my-complaints', authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ email: req.user.mail });
    if (complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found' });
    }
    res.status(200).json(complaints);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred, please try again' });
  }
});

app.get('/user-complaints', authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'name');

    if (complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found' });
    }

    res.status(200).json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred, please try again' });
  }
});

app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username: ADMIN_USERNAME }, SECRET_KEY, { expiresIn: '24h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

app.get('/complaint/:id', async (req, res) => {
  try {
    const complaintId = req.params.id;
    const getComplaint = await Complaint.findById(complaintId).populate('user', 'name email');
    if (!getComplaint) {
      return res.status(404).send({ message: 'Complaint not found' });
    }
    res.status(200).json(getComplaint);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.put('/complaint/:id', async (req, res) => {
  try {
    const complaintId = req.params.id;
    const updatedCategory = req.body.category;

    const updateComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { category: updatedCategory },
      { new: true }
    );

    if (!updateComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json(updateComplaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
