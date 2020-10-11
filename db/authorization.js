
async function authorization(login, password, callback) {

    const mysql = require('mysql2/promise');
    // const config = require('./config');
    const config = {
        host: "localhost",
        user: "root",
        database: "vtb",
        password: ""
    };

    var resultPas = 'k4444';


        const conn = await mysql.createConnection(config);
        const [rows, fields] = await conn.execute('SELECT * FROM user');

        for (let i = 0; i < rows.length; i++) {
            // console.log(result[i]['login']);
            if (rows[i]['login'].toString() === login) {
                if (rows[i]['password'].toString() === password.toString()) {
                    resultPas = "ok";
                    // return resultPas;
                    break;
                } else {
                    resultPas = "not pass";
                    // return resultPas;
                    break;
                }
            } else {
                resultPas = "not login";
            }
        }
        // await conn.execute('UPDATE user SET firstname="'+rows[0]['firstname']+'" WHERE email="iv@ua"');
        conn.end();
        // let pol = resultPas.toString();




// console.log(login);
// console.log('========');
    // console.log('00000000000000');
    // console.log(resultPas);
    // console.log('00000000000000');
    // return resultPas;
    // return conn.;
    // async function f()  {
    //     let a = await main();
    //     console.log(a);
    // };
    //
    // f();


    // let a = await main();
    // console.log("opppppppp");
    // console.log(a);
    // console.log("opppppppp");
    // return a;


    console.log("opppppppp");
    console.log(resultPas);
    console.log("opppppppp");
    return resultPas;
}

module.exports = {
    authorization: authorization
};
