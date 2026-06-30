const crypto = require("crypto");

class CryptoUtils {
  static SessionToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}

module.exports = CryptoUtils;