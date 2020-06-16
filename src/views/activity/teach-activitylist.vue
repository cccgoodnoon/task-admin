<template>
    <el-container>
        <el-main>
            <div> 
                <h2>教师上课工作量一览表</h2>
                <el-row class="line-display">
                    <el-col :span="22" :offset="1">
                        <div class="grid-content" style="margin-top:0px; border:0">
                            <el-row>
                                <el-col :span="2">
                                    <el-button type="primary" @click="getReport2" size="small">Report2</el-button>
                                </el-col>
                                <el-col :span="2">
                                    <el-button type="primary" @click="getReport3" size="small">Report3</el-button>
                                </el-col>
                                <div class="searchWord">
                                    <!-- 模糊搜索 -->
                                    <el-input v-model="search" style="display: inline-block;width: 240px" 
                                        placeholder="请输入要查询教师姓名或者课程名称" size="small">
                                    </el-input>
                                </div>
                            </el-row>                            
                            <el-col :span="24" style="height:20px;"></el-col>
                            <el-table 
                                :data="tables" 
                                stripe
                                height="650"
                                     >
                                <el-table-column type="selection"
                                                width="50">
                                </el-table-column>
                                <el-table-column prop="objectstate"
                                                label="状态"
                                                sortable
                                                width="80">
                                </el-table-column>
                                <el-table-column prop="uuid"
                                                label="人员标识"
                                                width="180">
                                </el-table-column>
                                <el-table-column prop="employeeid"
                                                label="工号"
                                                sortable
                                                width="90">
                                </el-table-column>
                                <el-table-column prop="name"
                                                label="姓名"
                                                sortable
                                                width="90">
                                </el-table-column>
                                <el-table-column prop="title"
                                                label="职称"
                                                width="100">
                                </el-table-column>
                                <el-table-column prop="courseuuid"
                                                label="课程标识"
                                                width="220">
                                </el-table-column>
                                <el-table-column prop="courseid"
                                                label="课号"
                                                sortable
                                                width="80">
                                </el-table-column>
                                <el-table-column prop="coursename"
                                                label="课程"
                                                sortable
                                                width="200">
                                </el-table-column>
                                <el-table-column prop="credit"
                                                label="学分"
                                                width="80">
                                </el-table-column>
                                <el-table-column prop="begintime"
                                                label="开始日期"
                                                width="200">
                                </el-table-column>
                                <el-table-column prop="endtime"
                                                label="结束日期"
                                                width="100">
                                </el-table-column>
                                <el-table-column prop="workday"
                                                label="投入天数"
                                                width="100">
                                </el-table-column>
                                <el-table-column prop="workpoint"
                                                label="工作量"
                                                width="100">
                                </el-table-column>
                                <!-- <el-table-column
                                    inline-template
                                    label="操作"
                                    width="210">
                                    <span>
                                        <el-button type="danger" size="small" @click="removeUser(row)">删除</el-button>
                                        <el-button type="success" size="small" @click="setCurrent(row)">编辑</el-button>
                                    </span>
                                </el-table-column> -->
                            </el-table>
                                <!-- <el-pagination background 
                                    layout="prev, pager, next, sizes, total, jumper"
                                    :page-sizes="[5, 10, 15, 20]"
                                    :page-size="pagesize"
                                    :total="list.length"
                                    @current-change="handleCurrentChange"
                                    @size-change="handleSizeChange"
                                    >
                                </el-pagination> -->
                            <!-- <div style="width:100%; ovflow:hidden; height:180px;"></div> -->
                        </div>
                    </el-col>
                </el-row>

                <!-- <el-dialog title="新建任务" v-model="dialogCreateVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="reset" >
                    <el-form id="#create" :model="create" :rules="rules" ref="create" label-width="100px">
                        <el-form-item label="负责人" prop="performer">
                            <el-input v-model="create.performer"></el-input>
                        </el-form-item>
                        <el-form-item label="任务说明" prop="title">
                            <el-input v-model="create.title"></el-input>
                        </el-form-item>
                        <el-form-item label="任务详情" prop="description">
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
                        <el-form-item label="是否完成" prop="state">
                            <el-select v-model="create.state" placeholder="请选择完成情况">
                                <el-option label="未完成" value="未完成"></el-option>
                                <el-option label="已完成" value="已完成"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogCreateVisible = false">取 消</el-button>
                        <el-button type="primary" :loading="createLoading" @click="createUser">确 定</el-button>
                    </div>
                </el-dialog> -->
                <!-- 修改用户 begin-->
                <!-- <el-dialog title="修改用户信息" v-model="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
                    <el-form id="#update" :model="update" :rules="updateRules" ref="update" label-width="100px">
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
                        <el-form-item label="是否完成">
                            <el-select v-model="update.state" prop="state">
                                <el-option label="已完成" value="已完成"></el-option>
                                <el-option label="未完成" value="未完成"></el-option>
                            </el-select>
                        </el-form-item> 
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
                        <el-button type="primary" :loading="updateLoading" @click="updateUser">确 定</el-button>
                    </div>
                </el-dialog> -->
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import {
        mapState,
        mapMutations,
        mapGetters,
        mapActions
    } from 'vuex';
    // import api from '../api/service.js'
    import api from "../../utils/auth"
    export default {
        name:'',
        data : function () {
            return{
                activities:[],
                search:'',
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
                        message: '请输入任务名',
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
                        message: '请输入任务名',
                        trigger: 'blur'
                    }, {
                        min: 1,
                        max: 25,
                        // message: '长度在 6 到 25 个字符'
                    }],
                },
                // total_rows:0,
                selected: [], //已选择项
                dialogCreateVisible: false, //创建对话框的显示状态
                dialogUpdateVisible: false, //编辑对话框的显示状态
                pagesize:10,
                currentPage:1
            }
        },
        mounted:function(){
            this.getActivities();
        },
        computed: {
        // 模糊搜索
            tables () {
                const search = this.search
                if (search) {
                // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
                // 注意： filter() 不会对空数组进行检测。
                // 注意： filter() 不会改变原始数组。
                return this.activities.filter(data => {
                    // some() 方法用于检测数组中的元素是否满足指定条件;
                    // some() 方法会依次执行数组的每个元素：
                    // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
                    // 如果没有满足条件的元素，则返回false。
                    // 注意： some() 不会对空数组进行检测。
                    // 注意： some() 不会改变原始数组。
                    return Object.keys(data).some(key => {
                    // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
                    // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
                    return String(data[key]).toLowerCase().indexOf(search) > -1
                    })
                })
                }
                return this.activities
            }
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
                    this.$refs.usersTable.toggleRowSelection(row, true);
                } else {
                    this.selected.splice(index, 1);
                    this.$refs.usersTable.toggleRowSelection(row, false);
                }
            },
           // 重置表单
            reset() {
                this.$refs.create.resetFields();
            },

            //编辑
            setCurrent(user) {
                this.currentId = user.id;
                this.update.performer = user.performer;
                this.update.title = user.title;
                this.update.description = user.description;
                this.update.begintime = user.begintime;
                this.update.endtime = user.endtime;
                this.update.state = user.state;
                this.dialogUpdateVisible = true;
            },
            //获取任务数据
            getActivities(){
                let self = this
                api._geta().then(res => {
                    self.activities  = res;
                    // console.log(res.data);
                    // console.log(res,8888);
                },err => {
                    console.log(err);
                })
            },
            getReport2(){
                window.location.href = "http://127.0.0.1:5000/api/u/export/report2"
            },
            getReport3(){
                window.location.href = "http://127.0.0.1:5000/api/u/export/report3"

            },

            getMemberByCourseName(){

            },

            //创建任务
            createActivity() {
                this.$refs.create.validate((valid) => {
                    if (valid) {
                        api._post(this.create).then(res => {
                            this.$message.success('创建课程分配成功！');
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
            
            // 更新任务
            updateActivity() {
                this.$refs.update.validate((valid) => {
                    if (valid) {
                        api._update(this.currentId, this.update).then(res => {
                            this.$message.success('修改课程分配成功！');
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

            // 删除单个任务
            removeUser(activity) {
                this.$confirm('是否要删除改课程分配 ' + activity.title + ' ?', '提示', {
                  type: 'warning'
                }).then(() => {
                    api._remove(activity).then(res => {
                        this.$message.success('成功删除了该课程分配' + activity.title + ' !');
                        this.getActivities();
                        console.log(activity.id);
                    }).catch((res) => {
                        this.$message.error('删除失败!');
                    });
                }).catch(() => {
                    this.$message.info('已取消操作!');
                });
            },

             //删除多个任务
            removeActivities() {
                this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个课程分配, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    api._removes().then(res =>{
                        this.$message.success('删除了' + this.selected.length + '个任务!');
                        this.getActivities();
                    }).catch((res) => {
                        this.$message.error('删除失败!');
                    });
                }).catch(() => {
                    this.$message('已取消操作!');
                });
            },
            
				handleCurrentChange(cpage) {
					this.currpage = cpage;
				},
				handleSizeChange(psize) {
					this.pagesize = psize;
                },

        }
    }
</script>
<style>
ul li{list-style: none}
.tc{text-align:center; }
.mg{ margin-top:1px;}
.fl{float:left;}
.fr{float:right;margin-top: 0px}
h2{text-align: center; margin-bottom: 0px;color: #112d4e;letter-spacing:5px; margin-bottom: 10px;}
::-webkit-scrollbar {
  width: 9px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: #d6e4f0;
  border-radius: 3px;
}
.el-table{
color:black;
border: 1px solid #d6e4f0;
height: 500px;
}
.el-table__body tr.current-row>td{
  background-color: #d6e6f2 !important;
  color: #537791;  
}
.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #d6e6f2;
  color: #537791; 
}
</style>