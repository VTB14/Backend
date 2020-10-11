function transfer(token) {

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


    let query = "SELECT * FROM user";

    conn.query(query, (err, result, field) => {
        let resultPas = '777';
        console.log(err);
        // console.log(result);
        for (let i = 0; i < result.length; i++) {
            // console.log(result[i]['login']);
            if (result[i]['keyp'].toString() === token) {
                resultPas = "ok";
                break;
            } else {
                resultPas = "not";
                break;
            }
        }
        console.log(resultPas);
        // console.log(result[0]);
        // console.log(field);
        // console.log(result.length);
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
    transfer: transfer
};

