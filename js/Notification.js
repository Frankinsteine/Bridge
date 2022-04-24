class Notification {
    constructor(text, idButton, textButton) {
        this.text = text;
        this.textButton = textButton;
        this.idButton = idButton;
    }

    createNotification() {
        document.body.style.backgroundColor = "rgba(0,0,0,.3)"
        this.center = document.createElement("center");
        this.notification = document.createElement("div");
        this.button = document.createElement("button");
        this.textStart = document.createElement("p");

        this.center.classList.add("center")

        this.notification.classList.add("notification");

        this.textStart.id = "textStart";
        this.textStart.innerHTML = this.text;

        this.input_name = document.createElement("input");
        this.input_name.type = "text";
        this.input_name.id ="input_name";

        this.button.id = this.idButton;
        this.button.classList.add("buttonStart");
        this.button.innerText = this.textButton;

        document.body.appendChild(this.center);
        this.center.appendChild(this.notification);
        this.notification.appendChild(this.textStart);
        this.notification.appendChild(this.input_name);
        this.notification.appendChild(this.button);
    }

    deleteNotification() {
        this.notification.style.animation = "unshow 1s 1";
        document.querySelector(".notification").remove();
        document.querySelector(".center").remove();
    }
}