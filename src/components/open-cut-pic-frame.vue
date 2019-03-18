<template>
    <div class="component-open-cut-pic-frame" ref="container"
    :style="{
        'top': `${limit.top}px`,
        'left': `${limit.left}px`,
        'width': `${limit.width}px`,
        'height': `${limit.height}px`,
    }">
        <div class="frame-mask top-mask" 
        :style="{
            'height': `${value.top}px`
        }"></div>
        <div class="frame-mask right-mask"
        :style="{
            'top': `${value.top}px`,
            'left': `${value.left + value.width}px`,
            'width': `${limit.width - value.left - value.width}px`,
            'height': `${value.height}px`
        }"></div>
        <div class="frame-mask bottom-mask"
        :style="{
            'height': `${limit.height - value.height - value.top}px`
        }"></div>
        <div class="frame-mask left-mask"
        :style="{
            'top': `${value.top}px`,
            'width': `${value.left}px`,
            'height': `${value.height}px`
        }"></div>
        <div class="select-frame"
            ref="frameEl"
            :style="{
                'top': `${value.top}px`,
                'left': `${value.left}px`,
                'width': `${value.width}px`,
                'height': `${value.height}px`
            }">
            {{limit}}
            <div class="frame-contact top-left-contact"></div>
            <div class="frame-contact top-right-contact"></div>
            <div class="frame-contact bottom-right-contact"></div>
            <div class="frame-contact bottom-left-contact"></div>
        </div>
    </div>
</template>

<script>
import Mixin from './open-cut-pic-mixin'

