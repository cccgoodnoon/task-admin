<template>
    <el-container>
        <!-- <el-header style="text-align: right; font-size: 12px">
            <el-dropdown>
                <i class="el-icon-setting" style="margin-right: 15px"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>查看</el-dropdown-item>
                    <el-dropdown-item>新增</el-dropdown-item>
                    <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <span>王小虎</span>
        </el-header> -->

        <el-main>
            <div id="Activities"> 
                <h1>TODO</h1>
                <el-row class="line-display">
                    <el-col :span="22" :offset="1">
                        <div class="grid-content" style="margin-top:0px; border:0">
                            <!-- 操作 -->
                            <ul class="btn-edit fr">
                                <li >
                                    <el-button type="primary" @click="dialogCreateVisible = true"> <i class="el-icon-plus iconss" ></i>新增任务</el-button>
                                    <el-button type="danger" icon="delete" :disabled="selected.length==0" @click="removeActivities()"  >删除</el-button>
                                </li>
                            </ul>

                            <!-- 用户列表-->
                            <el-col :span="24" style="height:20px;"></el-col>
                            <el-table :data="Activities"                            
                                    height="600"
                                    @selection-change="tableSelectionChange" >
                                <el-table-column type="selection"
                                                width="100">
                                </el-table-column>
                                <el-table-column prop="uuid"
                                                label="人员"
                                                width="120">
                                </el-table-column>
                                <el-table-column prop="employeeid"
                                                label="工号"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="name"
                                                label="姓名"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="title"
                                                label="职称"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="courseuuid"
                                                label="课程标识"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="courseid"
                                                label="课号"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="employeeid"
                                                label="工号"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="coursename"
                                                label="课程"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="credit"
                                                label="学分"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="begintime"
                                                label="开始日期"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="endtime"
                                                label="结束日期"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="workday"
                                                label="投入天数"
                                                width="280">
                                </el-table-column>
                                <el-table-column prop="workpoint"
                                                label="工作量(点数)"
                                                width="280">
                                </el-table-column>
                                <!-- <el-table-column prop="performer"
                                                label="负责人"
                                                width="178">
                                </el-table-column>                        
                                <el-table-column prop="endtime"
                                                label="截止日期"
                                                width="240">
                                </el-table-column>                       
                                <el-table-column prop="state"
                                                label="完成状态"
                                                width="160">
                                                <!-- <template slot-scope="scope">
                                                    <el-tag
                                                    :type="scope.row.state === '家' ? 'primary' : 'success'"
                                                    disable-transitions>{{scope.row.stete}}</el-tag>
                                                </template> -->
                                <!-- </el-table-column> --> 
                                <el-table-column
                                    inline-template
                                    label="操作"
                                    width="210">
                                    <span>
                                        <el-button type="danger" size="small" @click="removeActivity(row)">删除</el-button>
                                        <el-button type="success" size="small" @click="setCurrent(row)">编辑</el-button>
                                    </span>
                                </el-table-column>
                            </el-table>
                            <div style="width:100%; ovflow:hidden; height:180px;"></div>
                        </div>
                    </el-col>
                </el-row>

                <!-- 新建Activity begin-->
                <el-dialog title="新建Activity" v-model="dialogCreateVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset" >
                    <el-form id="#create" :model="create" :rules="rules" ref="create" label-width="100px">
                        <el-form-item label="负责人" prop="performer">
                            <el-input v-model="create.performer"></el-input>
                        </el-form-item>
                        <el-form-item label="Activity说明" prop="title">
                            <el-input v-model="create.title"></el-input>
                        </el-form-item>
                        <el-form-item label="Activity详情" prop="description">
                            <el-input type="textarea" v-model="create.description"></el-input>
                        </el-form-item>
                        <el-form-item label="开始日期">
                            <el-date-picker v-model="create.begintime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="截止日期">
                            <el-date-picker v-model="create.endtime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <!-- <el-form-item label="完成">
                            <el-switch on-text="" off-text="" v-model="create.state"></el-switch>
                        </el-form-item> -->
                        <el-form-item label="是否完成" prop="state">
                            <el-select v-model="create.state" placeholder="请选择完成情况">
                                <el-option label="未完成" value="未完成"></el-option>
                                <el-option label="已完成" value="已完成"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogCreateVisible = false">取 消</el-button>
                        <el-button type="primary" :loading="createLoading" @click="createActivity">确 定</el-button>
                    </div>
                </el-dialog>
                <!-- 修改用户 begin-->
                <el-dialog title="修改授课信息" v-model="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
                    <el-form id="#update" :model="update" :rules="updateRules" ref="update" label-width="100px">
                        <!-- <el-form-item label="任务ID" prop="id">
                            <el-input v-model="update.id"></el-input>
                        </el-form-item> -->
                        <el-form-item label="负责人" prop="performer">
                            <el-input v-model="update.performer"></el-input>
                        </el-form-item>
                        <el-form-item label="任务说明" prop="title">
                            <el-input v-model="update.title"></el-input>
                        </el-form-item>
                        <el-form-item label="任务详情" prop="description">
                            <el-input type="textarea" v-model="update.description"></el-input>
                        </el-form-item>
                        <el-form-item label="开始日期">
                            <el-date-picker v-model="update.begintime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="截止日期">
                            <el-date-picker v-model="update.endtime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <!-- <el-form-item label="是否完成">
                            <el-switch on-text="" off-text="" v-model="update.state"></el-switch>
                        </el-form-item> -->
                        <el-form-item label="是否完成">
                            <el-select v-model="update.state" prop="state">
                                <el-option label="已完成" value="已完成"></el-option>
                                <el-option label="未完成" value="未完成"></el-option>
                            </el-select>
                        </el-form-item> 
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
                        <el-button type="primary" :loading="updateLoading" @click="updateActivity">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import 
    import {
        mapState,
        mapMutations,
        mapGetters,
        mapActions
    } from 'vuex';
    import api from '../service/avtivity.js'
    export default {
        name:'',
        data : function () {
            return{
                Activities:[],
                filter: {
                    per_page: 10, // 页大小
                    page: 1, // 当前页
                    id: '',
                    description: '',
                    endtime: '',
                    performer: '',
                    state: '',
                    title: '',
                    sorts: '',
                },
                create: {
                    description: '',
                    begintime: '',
                    endtime: '',
                    performer: '',
                    title: '',
                    state: '',
                },
                currentId: '',
                update: {
                    description: '',
                    begintime: '',
                    endtime: '',
                    performer: '',
                    state: '',
                    title: '',
                    state: ''
                },
                rules: {
                    performer: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }, {
                        min: 2,
                        max: 15,
                        message: '长度在 2 到 15 个字符'
                    }],
                    title: [{
                        required: true,
                        message: '请输入Activity',
                        trigger: 'blur'
                    }, {
                        min: 1,
                        max: 25,
                        // message: '长度在 6 到 25 个字符'
                    }],
                },
                updateRules: {
                    performer: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }, {
                        min: 2,
                        max: 15,
                        message: '长度在 2 到 15 个字符'
                    }],
                    title: [{
                        required: true,
                        message: '请输入Activity',
                        trigger: 'blur'
                    }, {
                        min: 1,
                        max: 25,
                        // message: '长度在 6 到 25 个字符'
                    }],
                },
                total_rows:0,
                selected: [], //已选择项
                dialogCreateVisible: false, //创建对话框的显示状态
                dialogUpdateVisible: false, //编辑对话框的显示状态
            }
        },
        mounted:function(){
            this.getActivities();
        },
        methods:{
            tableSelectionChange(val) {
                this.selected = val;
            },
            //每页显示多少条
            pageSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.filter.per_page = val;
                this.getActivities();
            },
            //当前页选择
            pageCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.filter.page = val;
                this.getActivities();
            },
            rowClick(row, event) {
                var index = $.inArray(row, this.selected)
                if (index < 0) {
                    this.selected.push(row);
                    this.$refs.ActivityTable.toggleRowSelection(row, true);
                } else {
                    this.selected.splice(index, 1);
                    this.$refs.ActivityTable.toggleRowSelection(row, false);
                }
            },
           // 重置表单
            reset() {
                this.$refs.create.resetFields();
            },

            //编辑
            setCurrent(Activity) {
                this.currentId = Activity.id;
                this.update.performer = Activity.performer;
                this.update.title = Activity.title;
                this.update.description = Activity.description;
                this.update.begintime = Activity.begintime;
                this.update.endtime = Activity.endtime;
                this.update.state = Activity.state;
                this.dialogUpdateVisible = true;
            },
            //获取Activity数据
            getActivitys(){
                let self = this
                api._get().then(res => {
                    self.activities = res;
                    console.log(res.data);
                    this.total_rows = res.datas.total_rows;
                    console.log(res,8888);
                },err => {
                    console.log(err);
                })
            },
            //创建Activity
            createActivity() {
                this.$refs.create.validate((valid) => {
                    if (valid) {
                        api._post(this.create).then(res => {
                            this.$message.success('创建任务成功！');
                            this.dialogCreateVisible = false;
                            this.createLoading = false;
                            this.reset();
                            this.getActivities();
                        }).catch((res) => {
                            var data = res;
                            if (data instanceof Array) {
                              this.$message.error(data[0]["message"]);
                            } else if (data instanceof Object) {
                              this.$message.error(data["message"]);
                            }
                            this.createLoading = false;
                        });
                    } else {
                      //this.$message.error('存在输入校验错误!');
                      return false;
                    }
                });
            },
            
            // 更新Activity
            updateActivity() {
                this.$refs.update.validate((valid) => {
                    if (valid) {
                        api._update(this.currentId, this.update).then(res => {
                            this.$message.success('修改Activity成功！');
                            this.dialogUpdateVisible = false;
                            this.getActivities();
                        }).catch((res) => {
                            var data = res;
                            if (data instanceof Array) {
                                this.$message.error(data[0]["message"]);
                            } else if (data instanceof Object) {
                                this.$message.error(data["message"]);
                            }
                            this.updateLoading = false;
                          });
                    } else {
                        return false;
                    }
                });
            },

            // 删除单个Activity
            removeActivity(Activity) {
                this.$confirm('是否要删除Activity ' + Activity.title + ' ?', '提示', {
                  type: 'warning'
                }).then(() => {
                    api._remove(Avtivity).then(res => {
                        this.$message.success('成功删除了Activity' + Activity.title + ' !');
                        this.getActivities();
                        console.log(Activity.id);
                    }).catch((res) => {
                        this.$message.error('删除失败!');
                    });
                }).catch(() => {
                    this.$message.info('已取消操作!');
                });
            },

             //删除多个Activity
            removeActivities() {
                this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个Activity, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    api._removes().then(res =>{
                        this.$message.success('删除了' + this.selected.length + '个Activity!');
                        this.getActivities();
                    }).catch((res) => {
                        this.$message.error('删除失败!');
                    });
                }).catch(() => {
                    this.$message('已取消操作!');
                });
            }
        }
    }
</script>
<style>
ul li{list-style: none}
.tc{text-align:center; }
.mg{ margin-top:1px;}
.fl{float:left;}
.fr{float:right;margin-top: 0px}
h1{text-align: center; margin-bottom: 0px }
</style>