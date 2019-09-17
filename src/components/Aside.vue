<template>
    <div class="ve-aside">
        <div class="logo"><img src="../assets/logo.png" alt=""/>alpha</div>
        <el-menu router :default-active="$route.path"
                 background-color="#454353" text-color="#ccc" active-text-color="#ffd04b">
            <el-menu-item index="/home">控制台</el-menu-item>
            <el-menu-item index="/user/list">用户</el-menu-item>
            <el-menu-item index="/2">控制台</el-menu-item>
            <el-menu-item index="/3">控制台</el-menu-item>
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