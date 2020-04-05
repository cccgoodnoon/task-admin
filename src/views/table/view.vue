<template>
	<!-- <el-form ref="form" :model="form" label-width="80px">
		<el-form-item label="活动名称">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="活动区域">
			<el-select v-model="form.region" placeholder="请选择活动区域">
			<el-option label="区域一" value="shanghai"></el-option>
			<el-option label="区域二" value="beijing"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="活动时间">
			<el-col :span="11">
			<el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
			</el-col>
			<el-col class="line" :span="2">-</el-col>
			<el-col :span="11">
			<el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
			</el-col>
		</el-form-item>
		<el-form-item label="即时配送">
			<el-switch v-model="form.delivery"></el-switch>
		</el-form-item>
		<el-form-item label="活动性质">
			<el-checkbox-group v-model="form.type">
			<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
			<el-checkbox label="地推活动" name="type"></el-checkbox>
			<el-checkbox label="线下主题活动" name="type"></el-checkbox>
			<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
			</el-checkbox-group>
		</el-form-item>
		<el-form-item label="特殊资源">
			<el-radio-group v-model="form.resource">
			<el-radio label="线上品牌商赞助"></el-radio>
			<el-radio label="线下场地免费"></el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="活动形式">
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onSubmit">立即创建</el-button>
			<el-button>取消</el-button>
		</el-form-item>
	</el-form> -->
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
				<el-option label="未完成" value="0"></el-option>
				<el-option label="已完成" value="1"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="createUser">确 定</el-button>
		</el-form-item>
	</el-form>
</template>
<script>
import api from "../../utils/auth"
export default {
    data() {
      return {
		create: {
			description: '',
			begintime: '',
			endtime: '',
			performer: '',
			title: '',
			state: '',
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
      }
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
		//创建任务
		createUser() {
			this.$refs.create.validate((valid) => {
				if (valid) {
					api._post(this.create).then(res => {
						this.$message.success('创建任务成功！');
						this.dialogCreateVisible = false;
						// this.createLoading = false;
						this.reset();
						this.getUsers();
						this.$router.push('/task/list');
					}).catch((res) => {
						var data = res;
						if (data instanceof Array) {
							this.$message.error(data[0]["message"]);
						} else if (data instanceof Object) {
							this.$message.error(data["message"]);
						}
						// this.createLoading = false;
					});
				} else {
					//this.$message.error('存在输入校验错误!');
					return false;
				}
			});
		},
		handleCancel() {
			this.$message({
				message: '取消创建',
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