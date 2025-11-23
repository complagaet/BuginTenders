import 'dotenv/config';
import User from '../models/User.js';

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.decodedToken._id });

        if (user.status !== 'admin') {
            console.log('[isAdmin] Access denied.');
            return res.status(401).json({ error: 'Access denied.' });
        }

        console.log(`[isAdmin] ${user.username} is really admin lol.`);
        next();
    } catch (e) {
        console.log('[isAdmin] Unknown error.', e);
        res.status(520).json({ error: 'Unknown error.' });
    }
};

export default isAdmin;
