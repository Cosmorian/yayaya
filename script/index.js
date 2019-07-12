import { shuffleArray } from './util.js';
import Ya from './ya.js';
import Ball from './ball.js';
import TimeChecker from './time-checker.js';

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
        this.timeChecker = new TimeChecker(Date.now());
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
                if (this.renderData.velocity <= 0.1 && this.timeChecker.isResultTime()) {
                    window.cancelAnimationFrame(this.renderData.stopAnimation);
                    setTimeout(() => {
                        this.end(performance.now(), 1, {x: 0, y: this.absolutePositionValue[0].y} )
                    }, 500);
                } else {
                    this.changePosition();
                    this.moveYa();
                }
            } else {
                this.moveYa();
            }
        }
    }

    start(tFrame, step, position) {
        if (step === 1 && position.y === this.absolutePositionValue[0].y - 50) {
            step = 2;
        } else if (step === 2 && position.y === this.absolutePositionValue[0].y) {
            step = 3;
        } else if (step ===3 && position.y === this.absolutePositionValue[0].y - 24) {
            step = 4;
        }
        this.renderData.stopStartAnimation = window.requestAnimationFrame( tFrame => this.start(tFrame, step, position) );
        if (this.renderData.lastTick + this.renderData.tickLength <= tFrame && this.timeChecker.isAnimationTime()) {
            this.renderData.lastTick = tFrame;
            this.renderData.tickCnt = this.renderData.tickCnt + 1;
            if (step === 1 && position.y > this.absolutePositionValue[0].y - 50) {
                position.y -= 2;
            } else if (step === 2 && position.y < this.absolutePositionValue[0].y) {
                position.y += 2;
            } else if (step === 3 && position.y > this.absolutePositionValue[0].y - 24) {
                position.y -= 2;
            } else if (step === 4 && position.y < this.absolutePositionValue[0].y) {
                position.y += 2;
            }
            this.yas.forEach(ya => {
                ya.y = position.y;
            });
            this.render(true);
            if (step === 4 && position.y === this.absolutePositionValue[0].y) {
                window.cancelAnimationFrame(this.renderData.stopStartAnimation);
                this.main(performance.now());
            }
        }
    }

    end(tFrame, step, position) {
        if (position.y === this.absolutePositionValue[0].y - 50) {
            step = 2;
        }
        this.renderData.stopStartAnimation = window.requestAnimationFrame( tFrame => this.end(tFrame, step, position) );
        if (this.renderData.lastTick + this.renderData.tickLength <= tFrame) {
            this.renderData.lastTick = tFrame;
            this.renderData.tickCnt = this.renderData.tickCnt + 1;
            if (step === 1 && position.y > this.absolutePositionValue[0].y - 50) {
                position.y -= 2;
            } else if (step === 2 && position.y < this.absolutePositionValue[0].y) {
                // position.y += 2;
            }
            this.yas.forEach(ya => {
                ya.y = position.y;
            });
            this.render(true);
            if (step === 2 && position.y === this.absolutePositionValue[0].y) {
                window.cancelAnimationFrame(this.renderData.stopStartAnimation);
            }
        }
    }

    changePosition() {
        if (this.renderData.velocity > 0.1) {
            this.renderData.velocity -= 0.05;
        }

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
        return this.yas
            .filter(ya => ya.isMoving)
            .some(ya => {
                const destPosition = this.absolutePositionValue[ya.position - 1];
                return ya.x < destPosition.x + 1 && ya.x > destPosition.x - 1;
            });
    }

    moveYa() {
        this.yas.forEach(ya => {
            ya.x = ya.x + ya.movingPerFrame;
        });
        this.render(false);
    }

     initYa() {
         this.yaImage = new Image();
         this.ballImage = new Image();
         this.yaImage.onload = () => {
             this.initYaPosition();
             this.changePosition();
             this.ballImage.src = './ball.png';
         };

         this.ballImage.onload = () => {
             this.initBallPosition(1);
             this.render();
             this.start(performance.now(), 1, {x: 0, y: this.absolutePositionValue[0].y});
         };

         this.yaImage.src = './cup.png';
     }

    render(withBall) {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        if (withBall) {
            this.drawBall();
        }
        this.drawYa();
    }

    drawYa() {
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

    initBallPosition(position) {
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

    initYaPosition() {
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
