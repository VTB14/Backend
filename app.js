var addingToken = require('./db/adding-token');
var addingKeys = require('./db/adding-keys');
var addingh = require('./db/adding-zader');
var key = require('./rsa/rsa');

const http = require('http');
const url = require('url');
const { parse } = require('querystring');

http.createServer(function (req, res) {
    let urlParts = url.parse(req.url);
    // // console.log(urlParts);
    // console.log(req);
    // console.log('==========================');
    // // console.log(urlParts.pathname);
    // console.log('==========================');
    if (req.method == 'GET') {
        switch (urlParts.pathname) {
            case "/":
                homepage(req, res);
                break;
            case "/about":
                console.log('!!!!!!!!!!!!!!!!!11');
                about(req, res);
                break;
            default:
                page404(req,res);
                break;
        }
        console.log('1=====)')
    }
    else
    if (req.method == 'POST') {
        // console.log('2=====')
        switch (urlParts.pathname) {
            case "/password":
                console.log('1=====0')
                let login ='';
                let password ='';
                let openKey = '';

                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                console.log('00000000000000000')
                // console.log(body)
                req.on('end', () => {
                    let params = parse(body);
                    login = params.login;
                    password = params.pass;
                    openKey = params.key;
                    console.log('1=====')
                    console.log(login);
                    console.log('2=====')
                    console.log(password);
                    passwordi(req, res, login, password);
                });
                break;

            case "/token":
                let parmw = '';
                let tokens = '';
                let jsonEncrypted = '';





                let bodys = '';
                req.on('data', chunk => {
                    bodys += chunk.toString();
                });
                req.on('end', () => {
                    let params = parse(bodys);
                    tokens = params.tokenEncrypted;
                    jsonEncrypted = params.jsonEncrypted;

                    token(req, res, tokens, jsonEncrypted);
                });
                break;



            default:
                page404(req,res);
                break;
        }
    }
    // if (req.method == 'OPTIONS') {
    //     let body = '';
    //
    //     req.on('data', chunk => {
    //         body += chunk.toString();
    //     });
    //     console.log(req);
    //     console.log('======================================');
    //     console.log(body);
    //     console.log('privet100');
    //     res.end('no');
    // }
    else {
        console.log('1=====+++')
        page404(req,res);
    }

}).listen(3001);
console.log("Server running at http://localhost:3001/");

function homepage(req, res) {
    res.end("homepage");
}
async function passwordi(req, res, login, password) {
    // let login = 'fenomen';
    // let password = 'passsword';

    const mysql = require('mysql2/promise');
    // const config = require('./config');
    const config = {
        host: "localhost",
        user: "root",
        database: "vtb",
        password: ""
    };
    // var resultPas = 'k4444';

    async function main() {
        const conn = await mysql.createConnection(config);
        const [rows, fields] = await conn.execute('SELECT * FROM user');
        let resultPas = '';
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
        return resultPas
    }

    async function f()  {
        let a = await main();
        console.log(a);
        if (a === 'ok'){

            // генерируем токен
            let keypi = 'ggg45';

            // сохраняем его в бд, (указываем дату и время)
            addingToken.token(login, keypi);

            // шифруем токен открытым ключем из клиента (неработает токлько с открытым ключем, реализовал шифрование через ключи с сервака)
            let keypo = key.encryptPage(keypi).toString();
            console.log(keypo);

            // генерируем открытый и закрытый ключи шифрования
            // key.generateKeysSyncPage();
            let publicKey = key.getPublicKey();
            let sealedKey = key.getPrivateKey();

            // let publicKey = '7788';
            // let sealedKey = '8877';

            // сохраняем ключи в бд
            addingKeys.keys(login, publicKey, sealedKey);

            // соеденяем строчки, шифрованного токена и новый сгенерированый открытый ключ    (json)
            let jsoTokKey = "{\r\n    \"token\": \"" + keypo + "\", \r\n  \"openKeyServer\": \"" + publicKey + "\" \r\n }"

            // let json = JSON.stringify(jsoTokKey);

            // и выводим эту строчку
            res.end(jsoTokKey);
        }
        else{
            res.end('no');
        }

    };

    f();

    console.log('---------------')
}

