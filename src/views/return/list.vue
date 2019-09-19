<template>
    <div class="user">
        <el-card>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
                <el-breadcrumb-item>退货单</el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-card>
            <el-button-group>
                <el-button type="primary" icon="fas fa-plus" @click="add()">&nbsp;新增</el-button>
            </el-button-group>
            <div class="info">
                <el-alert :closable="false">平均物流耗时（天）：{{chart.transportation}}</el-alert>
                <el-alert :closable="false">用户平均使用时间（天）：{{chart.use}}</el-alert>
            </div>
            <el-table border stripe :data="tableData">
                <el-table-column label="店铺-品牌" prop="shopBrand"></el-table-column>
                <el-table-column label="问题类别" prop="issueType"></el-table-column>
                <el-table-column label="产品型号" prop="productSku" width="200px"></el-table-column>
                <el-table-column label="客户描述内容" prop="details" width="300px"></el-table-column>
                <el-table-column label="下单购买时间" prop="buyDate"></el-table-column>
                <el-table-column label="收货时间" prop="receiveDate"></el-table-column>
                <el-table-column label="退货要求发起时间" prop="returnDate"></el-table-column>
                <el-table-column label="物流实际耗费时间" prop="transportationDate"></el-table-column>
                <el-table-column label="用户使用时间" prop="useDate"></el-table-column>
                <el-table-column label="创建人" prop="userName"></el-table-column>
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
                <el-form-item label="店铺-品牌" prop="shopBrand">
                    <el-select v-model="dialog.shopBrand" placeholder="请选择">
                        <el-option v-for="(i,index) in shopBrandList" :key="index"
                                   :value="i.k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题类别" prop="issueType">
                    <el-select v-model="dialog.issueType" placeholder="请选择">
                        <el-option v-for="(i,index) in issueTypeList" :key="index"
                                   :value="i.k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品型号" prop="productSku">
                    <el-input v-model="dialog.productSku"></el-input>
                </el-form-item>
                <el-form-item label="客户描述内容" prop="details">
                    <el-input type="textarea" v-model="dialog.details"></el-input>
                </el-form-item>
                <el-form-item label="下单购买时间" prop="buyDate">
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dialog.buyDate" type="date"></el-date-picker>
                </el-form-item>
                <el-form-item label="收货时间" prop="receiveDate">
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dialog.receiveDate" type="date"></el-date-picker>
                </el-form-item>
                <el-form-item label="退货要求发起时间" prop="returnDate">
                    <el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dialog.returnDate" type="date"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="submitForm()">确 定</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </div>
        </el-dialog>
        <el-row>
            <el-col :span="6">
                <el-card :body-style="{ 'padding': '0px' }">
                    <header slot="header">品牌类别统计</header>
                    <div id="pie-brand" class="chart"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card :body-style="{ 'padding': '0px' }">
                    <header slot="header">问题数（例）与下单月份</header>
                    <div id="line" class="chart"></div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card :body-style="{ 'padding': '0px' }">
                    <header slot="header">问题类别统计</header>
                    <div id="pie-issue" class="chart"></div>
                </el-card>
            </el-col>
        </el-row>
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
                shopBrandList:[],
                issueTypeList:[],
                dialog:{
                    shopBrand:null,//店铺-品牌
                    issueType:null,//问题类别
                    productSku:null,//产品型号
                    details:null,//问题描述
                    buyDate:null,//下单时间
                    receiveDate:null,//收货时间
                    returnDate:null,//退货发起时间
                },
                dialogRules:{
                    shopBrand:{ required: true, message: '请选择', trigger: 'change' },//店铺-品牌
                    issueType:{ required: true, message: '请选择', trigger: 'change' },//问题类别
                    productSku:{ required: true, message: '请输入', trigger: 'blur' },//产品型号
                    details:{ required: true, message: '请输入', trigger: 'blur' },//问题描述
                    buyDate:{ required: true, message: '请选择', trigger: 'change' },//下单时间
                    receiveDate:{ required: true, message: '请选择', trigger: 'change' },//收货时间
                    returnDate:{ required: true, message: '请选择', trigger: 'change' },//退货发起时间
                },
                chart:{
                    transportation:null, // 平均物流
                    use:null,// 平均用户使用
                    shopBrandList:[],// 品牌错误
                    shopMList:[], // 月份 问题
                    shopMListX:[],
                    shopIssueList:[], // 问题错误
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
                this.$ajax.post("/select/shop_typeSelect")
                    .then(res=>{
                        if(res.success==='0000') this.shopBrandList=res.data;
                    })
                    .then(()=>{
                        this.$ajax.post("/select/shop_issueSelect")
                            .then(res=>{
                                if(res.success==='0000') this.issueTypeList=res.data;
                            });
                    })
            },
            //查询
            searchData(){
                this.$ajax.post("/shopIssue/page?pageSize="+this.search.pageSize+'&pageNo='+this.search.pageNo,{})
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
                        this.$ajax.post('/shopIssue/'+this.dialogType,this.dialog)
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
                this.$ajax.post('/shopIssue/del',row)
                    .then(res=>{
                        if(res.success==='0000'){
                            this.searchData();
                            this.$message.success(res.message);
                        }
                    })
            },
            //图表
            getChart(){
                this.$ajax.post("/shopIssue/chart")
                    .then(res=>{
                        if(res.success==='0000'){
                            this.chart=JSON.parse(JSON.stringify(res.data));
                            this.chart.shopBrandList=res.data.shopBrandList.map(v=>{
                                return {name:v.type, value:v.count}
                            });
                            this.chart.shopMList=res.data.shopMList.map(v=>{
                                return {name:v.type, value:v.count}
                            });
                            this.chart.shopMListX=res.data.shopMList.map(v=>{
                                return {value:v.type}
                            });
                            this.chart.shopIssueList=res.data.shopIssueList.map(v=>{
                                return {name:v.type, value:v.count}
                            });
                        }
                    })
                    .then(()=>{
                        this.drawBrand();
                        this.drawLine();
                        this.drawIssue();
                    })
            },
            drawBrand(){
                let chart = this.$echarts.init(document.getElementById('pie-brand'));
                let option = {
                    color:this.color,
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        top:'10',
                        left: '10',
                    },
                    series : [
                        {
                            name: '品牌问题统计',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:this.chart.shopBrandList,
                        }
                    ]
                };
                chart.setOption(option);
            },
            drawLine(){
                let chart = this.$echarts.init(document.getElementById('line'));
                let option = {
                    color:this.color,
                    tooltip : {
                        trigger: 'item',
                    },
                    xAxis: {
                        type: 'category',
                        data: this.chart.shopMListX
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.chart.shopMList,
                        type: 'line'
                    }]
                };
                chart.setOption(option);
            },
            drawIssue(){
                let chart = this.$echarts.init(document.getElementById('pie-issue'));
                let option = {
                    color:this.color,
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        top:'10',
                        left: '10',
                    },
                    series : [
                        {
                            name: '问题类别统计',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:this.chart.shopIssueList,
                        }
                    ]
                };
                chart.setOption(option);
            }
        }
    }
</script>

<style lang="scss">
    .user{
        .chart{
            height: 300px;
            width: 100%;
        }
        .info{
            @include flex(space-around);
            margin: 15px 0;
            .el-alert{
                flex: 0 0 40%;
            }
        }
    }
</style>