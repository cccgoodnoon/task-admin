<template>
  <!-- <div class="app-container">
  </div> -->
  <el-form>
    <el-form-item label="附件" v-if="isShowPdf">
      <el-row>
				<el-col :span="8">
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
					</div>
				</el-col>
			</el-row>
    </el-form-item> 
  </el-form>
</template>

<script>
// Requirement
// 支持参数：
// - url: 服务端获取附件list的url，例如/task/{id}/attachments，
// - taskid: 任务标识
// - readonly: true or false
// 功能要求
// - 调用服务端restful接口并从服务端取得attachments数据，以list风格显示。包括文件名、大小、上传日期
// - 支持如下操作：download、open和删除。如果readonly为true，则隐掉删除按钮。
//
import "../../service/foundation"
import api from "../../utils/auth"

export default {
  data() {
    return {
      user:{},
      isShowPdf:false,
      PdfViewer: "javascript:;",
    }
  },
  mounted(){
      this.getUser();
  },
  methods:{
		getUser(){
			let self = this
			api._gets(self.$route.params.id).then(res => {
          // self.user = res;
          // console.log(res);
          // self.user.state = String(res['state'])
          self.nodeid = res['nodeid']
          if (self.nodeid != null) {
					this.getFileName();
					this.getFileLink("fileone");
          }
			},err => {
				console.log(err);
        })
    },
		getFileLink(p) {
			this.filePath = 
				"/api/u/fdb/task/"+this.nodeid+"/content";
			// console.log(this.filePath,"url");
			switch (p) {
				case "fileone":
					this.PdfViewer = this.filePath;
				break;
				case "filetwo":
					this.PdfViewerTwo = this.filePath;
				break;
			}
    },
    getFileName(){
			// console.log(this.user.nodeid,11111111);
			let self = this
      api._getOneNode(this.nodeid).then(res => {
        self.filename = res
				// console.log(this.filename);
				this.isShowPdf = true
      })
    },

		matchType(filename){
			// console.log(this.filename);
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
.actions{
    float: left;
    margin-right: 15px;
    margin-bottom: 15px;
}
.el-form{
	margin: 50px 600px 0px 20px;
  padding-left: 30px;
  padding-top: 50px;

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