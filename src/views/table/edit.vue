<template>
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
            <el-date-picker  v-model="update.begintime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期">
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
        <el-form-item>
			<el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="updateUser">确 定</el-button>
		</el-form-item>
    </el-form>
</template>
<script>
import api from "../../utils/auth"
export default {
    data() {
      return {
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
      }
    },
    mounted(){
        this.getUsers();
    },
    methods: {
		// 重置表单
		reset() {
			this.$refs.create.resetFields();
		},
		getUsers(){
			let self = this
			api._get().then(res => {
				self.users = res;
				console.log(res.data);
				// this.total_rows = res.datas.total_rows;
				console.log(res,8888);
			},err => {
				console.log(err);
			})
		},
		updateUser() {
            this.$refs.update.validate((valid) => {
                if (valid) {
                    api._update(this.currentId, this.update).then(res => {
                        this.$message.success('修改任务成功！');
                        this.dialogUpdateVisible = false;
                        this.getUsers();
                    }).catch((res) => {
                        var data = res;
                        if (data instanceof Array) {
                            this.$message.error(data[0]["message"]);
                        } else if (data instanceof Object) {
                            this.$message.error(data["message"]);
                        }
                        // this.updateLoading = false;
                    });
                } else {
                    return false;
                }
            });
        },
		handleCancel() {
			this.$message({
				message: '取消修改',
				type: 'warning'
			});
			this.$router.replace('/task/list');
		},
    }
  }
</script>
<style>
.el-form{
	margin: 50px 300px 0px 20px;
}
</style>