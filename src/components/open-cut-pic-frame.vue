<template>
    <div class="component-open-cut-pic-frame" ref="frameContainer"
        :style="{'width': `${width}px`, 'height': `${height}px`, 'min-width': `${minWdith}px`, 'min-height': `${minHeight}px`}">
        <div class="frame-contact top-left-contact"></div>
        <div class="frame-contact top-right-contact"></div>
        <div class="frame-contact bottom-right-contact"></div>
        <div class="frame-contact bottom-left-contact"></div>
    </div>
</template>

<script>
import Mixin from './open-cut-pic-mixin'

export default {
    name: 'OpenCutPicFrame',
    mixins: [Mixin],
    props: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    },
    computed: {
        minWdith() {
            if (this.width > this.height) {
                return 50 * this.width / this.height;
            }
            else {
                return 50;
            }
        },
        minHeight() {
            if (this.height > this.width) {
                return 50 * this.height / this.width;
            }
            else {
                return 50;
            }
        }
    },
    data() {
        return {
            oldSize: {},
            oldPosition: {},
            clickPosition: {},
            touchPoint: null,
            touchFuc: null
        };
    },
    mounted() {
        this.$refs.frameContainer.addEventListener('mousedown', e => {
            e.stopPropagation();
            this.oldSize = this.$refs.frameContainer.getBoundingClientRect();
            this.oldPosition.top = e.clientY;
            this.oldPosition.left = e.clientX;
            // 触点相对于被点击元素的位置
            this.clickPosition.top = e.offsetY || 0;
            this.clickPosition.left = e.offsetX || 0;
            // 根据被点击的元素选用方法
            if (this._hasClass(e.target, 'top-left-contact')) {
                this.touchFuc = this._topLeft;
            }
            else if (this._hasClass(e.target, 'top-right-contact')) {
                this.touchFuc = this._topRight;
            }
            else if (this._hasClass(e.target, 'bottom-right-contact')) {
                this.touchFuc = this._bottomRight;
            }
            else if (this._hasClass(e.target, 'bottom-left-contact')) {
                this.touchFuc = this._bottomLeft;
            }
            else {
                this.touchFuc = this._positionFrame;
            }
            this._addMousemoveEvent(this.touchFuc);
        });
        window.addEventListener('mouseup', e => {
            e.stopPropagation();
            this._removeMousemoveEvent(this.touchFuc);
        });
    },
    methods: {
        _getPosition(e) {
            // 当前出点相对于页面的坐标，加上浏览器滚动条滚动的距离，减去限制组建相对于页面的位置，减去触点相对于被点击元素的位置
            const top = e.clientY + document.documentElement.scrollTop - this.$parent.$el.offsetTop - this.clickPosition.top;
            const left = e.clientX + document.documentElement.scrollLeft - this.$parent.$el.offsetLeft - this.clickPosition.left;
            return {top, left}
        },
        _positionFrame(e) {
            const {top, left} = this._getPosition(e);
            this.$refs.frameContainer.style.top = top + 'px';
            this.$refs.frameContainer.style.left = left + 'px';
        },
        _topLeft(e) {
            const width = this.oldSize.width + this.oldPosition.left - e.clientX;
            if (width >= this.minWdith) {
                this.$refs.frameContainer.style.width = width + 'px';
                this.$refs.frameContainer.style.left = this._getPosition(e).left + 'px';
            }
            
            const height = this.oldSize.height + this.oldPosition.top - e.clientY;
            if (height >= this.minHeight) {
                this.$refs.frameContainer.style.height = height + 'px';
                this.$refs.frameContainer.style.top = this._getPosition(e).top + 'px';
            }
        },
        _topRight(e) {
            this.$refs.frameContainer.style.width = this.oldSize.width + e.clientX - this.oldPosition.left + 'px';

            const height = this.oldSize.height + this.oldPosition.top - e.clientY;
            if (height >= this.minHeight) {
                this.$refs.frameContainer.style.height = height + 'px';
                this.$refs.frameContainer.style.top = this._getPosition(e).top + 'px';
            }
        },
        _bottomRight(e) {
            this.$refs.frameContainer.style.width = this.oldSize.width + e.clientX - this.oldPosition.left + 'px';
            this.$refs.frameContainer.style.height = this.oldSize.height + e.clientY - this.oldPosition.top + 'px';
        },
        _bottomLeft(e) {
            this.$refs.frameContainer.style.height = this.oldSize.height + e.clientY - this.oldPosition.top + 'px';

            const width = this.oldSize.width + this.oldPosition.left - e.clientX;
            if (width >= this.minWdith) {
                this.$refs.frameContainer.style.width = (width >= this.minWdith ? width : this.minWdith) + 'px';
                this.$refs.frameContainer.style.left = this._getPosition(e).left + 'px';
            }
        }
    }
};
</script>

<style lang="less">
.component-open-cut-pic-frame {
    display: inline-block;
    top: 100px;
    left: 100px;
    border: 1px dashed #000;
    cursor: move;
    position: absolute;
    .frame-contact {
        position: absolute;
        width: 5px;
        height: 5px;
        background-color: rgba(0,0,0,.5);
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
</style>
