<template>
    <div class="ve-header">
        <ul class="left">
<!--            <li><i class="fold" :class="{'el-icon-s-unfold':fold,'el-icon-s-fold':!fold}" @click="toggleFold()"></i></li>-->
<!--            <li><a href="https://cn.vuejs.org/" target="_blank"><i class="fab fa-vuejs"></i></a></li>-->
        </ul>
        <ul class="right">
            <li class="hidden-xs-only"><i class="fas" :class="[fullscreen?'fa-compress-arrows-alt':'fa-compress']" @click="handleFullScreen()"></i></li>
            <li><el-dropdown>
                <span>{{user.username}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
<!--                    <el-dropdown-item><router-link to="/account/user/info">个人资料</router-link></el-dropdown-item>-->
                    <el-dropdown-item><router-link to="/user/password">修改密码</router-link></el-dropdown-item>
                    <el-dropdown-item divided><span @click="logout">退出登录</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data(){
            return{
                fullscreen: false,
            }
        },
        computed:{
            user(){
                return this.$store.state.user
            }
        },
        methods:{
            //全屏
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            //登出
            logout(){
                this.$ajax.get('/user/logout')
                    .then(res=>{
                        if(res.success==='0000'){
                            this.$store.commit('setData',{
                                name:'token',
                                value:'',
                            });
                            localStorage.removeItem('token');
                            this.$router.push('/login')
                        }
                    })
            }
        }
    }
</script>

<style lang="scss">
    .ve-header{
        @include flex(space-between);
        height: 50px;
        background-color: #a4a4cc;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
        padding: 0 30px;
        .left{
            @include flex();
            li{
                cursor: pointer;
                margin-right: 30px;
                i{
                    font-size: 16px;
                }
            }
        }
        .right{
            @include flex();
            li{
                color: #fff;
                cursor: pointer;
                margin-left: 30px;
                span{
                    color: #fff;
                }
            }
        }

    }
</style>