import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'Email must be at least 6 characters long'],
        maxLength: [25, 'Email must not be longer than 25 characters'],
        unique: true, // Ensures no duplicate emails
    },
    password: {
        type: String,
        required: true,
        select: false, // Excludes password from query results by default
    },
});

// Static method for hashing passwords
userSchema.statics.hashedPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

// Instance method to validate password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Instance method to generate JWT token
userSchema.methods.generateToken = function () {
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const User = mongoose.model('User', userSchema);
export default User;
