<template>
    <el-form @submit.native.prevent="updateUser" :model="update" :rules="updateRules" ref="update" label-width="100px">
        <el-form-item label="负责人">
            <el-input v-model="update.performer"></el-input>
        </el-form-item>
        <el-form-item label="任务说明">
            <el-input v-model="update.title"></el-input>
        </el-form-item>
        <el-form-item label="任务详情">
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
                <el-option label="已完成" value="1"></el-option>
                <el-option label="未完成" value="0"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item>
			<el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" native-type="submit">确 定</el-button>
		</el-form-item>
    </el-form>
    
</template>
<script>
import api from "../../utils/auth"
export default {
    data() {
        return {
            update:{},
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
                }],
            },
        }
    },
    mounted(){
        this.getUser();
    },
    methods: {
		reset() {
			this.$refs.create.resetFields();
		},
		getUser(){
			let self = this
			api._gets(self.$route.params.id).then(res => {
                self.update = res;
                console.log(res);
			},err => {
				console.log(err);
            })
        },
		updateUser() {
            api._update(this.$route.params.id, this.update).then(res => {
                this.$message({
                    message: "任务修改成功",
                    type: "success"
                });
                this.$router.push('/task/list');
                console.log(res);
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