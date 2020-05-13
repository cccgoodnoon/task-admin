<template>
    <el-form @submit.native.prevent="back" :model="user" label-width="100px" readonly: true>
        <el-form-item label="ID">
            <el-input v-model="user.id" readonly></el-input>
        </el-form-item>
		<el-form-item label="负责人">
            <el-input v-model="user.performer" readonly></el-input>
        </el-form-item>
        <el-form-item label="任务说明">
            <el-input v-model="user.title" readonly></el-input>
        </el-form-item>
        <el-form-item label="任务详情">
            <el-input v-model="user.description" readonly></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
            <el-date-picker  v-model="user.begintime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" readonly>
            </el-date-picker>
        </el-form-item>
        <el-form-item label="截止日期">
            <el-date-picker v-model="user.endtime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 100%;" readonly>
            </el-date-picker>
        </el-form-item>

        <el-form-item label="是否完成">
            <el-select v-model="user.state" prop="state" :disabled=true>
                <el-option label="已完成" value="1"></el-option>
                <el-option label="未完成" value="0"></el-option>
            </el-select>
        </el-form-item> 
        <el-form-item>
            <el-button type="primary" native-type="submit">返回列表</el-button>
		</el-form-item>
    </el-form>
    
</template>
<script>
import api from "../../utils/auth"
export default {
    data() {
        return {
            user:[],
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
                self.user = res;
                console.log(res);
			},err => {
				console.log(err);
            })
        },
		back() {
			this.$router.replace('/task/list');
		},
    }
  }
</script>
<style>
.el-form{
	margin: 50px 600px 0px 20px;
}
</style>