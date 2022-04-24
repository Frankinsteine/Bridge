class Boat {
    Boat = {
        divName: "container",
        imgName: "../bridge/js/img/boat.png",
    }

    x = 0;
    y = 0;
    position = 1;
    ruler = false;
    pass = false;

    constructor(x, y, id, w, h, params = this.Boat) {
        if (!document.getElementById(id)) {
            this.mainDiv = document.createElement('div');
            this.mainDiv.className = params.divName;
            this.mainDiv.id = id;
            this.mainDiv.style.left = x + "px";
            this.mainDiv.style.top = y + "px";
            document.body.appendChild(this.mainDiv);
        }
        this.imgId = document.createElement('img');
        this.imgId.src = params.imgName;
        this.imgId.className = 'Boat';
        this.imgId.style.width = w/6 + "px";
        this.imgId.style.height = w/3.2 + "px";
        this.Boat.width = w/6;
        this.Boat.height = h;
        this.mainDiv = document.getElementById(id);
        this.mainDiv.appendChild(this.imgId);
        this.x = x;
        this.y = y;
        //console.log(this);
    }

    resize(w,h) {
        this.imgId.style.width = w/6 + "px";
        this.imgId.style.height = w/3.2 + "px";
    }

    take(pass) {
        //console.log(this, pass);
        if (this.position === pass.position) {
            if (pass.ruler && !this.ruler) {
                this.ruler = pass;
                pass.move(this.x + this.Boat.width / 5, this.y - this.Boat.height / 20);
            } else if ( pass.ruler=== false && this.pass === false) {
                this.pass = pass;
                pass.move(this.x + this.Boat.width / 5, this.y + this.Boat.width / 2);
            }
        }
    }

    go(distance) {
        if (this.ruler) {
            if (this.position === 1) {
                this.ruler.position = this.position = 2;
                if (this.pass) {
                    this.pass.position = 2;
                }
            } else if (this.position === 2) {
                this.ruler.position = this.position = 1;
                if (this.pass) {
                    this.pass.position = 1;
                }
            }
            //console.log(this.x + distance); 
            this.move(this.x + distance, this.y);
            this.ruler.move(this.x + this.Boat.width / 5 + distance, this.y - this.Boat.height / 20);
            if (this.pass) {
                this.pass.move(this.x + this.Boat.width / 5 + distance, this.y + this.Boat.width / 2);
            }
        }
    }

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
}