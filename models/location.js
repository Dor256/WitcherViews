import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    name: String,
    region: String,
    image: String,
    desc: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Location = mongoose.model("Location", locationSchema);

export { Location };