const http = require('http');
const fs = require('fs');
const requests = require('requests');
const home = fs.readFileSync('home.html', 'UTF-8');

const replaceVal = (tempVal, orgval) => {

    let temperature = tempVal.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%country%}", orgval.sys.country);
    return temperature;
}
const server = http.createServer((req, res) => {
    //res.writeHead(200, { 'Content-Type': 'application/json' });
    if (req.url == '/') {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Muzaffarpur&appid=56dccd6c263e87ce14023929f693444e&units=metric")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = Array(objData);
                //console.log(arrData[0].main.temp);
                const realtime = arrData.map((val) => replaceVal(home, val))
                    .join("");
                res.write(realtime);
                //console.log(realtime);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
    // res.end();
});
server.listen(8080, '127.0.0.1');




