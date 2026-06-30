class Console {
  static log(type, text) {
    console.log(`\x1b[34m[${type}]\x1b[0m ${text}`);
  }
  static error(type, text) {
    console.log(`\x1b[31m[${type}]\x1b[0m ${text}`);
  }
}

module.exports = Console;