function token(req, res, tokensi, jsonEncrypted) {
    var erorToken = false;
    let tokens = '';
    let erorJson = false;
    let dann = '';

    let strana = '';
    let ip = '';
    let brouser = '';
    var shcet = '';
    let autoriz = '';
    var summa = '';

    // дешифруем json
    try {
        jsonEncrypted = key.decryptPage(jsonEncrypted);

        // раскрываем джейсон
        dann = JSON.parse(jsonEncrypted);
        strana = dann['country'];
        ip = dann['ip'];
        brouser = dann['brouser'];
        shcet = dann['score'];
        autoriz = dann['numberAttempts'];
        summa = dann['summa'];

    } catch (err) {
        erorJson = true;
        console.log(err);
    }




    // дешифруем токен
    try {
        tokens = key.decryptPage(tokensi);

    } catch (err) {
        erorToken = true;
        console.log(err);
    }
    // let tokens = key.decryptPage(tokensi);
    console.log('====================---------===========');
    // console.log(tokens);

    // сверяем токен с токеном из бд (если совпадает выведим ok, иначе no)
    const mysql = require('mysql2/promise');
    const config = {
        host: "localhost",
        user: "root",
        database: "vtb",
        password: ""
    };

    async function main() {
        const conn = await mysql.createConnection(config);
        const [rows, fields] = await conn.execute('SELECT * FROM user');
        let resultPas = '';
        let score = '';
        for (let i = 0; i < rows.length; i++) {
            // console.log(result[i]['login']);
            if (rows[i]['keyp'].toString() === tokens) {
                resultPas = "ok";
                break;
            } else {
                resultPas = "not";
            }
        }
        // await conn.execute('UPDATE user SET firstname="'+rows[0]['firstname']+'" WHERE email="iv@ua"');
        conn.end();
        // let pol = resultPas.toString();
        return resultPas
    }

    async function f()  {
        var dostup = false;
        let a = await main();
        console.log(a);
        if (a === 'ok'){
            async function main() {
                const conn = await mysql.createConnection(config);
                const [rows, fields] = await conn.execute('SELECT * FROM user');
                let resultPas = '';
                let score = '';

                for (let i = 0; i < rows.length; i++) {
                    // console.log(result[i]['login']);
                    if (rows[i]['keyp'].toString() === tokens) {
                        score = rows[i]['country'];
                        break;
                    } else {
                        score = "not";
                    }
                }
                // await conn.execute('UPDATE user SET firstname="'+rows[0]['firstname']+'" WHERE email="iv@ua"');
                conn.end();
                // let pol = resultPas.toString();
                return score
            }

            async function f()  {
                let a = await main();
                console.log(a);
                if (!(a === 'not')){

                    // распарсиваем a из бд
                    // раскрываем джейсон (не получается распарсить!!!!!!!!!!!!!!)
                    let danni = JSON.parse(a);
                    let stranai = danni['country'];
                    let ipi = danni['ip'];
                    let brouseri = danni['brouser'];
                    let shceti = danni['score'];

                    let prava = 5;
                    // реализовать АБС защиту, и саму АБС
                    console.log(strana);
                    console.log(ip);
                    console.log(brouser);
                    console.log(shcet);
                    console.log(autoriz);
                    console.log(summa);

                    console.log('======000000000======000000========')

                    console.log(stranai);
                    console.log(ipi);
                    console.log(brouseri);
                    console.log(shceti);
                    // console.log(autoriz);
                    // console.log(summa);


                    if (!erorJson) {
                        if(autoriz < 3){
                            prava = 4;
                            if(strana === stranai){
                                prava = 3;
                                if(brouser === brouseri && ip === ipi){
                                    prava = 2;
                                    if(shcet === shceti){
                                        prava = 1;
                                    }
                                }
                            }
                        }

                        switch (prava) {
                            case 5:
                                if (summa < 5001)
                                    dostup = true;
                                break;
                            case 4:
                                if (summa < 10001)
                                    dostup = true;
                                break;
                            case 3:

                                if (summa < 50001)

                                    dostup = true;
                                break;
                            case 2:
                                if (summa < 100001)
                                    dostup = true;
                                break;
                            case 1:
                                if (summa < 1000001)
                                    dostup = true;
                                break;
                            default:
                                console.log( "Нет таких значений" );
                        }
                    }
                    if (dostup)
                        res.end('ok-prav');
                    else{
                        // реализовать задержку перевода(внести в бд, с датой и временем)(отправка смс пользователю)
                        var now = new Date();

                        console.log('4444444444444444444444');
                        console.log(shcet);
                        console.log('4444444444444444444444');
                        async function main() {
                            const conn = await mysql.createConnection(config);
                            const [rows, fields] = await conn.execute('SELECT * FROM user');
                            let resultPas = '';
                            let score = '';
                            for (let i = 0; i < rows.length; i++) {
                                // console.log(result[i]['login']);
                                if (rows[i]['keyp'].toString() === tokens) {
                                    addingh.keys(rows[i]['score'], shcet, summa);
                                    // addingZader
                                    // rows[i]['score'];
                                    // summa;
                                    // shcet;


                                    break;
                                } else {
                                    resultPas = "not";
                                }
                            }
                            // await conn.execute('UPDATE user SET firstname="'+rows[0]['firstname']+'" WHERE email="iv@ua"');
                            conn.end();
                            // let pol = resultPas.toString();
                            return;
                        }
                        main();

                        res.end('ok-time: ' + prava);
                    }

                }
                else{
                    // выводи no
                    res.end('no');
                }
            };

            f();



            // // реализовать АБС защиту, и саму АБС
            // if (!erorJson) {
            //     console.log(strana);
            //     console.log(ip);
            //     console.log(brouser);
            //     console.log(shcet);
            //     console.log(autoriz);
            //     console.log(summa);
            //
            //
            // }
            // выводи ok
            console.log('sykaaaaaaaaaaaaa!!!!!!!!!!!11');
            console.log(dostup);
            // выводи ok

            // res.end('ok');
        }
        else{
            // выводи no
            res.end('no');
        }

    };
    if (!erorToken)
        f();
    else
        res.end('no');
}

function page404(req, res) {
    res.end("40454764566");
}
function about(req, res) {
    res.end("about5555");
    console.log('ytrewq');
}