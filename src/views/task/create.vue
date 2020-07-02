<template>
	<el-form id="#create" :model="create" :rules="rules" ref="create" label-width="100px">
		<el-form-item label="负责人" prop="performer">
			<el-input v-model="create.performer"></el-input>
		</el-form-item>
		<el-form-item label="任务说明" prop="title">
			<el-input v-model="create.title"></el-input>
		</el-form-item>
		<el-form-item label="任务详情" prop="description">
			<el-input type="textarea" v-model="create.description" label-width="100px"></el-input>
		</el-form-item>
		<el-form-item label="开始日期" >
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
        <el-form-item label="上传附件" prop="isFile">
			<el-row>
				<el-col :span="8" v-if="isShowPdf">
					<div class="avatar-uploader">
						<img width="40" height="40" :src="require('../../assets/file/'+matchType(this.filename)+'.png')"> 
						<p>{{this.filename}}</p>
					</div>
					<!-- 预览/删除遮罩 -->
					<div class="mask">
						<!--预览 -->
						<a :href="PdfViewer" target="_blank" title="点击预览">
							<i class="el-icon-zoom-in"></i>
						</a>
						<!-- 删除重新上传 -->
						<a href='javascript:;' @click="removeFile('fileone')"  title="删除预览">
							<i class="el-icon-delete" ></i>
						</a>
					</div>
				</el-col>
				<el-col :span="8" v-if="!isShowPdf">
					<el-upload
					ref="upload"
					action="/api/u/fdb/task" 
					:limit="1"
					multiple
					:with-credentials="true"
					:on-success="upFile"
					:on-error="uploadFalse"
					:on-remove="handleRemove"
					:on-exceed="handleExceed"
					:data="upData"
					:auto-upload="false"
					:before-upload="beforeImageUpload"
					>
					<div slot="tip" class="el-upload__tip" style="line-height: 10px">最多上传1个文件，且文件大小不超过20MB</div>
					<el-button slot="trigger" size="small" plain type="primary">选取文件</el-button>
					<el-button size="small" type="success" plain @click="add()" >上传</el-button>
					<!-- <router-link :to="`/task/attachments/new`">
						<el-button type="success" size="small">上传附件</el-button>
					</router-link> -->
					</el-upload>
				</el-col>
			</el-row>	
        </el-form-item>

        <!-- <el-form-item label="上传附件2">   
			<el-row>
				<el-col :span="8" v-if="isShowPdfTwo">
					<div class="avatar-uploader">
						<img width="40" height="40" :src="require('../../assets/file/'+matchType(this.filenameTwo)+'.png')"> 
						<p>{{this.filenameTwo}}</p>
					</div>
					<div class="mask">
						<a :href="PdfViewerTwo" target="_blank" title="点击预览">
							<i class="el-icon-zoom-in"></i>
						</a>
						<a href='javascript:;' @click="removeFile('filetwo')"  title="删除预览">
							<i class="el-icon-delete" ></i>
						</a>
					</div>
				</el-col>
				<el-col :span="8" v-if="!isShowPdfTwo">
					<el-upload
					ref="uploadTwo"
					action="/api/u/fdb/task" 
					:limit="1"
					multiple
					:with-credentials="true"
					:on-success="upFileTwo"
					:on-error="uploadFalse"
					:on-remove="handleRemove"
					:on-exceed="handleExceed"
					:data="upData"
					:auto-upload="false"
					>
					<el-button slot="trigger" size="small" plain type="primary">选取文件</el-button>
					<el-button size="small" type="success" plain @click="addt()" >上传</el-button>
					</el-upload>
				</el-col>
			</el-row>
        </el-form-item> -->

		<el-form-item>
			<el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="createUser">确 定</el-button>
		</el-form-item>
		<!-- <el-form-item>
			<pdf :src="src" :page="currentPage" @progress="loadedRatio = $event" @num-pages="pageCount=$event" @page-loaded="currentPage=$event" @loaded="loadPdfHandler" ref="wrapper" class="pdf"></pdf>
		</el-form-item> -->
	</el-form>


