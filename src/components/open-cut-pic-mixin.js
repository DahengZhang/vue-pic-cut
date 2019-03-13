import Base from './open-cut-pic-base'

export default {
    mixins: [Base],
    methods: {
        _loadImage(src) {
            const img = new Image();
            img.src = src;
            return new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
        },
        _createImage(src) {
            const imgEl = document.createElement('img')
            imgEl.src = src;
            this._addClass(imgEl, 'cut-pic-el');
            return imgEl;
        },
        _getWdith(isVertical) {
            const isRotate = Math.abs(this._getRotate(this.imgEl) / 90) === 1;
            if (isVertical) {
                return this.wrapperSize.height * this.imgEl.width / this.imgEl.height;
            }
            else {
                return isRotate ? this.wrapperSize.height : this.wrapperSize.width;
            }
        },
        _getTop() {},
        _getLeft() {}
    }
};