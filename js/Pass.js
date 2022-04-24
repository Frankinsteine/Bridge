class Pass {
    x = 0;
    y = 0;
    start = 0;
    ruler = false;
    onboard = false;
    position = 1;

    constructor(x, y, name, id, w, h) {
        if (!document.getElementById(id)) {
            this.mainDiv = document.createElement('div');
            this.mainDiv.className = 'container';
            this.mainDiv.id = id;
            this.mainDiv.style.left = x + "px";
            this.mainDiv.style.top = y + "px";
            document.body.appendChild(this.mainDiv);
        }
        this.imgId = document.createElement('img');
        this.imgId.src = `../bridge/js/img/${name}.png`;
        this.imgId.className = 'Pass';
        this.imgId.style.width = w/11 + "px";
        this.imgId.style.height = w/11 + "px";
        this.mainDiv = document.getElementById(id);
        this.mainDiv.appendChild(this.imgId);
        this.x = x;
        this.y = y;
        this.onboard = false;
        if(name === 'farmer') {
            this.ruler = true;
        }
        switch(name) {
            case 'farmer': this.start = 20; break;
            case 'cabbage': this.start = 4; break;
            case 'goat': this.start = 2.2; break;
            case 'wolf': this.start = 1.5; break;
        }
        //console.log(this);
    }

    resize(w,h) {
        this.imgId.style.width = w/11 + "px";
        this.imgId.style.height = w/11 + "px";
    }


    //Движение мишени
    move(x, y) {
        // задаём смещение по осям
        let dx = (x - this.x) / 100;
        let dy = (y - this.y) / 100;

        //изменяем координаты центра через малые промежутки времени
        let timerId = setInterval(() => {
            this.x += dx;
            this.y += dy;
            requestAnimationFrame(() => {
                this.mainDiv.style.left = this.x + "px";
                this.mainDiv.style.top = this.y + "px";
            });
        }, 10);
        setTimeout(() => { clearInterval(timerId); }, 1000);
    }

    moveInStart(width, height) {
        if(this.position === 1 && this.onboard) {
            this.move(width / 20, height / this.start);
            this.onboard = false;
        } else if(this.position === 2 && this.onboard) {
            this.move(width - (width / 5), height / this.start);
            this.onboard = false;
        }
    }
}