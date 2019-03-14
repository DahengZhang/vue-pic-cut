export default {
    methods: {
        _hasClass(el, className) {
            let classList = el.getAttribute('class');
            if (!classList) {
                return false;
            }
            classList && className.split(' ') || [];
            return classList.indexOf(className) !== -1;
        },
        _addClass(el, className) {
            const has = this._hasClass(el, className);
            if (!has) {
                let classList = el.getAttribute('class');
                classList = classList && classList.split(' ') || [];
                classList.push(className);
                el.setAttribute('class', classList.join(' '));
            }
        },
        _removeClass(el, className) {
            const has = this._hasClass(el, className);
            if (!has) {
                return;
            }
            let classList = el.getAttribute('class');
            classList = classList && classList.split(' ') || [];
            classList.splice(classList.indexOf(className), 1);
            el.setAttribute('class', classList.join(' '));
        },
        _getRotate(el) {
            const transform = window.getComputedStyle(el, null).getPropertyValue('transform');
            if (transform === 'none') {
                return 0;
            }
            const transformValue = transform.split('(')[1].split(')')[0].split(',');
            return Math.round(Math.atan2(transformValue[1], transformValue[0]) * (180 / Math.PI))
        },
        _addMousemoveEvent(mouseMoveFuc) {
            window.addEventListener('mousemove', mouseMoveFuc);
        },
        _removeMousemoveEvent(mouseMoveFuc) {
            window.removeEventListener('mousemove', mouseMoveFuc);
        },
        _loadImage(src) {
            const img = new Image();
            img.src = src;
            return new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
        },
        _createImage(src, className) {
            const imgEl = document.createElement('img')
            imgEl.src = src;
            this._addClass(imgEl, className);
            return imgEl;
        }
    }
};