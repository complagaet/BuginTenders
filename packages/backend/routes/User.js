import 'dotenv/config';
import express from 'express';

import checkToken from '../middleware/checkToken.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/user', checkToken, async (req, res) => {
    try {
        const user = await User.findOne(
            { _id: req.decodedToken._id },
            { password: 0, __v: 0 }
        ).populate('lockers', '-__v -password'); // Заменяет IDs на объекты, исключает __v у замков

        if (!user) {
            console.log('[GET user] Not found!');
            return res.status(404).json({ error: 'Not found!' });
        }

        console.log('[GET user] Shared userinfo successfully.');
        res.status(200).json(user);
    } catch (e) {
        console.log('[GET user] Unknown error.', e);
        res.status(520).json({ error: 'Unknown error.' });
    }
});

export default router;
