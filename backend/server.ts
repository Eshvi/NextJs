// backend/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cartRoutes from '../backend/src/routes/cartRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', cartRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ecommerce').then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

