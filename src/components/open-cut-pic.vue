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
        this.wrapperSize = this.$refs.wrapper.getBoundingClientRect();
        this.imageSize = await this._loadImage(this.src);
        this.imgEl = this._createImage(this.src);
        this.$refs.wrapper.appendChild(this.imgEl);
        this._fitImage();
    },
    methods: {
        rotate(angle) {
            this.imgEl.style.transform = `rotate(${this._getRotate(this.imgEl) + angle}deg)`;
            this.tF();
        },
        tF() {
            const isRotate = Math.abs(this._getRotate(this.imgEl) / 90) === 1;

            const wrapperScale = this.wrapperSize.width / this.wrapperSize.height;
            const imgScale = isRotate ? 
                this.imgEl.height / this.imgEl.width : 
                this.imgEl.width / this.imgEl.height;
            console.log(wrapperScale < imgScale ? '水平布局' : '竖直布局')
        },
        _fitImage() {
            const wrapperScale = this.wrapperSize.width / this.wrapperSize.height;
            const imgScale = this.imgEl.width / this.imgEl.height;
            wrapperScale < imgScale ? this._horizontal() : this._vertical();
        },
        _horizontal() { // 水平布局
            console.log('---_horizontal')

            this.imgEl.style.width = this._getWdith(false) + 'px';
            const top = (this.wrapperSize.height - this.imgEl.height) / 2;
            this.imgEl.style.top = top + 'px';
        },
        _vertical(size) { // 竖直布局
            console.log('---_vertical')

            const width = this.wrapperSize.height * this.imgEl.width / this.imgEl.height;
            this.imgEl.style.width = width + 'px';
            const left = (this.wrapperSize.width - this.imgEl.width) / 2;
            this.imgEl.style.left = left + 'px';
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
