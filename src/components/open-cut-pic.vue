<template>
    <div class="component-open-cut-pic" ref="wrapper">
        <div class="rotate-btns-wrapper">
            <button @click="rotate(-90)">逆时针</button>
            <button @click="rotate(90)">顺时针</button>
        </div>
        <open-cut-pic-frame :width="200" :height="100" :limit="borderLimit"></open-cut-pic-frame>
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
        }
    },
    data() {
        return {
            wrapperSize: {},
            imageSize: {},
            imgEl: null,
            borderLimit: {}
        };
    },
    async mounted() {
        // 获取外层容器尺寸
        this.wrapperSize = this.$refs.wrapper.getBoundingClientRect();
        // 加载需要裁剪的图片
        this.imageSize = await this._loadImage(this.src);
        // 创建图片dom
        this.imgEl = this._createImage(this.src, 'cut-pic-el');
        // 将图片加载到页面中
        this.$refs.wrapper.insertBefore(this.imgEl, this.$refs.wrapper.childNodes[0] || null);
        // 适配图片
        this._fitImage();
        // 计算剪切边境
        this._calcBorder();
    },
    methods: {
        rotate(angle) {
            this.imgEl.style.transform = `rotate(${this._getRotate(this.imgEl) + angle}deg)`;
            this._fitImage();
            this._calcBorder();
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
        },
        _calcBorder() {
            const isRotate = Math.abs(this._getRotate(this.imgEl) / 90) === 1;
            const verticalImg = this.imgEl.width / this.imgEl.height < 1;
            const isVertical = verticalImg ? verticalImg && !isRotate : verticalImg || isRotate;
            const wrapperSize = this.$refs.wrapper.getBoundingClientRect();
            
            let top = 0;
            let left = 0;
            let width = 0;
            let height = 0;

            // 图片横着展示
            if (!verticalImg && !isRotate) {
                // 原图片是横着的，并且没有旋转
                top = (wrapperSize.height - this.imgEl.height) / 2;
                width = this.imgEl.width;
                height = this.imgEl.height;
            }
            else if (!verticalImg && isRotate) {
                // 原图片是横着的，并且被旋转
                left = (wrapperSize.width - this.imgEl.height) / 2;
                width = this.imgEl.height;
                height = this.imgEl.width;
            }
            // 图片竖着展示
            else if (verticalImg && !isRotate) {
                // 原图片是竖着的，并且没有旋转
                left = (wrapperSize.width - this.imgEl.width) / 2;
                width = this.imgEl.width;
                height = this.imgEl.height;
            }
            else {
                // 原图片是竖着的，并且被旋转
                top = (wrapperSize.height - this.imgEl.width) / 2;
                width = this.imgEl.height;
                height = this.imgEl.width;
            }

            this.borderLimit = {
                top,
                left,
                width,
                height
            }
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
