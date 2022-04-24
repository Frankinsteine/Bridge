window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

const store = window.localStorage;
let endgame = false;
let timer;
let background;
let logo;
let elements = [];
let boat;
let width = window.innerWidth;
let height = window.innerHeight;
let distance = width / 3.4;
let blockmove = true;
let counter;
let user;
let canvas;
let c;
let audio;
let date = new Date(0, 0, 0);

function start() {
    canvas.width = width;
    canvas.height = height;
    canvas.addEventListener('click', () => {
        if(endgame) {
            refresh();
            endgame = false;
        }
    });
    //музыка
    document.getElementById('id_clock').style.zIndex = 5;
    audio = document.getElementById('mybtn');
    audio.style.display = 'inline';
    document.getElementById("mybtn").onclick = function () {
        var myaudio = document.getElementById("myaudio");
        myaudio.volume = 0.03;
        if (myaudio.paused == true) {
            document.getElementById("myaudio").play();
            this.style.backgroundColor = "Blue"; //Цвет кнопки можно изменить напрямую, без всяких картинок.
            this.style.color = "White"; //Заодно меняем цвет текста для удобичитаемости
            //this здесь является самой кнопкой, так как функция является дочерней кнопке
        }
        else if (myaudio.paused == false) {
            document.getElementById("myaudio").pause();
            this.style.backgroundColor = "White";
            this.style.color = "Black";
        }
    };
    //
    boat = new Boat(width / 3.6, height / 5, 1, width, height);
    let farmer = new Pass(width / 20, height / 20, 'farmer', 2, width, height);
    let cabbage = new Pass(width / 20, height / 4, 'cabbage', 3, width, height);
    let goat = new Pass(width / 20, height / 2.2, 'goat', 4, width, height);
    let wolf = new Pass(width / 20, height / 1.5, 'wolf', 5, width, height);
    elements.push(farmer);
    elements.push(cabbage);
    elements.push(goat);
    elements.push(wolf);
    c.shadowColor = 'rgba(0,0,0,0.5)';
    c.shadowBlur = 50;
    // Background
    background = c.createLinearGradient(0, 0, width, 0);
    background.addColorStop(0, 'green');
    background.addColorStop(0.2, 'green');
    background.addColorStop(0.27, '#654321');
    background.addColorStop(0.3, 'blue');
    background.addColorStop(0.5, '#00BFFF');
    background.addColorStop(0.7, 'blue');
    background.addColorStop(0.73, '#654321');
    background.addColorStop(0.8, 'green');
    background.addColorStop(1, 'green');
    c.fillStyle = background;
    c.fillRect(0, 0, width, height);
    counter = 0;
    date.setSeconds(0);
    date.setMinutes(0);
    digitalClock();
}

document.addEventListener('click', (e) => {
    let id = e.path[1].id;
    //console.log(e);
    if (e.path[0].localName === 'canvas' && logo) {
        document.getElementById('startbck').style.display = 'none';
        start();
        logo = false;
    }
    elements.forEach(elem => {
        if (elem.mainDiv.id === id) {
            if (elem.onboard === true) {
                if (blockmove) {
                    elem.moveInStart(width, height);
                    if (elem.ruler) {
                        boat.ruler = false;
                    } else {
                        boat.pass = false;
                    }
                    block();
                    check();
                }
            } else if (elem.onboard === false && elem.position == boat.position) {
                if (blockmove) {
                    elem.onboard = true;
                    boat.take(elem);
                    block();
                    check();
                }
            }
        };

    });
    if ((id - 0) === 1) {
        if (boat.ruler) {
            if (blockmove) {
                boat.go(distance);
                distance = -distance;
                block();
                counter++;
                check();
            }
        }
    }
});

function check() {
    if (elements[0].position == 2 && (elements[3].position == 1 && elements[2].position == 1) ||
        elements[0].position == 1 && (elements[3].position == 2 && elements[2].position == 2) ||
        elements[0].position == 2 && (elements[2].position == 1 && elements[1].position == 1) ||
        elements[0].position == 1 && (elements[2].position == 2 && elements[1].position == 2)
    ) {
        setTimeout(() => {
            gameOver('Проигрыш!');
            destroy();
        }, 1000);
    }
    if (elements[0].position == 2 && elements[1].position == 2 && elements[2].position == 2 && elements[3].position == 2) {
        if (!elements[0].onboard && !elements[1].onboard && !elements[2].onboard && !elements[3].onboard) {
            setTimeout(() => {
                destroy();
                gameOver('Победа!');
            }, 1000);
        }
    }
}

