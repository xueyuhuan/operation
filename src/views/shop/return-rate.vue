<template>
    <div class="rate">
        <el-card>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
                <el-breadcrumb-item>店铺退货率</el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-card :body-style="{ 'padding': '0px' }">
            <header slot="header">2019年每周总退货率</header>
            <div id="bar" class="chart"></div>
        </el-card>
        <el-card>
            <el-button-group>
                <el-button type="primary" icon="fas fa-plus" @click="add()">&nbsp;新增</el-button>
            </el-button-group>
            <el-table border stripe :data="tableData">
                <el-table-column label="平台" prop="terrace"></el-table-column>
                <el-table-column label="负责人" prop="userName"></el-table-column>
                <el-table-column label="店铺ID" prop="shopName"></el-table-column>
                <el-table-column label="时间" prop="date"></el-table-column>
                <el-table-column label="退货率" prop="returnRate"></el-table-column>
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
                <el-form-item label="店铺" prop="shopId">
                    <el-select v-model="dialog.shopId" placeholder="请选择">
                        <el-option v-for="(i,index) in shopList" :key="index"
                                   :value="i.k" :label="i.y"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="退货率" prop="returnRate">
                    <el-input v-model="dialog.returnRate" placeholder="0.00%"></el-input>
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
                shopList:[],
                dialog:{
                    shopId:null,//店铺
                    returnRate:null,// 退货率
                },
                dialogRules:{
                    shopId:{ required: true, message: '请选择', trigger: 'change' },//店铺
                    returnRate:{ required: true, message: '请输入', trigger: 'blur' },// 退货率
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
            this.searchData();
            this.getList();
        },
        mounted(){
            this.getChart();
        },
        methods: {
            getList(){
                this.$ajax.post("/select/my_shop_Select")
                    .then(res=>{
                        if(res.success==='0000') this.shopList=res.data;
                    })
            },
            //查询
            searchData(){
                this.$ajax.post("/shopReturnRate/page?pageSize="+this.search.pageSize+'&pageNo='+this.search.pageNo,{})
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
                        this.$ajax.post('/shopReturnRate/'+this.dialogType,this.dialog)
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
                this.$ajax.post('/shopReturnRate/del',row)
                    .then(res=>{
                        if(res.success==='0000'){
                            this.searchData();
                            this.$message.success(res.message);
                        }
                    })
            },
            //图表
            getChart(){
                this.$ajax.post("/shopReturnRate/chart")
                    .then(res=>{
                        if(res.success==='0000'){
                            this.chart.x=res.data.map(v=>{
                                return {value:v.date}
                            });
                            this.chart.y=res.data.map(v=>{
                                return {value:v.dateReturnRate}
                            });
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
                    series: [{
                        data: this.chart.y,
                        type: 'bar'
                    }]
                };
                chart.setOption(option);
            },
        }
    }
</script>

<style lang="scss">
    .rate{
        .chart{
            height: 300px;
            width: 100%;
        }
    }
</style>