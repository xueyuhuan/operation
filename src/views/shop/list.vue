<template>
    <div class="user">
        <el-card>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
                <el-breadcrumb-item>店铺</el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-card>
            <el-button-group>
                <el-button type="primary" icon="fas fa-plus" @click="add()">&nbsp;新增</el-button>
            </el-button-group>
            <el-table border stripe :data="tableData">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="terrace" label="平台"></el-table-column>
                <el-table-column prop="state" label="账户国度"></el-table-column>
                <el-table-column prop="userName" label="店主"></el-table-column>
                <el-table-column prop="shopName" label="店铺ID"></el-table-column>
                <el-table-column prop="status" label="账号状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status==='账户申请中'">{{scope.row.status}}</el-tag>
                        <el-tag v-else-if="scope.row.status==='冻结'" type="info">{{scope.row.status}}</el-tag>
                        <el-tag v-else-if="scope.row.status==='异常限额'" type="warning">{{scope.row.status}}</el-tag>
                        <el-tag v-else-if="scope.row.status==='账号安全异常'" type="danger">{{scope.row.status}}</el-tag>
                        <el-tag v-else type="success">{{scope.row.status}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sendStatus" label="发货表现">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.sendStatus==='警告'" type="warning">{{scope.row.sendStatus}}</el-tag>
                        <el-tag v-else-if="scope.row.sendStatus==='严重'" type="danger">{{scope.row.sendStatus}}</el-tag>
                        <el-tag v-else type="success">{{scope.row.sendStatus}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="elseSendStatus" label="非货运表现">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.elseSendStatus==='警告'" type="warning">{{scope.row.elseSendStatus}}</el-tag>
                        <el-tag v-else-if="scope.row.elseSendStatus==='严重'" type="danger">{{scope.row.elseSendStatus}}</el-tag>
                        <el-tag v-else type="success">{{scope.row.elseSendStatus}}</el-tag>
                    </template>
                </el-table-column>
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
            <el-form ref="dialog" :model="dialog" :rules="dialogRules" label-width="102px">
                <el-form-item label="平台" prop="terrace">
                    <el-select v-model="dialog.terrace" placeholder="请选择">
                        <el-option v-for="(i,index) in terraceList" :key="index"
                                   :value="i.k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="国家" prop="state">
                    <el-select v-model="dialog.state" placeholder="请选择">
                        <el-option v-for="(i,index) in stateList" :key="index"
                                   :value="i.k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="店铺名称" prop="shopName">
                    <el-input v-model="dialog.shopName"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="dialog.status" placeholder="请选择">
                        <el-option v-for="(i,index) in statusList" :key="index"
                                   :value="i.k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货状态" prop="sendStatus">
                    <el-select v-model="dialog.sendStatus" placeholder="请选择">
                        <el-option v-for="(i,index) in sendStatusList" :key="index"
                                   :value="i.k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="非发货状态" prop="elseSendStatus">
                    <el-select v-model="dialog.elseSendStatus" placeholder="请选择">
                        <el-option v-for="(i,index) in sendStatusList" :key="index"
                                   :value="i.k"></el-option>
                    </el-select>
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
                terraceList:[],
                stateList:[],
                statusList:[],
                sendStatusList:[],
                dialog:{
                    terrace:null,//平台
                    state:null,//国家
                    shopName:null,//店铺名
                    status:null,//店铺状态
                    sendStatus:null,//发货状态
                    elseSendStatus:null//非发货状态
                },
                dialogRules:{
                    terrace:{ required: true, message: '请选择', trigger: 'change' },//平台
                    state:{ required: true, message: '请选择', trigger: 'change' },//国家
                    shopName:{ required: true, message: '请输入', trigger: 'blur' },//店铺名
                    status:{ required: true, message: '请选择', trigger: 'change' },//店铺状态
                    sendStatus:{ required: true, message: '请选择', trigger: 'change' },//发货状态
                    elseSendStatus:{ required: true, message: '请选择', trigger: 'change' },//非发货状态
                }
            }
        },
        created(){
            this.searchData();
            this.getList();
        },
        methods: {
            getList(){
                this.$ajax.post("/select/terraceSelect")
                    .then(res=>{
                        if(res.success==='0000') this.terraceList=res.data;
                    })
                    .then(()=>{
                        this.$ajax.post("/select/stateSelect")
                            .then(res=>{
                                if(res.success==='0000') this.stateList=res.data;
                            });
                    })
                    .then(()=>{
                        this.$ajax.post("/select/shop_statusSelect")
                            .then(res=>{
                                if(res.success==='0000') this.statusList=res.data;
                            });
                    })
                    .then(()=>{
                        this.$ajax.post("/select/send_elss_StatusSelect")
                            .then(res=>{
                                if(res.success==='0000') this.sendStatusList=res.data;
                            });
                    })
            },
            //查询
            searchData(){
                this.$ajax.post("/shop/page?pageSize="+this.search.pageSize+'&pageNo='+this.search.pageNo,{})
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
                        this.$ajax.post('/shop/'+this.dialogType,this.dialog)
                            .then(res=>{
                                if(res.success==='0000'){
                                    this.searchData();
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
                this.$ajax.post('/shop/del',row)
                    .then(res=>{
                        if(res.success==='0000'){
                            this.searchData();
                            this.$message.success(res.message);
                        }
                    })
            }
        }
    }
</script>

<style lang="scss">

</style>