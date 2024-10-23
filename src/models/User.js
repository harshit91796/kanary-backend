// /models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({

    name : {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    age : {
        type: Number,
        // required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role : {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    isDeleted : {
        type: Boolean,
        default: false,
    },
    resetToken : String,
    isAdmin: {
        type: Boolean,
        default: false
    },
 
  
}, {timestamps: true});

// Hash the password before saving the user
UserSchema.pre('save', async function(next) {
    console.log(this.password);
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateResetToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
 const User = mongoose.model('User', UserSchema);

module.exports = User;
