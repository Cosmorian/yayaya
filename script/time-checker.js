export default class TimeChecker {
    constructor(ts) {
        this.startTimeStamp = ts;
        this.animationStartTimeStamp = ts + 10000;
        this.animationEndTimeStamp = ts + 50000;
        this.endTimeStamp = ts + 60000;
    }

    isAnimationTime() {
        const now = Date.now();
        return (this.animationStartTimeStamp <= now && this.animationEndTimeStamp > now);
    }

    isReadyTime() {
        const now = Date.now();
        return (this.startTimeStamp <= now && this.animationStartTimeStamp > now);
    }

    isResultTime() {
        const now = Date.now();
        return (this.endTimeStamp > now && this.animationEndTimeStamp < now);
    }
}
