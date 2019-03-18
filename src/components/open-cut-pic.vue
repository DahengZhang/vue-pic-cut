<template>
    <div class="component-open-cut-pic" ref="wrapper">
        <div class="rotate-btns-wrapper">
            <button @click="rotate(-90)">逆时针</button>
            <button @click="rotate(90)">顺时针</button>
        </div>
        <open-cut-pic-frame v-model="frameSize" :scale="width / height" :limit="limit"></open-cut-pic-frame>
    </div>
</template>

<script>
import Mixin from './open-cut-pic-mixin'
import OpenCutPicFrame from './open-cut-pic-frame.vue'

export default {
    name: 'OpenCutPic',
    mixins: [Mixin],
    props: {
        src: {  // 需要建材的图片地址
            type: String,
            required: true
        },
        width: { // 剪裁框宽度
            type: Number,
            default: 200
        },
        height: { // 剪裁框高度
            type: Number,
            default: 150
        },
        value: { // 定点坐标，剪裁框尺寸，旋转角度等信息
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isRotate: false, // 用来存放图片是否被旋转
            wrapperSize: { // 用来存放裁剪组件大小
                width: 0,
                height: 0
            },
            imgEl: null, // 被剪裁图片的dom对象
            limit: { // 剪裁限制区域
                top: 0,
                left: 0,
                bottom: 0,
                left: 0
            }
        };
    },
    computed: {
        frameSize: {
            get() {
                return this.value;
            },
            set(v) {
                this.$emit('input', v);
            }
        }
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
        rotate(angle) { // 旋转图片
            this.imgEl.style.transform = `rotate(${this._getRotate(this.imgEl) + angle}deg)`;
            this._fitImage();
        },
        _fitImage() { // 等同于CSS中 object-fit: contain;
            this.isRotate = Math.abs(this._getRotate(this.imgEl) / 90) === 1; // 图片是否被90度翻转
            const wrapperScale = this.wrapperSize.width / this.wrapperSize.height; // 外层容器宽高比
            const imgScale = this.imgEl.width / this.imgEl.height; // 图片宽高比
            // 设置图片宽度
            if (wrapperScale < imgScale) { // 初始时为水平布局
                const width = this.isRotate ? this.wrapperSize.height : this.wrapperSize.width;
                this.imgEl.style.width = width + 'px';
            }
            else { // 初始时为竖直布局
                const width = this.isRotate
                    ? this.imgEl.width * this.wrapperSize.width / this.imgEl.height
                    : this.wrapperSize.height * this.imgEl.width / this.imgEl.height;
                this.imgEl.style.width = width + 'px';
            }
            // 设置图片左边距，使其水平居中
            const left = (this.wrapperSize.width - this.imgEl.width) / 2;
            this.imgEl.style.left = left + 'px';
            // 设置图片上边距，使其竖直居中
            const top = (this.wrapperSize.height - this.imgEl.height) / 2;
            this.imgEl.style.top = top + 'px';

            // 计算可裁剪范围
            this._calcBorder();
        },
        _calcBorder() {
            const imgIsVertical = this.imgEl.width / this.imgEl.height < 1; // 原图是否为竖直

            this.limit.top = 0;
            this.limit.left = 0;
            this.limit.width = this.wrapperSize.width;
            this.limit.height = this.wrapperSize.height;

            // 图片横着展示
            if (!imgIsVertical && !this.isRotate) {
                // 原图片是横着的，并且没有旋转
                this.limit.top = (this.wrapperSize.height - this.imgEl.height) / 2;
                this.limit.height = this.imgEl.height;
            }
            else if (!imgIsVertical && this.isRotate) {
                // 原图片是横着的，并且被旋转
                this.limit.left = (this.wrapperSize.width - this.imgEl.height) / 2;
                this.limit.width = this.imgEl.height;
            }

            // 图片竖着展示
            else if (imgIsVertical && !this.isRotate) {
                // 原图片是竖着的，并且没有旋转
                this.limit.left = (this.wrapperSize.width - this.imgEl.width) / 2;
                this.limit.width = this.imgEl.width;
            }
            else {
                // 原图片是竖着的，并且被旋转
                this.limit.top = (this.wrapperSize.height - this.imgEl.width) / 2;
                this.limit.height = this.imgEl.width;
            }

            this._initFrameSize();
        },
        _initFrameSize(imgWidth, imgHeight) {
            const frameScale = this.limit.width / this.limit.height; // 选择区域宽高比
            const selectedScale = this.width / this.height; // 裁剪区域宽高比

            let selected = {
                top: 0,
                left: 0,
                width: this.limit.width,
                height: this.limit.height
            }

            if (frameScale > selectedScale) { // 竖着剪裁
                selected.left = this.limit.width / 2 - this.limit.height / this.height * this.width / 2;
                selected.width = this.width * this.limit.height / this.height;
            }
            else { // 横着剪裁
                selected.top = this.limit.height / 2 - this.limit.width / this.width * this.height / 2;
                selected.height = this.height * this.limit.width / this.width;
            }

            this.$emit('input', selected)
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
    }
}
</style>
