<template>
  <div class="first">
    <el-upload
      class="upload-demo"
      drag
      ref="upload"
      :action=uploadFileURL
      :on-change="handleChooseFile"
      :data="upData"
      :auto-upload="false"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <el-button type="primary" style="margin-top: 30px" @click="confirm">确认</el-button>
    <el-button type="default" style="margin-top: 30px" @click="cancel">取消</el-button>
  </div>
</template>

<script>
  // Requirement
  // 控件接口参数
  // Input
  // - url：服务端用于接收上传文件的url
  // - owner: 文件所有者，等同于数据库中的parent，也等同于当前模块中的taskid
  // - mode：当前工作模式，"addnew"或"update"，default为"addnew"。因为发给服务端的都是POST请求，所以该参数可用于服务端判别是新增还是更新。
  // 允许owner和mode不提供，则服务端默认将所上传文件视为临时文件，临时文件会在超时后由服务端自动删除。
  // Output
  // - 从服务端返回的已成功上传的文件的id和文件名。用于本控件的使用者在addnew、update一个task对象时使用。
  // 操作
  // - 一般情况下是利用构造的URL从父控件转移到当前uploader控件的。跳转的同时由父控件完成输入参数赋值。这样该控件就可以拿到输入的值。例如：
  //      http://<domain>/openedu2020/admin/#/task/tasks/3F4242324742DE4/attachments/new
  //      http://<domain>/openedu2020/admin/#/task/attachments/new
  // Reference
  // 嵌套路由, https://router.vuejs.org/zh/guide/essentials/nested-routes.html
  // 路由组件传参, https://router.vuejs.org/zh/guide/essentials/passing-props.html#%E5%B8%83%E5%B0%94%E6%A8%A1%E5%BC%8F
  //
  import "../../service/foundation";
  import api from "../../utils/auth";
  import {mapMutations} from "vuex";
  import axios from "axios";
  import uploadfile from "../upload/uploadfile";
  import router from "../../router";

  export default {
    name: 'uploader',
    data() {
      return {
        fileList: [],
        uploadFileURL: "",
      };
    },
    computed: {
      upData() {
        return {
          body: JSON.stringify(this.form)
        };
      }
    },
    mounted() {
      this.getURL();
    },
    methods: {
      ...mapMutations({
        setFileList: 'duty/setFileList'
      }),
      confirm() {
        this.setFileList(this.fileList);
        if (this.$route.query.nodeid != null) {
          this.$refs.upload.submit();
          this.$router.back();
        } else {
          this.$router.back();
        }
      },
      getURL() {
        this.uploadFileURL = "http://127.0.0.1:5000/api/u/fdb/task/updatefile/" + this.$route.query.nodeid
      },
      cancel() {
        this.$router.back();
      },
      handleChooseFile(file, fileList) {
        this.fileList = fileList;
      },

      // 上传文件超出个数
      handleExceed(files, fileList) {
        this.$message.warning(`当前只能选择上传1 个文件`);
      },
      // 移除文件
      handleRemove(res, file, fileList) {
        this.$message.warning(`移除当前${res.name}文件，请重新选择文件上传！`);
        this.removeFile("fileone");
      },
      back() {
        this.$message({
          message: "返回编辑",
          type: "success"
        });
        this.$router.replace(`/task/edit/${this.$route.params.id}`);
      }
    }
  };
</script>

<style>
  .actions {
    float: left;
    margin-right: 15px;
    margin-bottom: 15px;
  }

  .first {
    width: 50%;
    float: left;
    height: 650px;
    margin-top: 80px;
    margin-left: 50px;
  }

  .upload-demo .el-upload {
    /* border: 1px dashed #d9d9d9; */
    /* border-radius: 6px; */
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 95%;
  }

  .down {
    margin-top: 50px;
  }
</style>
