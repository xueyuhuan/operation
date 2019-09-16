<template>
    <div class="login">
        <img class="top" src="../assets/img/login/top.png" alt=""/>
        <img class="bottom" src="../assets/img/login/bottom.png" alt=""/>
        <div class="content">
            <div class="animation">
                <img src="../assets/img/login/people-top.png" alt=""/>
                <img src="../assets/img/login/people-bottom.png" alt=""/>
                <img src="../assets/img/login/people-left.png" alt=""/>
                <img src="../assets/img/login/people-right.png" alt=""/>
                <img src="../assets/img/login/cloud-left.png" alt=""/>
                <img src="../assets/img/login/cloud-right.png" alt=""/>
            </div>
            <div class="form">
                <h1>DELPA-Operation-CRM</h1>
                <p>Fast  efficient  convenient</p>
                <label><i class="fas fa-user"></i><input v-model="login.name" placeholder="请输入用户名"/></label>
                <label><i class="fas fa-lock"></i><input v-model="login.password" type="password" placeholder="请输入密码"/></label>
                <label><input v-model="code" placeholder="验证码"/><canvas id="canvas" @click="draw(show_num)"></canvas></label>
                <label><button @click="toLogin()">登录</button></label>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                login:{
                    name:'admin',
                    password:'000000',
                },
                show_num:[],
                code:'',
            }
        },
        created(){

        },
        mounted(){
            this.draw(this.show_num)
        },
        methods:{
            //生成并渲染出验证码图形
            draw(show_num) {
                let canvas_width=94;
                let canvas_height=32;
                let canvas = document.getElementById("canvas");//获取到canvas的对象
                let context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
                canvas.width = canvas_width;
                canvas.height = canvas_height;
                let sCode = "a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
                let aCode = sCode.split(",");
                let aLength = aCode.length;//获取到数组的长度

                for (let i = 0; i < 4; i++) {  //这里的for循环可以控制验证码位数（如果想显示6位数，4改成6即可）
                    let j = Math.floor(Math.random() * aLength);//获取到随机的索引值
                    let deg = Math.random() - 0.5; //产生一个随机弧度
                    let txt = aCode[j];//得到随机的一个内容
                    show_num[i] = txt.toLowerCase();
                    let x = 10 + i * 20;//文字在canvas上的x坐标
                    let y = 20 + Math.random() * 8;//文字在canvas上的y坐标
                    context.font = "bold 23px 微软雅黑";

                    context.translate(x, y);
                    context.rotate(deg);

                    context.fillStyle = this.randomColor();
                    context.fillText(txt, 0, 0);

                    context.rotate(-deg);
                    context.translate(-x, -y);
                }
                for (let i = 0; i <= 5; i++) { //验证码上显示线条
                    context.strokeStyle = this.randomColor();
                    context.beginPath();
                    context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
                    context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
                    context.stroke();
                }
                for (let i = 0; i <= 30; i++) { //验证码上显示小点
                    context.strokeStyle = this.randomColor();
                    context.beginPath();
                    let x = Math.random() * canvas_width;
                    let y = Math.random() * canvas_height;
                    context.moveTo(x, y);
                    context.lineTo(x + 1, y + 1);
                    context.stroke();
                }
            },
            //得到随机的颜色值
            randomColor() {
                let r = Math.floor(Math.random() * 256);
                let g = Math.floor(Math.random() * 256);
                let b = Math.floor(Math.random() * 256);
                return "rgb(" + r + "," + g + "," + b + ")";
            },
            toLogin(){
                if(!this.login.name){
                    this.$message.error("请输入用户名");
                    return false;
                }
                if(!this.login.password){
                    this.$message.error("请输入密码");
                    return false;
                }
                if(this.code!==this.show_num.join('')){
                    this.$message.error("验证码错误");
                    return false;
                }
                this.$ajax.post('/user/login',this.login)
                    .then(res=>{
                        if(res.success==='0000'){
                            localStorage.setItem('token',res.data.token);
                            localStorage.setItem('user',JSON.stringify(res.data.userDetail));
                            this.$store.commit('setData',{
                                name:'token',
                                value:res.data.token
                            });
                            this.$store.commit('setData',{
                                name:'user',
                                value:res.data.userDetail
                            });
                            this.$router.push({path: '/'})
                        }
                    })
            }
        }
    }
