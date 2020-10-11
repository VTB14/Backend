const fs                = require('fs');
const NodeRSA           = require('node-rsa');
const { keysFilename }  = require('../config/config.js');
const { keysFilename1 }  = require('../config/config-token.js');

// вытаскивают оба ключа
var getKeys = function() {
    let contents = fs.readFileSync(keysFilename, 'utf-8');
    let keysObj = JSON.parse(contents);
    return keysObj;
}


var getPublicKey = function() {
    let keysJson = getKeys();
    return keysJson.publicKey;
}


var getPrivateKey = function() {
    let keysJson = getKeys();
    return keysJson.privateKey;
}

// вытаскивем ключ для шифрования токена (1)
var getKeysToken = function() {
    let contents = fs.readFileSync(keysFilename1, 'utf-8');
    let keysObj = JSON.parse(contents);
    return keysObj;
}

// шифруем токен ключем(1)
var encryptToken = function(message) {
    let publicKey = getKeysToken();
    // let privateKey = getPrivateKey();

    const key = new NodeRSA();
    key.importKey(publicKey, 'pkcs1-public-pem');
    // key.importKey(privateKey, 'pkcs1-private-pem');

    const encrypted = key.encrypt(message, 'base64');
    return encrypted;
}

// шифрование
var encrypt = function(message) {
    let publicKey = getPublicKey();
    let privateKey = getPrivateKey();

    const key = new NodeRSA();
    key.importKey(publicKey, 'pkcs1-public-pem');
    key.importKey(privateKey, 'pkcs1-private-pem');

    const encrypted = key.encrypt(message, 'base64');
    return encrypted;
}

// дешифрование
var decrypt = function(message) {
    let privateKey = getPrivateKey();
    let publicKey = getPublicKey();

    const key = new NodeRSA();
    key.importKey(privateKey, 'pkcs1-private-pem');
    key.importKey(publicKey, 'pkcs1-public-pem');
    console.log(privateKey);

    const decrypted = key.decrypt(message, 'utf8');
    return decrypted;
}




// генерация ключей
var generateKeysSyncPage = function() {
    const key = new NodeRSA({b: 4096});

    let publicKey = key.exportKey('pkcs1-public-pem');
    let privateKey = key.exportKey('pkcs1-private-pem');
    
    let keysObj = {
        publicKey,
        privateKey
    }

    let keyStr = JSON.stringify(keysObj);

    fs.writeFileSync(keysFilename, keyStr);
    return keyStr;
}


var getKeysPage = function() {
    return JSON.stringify(getKeys());
}

var encryptPage = function(message) {
    return encrypt(message);
}

var encryptPageToken = function(message) {
    return encryptToken(message);
}


var decryptPage = function(message) {
    return decrypt(message);
}


module.exports = {
    generateKeysSyncPage,
    getKeysPage,
    encryptPage,
    decryptPage,
    getPublicKey,
    getPrivateKey,
    getKeysToken,
    encryptPageToken
}