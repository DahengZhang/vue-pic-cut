<template>
    <div class="component-open-cut-pic" ref="wrapper">
        <div class="rotate-btns-wrapper">
            <button @click="rotate(-90)">逆时针</button>
            <button @click="rotate(90)">顺时针</button>
        </div>
        <!-- <img :src="src" :alt="src" class="cut-pic-el" /> -->
    </div>
</template>

<script>
import mixin from './open-cut-pic-mixin'
export default {
    name: 'OpenCutPic',
    mixins: [mixin],
    props: {
        src: {
            type: String
        }
    },
    data() {
        return {
            wrapperSize: {},
            imageSize: {},
            imgEl: {}
        };
    },
    async mounted() {
        // 获取外层容器尺寸
        this.wrapperSize = this.$refs.wrapper.getBoundingClientRect();
        // 加载需要裁剪的图片
        this.imageSize = await this._loadImage(this.src);
        // 创建图片dom
        this.imgEl = this._createImage(this.src);
        // 将图片加载到页面中
        this.$refs.wrapper.appendChild(this.imgEl);
        // 适配图片
        this._fitImage();
    },
    methods: {
        rotate(angle) {
            this.imgEl.style.transform = `rotate(${this._getRotate(this.imgEl) + angle}deg)`;
            this._fitImage();
        },
        _fitImage() {
            const wrapperScale = this.wrapperSize.width / this.wrapperSize.height; // 外层容器比例
            const imgScale = this.imgEl.width / this.imgEl.height;
            wrapperScale < imgScale ? this._horizontal() : this._vertical();
        },
        _horizontal() { // 初始时为水平布局
            console.log('---_horizontal:初始时为水平布局')

            const isRotate = Math.abs(this._getRotate(this.imgEl) / 90) === 1;
            const width = isRotate ? this.wrapperSize.height : this.wrapperSize.width;
            this.imgEl.style.width = width + 'px';
            const top = (this.wrapperSize.height - this.imgEl.height) / 2;
            this.imgEl.style.top = top + 'px';
        },
        _vertical() { // 初始时为竖直布局
            console.log('---_vertical:初始时为竖直布局')

            const isRotate = Math.abs(this._getRotate(this.imgEl) / 90) === 1;
            const width = isRotate ? this.imgEl.width * this.wrapperSize.width / this.imgEl.height : this.wrapperSize.height * this.imgEl.width / this.imgEl.height;
            this.imgEl.style.width = width + 'px';
            const left = (this.wrapperSize.width - this.imgEl.width) / 2;
            this.imgEl.style.left = left + 'px';
            const top = (this.wrapperSize.height - this.imgEl.height) / 2;
            this.imgEl.style.top = top + 'px';
        }
    }
};
</script>
 
<style lang="less">
.component-open-cut-pic {
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
