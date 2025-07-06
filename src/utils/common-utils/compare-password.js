const bcrypt = require('bcrypt')

async function comparePasswords(inputPassword, hashedPassword){
      const isPasswordCorrect = await bcrypt.compare(inputPassword, hashedPassword);
      return isPasswordCorrect? true : false;
}

module.exports = comparePasswords