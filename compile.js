const path = require("path");
const fs = require("fs");
const solc = require("solc");

const wagerPath = path.resolve(__dirname, "contracts", "Wager.sol");
const source = fs.readFileSync(wagerPath, "utf8");

 module.exports = solc.compile(source, 1).contracts[':Wager']
