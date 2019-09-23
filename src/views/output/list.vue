<template>
    <div class="output">
        <el-card>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
                <el-breadcrumb-item>产出比</el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-card :body-style="{ 'padding': '0px' }">
            <header slot="header">运营产出比</header>
            <div id="bar" class="chart"></div>
        </el-card>
        <el-card>
            <el-form inline :model="search" size="mini">
                <el-form-item label="用户名">
                    <el-select v-model="search.userName" clearable placeholder="用户名" @change="searchData()">
                        <el-option v-for="i in userList" :key="i.k" :value="i.y"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="searchData()">查询</el-button>
                </el-form-item>
            </el-form>
            <el-button-group>
                <el-button type="primary" icon="fas fa-plus" @click="add()">&nbsp;新增</el-button>
            </el-button-group>
            <el-table border stripe :data="tableData">
                <el-table-column label="店主" prop="userName"></el-table-column>
                <el-table-column label="时间" prop="date" sortable></el-table-column>
                <el-table-column label="产出比" prop="outputScore"></el-table-column>
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
        <el-dialog
                :title="dialogName"
                :visible.sync="dialogVisible">
            <el-form ref="dialog" :model="dialog" :rules="dialogRules" label-width="135px">
                <el-form-item label="店主" prop="userName">
                    <el-input v-model="dialog.userName"></el-input>
                </el-form-item>
                <el-form-item label="时间" prop="date">
                    <el-date-picker v-model="dialog.date" type="month"
                                    format="yyyy-MM" value-format="yyyy-MM"
                                    placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="产出比" prop="outputScore">
                    <el-input v-model="dialog.outputScore"></el-input>
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
        name: "output",
        data() {
            return {
                userList:[],
                search: {
                    userName:null,
                    pageSize:10,
                    pageNo:1,
                },
                total:null,
                tableData: [],
                dialogVisible: false,
                dialogType:'',
                dialogName:'',
                dialog:{
                    date:'',//年月
                    outputScore:'',//产出比
                    userName:null,// 人员
                },
                dialogRules:{
                    date:{ required: true, message: '请选择', trigger: 'change' },//年月
                    outputScore:{ required: true, message: '请输入', trigger: 'blur' },//产出比
                    userName:{ required: true, message: '请输入', trigger: 'blur' },// 人员
                },
                chart:{
                    x:[],
                    y:[],
                }
            }
        },
        computed:{
            color(){
                return this.$store.state.color;
            }
        },
        created(){
            this.getList();
            this.searchData();
        },
        mounted(){
            // this.getChart();
        },
        methods: {
            getList(){
                this.$ajax.post("/select/user_Select")
                    .then(res=>{
                        if(res.success==='0000') this.userList=res.data;
                    })
            },
            //查询
            searchData(){
                this.$ajax.post("/output/page?pageSize="+this.search.pageSize+'&pageNo='+this.search.pageNo,this.search)
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
                        this.$ajax.post('/output/'+this.dialogType,this.dialog)
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
                this.$ajax.post('/output/del',row)
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
                this.$ajax.post("/output/chart")
                    .then(res=>{
                        if(res.success==='0000'){
                            this.chart.x=res.data.listUserOutput.map(v=>{
                                return {value:v.userName}
                            });
                            this.chart.y=res.data.listUserOutput.map(v=>{
                                return Object.assign({value:v.outputList,name:v.userName},{type:'line'})
                            });
                            console.log(this.chart)
                        }
                    })
                    .then(()=>{
                        this.drawBar();
                    })
            },
            drawBar(){
                let chart = this.$echarts.init(document.getElementById('bar'));
                let option = {
                    color:this.color,
                    tooltip : {
                        trigger: 'item',

                    },
                    xAxis: {
                        type: 'category',
                        data: this.chart.x
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: this.chart.y
                };
                chart.setOption(option);
            },
        }
    }
</script>

<style lang="scss">
    .output{
        .chart{
            height: 300px;
            width: 100%;
        }
    }
</style>