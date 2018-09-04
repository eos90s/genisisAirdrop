require('babel-register')
require("babel-polyfill")
var execAirdrop = require('./eosnts').execAirdrop

var keyProvider = process.argv[2];
if (!keyProvider) {
  console.log("keyProvider must supply");
  process.exit();
}

execAirdrop(keyProvider).then(() => process.exit())
