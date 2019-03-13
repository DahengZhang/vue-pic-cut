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
        }
    }
};