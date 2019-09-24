<template>
    <div class="up-to-date">
        <el-card>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
                <el-breadcrumb-item>上新</el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-card :body-style="{ 'padding': '0px' }">
            <header slot="header">每周个人上新数</header>
            <div id="line" class="chart"></div>
        </el-card>
        <el-row>
            <el-col :span="8">
                <el-card>
                    <el-button-group>
                        <el-button type="primary" icon="fas fa-plus" @click="add()">&nbsp;新增</el-button>
                    </el-button-group>
                    <el-table border stripe :data="tableData">
                        <el-table-column label="时间" prop="date" sortable></el-table-column>
                        <el-table-column label="店主" prop="userName"></el-table-column>
                        <el-table-column label="上新数" prop="updateNum"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="84px">
                            <template slot-scope="scope">
                                <el-button @click="handleClickUpdate(scope.row)" type="text" size="small">编辑</el-button>
                                <el-button @click="handleClickDel(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            background hide-on-single-page
                            layout="prev, pager, next"
                            @current-change="handleCurrentChange"
                            :page-size="search.pageSize"
                            :current-page.sync="search.pageNo"
                            :total="total">
                    </el-pagination>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card :body-style="{ 'padding': '0px' }">
                    <header slot="header">周上新数量分析</header>
                    <div id="bar-date" class="chart"></div>
                </el-card>
                <el-card :body-style="{ 'padding': '0px' }">
                    <header slot="header">个人上新总数</header>
                    <div id="bar-people" class="chart"></div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
                :title="dialogName"
                :visible.sync="dialogVisible">
            <el-form ref="dialog" :model="dialog" :rules="dialogRules" label-width="100px">
                <el-form-item label="时间" prop="date">
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dialog.date" type="date"></el-date-picker>
                </el-form-item>
                <el-form-item label="上新数" prop="updateNum">
                    <el-input v-model="dialog.updateNum"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="submitForm()">确 定</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "list",
        data() {
            return {
                search: {
                    pageSize:10,
                    pageNo:1,
                },
                total:null,
                tableData: [],
                dialogVisible: false,
                dialogType:'',
                dialogName:'',
                dialog:{
                    date:null,
                    updateNum:null,// 上新数
                },
                dialogRules:{
                    date: { required: true, message: '请选择日期', trigger: 'change' },
                    updateNum:{ required: true, message: '请输入', trigger: 'blur' },// 上新数
                },
                chart:{
                    line:{
                        x:[],
                        y:[],
                    },
                    barDate:{
                        x:[],
                        y:[],
                    },
                    barPeople:{
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
        created(){
            this.searchData();
        },
        mounted(){
            this.getChart();
        },
        methods: {
            //查询
            searchData(){
                this.$ajax.post("/userUpdateNum/page?pageSize="+this.search.pageSize+'&pageNo='+this.search.pageNo,{})
                    .then(res=>{
                        if(res.success==='0000'){
                            this.tableData=res.data.list;
                            this.total=res.data.total;
                        }
                    })
            },
            handleCurrentChange(val) {
                this.search.pageNo=val;
                this.searchData();
            },
            //新增
            add(){
                this.dialogName='新增';
                this.dialogType='add';
                this.dialogVisible=true;
            },
            //修改
            update(){
                this.dialogName='编辑';
                this.dialogType='update';
                this.dialogVisible=true;
            },
            submitForm() {
                this.$refs['dialog'].validate((valid) => {
                    if (valid) {
                        this.$ajax.post('/userUpdateNum/'+this.dialogType,this.dialog)
                            .then(res=>{
                                if(res.success==='0000'){
                                    this.searchData();
                                    this.getChart();
                                    this.$message.success(res.message);
                                    this.dialogVisible=false;
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs['dialog'].resetFields();
            },
            //行操作
            handleClickUpdate(row){
                this.dialog={...row};
                this.update();
            },
            handleClickDel(row){
                this.$ajax.post('/userUpdateNum/del',row)
                    .then(res=>{
                        if(res.success==='0000'){
                            this.searchData();
                            this.getChart();
                            this.$message.success(res.message);
                        }
                    })
            },
            //图表
            getChart(){
                this.$ajax.post("/userUpdateNum/chart")
                    .then(res=>{
                        if(res.success==='0000'){
                            this.chart.line.x=res.data.weekVO.dateList;
                            this.chart.line.y=res.data.weekVO.userNameNumList.map(v=>{
                                return Object.assign({name:v.userName,data:v.num},{type:'line'})
                            });
                            console.log(this.chart.line)
                            this.chart.barDate.x=res.data.listUnWSum.map(v=>{
                                return {value:v.date}
                            });
                            this.chart.barDate.y=res.data.listUnWSum.map(v=>{
                                return {value:v.num}
                            });
                            this.chart.barPeople.x=res.data.listName.map(v=>{
                                return {value:v.name}
                            });
                            this.chart.barPeople.y=res.data.listName.map(v=>{
                                return {value:v.num}
                            });
                        }
                    })
                    .then(()=>{
                        this.drawLine();
                        this.drawBarDate();
                        this.drawBarPeople();
                    })
            },
            drawLine(){
                let chart = this.$echarts.init(document.getElementById('line'));
                let option = {
                    color:this.color,
                    tooltip : {
                        trigger: 'axis',
                    },
                    legend:{},
                    xAxis: {
                        type: 'category',
                        data: this.chart.line.x
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: this.chart.line.y
                };
                chart.setOption(option);
            },
            drawBarDate(){
                let chart = this.$echarts.init(document.getElementById('bar-date'));
                let option = {
                    color:this.color,
                    tooltip : {
                        trigger: 'item',
                    },
                    xAxis: {
                        type: 'category',
                        data: this.chart.barDate.x
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.chart.barDate.y,
                        type: 'bar'
                    }]
                };
                chart.setOption(option);
            },
            drawBarPeople(){
                let chart = this.$echarts.init(document.getElementById('bar-people'));
                let option = {
                    color:this.color,
                    tooltip : {
                        trigger: 'item',
                    },
                    xAxis: {
                        type: 'category',
                        data: this.chart.barPeople.x
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.chart.barPeople.y,
                        type: 'bar'
                    }]
                };
                chart.setOption(option);
            },
        }
    }
</script>

<style lang="scss">
    .up-to-date{
        .chart{
            height: 300px;
            width: 100%;
        }
    }
</style>