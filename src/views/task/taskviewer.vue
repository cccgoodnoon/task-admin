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
      <el-input type="textarea" v-model="user.description" readonly></el-input>
    </el-form-item>
    <el-form-item label="开始日期">
      <el-date-picker v-model="user.begintime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                      placeholder="选择日期" style="width: 100%;" readonly>
      </el-date-picker>
    </el-form-item>
    <el-form-item label="截止日期">
      <el-date-picker v-model="user.endtime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                      placeholder="选择日期" style="width: 100%;" readonly>
      </el-date-picker>
    </el-form-item>

    <el-form-item label="是否完成">
      <el-select v-model="user.state" prop="state" :disabled=true>
        <el-option label="已完成" value="1"></el-option>
        <el-option label="未完成" value="0"></el-option>
      </el-select>
    </el-form-item>


    <el-form-item label="附件">
      <el-row>
        <el-col :span="8" v-for="item in this.file_list" :key=item>
          <div class="avatar-uploader">
            <img width="40" height="40" :src="require('../../assets/file/'+matchType(item.filename)+'.png')">
            <p>{{item.filename}}</p>
          </div>
          <!-- 预览/删除遮罩 -->
          <div class="mask">
            <!--预览 -->
            <a @click="previewer(item.uuid)" target="_blank" title="点击预览">
              <i class="el-icon-zoom-in"></i>
            </a>
            <a @click="singeDownloadFile(item.uuid)" title="点击下载">
              <i class="el-icon-download"></i>
            </a>
          </div>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" native-type="submit">返回列表</el-button>
      <router-link :to="`/task/${this.$route.params.id}/attachments`">
        <el-button type="success">查看所有附件</el-button>
      </router-link>
    </el-form-item>
  </el-form>

</template>
<script>
  import api from "../../utils/auth"

  export const downloadFile = (url) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";  // 防止影响页面
    iframe.style.height = 0;  // 防止影响页面
    iframe.src = url;
    document.body.appendChild(iframe);  // 这一行必须，iframe挂在到dom树上才会发请求
    // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
    setTimeout(() => {
      iframe.remove();
    }, 5 * 60 * 1000);
  }
  export default {
    data() {
      return {
        user: {},
        isShowPdf: false,
        PdfViewer: "javascript:;",
        PdfDownload: "javascript:;",
        file_list: []
      }
    },
    mounted() {
      this.getUser();
    },
    methods: {
      singeDownloadFile(uuid) {
        downloadFile('http://202.120.167.50:8088/api/u/fdb/task/' + uuid);
      },
      previewer(uuid) {
        window.open("http://202.120.167.50:8088/api/u/fdb/task/content/" + uuid, '_blank');
      },
      reset() {
        this.$refs.create.resetFields();
      },
      getUser() {
        let self = this
        api._gets(self.$route.params.id).then(res => {
          self.user = res;
          // console.log(res);
          self.user.state = String(res['state'])
          self.user.nodeid = res['nodeid']
          if (self.user.nodeid != null && self.user.nodeid != 'None') {
            this.getFileName();
            // this.getFileLink("fileone");
          }
        }, err => {
          console.log(err);
        })
      },
      // getFileLink(p) {
      //   this.fileDownloadPath =
      //     "/api/u/fdb/task/" + this.user.nodeid;
      //   this.fileViewPath =
      //     "/api/u/fdb/task/" + this.user.nodeid + "/content";
      //   // console.log(this.fileViewPath,"url");
      //   switch (p) {
      //     case "fileone":
      //       this.PdfViewer = this.fileViewPath;
      //       this.PdfDownload = this.fileDownloadPath;
      //       break;
      //     case "filetwo":
      //       this.PdfViewerTwo = this.fileViewPath;
      //       break;
      //   }
      // },
      getFileName() {
        // console.log(this.user.nodeid,11111111);
        let self = this
        api._getFileName(this.user.nodeid).then(res => {
          this.file_list = res
          // console.log(this.filename);
          this.isShowPdf = true
        })
      },
      back() {
        this.$router.replace('/task/list');
      },
      matchType(filename) {
        // console.log(this.filename);
        var suffix = ''
        var result = ''
        try {
          var fileArr = filename.split('.')
          suffix = fileArr[fileArr.length - 1]
        } catch (err) {
          suffix = ''
        }
        if (!suffix) {
          result = false
          return result
        }
        var imglist = ['png', 'jpg', 'jpeg', 'gif']
        result = imglist.some(function (item) {
          return item === suffix
        })
        if (result) {
          result = 'image'
          return result
        }
        var txtlist = ['txt']
        result = txtlist.some(function (item) {
          return item === suffix
        })
        if (result) {
          result = 'txt'
          return result
        }
        var pdflist = ['pdf']
        result = pdflist.some(function (item) {
          return item === suffix
        })
        if (result) {
          result = 'pdf'
          return result
        }
        var doclist = ['doc']
        result = doclist.some(function (item) {
          return item === suffix
        })
        if (result) {
          result = 'doc'
          return result
        }
        var pptlist = ['ppt']
        result = pptlist.some(function (item) {
          return item === suffix
        })
        if (result) {
          result = 'ppt'
          return result
        }
        var ziplist = ['zip', 'rar']
        result = ziplist.some(function (item) {
          return item === suffix
        })
        if (result) {
          result = 'zip'
          return result
        }
        var mp4list = ['mp4']
        result = mp4list.some(function (item) {
          return item === suffix
        })
        if (result) {
          result = 'mp4'
          return result
        }
        var xlslist = ['xls', 'xlsx']
        result = xlslist.some(function (item) {
          return item === suffix
        })
        if (result) {
          result = 'xls'
          return result
        }
      }
    }
  }
</script>
<style>
  .el-form {
    margin: 50px 600px 0px 20px;
  }

  img {
    float: left;
    padding: 0;
    margin: 0px 0px 0px 8px;
  }

  p {
    padding: 5px 0px 0px 60px;
    font-family: sans-serif;
    margin: 2px 0px 0px 10px;
  }

  .mask {
    padding-left: 12px;
    float: left;
  }
</style>
