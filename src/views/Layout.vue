<template>
    <div class="ve-layout">
        <Aside></Aside>
        <div class="main">
            <Header></Header>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import Aside from "../components/Aside";
    import Header from "../components/Header";
    export default {
        name: "Layout",
        components: {Header, Aside},
    }
</script>

<style lang="scss">
    .ve-layout{
        height: 100%;
        @include flex(flex-start,flex-start);
        .main{
            position: relative;
            flex: 1;
            height: 100%;
            overflow-y: auto;
            padding-top: 50px;
            .ve-header{
                position: fixed;
                top: 0;
                left: 220px;
                right: 0;
                z-index: 999;
            }
            .content{
                padding: 15px;
                .el-card{
                    height: 100%;
                    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
                    header{
                        @include flex(space-between);
                        i{
                            color: #666;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
</style>