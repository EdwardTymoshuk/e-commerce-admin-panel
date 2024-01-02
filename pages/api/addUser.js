import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {User} from "../../models/User";

export default async function handler(req, res) {

    const { method, body, query } = req

if (method === 'POST') {
    try {
        // Connect to the database
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Hash the password
        const hashedPassword = await bcrypt.hash("Testpassword123!", 10);

        // Add the user to the database
        await User.create({
            name: "Test user",
            username: "test@test.com",
            password: hashedPassword,
            // Add other user fields as needed
        });
        

        res.status(200).json({ success: true, message: "User added successfully!" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    } finally {
        // Close the connection if it was established
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
    }
}
}
