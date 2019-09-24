<template>
    <div class="home">
        <el-card>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-card :body-style="{ 'padding': '0px' }">
            <header slot="header">销售额（单位：＄）</header>
            <div id="bar1" class="chart"></div>
        </el-card>
        <el-card :body-style="{ 'padding': '0px' }">
            <header slot="header">同比上月（单位：%）</header>
            <div id="bar2" class="chart"></div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'home',
        data(){
            return{
                chart:{
                    bar1:{
                        x:[],
                        y:[],
                    },
                    bar2:{
                        x:[],
                        y:[],
                    },
                },
            }
        },
        computed:{
            color(){
                return this.$store.state.color;
            }
        },
        mounted(){
            this.getChart();
        },
        methods:{
            //图表
            getChart(){
                this.$ajax.post("/ratio/chart")
                    .then(res=>{
                        if(res.success==='0000'){
                            this.chart.bar1.x=res.data.listDm.map(v=>{
                                return {value:v.date}
                            });
                            this.chart.bar1.y=res.data.listDm.map(v=>{
                                return {value:v.money}
                            });
                            this.chart.bar2.x=res.data.listDr.map(v=>{
                                return {value:v.date}
                            });
                            this.chart.bar2.y=res.data.listDr.map(v=>{
                                return {value:v.ratio}
                            });
                        }
                    })
                    .then(()=>{
                        this.drawBar1();
                        this.drawBar2();
                    })
            },
            drawBar1(){
                let chart = this.$echarts.init(document.getElementById('bar1'));
                let option = {
                    color:this.color,
                    tooltip : {
                        trigger: 'item',
                    },
                    xAxis: {
                        type: 'category',
                        data: this.chart.bar1.x
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.chart.bar1.y,
                        type: 'bar'
                    }]
                };
                chart.setOption(option);
            },
            drawBar2(){
                let chart = this.$echarts.init(document.getElementById('bar2'));
                let option = {
                    color:this.color,
                    tooltip : {
                        trigger: 'item',
                    },
                    xAxis: {
                        type: 'value',
                    },
                    yAxis: {
                        type: 'category',
                        data: this.chart.bar2.x
                    },
                    series: [{
                        data: this.chart.bar2.y,
                        type: 'bar'
                    }]
                };
                chart.setOption(option);
            },
        }
    }
</script>

<style lang="scss">
    .home{
        .chart{
            height: 300px;
            width: 100%;
        }
    }
</style>
