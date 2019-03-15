<template>
  <div id="app">
    This is App
    <p>水平</p>
    <open-cut-pic class="open-cut-pic-el" :src="'/images/hanfu002.jpeg'" :width="200" :height="100"></open-cut-pic>
    <p>竖直</p>
    <open-cut-pic class="open-cut-pic-el" :src="'/images/hanfu003.jpeg'" :width="200" :height="100"></open-cut-pic>
    <p>end</p>
  </div>
</template>

<script>
import OpenCutPic from '@/components/open-cut-pic'

export default {
    name: 'app',
    data() {
        return {
            src: '/images/hanfu002.jpeg'
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
