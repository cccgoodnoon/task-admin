<template>
    <!-- <el-container> -->
        <div> 
            <h2>教学任务分配</h2>
            <!-- <el-divider></el-divider> -->
            <div >            
                <ul class="fr">
                    <li >
                        <el-date-picker
                            v-model="timeValue"
                            align="right"
                            type="date"
                            placeholder="选择课程开始日期"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            size="small"
                        >
                        </el-date-picker>
                        <el-select v-model="objectvalue" placeholder="请选择课程状态" size="small">
                            <el-option
                            v-for="item in options"
                            :key="item.objectvalue"
                            :label="item.label"
                            :value="item.objectvalue">
                            </el-option>
                        </el-select>                          
                        <el-button type="primary" @click="addActivity()" size="small"> <i class="el-icon-plus iconss"></i>新增</el-button>
                        <el-button type="danger" icon="delete" :disabled="actiSelected.length==0" @click="removeActivity()" size="small">移除</el-button>
                    </li>
                </ul>                
            </div>
            
            <el-row :gutter="24" class="row">
                <el-col :offset="1" :span="7">
                <!--左边表格-->
                    <div>
                        <span class="subtitle">教师名单</span>
                        <el-table :data="member.filter(data => !msearch || data.firstname.toLowerCase().includes(msearch.toLowerCase()))" 
                            height="650" ref="memberTable" @row-click="handleMember"  highlight-current-row 
                            :header-cell-style="{background:'#d6e4f0'}"
                            >
                            <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
                            <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
                            <el-table-column prop="employeeid" label="工号" width="75" align="center"></el-table-column>
                            <el-table-column prop="firstname" label="姓名" width="120" align="center">
                                <template slot="header">
                                    <el-input
                                    v-model="msearch"
                                    size="small"
                                    placeholder="  姓名搜索"/>
                                </template>
                            </el-table-column>
                            <el-table-column prop="objectstate" label="状态" width="80" align="center">
                                <template slot-scope="scope">
                                <el-tag :type="scope.row.objectstate=='1' ?'success':'info'">{{scope.row.objectstate}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column>
                                
                            </el-table-column>

                        </el-table>         
                    </div>
                </el-col>

                <el-col  :span="8" >
                <!--中间表格-->
                    <div>
                        <span class="subtitle">课程清单</span>
                        <el-table height="650" :data="course.filter(data => !csearch || data.name.toLowerCase().includes(csearch.toLowerCase()))" 
                            ref="courseTable" @row-click="handleCourse" 
                            highlight-current-row 
                            :header-cell-style="{background:'#d6e4f0'}"
                            > 
                            <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
                            <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
                            <el-table-column prop="code" label="课程代号" width="85" align="center"></el-table-column>
                            <el-table-column prop="name" label="课程名称" width="155" align="center">
                                <template slot="header">
                                    <el-input
                                    v-model="csearch"
                                    size="small"
                                    placeholder="  课程名称搜索"/>
                                </template>                               
                            </el-table-column>
                            <el-table-column prop="objectstate" label="状态" width="95" align="center">
                                <template slot-scope="scope">
                                <el-tag :type="scope.row.objectstate=='1' ?'success':'info'">{{scope.row.objectstate}}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>

                <el-col :span="7" >
                <!--右边表格-->
                    <div class="righttable">
                        <!-- <div><span id="teacher"></span><span>老师上课清单</span></div> -->
                        <el-table height="650" :data="activity" ref="activityTable" @selection-change="actiTableSelection" highlight-current-row :header-cell-style="{background:'#d6e4f0'}" @row-click="handleActivity">
                            <el-table-column type="selection" width="45"></el-table-column>
                            <el-table-column prop="uuid" label="ID" width="40">
                                <template slot-scope="scope">{{scope.$index +1}}</template>
                            </el-table-column>
                            <el-table-column prop="code" label="课程代号" width="80" align="center"></el-table-column>
                            <el-table-column prop="name" label="课程名称"></el-table-column>
                            <el-table-column prop="objectstate" label="状态" width="110" align="center">
                                <template slot-scope="scope">
                                <el-tag :type="scope.row.objectstate=='1' ?'success':'info'">{{scope.row.objectstate|getStateName}}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>

            <el-dialog title="修改状态" :visible.sync="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false" width="30%">
                    <el-form id="#update" :model="update" ref="update" label-width="100px">
                        <el-form-item label="课程状态">
                            <el-select v-model="update.state" prop="state">
                                <el-option label="申请中" value="1"></el-option>
                                <el-option label="已分配" value="3"></el-option>
                            </el-select>
                        </el-form-item> 
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
                        <el-button type="primary" @click="updateState">确 定</el-button>
                    </div>
            </el-dialog>   
        </div> 
    <!-- </el-container> -->
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
        filter: {
            objectstate: ''
        },
        filters: {
            getStateName(objectstate) {
                const stateMap= {
                    1: '申请中',
                    3: '已分配',
                };
                return stateMap[objectstate]
            }
        },
        data() {
            return{
                member:[],
                course:[],
                activity:[],
                checked: null,
                timeValue: '',
                course_uuid:'',
                course_credit:'',
                uuid:'',
                member_uuid:'',
                selected: [],
                courseSelected: [],
                actiSelected: [], 
                course_name:'',
                objectstate: '',
                id:'',
                update: {state: ''},
                currentId: '',
                dialogUpdateVisible: false,
                msearch: '',
                csearch: '',
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                        picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                        }
                    },{
                        text: '一个月前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', date);
                        }
                    }]
                }, 
                options: [{
                objectvalue: '1',
                label: '申请中'
                }, {
                objectvalue: '3',
                label: '已分配'
                }],
                objectvalue: '' ,                              
            }
        },
        mounted:function(){
            this.getMember();
            this.getCourse();
        },
        methods:{
            reset() {
                this.$refs.create.resetFields();
            },
            //复选框
            actiTableSelection(val) {
                if (val.length > 1) {
                    this.$refs.activityTable.clearSelection();
                    let array=val.pop();
                    this.$refs.activityTable.toggleRowSelection(array,true);
                    this.actiSelected=array;
                    console.log(array);
                    // document.getElementById("teacher").innerHTML=array.firstname; 
                } 
                if (val.length == 1) {
                    this.$refs.activityTable.toggleRowSelection(val,false);
                    this.actiSelected=val;
                    this.course_name = val[0].name;
                    console.log(val);
                    // this.state = val[0].objectstate;
                    this.uuid = val[0].uuid;
                    // console.log(this.uuid);
                    console.log("复选框状态",this.state);
                }
 
            },
            // memberTableSelection(val) {
            //     if (val.length > 1) {
            //         this.$refs.memberTable.clearSelection();
            //         let array=val.pop();
            //         this.$refs.memberTable.toggleRowSelection(array,true);
            //         this.selected=array;
            //         // document.getElementById("teacher").innerHTML=array.firstname; 
            //     } 
            //     if (val.length == 1) {
            //         this.$refs.memberTable.toggleRowSelection(val,false);
            //         this.selected=val;
            //         // document.getElementById("teacher").innerHTML=val.firstname;
            //     } 
            // },
            // courseTableSelection(val) {
            //     if (val.length > 1) {
            //         this.$refs.courseTable.clearSelection();
            //         let array=val.pop();
            //         this.$refs.courseTable.toggleRowSelection(array,true);
            //         this.courseSelected=array;
            //         // document.getElementById("teacher").innerHTML=array.firstname; 
            //     } 
            //     if (val.length == 1) {
            //         this.$refs.courseTable.toggleRowSelection(val,false);
            //         this.courseSelected=val;
            //         // document.getElementById("teacher").innerHTML=val.firstname;
            //     } 
            // }, 
            //点击行            
            handleMember(row, event, column) {
                // console.log("老师名字",row.firstname);
                this.$refs.memberTable.toggleRowSelection(row);
                // document.getElementById("teacher").innerHTML=row.firstname;
                api._getOM(row.id).then(res => {
                    // console.log("这行内容",row);
                    // console.log("这个老师",res);
                    this.member_uuid = res[0].uuid;
                    // console.log("当前老师uuid",this.member_uuid);
                    this.getActivity(this.member_uuid);
                })
                this.$refs.memberTable.clearSelection();           
            },
            handleCourse(row, event, column) {
                this.$refs.courseTable.toggleRowSelection(row)
                // this.getOneCourse()
                // console.log(row);
                api._getOC(row.id).then(res => {
                    // console.log(row);
                    // console.log(this.course.id);
                    // console.log("当前课程id",row.id);
                    this.course_uuid = res[0].uuid;
                    this.course_credit = res[0].credit;
                    // console.log("当前课程uuid",this.course_uuid);
                    // console.log("当前课程学分",this.course_credit);
                })
            },
            handleActivity(row, event, column) {
                // console.log("该老师课程",this.activity);
                // console.log("该行信息",row);
                // console.log("该行id",row.id);
                // console.log("该行点击时状态",row.objectstate);
                this.state = row.objectstate
                console.log(this.state);
                this.update = {'state':row.objectstate}              
                this.$refs.activityTable.toggleRowSelection(row)
                this.currentId = row.id;
                this.dialogUpdateVisible = true
                this.update.state = String(this.state)           
            },
            getMember(){
                let self = this
                api._getM().then(res => {
                    // console.log(res);
                    self.member = res;
                },err => {
                    console.log(err);
                })
            },
            getCourse(){
                let self = this
                api._getC().then(res => {
                    self.course = res;
                },err => {
                    console.log(err);
                })
            },            
            getActivity(id){
                let self = this
                api._getA(this.member_uuid).then(res =>{
                    // console.log(res);
                    self.activity = res;
                },err => {
                    console.log(err);
                })
            },
            addActivity(){
                // console.log("选择框课程状态",this.objectvalue);
                if(this.course_uuid != ''&&this.member_uuid != ''&&this.timeValue != ''&&this.objectvalue !=''){
                    api._posta({course_uuid:this.course_uuid,course_credit:this.course_credit,member_uuid:this.member_uuid,timeValue:this.timeValue,objectvalue:this.objectvalue}).then(res =>{
                        this.$message.success('成功为该老师添加一门课！');
                        // this.getMember();
                        this.getCourse();
                        this.getActivity();
                        // this.timeValue = '';
                    },err => {
                        console.log(err);
                    })                    
                } else if (this.member_uuid == '') {
                    this.$message.warning('请选择一位老师!');
                } else if (this.course_uuid == '') {
                    this.$message.warning('请选择一门课!');
                } else if (this.timeValue == '') {
                    this.$message.warning('请选择课程开始时间!');
                } else if (this.objectvalue == '') {
                    this.$message.warning('请选择课程状态!');
                }
                // console.log("当前课程uuid",this.course_uuid);
                // console.log("当前课程学分",this.course_credit);
                // console.log("当前老师uuid",this.member_uuid);
                // console.log("选择框时间",this.timeValue);                               
            },
            removeActivity(){
                // console.log(this.course_name);
                // console.log(this.member_uuid);
                console.log(this.uuid);
                this.$confirm('此操作将删除该老师的 ' + this.actiSelected.length + ' 门课程, 是否继续?','提示', {
                  type: 'warning'
                }).then(() => {
                    // api._remove(this.course_name,this.member_uuid).then(res => {
                    //     this.$message.success('成功删除了课程!');
                    //     // this.getMember();
                    //     // this.getCourse();
                    //     this.getActivity();
                    // }).catch((res) => {
                    //     this.$message.error('删除失败!');
                    // });
                    api._removea(this.uuid).then(res => {
                        this.$message.success('成功删除了课程!');
                        this.getActivity();
                    }).catch((res) => {
                        this.$message.error('删除失败!');
                    });
                }).catch(() => {
                    this.$message.info('已取消操作!');
                });
            },
            updateState(){
                // console.log("id",this.currentId);
                // console.log("选择的状态",this.update)
                this.$refs.update.validate((valid) => {
                    if (valid) {
                        api._updatea(this.currentId, this.update).then(res => {
                            this.$message.success('修改课程状态成功！');
                            this.dialogUpdateVisible = false;
                            this.getActivity();
                            // this.getUsers();
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
            }
        }
    }
</script>
<style>
.row{
    margin-top: 50px;
    text-align:left;
}
.subtitle{
    color:#409EFF;
    font-size: 16px;
    padding: 5px;
    display:block;
}
.righttable{margin-top: 30px;}
ul li{list-style: none}
.tc{text-align:center; }
.mg{ margin-top:1px;}
.fl{float:left;}
.fr{float:right;margin: 10px 120px 0px 5px;display:block;}
h2{text-align: center; margin-bottom: 0px;color: #112d4e;letter-spacing:5px;}
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