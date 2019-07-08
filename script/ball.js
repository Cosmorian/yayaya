export default class Ball {
    constructor(x, y, imageInfo) {
        this.x = x;
        this.y = y;
        this.imageInfo = {
            width: imageInfo.width,
            height: imageInfo.height
        }
    }
}
