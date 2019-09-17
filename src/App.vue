<template>
    <div id="app">
        <router-view v-if="$route.meta.type==='login'"></router-view>
        <layout v-else><router-view/></layout>
    </div>
</template>

<style lang="scss">
    #app{
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        background-color: #f2f2f2;
    }
</style>
<script>
    import Layout from "./views/Layout";
    export default {
        components: {Layout}
    }
</script>