<template>
  <div id="app">
    This is App
    <p>水平</p>
    <open-cut-pic class="open-cut-pic-el" :src="'http://devimg.b.qq.com/vhtml/img_inner/hanfu002.jpeg'"></open-cut-pic>
    <p>竖直</p>
    <open-cut-pic class="open-cut-pic-el" :src="'http://devimg.b.qq.com/vhtml/img_inner/hanfu003.jpeg'"></open-cut-pic>
    <p>end</p>
  </div>
</template>

<script>
import OpenCutPic from '@/components/open-cut-pic'

export default {
    name: 'app',
    data() {
        return {
            src: 'http://devimg.b.qq.com/vhtml/img_inner/hanfu002.jpeg'
        };
    },
    components: {
        OpenCutPic
    }
};
</script>

<style lang="less">
#app {
    .open-cut-pic-el {
        width: 500px;
        height: 400px;
    }
}
</style>
