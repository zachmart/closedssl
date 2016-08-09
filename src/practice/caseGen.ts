"use strict";
var pem = require("pem");

/**
 * Created by zacharymartin on July 19, 2016.
 */

const cases: any[] = [
  {
    password: undefined,
    algorithm: "des3",
    numBits: 4096
  },
  {
    password: "abc123",
    algorithm: "des3",
    numBits: 2048
  },
  // {
  //   password: undefined,
  //   algorithm: "des",
  //   numBits: 1024
  // },
  // {
  //   password: "testtest",
  //   algorithm: "des",
  //   numBits: 1024
  // },
  // {
  //   password: undefined,
  //   algorithm: "aes128",
  //   numBits: 4096
  // },
  // {
  //   password: "whateva",
  //   algorithm: "aes128",
  //   numBits: 2048
  // },
  // {
  //   password: undefined,
  //   algorithm: "aes192",
  //   numBits: 1024
  // },
  // {
  //   password: "big fun",
  //   algorithm: "aes192",
  //   numBits: 1024
  // },
  // {
  //   password: undefined,
  //   algorithm: "aes256",
  //   numBits: 8192
  // },
  // {
  //   password: "123abc",
  //   algorithm: "aes256",
  //   numBits: 4096
  // },

];

for (let casee of cases) {
  pem.createPrivateKey(casee.numbits,
    {cipher: casee.algorithm, password: casee.password}, function(error, obj){
      let privateKey = obj.key;
      pem.getPublicKey(privateKey, function(error, obj) {
        let publicKey = obj.publicKey;

        console.log(`\n------------------------------------------------------------------------------------------------------------
PEMS for ${casee.numBits} bit key with algorithm "${casee.algorithm}" and password "${casee.password}"
privatePem:
${privateKey.replace("\n", "\\n")};
publicPem:
${publicKey.replace("\n", "\\n")}
-------------------------------------------------------------------------------------------------------\n`);
      })
    });
}

