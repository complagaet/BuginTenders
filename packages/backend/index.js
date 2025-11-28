import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';

import checkToken from './middleware/checkToken.js';

import AuthRoutes from './routes/Auth.js';
import AdminRoutes from './routes/Admin.js';
import UserRoutes from './routes/User.js';
import SearchRoutes from './routes/ProductSearch.js';
import SupplierRoutes from './routes/SupplierSearch.js';
import rnuCheckRouter from "./routes/rnuCheck.js";
import AnnounceRoutes from './routes/AnnounceSearch.js'

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';
const allowedOrigins = process.env.FRONTEND_ORIGINS.split(',');

const app = express();

mongoose
    .connect(DB_URL)
    .then(() => console.log(`Connected to MongoDB`))
    .catch((err) => console.error(`MongoDB connection error:`, err));

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('CORS blocked: ' + origin));
            }
        },
    })
);

app.use('/api', AuthRoutes);
app.use('/api', SearchRoutes);
app.use('/api', SupplierRoutes);
app.use('/api', AnnounceRoutes);
app.use("/api/rnu", rnuCheckRouter);
app.use('/api', checkToken, AdminRoutes);
app.use('/api', checkToken, UserRoutes);

app.get('/secured', checkToken, async (req, res) => {
    res.send('ok');
});

app.get('/', async (req, res) => {
    res.status(200).json({
        version: '1.0',
        messages: [],
        info: 'Bügın’ Tenders API',
        registrationEnabled: true,
        status: 'online', // 'online', 'maintenance'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
