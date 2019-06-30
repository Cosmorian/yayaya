import { shuffleArray } from "./util.js";

class Yayaya {
    constructor() {
        this.wrapper = document.getElementsByClassName('wrapper')[0];
        this.yas = [
            {
                name: 'ya1',
                x: 0,
                y: 0,
                prevPosition: 0,
                position: 1,
                movingPerFrame: 0,
                isMoving: false
            },
            {
                name: 'ya2',
                x: 0,
                y: 0,
                prevPosition: 0,
                position: 2,
                movingPerFrame: 0,
                isMoving: false
            },
            {
                name: 'ya3',
                x: 0,
                y: 0,
                prevPosition: 0,
                position: 3,
                movingPerFrame: 0,
                isMoving: false
            }
        ];
        this.absolutePositionValue = [
            {
                x: 0,
                y: 0,
            },
            {
                x: 0,
                y: 0,
            },
            {
                x: 0,
                y: 0,
            }
        ];
        this.renderData = {
            stopAnimation: {},
            lastTick: 0,
            tickLength: 20,
            tickCnt: 0
        }
        this.movingTime = 2;
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.wrapper.clientWidth;
        this.canvas.height = this.wrapper.clientHeight;
        this.wrapper.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.initYa();

    }

    main(tFrame) {
        this.renderData.stopAnimation = window.requestAnimationFrame( tFrame => this.main(tFrame) );

        if (this.renderData.lastTick + this.renderData.tickLength <= tFrame) {
            this.renderData.lastTick = tFrame;
            this.renderData.tickCnt = this.renderData.tickCnt + 1;
            if (this.checkEndedMoving()) {
                debugger;
                this.changePosition();
                this.moveYa();
            } else {
                this.moveYa();
            }
        }
    }

    changePosition() {
        console.log('changePosition');
        const shuffledArray = shuffleArray(this.yas.map(ya => ya.position));
        shuffledArray.forEach((v, idx) => {
            const ya = this.yas[idx];
            ya.prevPosition = ya.position;
            ya.position = v;
            ya.movingPerFrame =
                ((this.absolutePositionValue[ya.position - 1].x - this.absolutePositionValue[ya.prevPosition - 1].x) /
                (this.renderData.tickLength));
            if (ya.prevPosition !== ya.position) {
                ya.isMoving = true;
            } else {
                ya.isMoving = false;
            }
        });
        this.yas.forEach((ya, index) => {
            ya.x = this.absolutePositionValue[index].x;
            ya.y = this.absolutePositionValue[index].y;
        })
    }

    checkEndedMoving() {
        return !this.yas
            .filter(ya => ya.isMoving)
            .some(ya => {
                console.table({
                    ya: ya.x,
                    absol: this.absolutePositionValue[ya.position - 1].x
                })
                return ya.x + 1 > this.absolutePositionValue[ya.position - 1].x && ya.x - 1 < this.absolutePositionValue[ya.position - 1].x
            });
    }

    moveYa() {
        this.yas.forEach(ya => {
            const movingX = ya.movingPerFrame;
            ya.x = ya.x + movingX;
        });
        this.drawYa();
     }

     initYa() {
         this.yaImage = new Image();
         this.yaImage.onload = () => {
             this.setPosition();
             this.drawYa();
             this.main(performance.now());
         };
         this.yaImage.src = './cup.png';
     }

    drawYa() {
        const imageWidth = this.canvas.width / 4;
        const imageHeight = imageWidth * (this.yaImage.height / this.yaImage.width);
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.yas.forEach(ya => {
            this.ctx.beginPath();
            this.ctx.drawImage(this.yaImage, ya.x, ya.y - (imageHeight / 2), imageWidth, imageHeight);
            this.ctx.closePath();
        })
    }

    setPosition() {
        const eachArea = this.canvas.width / 3;
        const leftSpace = (eachArea - this.canvas.width / 4) / 2
        this.yas.forEach((ya, index) => {
            const x = eachArea * index + leftSpace;
            const y = (this.canvas.width / 2);
            this.yas[index].x = x;
            this.yas[index].y = y;
            this.absolutePositionValue[index].x = x;
            this.absolutePositionValue[index].y = y;
        });
        console.log(this.absolutePositionValue);
    }
}


const yayaya = new Yayaya();
yayaya.init();
