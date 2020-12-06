
const fs = require('fs')
const fetch = require('node-fetch')

let application = fs.readFileSync('./application.yml', 'utf8')

if (process.env.PORT) {
    application = application.replace('DYNAMICPORT', process.env.PORT)
}

if (process.env.PASS) {
    application = application.replace('youshallnotpass', process.env.PASS)
}
fs.writeFileSync('./application.yml', application)

const download = function (url, dest, cb) { //modified code from https://stackoverflow.com/a/22907134
    const file = fs.createWriteStream(dest);
    fetch(url).then(res=>{
        res.body.pipe(file)
        console.log('Downloading Lavalink.jar')
        file.on('finish', function () {
            console.log('Downloaded Lavalink.jar')
            file.close(cb);
        });
    })
};

function startLavalink() {
    const spawn = require('child_process').spawn;
    const child = spawn('java', ['-jar', 'Lavalink.jar'])

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')

    child.stdout.on('data', (data) => {
        console.log(data);
    });

    child.stderr.on('data', (data) => {
        console.error(data);
    });

    child.on('error', (error) => {
        console.error(error);
    });

    child.on('close', (code) => {
        console.log(`Lavalink exited with code ${code}`);
    });
    
    if(process.env.APP_NAME)
    keepAlive()
}

console.log('Fetching latest Lavalink.jar url...')
fetch('https://api.github.com/repos/Frederikam/Lavalink/releases/latest')
    .then(res => res.json())
    .then(json => {
        console.log('Found: '+json.assets[0].browser_download_url)
        download('https://cdn.glitch.com/be628ae2-455f-4fd7-b7c8-79c0d210ca1f%2FLavalink.jar?v=1607258575105', './Lavalink.jar', startLavalink)
    });

// json.assets[0].browser_download_url,


function keepAlive() {
    console.log('Keeping alive.');

    const fetch = require('node-fetch');

    let count = 0;
    setInterval(() =>
        fetch(`http://${process.env.APP_NAME}.herokuapp.com`)
            .then(() => console.log(`[${++count}] Kept server alive.`))
            .catch(() => console.log(`Failed to keep server alive.`))
        , 5 * 60 * 1000);
}



