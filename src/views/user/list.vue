<template>
    <div class="user">
        <el-card>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
                <el-breadcrumb-item>用户</el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-card>
            <el-button-group>
                <el-button type="primary" icon="fas fa-plus" @click="add()">&nbsp;新增</el-button>
            </el-button-group>
            <el-table border stripe :data="tableData">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="nickname" label="姓名"></el-table-column>
                <el-table-column prop="operatorScore" label="运营能力"></el-table-column>
                <el-table-column prop="languageScore" label="语言能力"></el-table-column>
                <el-table-column prop="savvyScore" label="理解能力"></el-table-column>
                <el-table-column prop="striveScore" label="工作努力"></el-table-column>
                <el-table-column prop="luckScore" label="运气"></el-table-column>
                <el-table-column prop="sumScore" label="总分"></el-table-column>
                <el-table-column prop="statusSign" label="状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status==='0'?'success':'danger'">{{scope.row.statusSign}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.status==='0'?'冻结':'激活'}}</el-button>
                        <el-button @click="handleClickScore(scope.row)" type="text" size="small">评分</el-button>
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
                <template v-if="dialogType==='add'">
                    <el-form-item label="角色" prop="roleId">
                        <el-select v-model="dialog.roleId" placeholder="请选择">
                            <el-option v-for="(i,index) in roleList" :key="index"
                                       :value="i.k" :label="i.y"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账号" prop="name">
                        <el-input v-model="dialog.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="nickname">
                        <el-input v-model="dialog.nickname"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item prop="operatorScore" label="运营能力">
                        <el-input-number v-model="dialog.operatorScore" :min="0" :max="5"></el-input-number>
                    </el-form-item>
                    <el-form-item prop="languageScore" label="语言能力">
                        <el-input-number v-model="dialog.languageScore" :min="0" :max="5"></el-input-number>
                    </el-form-item>
                    <el-form-item prop="savvyScore" label="理解能力">
                        <el-input-number v-model="dialog.savvyScore" :min="0" :max="5"></el-input-number>
                    </el-form-item>
                    <el-form-item prop="striveScore" label="工作努力">
                        <el-input-number v-model="dialog.striveScore" :min="0" :max="5"></el-input-number>
                    </el-form-item>
                    <el-form-item prop="luckScore" label="运气">
                        <el-input-number v-model="dialog.luckScore" :min="0" :max="5"></el-input-number>
                    </el-form-item>
                </template>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="submitForm()">确 定</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </div>
        </el-dialog>
        <el-card :body-style="{ 'padding': '0px' }">
            <header slot="header">综合能力、努力和运气</header>
            <div id="radar" class="chart"></div>
        </el-card>
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
                roleList:[],
                dialog:{
                    roleId:null,//角色
                    name:null,//账户
                    nickname:null,//用户名
                    operatorScore:null,//运营
                    languageScore:null,//语言
                    savvyScore:null,//理解
                    striveScore:null,//努力
                    luckScore:null,//运气
                },
                dialogRules:{
                    roleId:{ required: true, message: '请选择', trigger: 'change' },//角色
                    name:{ required: true, message: '请输入', trigger: 'blur' },//账户
                    nickname:{ required: true, message: '请输入', trigger: 'blur' },//用户名
                    operatorScore:{ required: true, message: '请输入', trigger: 'blur' },//运营
                    languageScore:{ required: true, message: '请输入', trigger: 'blur' },//语言
                    savvyScore:{ required: true, message: '请输入', trigger: 'blur' },//理解
                    striveScore:{ required: true, message: '请输入', trigger: 'blur' },//努力
                    luckScore:{ required: true, message: '请输入', trigger: 'blur' },//运气
                },
                chart:{}
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
                this.$ajax.post("/select/role_Select")
                    .then(res=>{
                        if(res.success==='0000') this.roleList=res.data;
                    })
            },
            //查询
            searchData(){
                this.$ajax.post("/user/page",this.search,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
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
                Object.keys(this.dialog).forEach(key=>this.dialog[key]='');
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
                        let url = this.dialogType==='update'? '/userScore/edit':'/user/sign';
                        this.$ajax.post(url,this.dialog)
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //行操作
            //冻结
            handleClick(row){
                this.$ajax.post("/user/updateByStatus",row)
                    .then(res=>{
                        if(res.success==='0000'){
                            this.$message.success(res.message);
                            this.searchData();
                            this.getChart();
                        }
                    })
            },
            handleClickScore(row){
                this.dialog={...row};
                this.update();
            },
            //图表
            getChart(){
                this.$ajax.post("/userScore/chart")
                    .then(res=>{
                        if(res.success==='0000'){
                            this.chart.x=res.data.listScoreName.map(v=>{
                                return {name:v.name,max:v.maxScore}
                            });
                            this.chart.y=res.data.listUserNameScore.map(v=>{
                                return {name:v.name,value:v.listScore}
                            });
                        }
                    })
                    .then(()=>{
                        this.drawRadar();
                    })
            },
            drawRadar(){
                let chart = this.$echarts.init(document.getElementById('radar'));
                let option = {
                    color:this.color,
                    tooltip: {},
                    legend:{
                        top:'20',
                        left:'50',
                        orient:'vertical'
                    },
                    radar: {
                        shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#666',
                            }
                        },
                        indicator: this.chart.x
                    },
                    series: [{
                        type: 'radar',
                        areaStyle:{
                            opacity:0.2
                        },
                        data : this.chart.y
                    }]
                };
                chart.setOption(option);
            },
        }
    }
</script>

<style lang="scss">
    .user{
        .chart{
            height: 300px;
            width: 100%;
        }
    }
</style>