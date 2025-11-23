import 'dotenv/config';
import express from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!validator.isEmail(email)) {
            console.log('[POST /register] Bad email.');
            return res.status(400).json({ error: 'Bad email' });
        }

        const hashedPwd = await bcrypt.hash(password, 12);

        const user = new User({
            username,
            email,
            password: hashedPwd,
        });
        await user.save();

        console.log('[POST /register] User created successfully.');
        res.status(200).json({ message: 'User created successfully.' });
    } catch (e) {
        console.log('[POST /register] Registration failed!', e);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            console.log('[POST /login] Email not found!');
            return res.status(401).json({ error: 'Login failed' });
        }

        const checkPasswords = await bcrypt.compare(password, user.password);
        if (!checkPasswords) {
            console.log('[POST /login] Wrong password!');
            return res.status(401).json({ error: 'Login failed' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME,
        });

        console.log('[POST /login] Login successfully!');
        res.status(200).json({ message: 'Login successfully.', token });
    } catch (e) {
        console.log('[POST /login] Login failed!', e);
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;
