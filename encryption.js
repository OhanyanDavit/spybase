const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const ENCRYPTION_KEY = "3f5e8a4da10b7ce37798569e34dd421cd239913a94065e219a5f3a7e564f331c"; 
const ALGORITHM = 'aes-256-cbc'; 

function encrypt(text) {
    const iv =crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    const [ivhex, encryptedText] = text.split(':');
    const iv = Buffer.from(ivhex, 'hex');
    const enc = Buffer.from(encryptedText, 'hex');
    const deciper = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = deciper.update(enc, 'hex', 'utf8');
    decrypted += deciper.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
};