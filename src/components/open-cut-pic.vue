<template>
    <div class="component-open-cut-pic" ref="wrapper">
        <div class="rotate-btns-wrapper">
            <button @click="rotate(-90)">逆时针</button>
            <button @click="rotate(90)">顺时针</button>
        </div>
        <open-cut-pic-frame :width="width" :height="height" :defaultSize="defaultSize" :limit="borderLimit"></open-cut-pic-frame>
    </div>
</template>

<script>
import Mixin from './open-cut-pic-mixin'
import OpenCutPicFrame from './open-cut-pic-frame.vue'

export default {
    name: 'OpenCutPic',
    mixins: [Mixin],
    props: {
        src: {
            type: String
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        }
    },
    data() {
        return {
            wrapperSize: {
                width: 0,
                height: 0
            },
            imgEl: null,
            borderLimit: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            defaultSize: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        };
    },
    async mounted() {
        // 获取外层容器尺寸
        this.wrapperSize.width = this.$refs.wrapper.getBoundingClientRect().width;
        this.wrapperSize.height = this.$refs.wrapper.getBoundingClientRect().height;
        // 创建图片dom
        this.imgEl = await this._createDom('img', 'cut-pic-el', this.src);
        
        // 将图片加载到页面中
        this.$refs.wrapper.insertBefore(this.imgEl, this.$refs.wrapper.childNodes[0] || null);
        // 适配图片
        this._fitImage();
    },
    methods: {
        rotate(angle) {
            this.imgEl.style.transform = `rotate(${this._getRotate(this.imgEl) + angle}deg)`;
            this._fitImage();
        },
        _fitImage() {
            const isRotate = Math.abs(this._getRotate(this.imgEl) / 90) === 1;
            const wrapperScale = this.wrapperSize.width / this.wrapperSize.height; // 外层容器宽高比
            const imgScale = this.imgEl.width / this.imgEl.height; // 图片宽高比
            // width
            if (wrapperScale < imgScale) {
                // 初始时为水平布局
                const width = isRotate ? this.wrapperSize.height : this.wrapperSize.width;
                this.imgEl.style.width = width + 'px';
            }
            else {
                // 初始时为竖直布局
                const width = isRotate ? this.imgEl.width * this.wrapperSize.width / this.imgEl.height : this.wrapperSize.height * this.imgEl.width / this.imgEl.height;
                this.imgEl.style.width = width + 'px';
            }
            // left
            const left = (this.wrapperSize.width - this.imgEl.width) / 2;
            this.imgEl.style.left = left + 'px';
            // top
            const top = (this.wrapperSize.height - this.imgEl.height) / 2;
            this.imgEl.style.top = top + 'px';
            this._calcBorder();
        },
        _calcBorder() {
            const isRotate = Math.abs(this._getRotate(this.imgEl) / 90) === 1;
            const verticalImg = this.imgEl.width / this.imgEl.height < 1;
            const isVertical = verticalImg ? verticalImg && !isRotate : verticalImg || isRotate;
            const wrapperSize = this.$refs.wrapper.getBoundingClientRect();

            // 图片横着展示
            if (!verticalImg && !isRotate) {
                // 原图片是横着的，并且没有旋转
                this.borderLimit.top = this.borderLimit.bottom = (wrapperSize.height - this.imgEl.height) / 2;
            }
            else if (!verticalImg && isRotate) {
                // 原图片是横着的，并且被旋转
                this.borderLimit.left = this.borderLimit.right = (wrapperSize.width - this.imgEl.height) / 2;
            }
            // 图片竖着展示
            else if (verticalImg && !isRotate) {
                // 原图片是竖着的，并且没有旋转
                this.borderLimit.left = this.borderLimit.right = (wrapperSize.width - this.imgEl.width) / 2;
            }
            else {
                // 原图片是竖着的，并且被旋转
                this.borderLimit.top = this.borderLimit.bottom = (wrapperSize.height - this.imgEl.width) / 2;
            }

            this._initFramePosition(isRotate ? this.imgEl.height : this.imgEl.width, isRotate ? this.imgEl.width : this.imgEl.height);
        },
        _initFramePosition(imgWidth, imgHeight) {
            const frameScale = imgWidth / imgHeight; // 选区框宽高比
            const cutScale = this.width / this.height; // 裁剪区域宽高比

            if (frameScale > cutScale) { // 竖着剪裁
                this.defaultSize.left = this.defaultSize.right = this.width * imgHeight / this.height / 2;
            }
            else { // 横着剪裁
                this.defaultSize.top = this.defaultSize.bottom = imgHeight * this.width / imgWidth / 2;
            }
            console.log(this.defaultSize)
        }
    },
    components: {
        OpenCutPicFrame
    }
};
</script>
 
<style lang="less">
.component-open-cut-pic {
    user-select: none;
    background-color: #b4b7bf;
    position: relative;
    .rotate-btns-wrapper {
        position: absolute;
        top: -23px;
        right: 0;
    }
    .cut-pic-el {
        position: absolute;
        // transform: rotate(90deg);
    }
}
</style>