function gameOver(result) {
    //document.getElementById('id_clock').remove();
    c.fillStyle = background;
    c.fillRect(0, 0, width, height);
    const list = getStorage(result);
    c.fillStyle = "black";
    c.font = "3rem Arial";
    c.fillText(result, (width - c.measureText(result).width) / 2, 100);
    c.textAlign = "center";
    c.fillStyle = "black";
    c.font = "1.5rem Arial";
    c.fillText('Номер', width / 2 - 150, 200);
    c.fillText('Ходы', width / 2, 200);
    c.fillText('Время', width / 2 + 150, 200);
    for (let i = 0; i < list.length; i++) {
        c.fillText(list[i].id, width / 2 - 150, 250 + 20 * i);
        c.fillText(list[i].count, width / 2, 250 + 20 * i);
        c.fillText(list[i].time + 'c', width / 2 + 150, 250 + 20 * i);
    }
    endgame = true;
}

function destroy() {
    var elems = document.getElementsByClassName('container');
    while (elems[0]) {
        elems[0].parentNode.removeChild(elems[0]);
    }
    elements = [];
    document.getElementById("myaudio").pause();
    audio.style.display = 'none';
    document.getElementById('id_clock').style.zIndex = -5;
    clearTimeout(timer);
    distance = Math.abs(distance);
}

function block(time = 1) {
    blockmove = false;
    setTimeout(() => { blockmove = true }, 1000 * time);
}

function startWindow() {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    c = canvas.getContext('2d');
    document.body.appendChild(canvas);
    let startWindow = document.getElementById('startbck');
    startWindow.style.display = 'inline';
    c.fillStyle = "black";
    c.font = "3.535rem Arial";
    c.textAlign = "center";
    c.fillText('Задача о волке, козе и капусте', width / 2, height / 3);
    c.font = "3.535rem Arial";
    c.fillText('Кликните, чтобы начать', width / 2, height / 1.5);
    c.textAlign = "left";
    c.fillStyle = "white";
    c.font = "3.5rem Arial";
    c.textAlign = "center";
    c.fillText('Задача о волке, козе и капусте', width / 2, height / 3);
    c.font = "3.5rem Arial";
    c.fillText('Кликните, чтобы начать', width / 2, height / 1.5);
    c.textAlign = "left";
    logo = true;
}

window.onresize = function () {
    width = window.innerWidth;
    height = window.innerHeight;
    // destroy();
    // start();
    elements.forEach(elem => {
        elem.resize(width, height);
    });
    boat.resize(width, height);
};

function getStorage(result) {
    let list = [];
    if (result == 'Победа!') {
        if ((typeof user.id) != 'string') {
            const id = store.length;
            user.id = id + 1;
        }
        user.count = counter;
        user.time = date.getMinutes() + ':' + date.getSeconds();
        store.setItem(user.id - 1, JSON.stringify(user));
    }
    for (const key in store) {
        const answer = JSON.parse(store.getItem(key));
        if (answer) list.push(answer);
    };
    list.sort((a, b) => {
        if (a.time > b.time) return 1;
        if (a.time < b.time) return -1;
        return 0;
    });
    console.log(list);
    return list;
}

function digitalClock() {
    let clock = document.getElementById("id_clock");
    clock.style.display = 'flex';
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    date.setSeconds(date.getSeconds() + 1);
    //* добавление ведущих нулей */
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    clock.innerHTML = minutes + ":" + seconds;
    timer = setTimeout("digitalClock()", 1000);
}

function refresh() {
    destroy();
    start();
}

window.onload = function () {
    const REG_WINDOW = notification = new Notification("Как вас зовут?", "buttonStart", "Play");
    REG_WINDOW.createNotification();
    document.getElementById("buttonStart").onclick = () => {
        const name_player = document.getElementById("input_name").value;
        user = new User();
        if (name_player) {
            user.id = name_player;
        }
        REG_WINDOW.deleteNotification();
        startWindow();
    }
}