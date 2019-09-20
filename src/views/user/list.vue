<template>
    <div class="user">
        <el-card>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item to="/">主页</el-breadcrumb-item>
                <el-breadcrumb-item>所有用户</el-breadcrumb-item>
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
                <el-form-item prop="operatorScore" label="运营能力">
                    <el-input v-model="dialog.operatorScore"></el-input>
                </el-form-item>
                <el-form-item prop="languageScore" label="语言能力">
                    <el-input v-model="dialog.languageScore"></el-input>
                </el-form-item>
                <el-form-item prop="savvyScore" label="理解能力">
                    <el-input v-model="dialog.savvyScore"></el-input>
                </el-form-item>
                <el-form-item prop="striveScore" label="工作努力">
                    <el-input v-model="dialog.striveScore"></el-input>
                </el-form-item>
                <el-form-item prop="luckScore" label="运气">
                    <el-input v-model="dialog.luckScore"></el-input>
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
                    operatorScore:null,//运营
                    languageScore:null,//语言
                    savvyScore:null,//理解
                    striveScore:null,//努力
                    luckScore:null,//运气
                },
                dialogRules:{
                    operatorScore:{ required: true, message: '请输入', trigger: 'blur' },//运营
                    languageScore:{ required: true, message: '请输入', trigger: 'blur' },//语言
                    savvyScore:{ required: true, message: '请输入', trigger: 'blur' },//理解
                    striveScore:{ required: true, message: '请输入', trigger: 'blur' },//努力
                    luckScore:{ required: true, message: '请输入', trigger: 'blur' },//运气
                },
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
                        let url = this.dialogType==='update'? '/userScore/edit':'/user/sign';
                        this.$ajax.post(url,this.dialog)
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
                        }
                    })
            },
            handleClickScore(row){
                this.dialog={...row};
                this.update();
            }
        }
    }
</script>

<style lang="scss">

</style>