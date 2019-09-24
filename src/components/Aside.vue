<template>
    <div class="ve-aside">
        <div class="logo"><img src="../assets/logo.png" alt=""/>alpha</div>
        <el-menu router :default-active="$route.path"
                 background-color="#454353" text-color="#ccc" active-text-color="#ffd04b">
            <el-menu-item index="/">
                <i class="fas fa-fw fa-home"></i>&nbsp;&nbsp;主页</el-menu-item>
            <el-menu-item index="/user/list">
                <i class="fas fa-fw fa-user-friends"></i>&nbsp;&nbsp;用户</el-menu-item>
            <el-menu-item index="/group/list">
                <i class="fas fa-fw fa-users"></i>&nbsp;&nbsp;小组</el-menu-item>
            <el-menu-item index="/output/list">
                <i class="fas fa-fw fa-chart-line"></i>&nbsp;&nbsp;产出比</el-menu-item>
            <el-menu-item index="/add/list">
                <i class="fas fa-fw fa-history"></i>&nbsp;&nbsp;上新</el-menu-item>
            <el-menu-item index="/shop/list">
                <i class="fas fa-fw fa-store-alt"></i>&nbsp;&nbsp;店铺</el-menu-item>
            <el-menu-item index="/shop/return/rate">
                <i class="fas fa-fw fa-truck-loading"></i>&nbsp;&nbsp;退货率</el-menu-item>
            <el-menu-item index="/return/list">
                <i class="fas fa-fw fa-file-invoice"></i>&nbsp;&nbsp;退货单</el-menu-item>
            <el-menu-item index="/money/list">
                <i class="fas fa-fw fa-money-check-alt"></i>&nbsp;&nbsp;业绩统计</el-menu-item>
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
            i.fa-fa-fw{
                color: #ccc;
                margin-right: 10px;
            }
        }

    }
</style>