</template>
<script>
import api from "../../utils/auth"
import pdf from 'vue-pdf'
export default {
    data() {
      return {
		// url:"http://127.0.0.1:5000/api/u/fdb/task",
		form: {},
		create: {
			description: '',
			begintime: '',
			endtime: '',
			performer: '',
			title: '',
			state: '',
			isFile:0,
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
			}],
			state: [{
				required: true,

			}],
		},
        currentPage: 0, // pdf文件页码
        pageCount: 0, // pdf文件总页数
        fileType: 'pdf', // 文件类型
		// src: 'http://127.0.0.1:5000/api/u/fdb/task/f26781c6-aae3-11ea-9fe2-a0510b8d8096', // pdf文件地址
		isShowPdf:false,
		isShowPdfTwo:false,
      	PdfViewer: "javascript:;",
      	PdfViewerTwo: "javascript:;",
      }
	},
	components: {pdf},
    computed:{
        upData() {
            return {
                body: JSON.stringify(this.form)
            }
        }        
    },
    methods: {
		// 重置表单
		reset() {
			this.$refs.create.resetFields();
		},
		// getUsers(){
		// 	let self = this
		// 	api._get().then(res => {
		// 		self.users = res;
		// 		console.log(res.data);
		// 		console.log(res,8888);
		// 	},err => {
		// 		console.log(err);
		// 	})
		// },
		createUser() {
			this.$refs.create.validate((valid) => {
				if (valid) {
				console.log(this.create);
				api._post(this.create).then(res => {
					this.$message.success('创建任务成功！');
					this.reset();
					// console.log(this.create.isFile,"创建任务之后");
					// this.getUsers();
					this.$router.replace('/task/list');
				}).catch((res) => {
					var data = res;
					if (data instanceof Array) {
					this.$message.error(data[0]["message"]);
					} else if (data instanceof Object) {
					this.$message.error(data["message"]);
					}
				});
				} else {
					this.$message.error('创建任务失败!');
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
        add() {
            this.$refs.upload.submit()
		},
        addt() {
            this.$refs.uploadTwo.submit()
        },
        // 成功上传文件
        upFile(response, file, fileList) {
			console.log(response);
			console.log(file);
			console.log(fileList);
			console.log(fileList[0].name);
			// console.log(fileList[1].name);
			this.filename = fileList[0].name
            let self = this
            if (response.status == 201) {
				this.$message.success("上传成功");
				self.nodeid = response.nodeid;
				this.create.isFile = 1;
				// console.log(this.create.isFile,"上传文件之后");
				this.getFileLink("fileone");
				this.isShowPdf = true
            }
		},
        upFileTwo(response, file, fileList) {
			this.filenameTwo = fileList[0].name
            let self = this
            if (response.status == 201) {
				this.$message.success("上传成功");
				console.log(response.nodeid,111111);
				self.nodeid = response.nodeid;
				this.getFileLink("filetwo");
				this.isShowPdfTwo = true
            }
		},
		// 处理PDF预览路径    参数p是key
		getFileLink(p) {
			this.filePath = 
				"/api/u/fdb/task/"+this.nodeid+"/content";
			console.log(this.filePath,"url");
			switch (p) {
				case "fileone":
					this.PdfViewer = this.filePath;
				break;
				case "filetwo":
					this.PdfViewerTwo = this.filePath;
				break;
			}
		},
		removeFile(e) {
			switch (e) {
				case "fileone":
					this.isShowPdf = false
				break;
				case "filetwo":
					this.isShowPdfTwo = false
				break;
			}
		},
		beforeImageUpload(file) {
			// const isTYPE = file.type === 'txt/pdf/png/jpg/jpeg/gif/doc/docx/xls/xlsx/ppt/pptx/mp4/zip/rar';
			console.log(file.size);
			const isLt20M = file.size / 1024 / 1024 < 20;
			console.log(isLt20M);
			
			// if (!isTYPE) {
			// this.$message.error('请选择正确的文件格式!');
			// }
			if (!isLt20M) {
				this.$message.error('上传文件大小不能超过 20MB!');
			}
			return isLt20M;
		},
        uploadFalse(response, file, fileList){
            console.log(response);
			this.$message.error(response.message.slice(1,-2));  
			//后台错误信息
        },
        // 上传文件超出个数
        handleExceed(files, fileList) {
            this.$message.warning(`当前只能选择上传1 个文件`);
        },
        // 移除文件
        handleRemove(res, file, fileList) {
			if (file && file.status==="success"){
				this.$message.warning(`移除当前${res.name}文件，请重新选择文件上传！`);
				this.removeFile("fileone")
			}
		},
		// changePdfPage (val) {
		// 	// console.log(val)
		// 	if (val === 0 && this.currentPage > 1) {
		// 	this.currentPage--
		// 	// console.log(this.currentPage)
		// 	}
		// 	if (val === 1 && this.currentPage < this.pageCount) {
		// 	this.currentPage++
		// 	// console.log(this.currentPage)
		// 	}
		// },

		// pdf加载时
		loadPdfHandler (e) {
			this.currentPage = 1 // 加载的时候先加载第一页
		},
		matchType(filename){
			var suffix = ''
			var result = ''
			try {
				var fileArr = filename.split('.')
				suffix = fileArr[fileArr.length -1]
			}catch(err){
				suffix = ''
			}
			if (!suffix){
				result =false
				return result
			}
			var imglist = ['png','jpg','jpeg', 'gif']
			result =imglist.some(function(item){
				return item === suffix
			})
			if (result){
				result = 'image'
				return result
			}
			var txtlist = ['txt']
			result =txtlist.some(function(item){
				return item === suffix
			})
			if (result){
				result = 'txt'
				return result
			}
			var pdflist = ['pdf']
			result =pdflist.some(function(item){
				return item === suffix
			})
			if (result){
				result = 'pdf'
				return result
			}
			var doclist = ['doc']
			result =doclist.some(function(item){
				return item === suffix
			})
			if (result){
				result = 'doc'
				return result
			}
			var pptlist = ['ppt']
			result =pptlist.some(function(item){
				return item === suffix
			})
			if (result){
				result = 'ppt'
				return result
			}
			var ziplist = ['zip','rar']
			result =ziplist.some(function(item){
				return item === suffix
			})
			if (result){
				result = 'zip'
				return result
			}
			var mp4list = ['mp4']
			result =mp4list.some(function(item){
				return item === suffix
			})
			if (result){
				result = 'mp4'
				return result
			}
			var xlslist = ['xls','xlsx']
			result =xlslist.some(function(item){
				return item === suffix
			})
			if (result){
				result = 'xls'
				return result
			}
		}
    }
  }
</script>
<style>
.el-form{
	margin: 50px 300px 0px 20px;
}
img{
	float: left;
	padding: 0 ;
	margin:  0px 0px 0px 8px;
}
p{
	padding:5px 0px 0px 60px;
	font-family:sans-serif;
	margin: 2px 0px 0px 10px;
}
.mask{
	padding-left:12px;
	float: left;
}
</style>