var script = require('../db/adding-token');
var scriptKeys = require('../db/adding-keys');

// получаем эти даны из post
let login = 'fenomen';

// генерируем токен, для удаления токена передаем пустую строчку
let keyp = 'ggg45';

script.token(login, keyp);

// генерируем ключи (реализовать удаление их из бд!!!)
let publicKey = '123';
let sealedKey = '321';

scriptKeys.keys(login, publicKey, sealedKey);

// отправить ответ