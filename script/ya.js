export default class Ya {
    constructor(position, x, y, imageInfo) {
        this.name = 'ya' + position;
        this.x = x;
        this.y = y;
        this.prevPosition = 0;
        this.position = position;
        this.movingPerFrame = 0;
        this.isMoving = false;
        this.imageInfo = {
            width: imageInfo.width,
            height: imageInfo.height
        }
    }
}
