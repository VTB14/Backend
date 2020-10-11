var script = require('../db/transfer');

// получаем эти даны из post(не забыть дешифрование)
let token = 'ggg45';

script.transfer(token);

//добавить проверку на аномалии пользователя!!!

// отправить ответ
