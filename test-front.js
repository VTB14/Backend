const fs                = require('fs');
const { keysFilename }  = require('./config.js');
var key = require('./rsa/rsa');

keypi = {
    country: 'Russia',
    ip: '185.82.246.210',
    brouser: 'Chrom',
    score: '12834572837940',
    numberAttempts: '2',
    summa: '20000000'
}

let json = JSON.stringify(keypi);

let keypo = key.encryptPage(json).toString();

fs.writeFileSync(keysFilename, keypo);

