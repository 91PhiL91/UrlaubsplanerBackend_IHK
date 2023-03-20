const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  

module.exports = {
    hashPassword
};