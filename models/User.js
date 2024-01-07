import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    name: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},
    image: {type: String, required: false},
});

const User = models?.User || model("User", userSchema);

export default User;