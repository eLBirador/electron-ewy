// preload.js

const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const fs = require('fs');
const path = require('path');
// const net = electron.remote.net;

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }

    // const request = net.request({
    //     method: 'GET',
    //     protocol: 'http:',
    //     hostname: 'httpbin.org',
    //     path: '/get',
    //     redirect: 'follow'
    // });
    // request.on('response', (response) => {
    //     console.log(`STATUS: ${response.statusCode}`);
    //     console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
  
    //     response.on('data', (chunk) => {
    //         console.log(`BODY: ${chunk}`)
    //     });
    // });
    // request.on('finish', () => {
    //     console.log('Request is Finished')
    // });
    // request.on('abort', () => {
    //     console.log('Request is Aborted')
    // });
    // request.on('error', (error) => {
    //     console.log(`ERROR: ${JSON.stringify(error)}`)
    // });
    // request.on('close', (error) => {
    //     console.log('Last Transaction has occured')
    // });
    // request.setHeader('Content-Type', 'application/json');
    // request.end();

    // var questions = [
    //     {q:"What is 1+1?", a:"2"},
    //     {q:"What is 2+2?", a:"4"},
    //     {q:"What is 10+5?", a:"15"},
    //     {q:"What is 20-1?", a:"19"},
    //     {q:"What is 1 x 10?", a:"10"},
    //     {q:"What is 1 x 8?", a:"8"},
    //     {q:"What is 9 x 1?", a:"9"},
    //     {q:"What is 11 x 1?", a:"11"},
    //     {q:"What is 1 x 14?", a:"14"},
    // ];

    let rawdata = fs.readFileSync(path.resolve(__dirname, 'items.json'));
    let questions = JSON.parse(rawdata);

    let btn = document.getElementById("submit");
    let status = document.getElementById("status");
    let q = document.getElementById("question");
    let g = document.getElementById("group1");

    const item = questions[Math.floor(Math.random()*questions.length)];
    if (item["type"] && item["type"] == 'break') {
        g.hidden = true;
        duration = parseInt(item['duration']);
        
        var x = setInterval(function() {
            q.innerHTML = 'Take a break. The window will close in ' + duration + ' seconds.';
            // If the count down is finished, write some text
            if (duration < 0) {
                clearInterval(x);
                q.innerHTML = "";
                alert('Bye, see you later');
                ipcRenderer.send('hide', 1);
            }
            duration = duration - 1;
          }, 1000);
        
    } else {
        //Get Question and update UI
        g.hidden = false;
        q.innerHTML = item.q;
    }

    btn.addEventListener('click', () => {
        let answer = document.getElementById("answer");
        console.log(item);
        if (answer != "") {
            if (answer.value == item.a) {
                status.innerHTML = "";
                var correct_msgs = [
                    {s:"Great Job!"},
                    {s:"Wow, Youre a champ!"},
                ];
                var msg = correct_msgs[Math.floor(Math.random()*correct_msgs.length)];
                alert( msg.s + ', See you later!');
                ipcRenderer.send('hide', 1);
            } else {
                var statuses = [
                    {s:"Oopsie daisy, Try again!"},
                    {s:"Nice Try!, Think for a sec and try again!"},
                ];
                var msg = statuses[Math.floor(Math.random()*statuses.length)];

                answer.value = "";
                status.innerHTML = msg.s;
                answer.blur();
            }
        } else {
            alert('Call Daddy!');
        }
    });
    
})
