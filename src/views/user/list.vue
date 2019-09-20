<template>
    <div class="user">
        <el-card>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
                <el-breadcrumb-item>所有用户</el-breadcrumb-item>
            </el-breadcrumb>
        </el-card>
        <el-card>
<!--            <el-button-group>-->
<!--                <el-button type="primary" icon="fas fa-plus" @click="dialogVisible = true">&nbsp;新增</el-button>-->
<!--            </el-button-group>-->
            <el-table border stripe :data="tableData">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="nickname" label="姓名"></el-table-column>
                <el-table-column prop="operatorScore" label="运营能力"></el-table-column>
                <el-table-column prop="languageScore" label="语言能力"></el-table-column>
                <el-table-column prop="savvyScore" label="理解能力"></el-table-column>
                <el-table-column prop="striveScore" label="工作努力"></el-table-column>
                <el-table-column prop="luckScore" label="运气"></el-table-column>
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
        </el-card>
        <el-dialog
                title="新增子账户"
                :visible.sync="dialogVisible">
            <el-form ref="add" :model="add" :rules="addRules" label-width="52px">
                <el-form-item label="角色" prop="role">
                    <el-select v-model="add.role" placeholder="请选择">
                        <el-option v-for="(i,index) in roleList" :key="index"
                                   :value="i.value" :label="i.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="add.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="add.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="add.phone"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="submitForm('add')">确 定</el-button>
                <el-button @click="resetForm('add')">重置</el-button>
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
                roleList:[
                    {
                        value:'供应商管理',
                        label:'管理',
                    },
                    {
                        value:'供应商销售',
                        label:'销售',
                    },
                    {
                        value:'供应商财务',
                        label:'财务',
                    }
                ],
                add:{
                    email:'',
                    name:'',
                    phone:'',
                    role:'',
                },
                addRules:{
                    email:[
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    name:{ required: true, message: '请输入姓名', trigger: 'blur' },
                    phone:{ required: true, message: '请输入手机', trigger: 'blur' },
                    role:{ required: true, message: '请选择角色', trigger: 'change' },
                }
            }
        },
        created(){
            this.searchData();
        },
        methods: {
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
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$ajax.post('/company/user/add',this.add,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                            .then(res=>{
                                if(res.code===1){
                                    this.searchData();
                                    this.$message.success(res.msg);
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
            //冻结
            handleClick(row){
                this.$ajax.post("/user/updateByStatus",row)
                    .then(res=>{
                        if(res.success==='0000'){
                            this.$message.success(res.message);
                            this.searchData();
                        }
                    })
            }
        }
    }
</script>

<style lang="scss">

</style>