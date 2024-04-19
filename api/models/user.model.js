import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: "string",
        required: true,
        unique: true,
    },
    email: {
        type: "string",
        required: true,
        unique: true,
    },
    password: {
        type: "string",
        required: true,
    },
    avatar: {
        type: String,
        default: "https://media.istockphoto.com/id/1298261537/vector/blank-man-profile-head-icon-placeholder.jpg?s=612x612&w=0&k=20&c=CeT1RVWZzQDay4t54ookMaFsdi7ZHVFg2Y5v7hxigCA="
    },
},
    { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;