</script>

<style lang="scss">
    .login{
        position: relative;
        min-height: 100%;
        background: #7778f7;
        img.top{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        }
        img.bottom{
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 1;
        }
        .content{
            @include flex(flex-start,flex-start);
            position: absolute;
            top: 50%;left: 50%;
            transform: translate(-50%,-50%);
            z-index: 2;
            background: #ffffff;
            height: 420px;
            width: 700px;
            border-radius: 30px;
            box-shadow: 0 0 40px 62px rgba(50,52,255,.16);
            .animation{
                flex: 1;
                position: relative;
                height: 100%;
                img{
                    position: absolute;
                    top: 50%;left: 50%;
                }
                img:first-child{
                    z-index: 1;
                    margin-top: -144px;
                    margin-left: -66px;
                    animation: people-top 2s linear infinite alternate;
                }
                img:nth-child(2){
                    z-index: 2;
                    margin-left: -66px;
                    animation: people-bottom 2s linear infinite alternate;
                }
                img:nth-child(3){
                    z-index: 1;
                    margin-left: -132px;
                    margin-top: -116px;
                    animation: people-left 1.2s linear infinite alternate;
                }
                img:nth-child(4){
                    z-index: 1;
                    margin-left: 56px;
                    margin-top: -118px;
                    animation: people-right 2.4s linear infinite alternate;
                }
                img:nth-child(5){
                    z-index: 3;
                    margin-left: -150px;
                    margin-top: 70px;
                    animation: cloud-left 1.4s linear infinite alternate;
                }
                img:nth-child(6){
                    z-index: 3;
                    margin-left: 40px;
                    margin-top: 114px;
                    animation: cloud-right 1.4s linear infinite alternate;
                }
            }
            .form{
                flex: 1;
                height: 100%;
                padding: 0 0 0 26px;
                h1{
                    font-size: 24px;
                    margin: 70px 0 10px;
                }
                p{
                    font-size: 16px;
                    color: #3f5ace;
                    margin: 0 0 50px 0;
                }
                label{
                    position: relative;
                    display: flex;
                    justify-content: center;
                    width: 258px;
                    margin: 0 0 30px 0;
                    i{
                        position: absolute;
                        top: 50%;
                        left: 24px;
                        transform: translate(0,-40%);
                        color: #5fb9f3;
                    }
                    input{
                        flex: 1;
                        background: linear-gradient(top, #d5fbff 0%,#edfdff 100%);
                        height: 32px;
                        width: 100%;
                        line-height: 32px;
                        padding: 0 0 0 60px;
                        border-radius: 14px;
                        border: none;
                        &::-webkit-input-placeholder{
                            font-size: 12px;
                            color: #5fb9f3;
                        }
                    }
                    canvas{
                        height: 32px;
                        flex: 1;
                        margin-left: 10px;
                    }
                    button{
                        width: 88px;
                        height: 32px;
                        background: linear-gradient(left, #5859ca 0%,#60cdfb 100%);
                        font-size: 16px;
                        color: #fff;
                        cursor: pointer;
                        border-radius: 30px;
                        border: none;
                    }
                }
            }
        }
    }
    @keyframes people-top {
        from{margin-top: -144px;}
        to{margin-top: -124px;}
    }
    @keyframes people-bottom {
        from{margin-top: 0;}
        to{margin-top: 20px;}
    }
    @keyframes people-left {
        from{margin-top: -116px;}
        to{margin-top: -86px;}
    }
    @keyframes people-right {
        from{margin-top: -118px;}
        to{margin-top: -88px;}
    }
    @keyframes cloud-left {
        from{margin-left: -150px;}
        to{margin-left: -120px;}
    }
    @keyframes cloud-right {
        from{margin-left: 40px;margin-top: 114px}
        to{margin-left: 20px;}
    }
</style>