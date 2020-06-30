<template>
    <el-form :model="update" :rules="updateRules" ref="update" label-width="100px">
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

        <el-form-item label="附件">
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
						<a :href="PdfDownload" target="_blank" title="点击下载">
							<i class="el-icon-download"></i>
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
					>
					<!-- <div slot="tip" class="el-upload__tip">请选择一个英文名称文件</div> -->
					<el-button slot="trigger" size="small" plain type="primary">选取文件</el-button>
					<el-button size="small" type="success" plain @click="add()" >上传</el-button>
					</el-upload>
				</el-col>
			</el-row>
        </el-form-item> 

		<!-- <el-form-item>
			<router-link :to="`/task/${this.$route.params.id}/attachments/update`">
				<el-button type="success" size="small">上传附件</el-button>
			</router-link>
		</el-form-item> -->

        <el-form-item>
			<el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="updateUser()">确 定</el-button>
		</el-form-item>
    </el-form>
    
</template>
<script>
import api from "../../utils/auth"
import CONFIG_API_BASE_URL from '../../conf/config'

export default {
    data() {
        return {
            update:{},
            // url:"http://127.0.0.1:5000/api/u/fdb/task",
            // form: {
            //     ipArea: "",
            //     sourceMachineIp: ""
            // },
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
            isShowPdf:false,
			PdfViewer: "javascript:;",
			PdfDownload: "javascript:;",
        }
    },
    mounted(){
        this.getUser();
    },
    computed:{
        upData() {
            return {
                body: JSON.stringify(this.form)
            }
        }        
    },
    methods: {
		reset() {
			this.$refs.create.resetFields();
		},
		getUser(){
			let self = this
			api._gets(self.$route.params.id).then(res => {
                self.update = res;
                // console.log(res);
				self.update.state = String(res['state'])
				// self.update.nodeid = sessionStorage.nodeid;
				self.update.nodeid = res['nodeid']
				// self.update.nodeid = localStorage.nodeid;
				// console.log(localStorage.nodeid);
                // console.log(res['nodeid'],133);
                if (self.update.nodeid != null && self.update.nodeid != 'None') {
					this.getFileName();
					this.getFileLink("fileone");
                }
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
                // this.$refs.upload.submit()
                this.$router.push('/task/list');
                // console.log(res);
            });
        },
		handleCancel() {
			this.$message({
				message: '取消修改',
				type: 'warning'
			});
			this.$router.replace('/task/list');
        },
        add() {
            this.$refs.upload.submit()
        },
        // 成功上传文件
        upFile(response, file, fileList) {
            // console.log(response);
            let self = this
            if (response.status == 201) {
                this.$message.success("上传成功");
				// self.update.nodeid = localStorage.nodeid;
				self.update.nodeid = response.nodeid;
				// console.log(localStorage.nodeid);
                // console.log(response.nodeid,170);
                this.getFileLink("fileone");
                this.getFileName()
				
            }
        },
        uploadFalse(response, file, fileList){
            // console.log(response);
            this.$message.error(response.message);
        },
        // 上传文件超出个数
        handleExceed(files, fileList) {
            this.$message.warning(`当前只能选择上传2 个文件`);
        },
        // 移除文件
        handleRemove(res, file, fileList) {
            this.$message.warning(`移除当前${res.name}文件，请重新选择文件上传！`);
        },
		getFileLink(p) {
			this.fileDownloadPath=
				"/api/u/fdb/task/"+this.update.nodeid;
			this.fileViewPath = 
				"/api/u/fdb/task/"+this.update.nodeid+"/content";
			// console.log(this.filePath,"url");
			switch (p) {
				case "fileone":
					this.PdfViewer = this.fileViewPath;
					this.PdfDownload = this.fileDownloadPath;
				break;
				case "filetwo":
					this.PdfViewerTwo = this.filePath;
				break;
			}
        },
        getFileName(){
			// console.log(this.update.nodeid,201);
			let self = this
            api._getOneNode(this.update.nodeid).then(res => {
                // console.log(res,205);
                self.filename = res
                if(res == "没有附件"){
				    this.isShowPdf = false;
                }else{
                    this.isShowPdf = true;
                }
				// console.log(this.filename);
				// this.isShowPdf = true
            })
        },
		removeFile(e) {
			switch (e) {
				case "fileone":
                    api._removeNode(this.update.nodeid).then(res => {
                        this.isShowPdf = false
                        // this.update.nodeid = null
                    })
				break;
				case "filetwo":
					this.isShowPdfTwo = false
				break;
			}
		},
		matchType(filename){
			// console.log(this.filename,230);
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