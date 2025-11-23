import { Schema, model } from 'mongoose';

const schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        status: { type: String, default: 'user' },
        banReason: { type: String, default: 'No reason' },
        scenarios: [{ type: Schema.Types.ObjectId, ref: 'scenario' }],
    },
    { timestamps: true }
);

const User = model('user', schema);

export default User;
