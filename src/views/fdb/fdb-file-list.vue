<template>
  <el-container>
    <div class="chartLineBox" style="height:50px"></div>
    <el-main>
      <div id="user">
        <h2>上传文件一览</h2>
        <el-row class="line-display">
          <el-col :span="22" :offset="1">
            <div class="grid-content" style="margin-top:0px; border:0">
              <el-row>
                <el-col :span="12">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="/api/u/fdb/task"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :on-success="upFile"
                    :on-error="uploadFalse"
                    multiple
                    :limit="3"
                    :auto-upload="false"
                    :on-exceed="handleExceed"
                    :before-upload="beforeUpload">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                    </el-button>
                    <div slot="tip" class="el-upload__tip">最多上传3个文件，且文件大小不超过10MB</div>
                  </el-upload>
                </el-col>
              </el-row>
              <el-row>
                <div class="searchWord">
                  <el-input v-model="search" style="display: inline-block;width: 300px"
                            placeholder="输入搜索文件名称">
                  </el-input>
                </div>
              </el-row>
              <el-button type="success" size="small" @click="multiDownload">批量下载</el-button>
              <el-button type="danger" size="small" @click="multiDelete">批量删除</el-button>
              <el-col :span="24" style="height:20px;"></el-col>
              <el-table
                :data="tables"
                style="width: 100%"
                height="550"
                stripe
                ref="test"
              >
                <el-table-column type="selection"
                                 width="50">
                </el-table-column>
                <el-table-column prop="uuid"
                                 label="uuid"
                                 sortable
                                 width="200">
                </el-table-column>
                <el-table-column prop="curname"
                                 label="文件名称"
                                 width="200">
                </el-table-column>
                <el-table-column prop="originname"
                                 label="文件原名"
                                 sortable
                                 width="150">
                </el-table-column>
                <el-table-column prop="upddate"
                                 label="更新时间"
                                 sortable
                                 width="150">
                </el-table-column>
                <el-table-column prop="crtdate"
                                 label="创建时间"
                                 width="150">
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="200">
                  <template slot-scope="scope">
                    <el-button type="success" size="small" @click="downloadNode(scope.$index, scope.row)">下载</el-button>
                    <el-button type="danger" size="small" @click="removeNode(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters,
    mapActions
  } from 'vuex';
  import api from "../../utils/auth"
  import table from "../../../mock/table";

  export const downloadFile =                                                                                                                                                                                                                                                                                  (url) => {
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
    name: '',
    data() {
      return {
        activities: [],
        search: '',
        filelist: [],
        filter: {
          per_page: 10, // 页大小
          page: 1, // 当前页
          id: '',
          description: '',
          endtime: '',
          performer: '',
          state: '',
          title: '',
          sorts: '',
        },
        selected: [], //已选择项
      }

    },

    mounted() {
      this.getActivities();
    },
    computed: {
      // 模糊搜索
      tables() {
        const search = this.search
        if (search) {
          return this.activities.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.activities
      }
    },
    methods: {
      multiDelete() {
        for (let item in this.$refs.test.selection) {
          let uuid = this.tables[item].uuid;
          let curname = this.tables[item].curname;
          api._removeNode(uuid).then(res => {
            this.$message.success('成功删除了该文件' + curname + ' !');
            this.getActivities();
            // console.log(row.id);
          }).catch((res) => {
            // this.$message.error('删除失败!');
            this.getActivities();
          });
        }
      },
      multiDownload() {
        for (let item in this.$refs.test.selection) {
          let uuid = this.tables[item].uuid;
          let curname = this.tables[item].curname;
          downloadFile('http://202.120.167.50:8088/api/u/fdb/task/' + uuid);
        }
      },


      tableSelectionChange(val) {
        this.selected = val;
      },
      //每页显示多少条
      pageSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.filter.per_page = val;
        this.getActivities();
      },
      //当前页选择
      pageCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.filter.page = val;
        this.getActivities();
      },
      rowClick(row, event) {
        var index = $.inArray(row, this.selected);
        if (index < 0) {
          this.selected.push(row);
          this.$refs.usersTable.toggleRowSelection(row, true);
        } else {
          this.selected.splice(index, 1);
          this.$refs.usersTable.toggleRowSelection(row, false);
        }
      },
      getActivities() {
        let self = this
        api._getNode().then(res => {
          self.activities = res;
          // console.log(res,8888);
        }, err => {
          console.log(err);
        })
      },
      // 删除单个node
      removeNode(index, row) {
        this.$confirm('是否要删除' + row.curname + ' ?', '提示', {
          type: 'warning'
        }).then(() => {
          api._removeNode(row.uuid).then(res => {
            this.$message.success('成功删除了该文件' + row.curname + ' !');
            this.getActivities();
            // console.log(row.id);
          }).catch((res) => {
            // this.$message.error('删除失败!');
            this.getActivities();
          });
        })
      },
      // handleFileUpload(upload) {
      //     let formData = new FormData();
      //     formData.append("file", upload.file);
      //     formData.append('group', 'system');

      //     // let config = {
      //     //     headers: {
      //     //         "Content-Type": "multipart/form-data"
      //     //     }
      //     // };
      //     console.log(formData);

      //     api._postFile({data:formData}).then((data) => {
      //         // var src = URL.createObjectURL(upload.file);
      //         console.log(data);
      //     }).catch((err)=> {
      //         console.log(err,'error');
      //     })
      //     // return "http://47.114.154.188:8080/ndb/file"
      // },
      submitUpload() {
        this.$refs.upload.submit();
        this.getActivities();
      },
      uploadFalse(response, file, fileList) {
        console.log(response);
        this.$message.error(response.message);
      },
      downloadNode(index, row) {
        var down = 'http://202.120.167.50:8088/api/u/fdb/task/' + row.uuid
        window.location.href = down
        console.log(row, 1111);

        // api._downloadNode(row.uuid).then(res => {
        //     this.$message.success('成功下载了该文件' + row.originname + ' !');
        //     console.log(res);
        //     // res = window.location.href
        //     // this.getActivities();
        //     // console.log(row.id);
        // }).catch((res) => {
        //     this.$message.error('下载!');
        //     // this.getActivities();
        // });
        // window.location.href
      },
      upFile(response, file, fileList) {
        console.log(response);
        let self = this
        if (response.status == 201) {
          self.$message.success("上传成功");
          self.getActivities();
        }
      },
      handleCurrentChange(cpage) {
        this.currpage = cpage;
      },
      handleSizeChange(psize) {
        this.pagesize = psize;
      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },

      beforeUpload(file) {
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const isLt2M = file.size / 1024 / 1024 < 100     //这里做文件大小限制
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 10MB!',
            type: 'warning'
          });
        }
        return isLt2M
      },
    }
  }
</script>
<style>
  ul li {
    list-style: none
  }

  .tc {
    text-align: center;
  }

  .mg {
    margin-top: 1px;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
    margin-top: 0px
  }

  h2 {
    text-align: center;
    margin-bottom: 0px
  }

  .searchWord {
    margin-top: 20px;
  }

  ::-webkit-scrollbar {
    width: 9px;
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #d6e4f0;
    border-radius: 3px;
  }

  .el-table {
    color: black;
    border: 1px solid #d6e4f0;
    height: 500px;
  }

  .el-table__body tr.current-row > td {
    background-color: #d6e6f2 !important;
    color: #537791;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #d6e6f2;
    color: #537791;
  }
</style>
