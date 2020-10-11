var script = require('../db/authorization');

// получаем эти даны из post
let login = 'fenomen';
let password = 'passsword';

script.authorization(login, password);

// отправить ответ
