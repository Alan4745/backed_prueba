/* eslint-disable no-unused-vars */
const Token = require("../../models/tokens/tokenUnitary.model");

function tokensSolos(req, res) {
    Token.find((err, tokenOne) => {
      console.log(tokenOne);
    });
}

module.exports = {tokensSolos}