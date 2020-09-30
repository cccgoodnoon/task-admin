<template>
  <el-form
    :model="update"
    :rules="updateRules"
    ref="update"
    label-width="100px"
  >
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
      <el-date-picker
        v-model="update.begintime"
        type="date"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="截止日期">
      <el-date-picker
        v-model="update.endtime"
        type="date"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="是否完成">
      <el-select v-model="update.state" prop="state">
        <el-option label="已完成" :value="'1'"></el-option>
        <el-option label="未完成" :value="'0'"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label=任务可见 prop="categoryid">
      <el-select v-model="update.categoryid">
        <el-option label="全部人可见" value="0"></el-option>
        <el-option label="仅老师可见" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="附件">
      <el-row>
        <el-col :span="8" v-for="item in this.file_list">
          <div class="avatar-uploader">
            <img
              width="40"
              height="40"
              :src="
                require('../../assets/file/' +
                  matchType(item.filename) +
                  '.png')
              "
            />
            <p>{{ item.filename}}</p>
          </div>
          <!-- 预览/删除遮罩 -->
          <div class="mask">
            <!--预览 -->
            <a @click="previewer(item.uuid)" target="_blank" title="点击预览">
              <i class="el-icon-zoom-in"></i>
            </a>
            <!-- 删除重新上传 -->
            <a @click="removeFile(item.uuid)" title="删除预览">
              <i class="el-icon-delete"></i>
            </a>
            <a @click="singeDownloadFile(item.uuid)" title="点击下载">
              <i class="el-icon-download"></i>
            </a>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-upload
            class="upload-demo"
            action="#"
            :multiple="true"
            :file-list="update.fileList"
            :auto-upload="false"
          >
            <el-button
              slot="tip"
              @click="chooseFile"
              size="small"
              type="primary"
            >选取文件
            </el-button
            >
          </el-upload>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="updateUser()">确 定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {mapMutations} from "vuex";
  // import api from "../../utils/auth";
  // import CONFIG_API_BASE_URL from "../../conf/config";
  // import axios from "axios";
  import { getOneTask,updateOneTask,getFileName,removeNode } from "../../api/api";
  import service from '@/utils/request';
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
    name: "edit",
    data() {
      return {
        update: {
          id: "",
          nodeid: "",
          description: "",
          begintime: "",
          endtime: "",
          performer: "",
          title: "",
          state: "",
          isFile: 0,
          fileList: [],
          categoryid:""
        },
        uploadFileURL: "",
        updateRules: {
          performer: [
            {
              required: true,
              message: "请输入姓名",
              trigger: "blur"
            },
            {
              min: 2,
              max: 15,
              message: "长度在 2 到 15 个字符"
            }
          ],
          title: [
            {
              required: true,
              message: "请输入任务名",
              trigger: "blur"
            },
            {
              min: 1,
              max: 25
            }
          ]
        },
        isShowPdf: false,
        PdfDownload: "javascript:;",
        file_list: [],
      };
    },
    activated() {
      const fileList = this.$store.state.duty.fileList;
      if (fileList && fileList.length > 0) {
        this.update.fileList = fileList;
      }
      this.getUser();
    },
    mounted() {
      this.getUser();
      // console.log("请求数据");
    },
    computed: {
      upData() {
        return {
          body: JSON.stringify(this.form)
        };
      }
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
        this.getActivities();
      },
      previewer(uuid) {
        let baseurl = process.env.VUE_APP_BASE_API
        // window.open("http://202.120.167.50:8088/api/u/fdb/task/content/" + uuid, '_blank');
        window.open("/api/u/fdb/task/content/" + uuid, '_blank');
      },
      singeDownloadFile(uuid) {
        downloadNode().then(res=>{
          this.$message.success('成功下载');
        })
      },
      chooseFile: function () {
        this.$router.push({
          path:"/task/attachments/new",
          query:{nodeid:this.update.nodeid}
        }
      )
        ;
      },
      submit() {
        console.log("提交修改", this.update);
      },
      reset() {
        this.$refs.create.resetFields();
      },
      getUser() {
        let self = this;
        getOneTask(self.$route.params.id).then(
          res => {
            self.update = res;
            self.update.state = String(res["state"]);
            self.update.categoryid = String(res["categoryid"]);
            self.update.nodeid = res["nodeid"];
            self.uploadFileURL = "/api/u/fdb/task/updatefile/" + res['nodeid']
            if (self.update.nodeid != null && self.update.nodeid != "None") {
              this.getFileName();
              this.getFileLink("fileone");
            }
          },
          err => {
            console.log(err);
          }
        );
      },
      updateUser() {
        updateOneTask(this.$route.params.id, this.update).then(res => {
          this.$message({
            message: "任务修改成功",
            type: "success"
          });
          // this.$refs.upload.submit()
          this.$router.push("/task/list");
          // console.log(res);
        });
      },
      handleCancel() {
        this.$router.replace("/task/list");
      },
      add() {
        this.$refs.upload.submit();
      },
      beforeImageUpload(file) {
        // const isTYPE = file.type === 'txt/pdf/png/jpg/jpeg/gif/doc/docx/xls/xlsx/ppt/pptx/mp4/zip/rar';
        const isLt20M = file.size / 1024 / 1024 < 20;

        // if (!isTYPE) {
        // this.$message.error('请选择正确的文件格式!');
        // }
        if (!isLt20M) {
          this.$message.error("上传文件大小不能超过 20MB!");
        }
        return isLt20M;
      },
      // 成功上传文件
      upFile(response, file, fileList) {
        // console.log(response);
        let self = this;
        if (response.status == 201) {
          this.$message.success("上传成功");
          // self.update.nodeid = localStorage.nodeid;
          self.update.nodeid = response.nodeid;
          // console.log(localStorage.nodeid);
          // console.log(response.nodeid,170);
          this.getFileLink("fileone");
          this.getFileName();
        }
      },
      uploadFalse(response, file, fileList) {
        // console.log(response);
        this.$message.error(response.message.slice(1, -2));
      },
      // 上传文件超出个数
      handleExceed(files, fileList) {
        this.$message.warning(`当前只能选择上传2 个文件`);
      },
      // 移除文件
      handleRemove(res, file, fileList) {
        if (file && file.status === "success") {
          this.$message.warning(`移除当前${res.name}文件，请重新选择文件上传！`);
          this.removeFile("fileone");
        }
      },
      getFileLink(p) {
        this.fileDownloadPath = "/api/u/fdb/task/" + this.update.nodeid;
        this.fileViewPath = "/api/u/fdb/task/" + this.update.nodeid + "/content";
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
      getFileName() {
        // console.log(this.update.nodeid,201);
        let self = this;
        getFileName(this.update.nodeid).then(res => {
          // console.log(res,205);
          this.file_list = res;
          if (res == "没有附件") {
            this.isShowPdf = false;
          } else {
            this.isShowPdf = true;
          }
          // console.log(this.filename);
          // this.isShowPdf = true
        });
      },
      removeFile(uuid) {
        removeNode(uuid).then(res => {
          this.getUser();
        });
      },
      matchType(filename) {
        var suffix = "";
        var result = "";
        try {
          var fileArr = filename.split(".");
          suffix = fileArr[fileArr.length - 1];
        } catch (err) {
          suffix = "";
        }
        if (!suffix) {
          result = false;
          return result;
        }
        var imglist = ["png", "jpg", "jpeg", "gif"];
        result = imglist.some(function (item) {
          return item === suffix;
        });
        if (result) {
          result = "image";
          return result;
        }
        var txtlist = ["txt"];
        result = txtlist.some(function (item) {
          return item === suffix;
        });
        if (result) {
          result = "txt";
          return result;
        }
        var pdflist = ["pdf"];
        result = pdflist.some(function (item) {
          return item === suffix;
        });
        if (result) {
          result = "pdf";
          return result;
        }
        var doclist = ["doc","docx"];
        result = doclist.some(function (item) {
          return item === suffix;
        });
        if (result) {
          result = "doc";
          return result;
        }
        var pptlist = ["ppt","pptx"];
        result = pptlist.some(function (item) {
          return item === suffix;
        });
        if (result) {
          result = "ppt";
          return result;
        }
        var ziplist = ["zip", "rar"];
        result = ziplist.some(function (item) {
          return item === suffix;
        });
        if (result) {
          result = "zip";
          return result;
        }
        var mp4list = ["mp4"];
        result = mp4list.some(function (item) {
          return item === suffix;
        });
        if (result) {
          result = "mp4";
          return result;
        }
        var xlslist = ["xls", "xlsx"];
        result = xlslist.some(function (item) {
          return item === suffix;
        });
        if (result) {
          result = "xls";
          return result;
        }
      }
    }
  };
</script>
<style>
  .el-form {
    margin: 50px 300px 0px 20px;
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
