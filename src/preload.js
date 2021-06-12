// preload.js

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

    var questions = [
        {q:"What is 1+1?", a:"2"},
        {q:"What is 2+2?", a:"4"},
        {q:"What is 10+5?", a:"15"},
        {q:"What is 20-1?", a:"19"}
    ];
    const item = questions[Math.floor(Math.random()*questions.length)];

    let q = document.getElementById("question");
    q.innerHTML = item.q;

    let btn = document.getElementById("submit");
    let status = document.getElementById("status");

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
                window.close();
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
