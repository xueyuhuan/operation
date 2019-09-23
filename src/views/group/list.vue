<template>
    <div class="group">
        <el-card>
            <div class="flex">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
                    <el-breadcrumb-item>小组</el-breadcrumb-item>
                </el-breadcrumb>
                <span>
                    <el-button type="primary" round size="medium" icon="el-icon-trophy-1">当月销量冠军小组：{{this.sum.groupName}}，${{this.sum.money}}</el-button>
                </span>
            </div>
        </el-card>
        <el-card :body-style="{ 'padding': '0px' }">
            <header slot="header">各组别累计销量（单位：＄）</header>
            <div id="bar" class="chart"></div>
        </el-card>
        <el-card>
            <el-tabs v-model="activeName">
                <el-tab-pane label="小组月份销量" name="1">
                    <el-radio-group v-model="tableMonth.group" @change="searchDataMonth()">
                        <el-radio-button v-for="i in tableMonth.groupList" :label="i.k" :key="i.k">{{i.y}}</el-radio-button>
                    </el-radio-group>
                    <el-table border :data="tableMonth.table" height="250">
                        <el-table-column prop="date" label="时间"></el-table-column>
                        <el-table-column prop="money" label="销量">
                            <template slot-scope="scope">
                                ${{scope.row.money}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="小组月冠军" name="2">
                    <el-table border :data="tableChampion.table">
                        <el-table-column prop="date" label="时间"></el-table-column>
                        <el-table-column prop="name" label="小组"></el-table-column>
                        <el-table-column prop="money" label="销量">
                            <template slot-scope="scope">
                                ${{scope.row.money}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            background hide-on-single-page
                            layout="prev, pager, next"
                            @current-change="handleCurrentChangeChampion"
                            :page-size="tableChampion.search.pageSize"
                            :current-page.sync="tableChampion.search.pageNo"
                            :total="tableChampion.total">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="小组管理" name="3">
                    <el-button-group>
                        <el-button type="primary" icon="fas fa-plus" @click="add()">&nbsp;新增</el-button>
                    </el-button-group>
                    <el-table border :data="tableData" :span-method="objectSpanMethod">
                        <el-table-column prop="name" label="小组"></el-table-column>
                        <el-table-column prop="userName" label="组员"></el-table-column>
                        <el-table-column prop="statusSign" label="状态">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.status==='0'?'success':'danger'">{{scope.row.statusSign}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.status==='0'?'冻结':'激活'}}</el-button>
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
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog
                :title="dialogName"
                :visible.sync="dialogVisible">
            <el-form ref="dialog" :model="dialog" :rules="dialogRules" label-width="100px">
                <el-form-item prop="groupName" label="组名">
                    <el-input v-model="dialog.groupName"></el-input>
                </el-form-item>
                <el-form-item prop="userIdList" label="选择组员">
                    <el-checkbox-group v-model="dialog.userIdList">
                        <el-checkbox v-for="i in userList" :value="i.k" :label="i.k" :key="i.k">{{i.y}}</el-checkbox>
                    </el-checkbox-group>
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
        name: "group",
        data() {
            return {
                sum:null,
                tableMonth:{
                    groupList:[],
                    group:"1",
                    table:[],//小组月份销量表格
                },
                tableChampion:{
                    search: {
                        pageSize:10,
                        pageNo:1,
                    },
                    total:null,
                    table:[],//小组月冠军表格
                },
                search: {
                    pageSize:10,
                    pageNo:1,
                },
                total:null,
                tableData: [],
                tableDataSpan:[],
                pos:null,
                dialogVisible: false,
                dialogType:'',
                dialogName:'',
                userList:[],
                dialog:{
                    groupName:null,
                    userIdList:[],
                },
                dialogRules:{
                    groupName:{ required: true, message: '请输入', trigger: 'blur' },
                    userIdList: { type: 'array', required: true, message: '请至少选择一个组员', trigger: 'change' },
                },
                chart:{
                    x:[],
                    y:[],
                },
                activeName:'1'
            }
        },
        computed:{
            color(){
                return this.$store.state.color;
            }
        },
        created(){
            this.$ajax.post('/group/presentDateGroupChampion')
                .then(res=>{
                    if(res.success==='0000') this.sum=res.data;
                });
            this.searchDataMonth();
            this.searchDataChampion();
            this.searchData();
            this.getList();
            this.getListGroup();
        },
        mounted(){
            this.getChart();
        },
        methods: {
            getList(){
                this.$ajax.post("/select/user_Select")
                    .then(res=>{
                        if(res.success==='0000') this.userList=res.data;
                    })
            },
            getListGroup(){
                this.$ajax.post("/select/group_Select")
                    .then(res=>{
                        if(res.success==='0000') this.tableMonth.groupList=res.data;
                    });
            },
            //查询
            searchDataMonth(){
                this.$ajax.post('/group/groupDateMoney?groupId='+this.tableMonth.group)
                    .then(res=>{
                        if(res.success==='0000') this.tableMonth.table=res.data;
                    })
            },
            searchDataChampion(){
                this.$ajax.post("/group/pageGroupMonthMoney?pageSize="+this.tableChampion.search.pageSize+'&pageNo='+this.tableChampion.search.pageNo)
                    .then(res=>{
                        if(res.success==='0000'){
                            this.tableChampion.table=res.data.list;
                            this.tableChampion.total=res.data.total;
                        }
                    })
            },
            handleCurrentChangeChampion(val){
                this.tableChampion.search.pageNo=val;
                this.searchDataChampion();
            },
            searchData(){
                this.$ajax.post("/group/page?pageSize="+this.search.pageSize+'&pageNo='+this.search.pageNo,{})
                    .then(res=>{
                        if(res.success==='0000'){
                            this.tableData=res.data.list;
                            this.tableDataSpan=[];
                            this.pos=null;
                            for(let i=0,l=this.tableData.length;i<l;i++){
                                if(i===0){
                                    this.tableDataSpan.push(1);
                                    this.pos=0
                                }
                                else{
                                    if(this.tableData[i].name===this.tableData[i-1].name){
                                        this.tableDataSpan[this.pos]+=1;
                                        this.tableDataSpan.push(0);
                                    }
                                    else{
                                        this.tableDataSpan.push(1);
                                        this.pos=i;
                                    }
                                }
                            }
                            this.total=res.data.total;
                        }
                    })
            },
            objectSpanMethod({ rowIndex, columnIndex }) {
                if (columnIndex === 0||columnIndex === 3) {
                    let _row = this.tableDataSpan[rowIndex];
                    let _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
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
                this.dialogName='评分';
                this.dialogType='update';
                this.dialogVisible=true;
            },
            submitForm() {
                this.$refs['dialog'].validate((valid) => {
                    if (valid) {
                        let url = this.dialogType==='update'? '/group/updateByStatus':'/group/edit';
                        this.$ajax.post(url,this.dialog)
                            .then(res=>{
                                if(res.success==='0000'){
                                    this.searchData();
                                    this.getListGroup();
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //行操作
            //冻结
            handleClick(row){
                this.$ajax.post("/group/updateByStatus?groupId="+row.id)
                    .then(res=>{
                        if(res.success==='0000'){
                            this.$message.success(res.message);
                            this.searchData();
                            this.getListGroup();
                        }
                    })
            },
            handleClickScore(row){
                this.dialog={...row};
                this.update();
            },
            //图表
            getChart(){
                this.$ajax.post("/group/groupSumMoney")
                    .then(res=>{
                        if(res.success==='0000'){
                            this.chart.x=res.data.map(v=>{
                                return {value:v.groupName}
                            });
                            this.chart.y=res.data.map(v=>{
                                return {value:v.money}
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
    .group{
        .flex{
            @include flex(space-between)
        }
        .chart{
            height: 300px;
            width: 100%;
        }
        .el-radio-group{
            margin-bottom: 10px;
        }
    }
</style>