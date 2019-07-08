import { shuffleArray } from './util.js';
import Ya from './ya.js';
import Ball from './ball.js';

class Yayaya {
    constructor() {
        this.wrapper = document.getElementsByClassName('wrapper')[0];
        this.yas = [];
        this.ball = {};
        this.absolutePositionValue = [];

        this.renderData = {
            stopAnimation: {},
            stopStartAnimation: {},
            stopEndAnimation: {},
            lastTick: 0,
            tickLength: 20,
            tickCnt: 0,
            velocity: 2,
        };
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
            if (this.checkEndedMoving() || !this.yas.some(ya => ya.isMoving)) {
                this.changePosition();
                this.moveYa();
            } else {
                this.moveYa();
            }
        }
    }

    start(tFrame) {
        this.renderData.stopStartAnimation = window.requestAnimationFrame( tFrame => this.start(tFrame) );

        if (this.renderData.lastTick + this.renderData.tickLength <= tFrame) {
            this.renderData.lastTick = tFrame;
            this.renderData.tickCnt = this.renderData.tickCnt + 1;
            if (this.checkEndedMoving() || !this.yas.some(ya => ya.isMoving)) {
                this.changePosition();
                this.moveYa();
            } else {
                this.moveYa();
            }
        }
    }

    end(tFrame) {
        this.renderData.stopEndAnimation = window.requestAnimationFrame( tFrame => this.end(tFrame) );
    }

    changePosition() {
        if (this.renderData.velocity > 0.1) {
            this.renderData.velocity -= 0.1;
        }
        console.log(this.renderData.velocity);
        const shuffledArray = shuffleArray(this.yas.map(ya => ya.position));
        shuffledArray.forEach((v, idx) => {
            const ya = this.yas[idx];
            ya.prevPosition = ya.position;
            ya.position = v;
            ya.movingPerFrame =
                ((this.absolutePositionValue[ya.position - 1].x - this.absolutePositionValue[ya.prevPosition - 1].x) /
                (this.renderData.tickLength * this.renderData.velocity));
            if (ya.prevPosition !== ya.position) {
                ya.isMoving = true;
            } else {
                ya.isMoving = false;
            }
        });
    }

    checkEndedMoving() {
        console.table(this.yas);
        return this.yas
            .filter(ya => ya.isMoving)
            .some(ya => {
                const destPosition = this.absolutePositionValue[ya.position - 1];
                return ya.x < destPosition.x + 1 && ya.x > destPosition.x - 1;
            });
    }

    moveYa() {
        this.yas.forEach(ya => {
            ya.x = ya.x + ya.movingPerFrame;;
        });
        this.drawYa();
     }

     initYa() {
         this.yaImage = new Image();
         this.ballImage = new Image();
         this.yaImage.onload = () => {
             this.setYaPosition();
             // this.drawYa();
             this.changePosition();
             this.ballImage.src = './ball.png';
         };

         this.ballImage.onload = () => {
             this.setBallPosition(1);
             this.drawBall(1);
             this.drawYa();
             this.main(performance.now());
         };

         this.yaImage.src = './cup.png';
     }

    drawYa() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.yas.forEach(ya => {
            this.ctx.beginPath();
            this.ctx.drawImage(this.yaImage, ya.x, ya.y, ya.imageInfo.width, ya.imageInfo.height);
            this.ctx.closePath();
        })
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.drawImage(this.ballImage, this.ball.x, this.ball.y, this.ball.imageInfo.width, this.ball.imageInfo.height);
        this.ctx.closePath();
    }

    setBallPosition(position) {
        const ya = this.yas[position];
        const imageWidth = this.canvas.width / 10;
        const imageHeight = imageWidth * (this.ballImage.height / this.ballImage.width);
        const x = (ya.x + (ya.imageInfo.width / 2)) - (imageWidth / 2);
        const y = ya.y + ya.imageInfo.height - imageHeight;
        this.ball = new Ball(x, y, {
            width: imageWidth,
            height: imageHeight
        });
    }

    setYaPosition() {
        const imageWidth = this.canvas.width / 4;
        const imageHeight = imageWidth * (this.yaImage.height / this.yaImage.width);
        const eachArea = this.canvas.width / 3;
        const leftSpace = (eachArea - this.canvas.width / 4) / 2;
        [1, 2, 3].forEach((position, index) => {
            const x = eachArea * index + leftSpace;
            const y = (this.canvas.width / 2) - imageHeight / 2;
            this.yas.push(new Ya(position, x, y, {
                width: imageWidth,
                height: imageHeight
            }));
            this.absolutePositionValue.push({x, y});
        });
    }
}


const yayaya = new Yayaya();
yayaya.init();
