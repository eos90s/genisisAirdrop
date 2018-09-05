require('babel-register')
require("babel-polyfill")
var execAirdrop = require('./eosnts').execAirdrop

var keyProvider = process.argv[2];
if (!keyProvider) {
  console.log("keyProvider must supply");
  process.exit();
}

var sendAcc = process.argv[3];
if (!sendAcc) {
  console.log("sendAcc must supply");
  process.exit();
}

execAirdrop(keyProvider, sendAcc).then(() => process.exit())
