function keys(login, publicKey, sealedKey) {

    const mysql = require('mysql');

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

// записываем ключи,
    let query = "INSERT INTO key_tok (login, public_key, sealed_key) values('" + login + "', '" + publicKey + "', '" + sealedKey + "')";

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
    keys: keys
};

