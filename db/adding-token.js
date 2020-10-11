function token(login, keyp) {

    const mysql = require('mysql');

    //для удаления токена передаем пустую строку


// конфигурация

    const conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "vtb",
        password: ""
    });

    conn.connect(function (err) {
        if (err) {
            return console.error("Ошибка: " + err.message);
        } else {
            console.log("Подключение к серверу MySQL успешно установлено");
        }
    });


// console.log(login);
// console.log('========');

// добовляем токен, (добавить запись даты и времени!!!)
    let query = "UPDATE user SET keyp='" + keyp + "' WHERE login='" + login + "'";

    conn.query(query, (err, result, field) => {
        console.log(err);
        // console.log(result);
    });


    conn.end(err => {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log('Database ----- Close');
        }
    });

}

module.exports = {
    token: token
};