export default {
    name: 'OpenCutPicFrame',
    mixins: [Mixin],
    props: {
        value: { // 选取框尺寸
            type: Object,
            required: true
        },
        scale: { // 剪裁区域比例
            type: Number,
            required: true
        },
        limit: { // 选取框边界限制
            type: Object,
            default: () => {
                return {
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0
                }
            }
        }
    },
    data() {
        return {
            clickPosition: {
                top: 0,
                left: 0
            },
            thisElPosition: null
        }
    },
    mounted() {
        let touchFuc = null;
        this.$refs.frameEl.addEventListener('mousedown', e => {
            e.stopPropagation();
            if (!this.thisElPosition) {
                const tp = this._getPositionPoint(this.$refs.container);
                this.thisElPosition = {
                    top: tp.top,
                    left: tp.left
                }
            }
            // 触点相对于被点击元素的位置
            this.clickPosition.top = e.offsetY;
            this.clickPosition.left = e.offsetX;
            if (this._hasClass(e.target, 'top-left-contact')) {
                touchFuc = this._dragTopLeft;
            }
            else if (this._hasClass(e.target, 'top-right-contact')) {
                touchFuc = this._dragTopRight;
            }
            else if (this._hasClass(e.target, 'bottom-right-contact')) {
                touchFuc = this._dragBottomRight;
            }
            else if (this._hasClass(e.target, 'bottom-left-contact')) {
                touchFuc = this._dragBottomLeft;
            }
            else {
                touchFuc = this._moveFrame;
            }
            this._addMousemoveEvent(touchFuc);
        });
        window.addEventListener('mouseup', e => {
            e.stopPropagation();
            this._removeMousemoveEvent(touchFuc);
        });
    },
    watch: {
        limit: {
            handler: function() {
                this.thisElPosition = null;
            },
            deep: true
        }
    },
    methods: {
        _getPosition(e) {
            // 当前出点相对于浏览器的坐标，加上浏览器滚动条滚动的距离，减去限制组建相对于页面的位置，减去触点相对于被点击元素的位置
            let top = e.clientY + document.documentElement.scrollTop - this.thisElPosition.top - this.clickPosition.top;
            let left = e.clientX + document.documentElement.scrollLeft - this.thisElPosition.left - this.clickPosition.left;
            return {top, left};
        },
        _moveFrame(e) {
            let {top, left} = this._getPosition(e);
            let width = this.value.width;
            let height = this.value.height;

            const needCerrect = this._checkLimit(top, left, width, height);

            if (needCerrect.top) {
                top = 0;
            }
            if (needCerrect.right) {
                left = this.limit.width - width;
            }
            if (needCerrect.bottom) {
                top = this.limit.height - height;
            }
            if (needCerrect.left) {
                left = 0;
            }

            this.$emit('input', {top, left, width, height});
        },
        _dragTopLeft(e) {
            let {top, left} = this._getPosition(e);
            let width = this.value.left - left + this.value.width;
            let height = width / this.scale;

            if (top < this.value.top) {
                height = this.value.top - top + this.value.height;
                width = height * this.scale;
            }
            // if (left < this.value.left) {
            //     width = this.value.left - left + this.value.width;
            //     height = width / this.scale;
            // }

            const needCerrect = this._checkLimit(top, left, width, height);
            if (needCerrect.top) {
                top = 0;
                height = this.value.top + this.value.height;
            }
            if (needCerrect.right) {}
            if (needCerrect.bottom) {
                // height = this.limit.height - top;
                // width = height * this.scale;
                // left = this.value.left;
            }
            if (needCerrect.left) {
                left = 0;
                width = this.value.left + this.value.width;
            }

            this.$emit('input', {top, left, width, height});
        },
        _dragTopRight(e) {
            let {top, left} = this._getPosition(e);
            
            let width = left - this.value.left;
            let height = this.value.top - top + this.value.height;

            // const needWidth = left - this.value.left;
            // const needHeight = this.value.top - top + this.value.height;

            height = width / this.scale;
            top = this.value.top - height + this.value.height;
            // if (needHeight >= this.value.height) {
            //     console.log('90-0987')
            //     height = top - this.value.top + this.value.height;
            //     width = height * this.scale;
            // }
            // else if (needHeight < this.value.height) {
            //     console.log('pppp')
            // }

            const needCerrect = this._checkLimit(top, this.value.left, width, height);
            if (needCerrect.top) {
                top = 0;
                height = this.value.top + this.value.height;
                width = height * this.scale;
            }
            if (needCerrect.bottom) {
                // height = this.limit.height - top;
            }
            if (needCerrect.right) {
                width = this.limit.width - this.value.left;
            }

            this.$emit('input', {top, left: this.value.left, width, height});
        },
        _dragBottomRight(e) {
            let {top, left} = this._getPosition(e);
            let width = left - this.value.left;
            let height = width / this.scale;

            if (top > this.value.top + height) {
                height = top - this.value.top;
                width = height * this.scale;
            }

            const needCerrect = this._checkLimit(this.value.top, this.value.left, width, height);
            if (needCerrect.right) {
                width = this.limit.width - this.value.left;
            }
            if (needCerrect.bottom) {
                height = this.limit.height - this.value.top;
            }

            if (needCerrect.right) {
                height = width / this.scale;
            }
            else {
                width = height * this.scale;
            }

            this.$emit('input', {top: this.value.top, left: this.value.left, width, height});
        },
        _dragBottomLeft(e) {
            let {top, left} = this._getPosition(e);
            let width = this.value.left - left + this.value.width;
            let height = top - this.value.top;

            const needCerrect = this._checkLimit(this.value.top, left, width, height);
            if (needCerrect.left) {
                left = 0;
                width = this.value.left + this.value.width;
            }
            if (needCerrect.bottom) {
                height = this.limit.height - this.value.top;
            }

            this.$emit('input', {top: this.value.top, left, width, height});
        },
        _checkLimit(top, left, width, height) {
            let needCerrect = {
                has: false,
                top: false,
                right: false,
                bottom: false,
                left: false
            };

            if (top < 0) {
                needCerrect.has = true;
                needCerrect.top = true;
            }
            if (left + width > this.limit.width) {
                needCerrect.has = true;
                needCerrect.right = true;
            }
            if (top + height > this.limit.height) {
                needCerrect.has = true;
                needCerrect.bottom = true;
            }
            if (left < 0) {
                needCerrect.has = true;
                needCerrect.left = true;
            }

            return needCerrect;
        },
        _checkBase(pointTop, pointLeft, width, height) {
            pointTop > this.value.top
        }
    }
};
</script>

<style lang="less">
.component-open-cut-pic-frame {
    position: absolute;
    .frame-mask {
        position: absolute;
        background-color: hsla(0, 0%, 100%, .4);
        &.top-mask {
            top: 0;
            width: 100%;
        }
        &.right-mask {
            right: 0;
        }
        &.bottom-mask {
            bottom: 0;
            width: 100%;
        }
        &.left-mask {
            left: 0;
        }
    }
    .select-frame {
        position: absolute;
        border: 1px dashed #000;
        cursor: move;
        box-sizing: border-box;
        .frame-contact {
            position: absolute;
            width: 5px;
            height: 5px;
            background-color: rgba(0, 0, 0, .5);
            transform: translate(-50%, -50%);
            &.top-left-contact {
                top: 0;
                left: 0;
                cursor: nw-resize;
            }
            &.top-right-contact {
                top: 0;
                left: 100%;
                cursor: ne-resize;
            }
            &.bottom-right-contact {
                top: 100%;
                left: 100%;
                cursor: se-resize;
            }
            &.bottom-left-contact {
                top: 100%;
                left: 0;
                cursor: sw-resize;
            }
        }
    }
}
</style>
