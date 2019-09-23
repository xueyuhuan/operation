<template>
    <div class="ve-aside">
        <div class="logo"><img src="../assets/logo.png" alt=""/>alpha</div>
        <el-menu router :default-active="$route.path"
                 background-color="#454353" text-color="#ccc" active-text-color="#ffd04b">
            <el-menu-item index="/user/list">用户</el-menu-item>
            <el-menu-item index="/group/list">小组</el-menu-item>
            <el-menu-item index="/output/list">产出比</el-menu-item>
            <el-menu-item index="/add/list">上新</el-menu-item>
            <el-menu-item index="/shop/list">店铺</el-menu-item>
            <el-menu-item index="/shop/return/rate">退货率</el-menu-item>
            <el-menu-item index="/return/list">退货单</el-menu-item>
            <el-menu-item index="/money/list">业绩统计</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "Aside",
    }
</script>

<style lang="scss">
    .ve-aside{
        @include flex(flex-start,stretch);
        flex-flow: column;
        flex: none;
        height: 100%;
        width: 220px;
        background-color: #a4a4cc;
        transition: all 2s;
        overflow-x: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar {display:none}
        .logo{
            @include flex(center);
            height: 50px;
            font-size: 12px;
            color: #eee;
            border-bottom: 1px rgba(0,0,0,.2) solid;
            img{
                height: 26px;
                margin-right: 10px;
            }
        }
        .el-menu{
            flex: 1;
            border-right: none;
            i.fa-fw{
                color: #ccc;
                margin-right: 10px;
            }
        }

    }
</style>