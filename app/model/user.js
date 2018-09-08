const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hash: String,
    salt: String,
    roles: [String],
    lastActivity: Date
});

userSchema.methods.setPassword = function(pPassword) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(pPassword, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(pPassword) {
    let generatedHash = crypto.pbkdf2Sync(pPassword, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === generatedHash;
};

userSchema.methods.generateJwt = function() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
  
    return jwt.sign({
      _id: this._id,
      email: this.email,
      name: this.name,
      roles: this.roles,
      exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('User', userSchema);
