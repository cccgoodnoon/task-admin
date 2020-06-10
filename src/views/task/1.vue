<template>
  <div class="attachmentManagement">
    <div class="breadcrumb">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>合同管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 搜索部分 -->
    <el-card style="margin-top:10px;" class="searchCard">
      <el-form
        :model="where"
        ref="ruleForm"
        label-width="80px"
        :inline="true"
        :cell-style="cellStyle"
        class="searchform"
      >
        <el-form-item label="合同编号">
          <el-input placeholder="请输入合同编号" v-model="where.HTBH" clearable></el-input>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input placeholder="请输入合同名称" v-model="where.HTMC" clearable></el-input>
        </el-form-item>
        <el-form-item label="发票编号">
          <el-input placeholder="请输入发票编号" v-model="where.FPBH" clearable></el-input>
        </el-form-item>
        <el-form-item label="供应商">
          <el-input placeholder="请输入供应商" v-model="where.GYSXX" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" circle class="btnmargin" @click="search"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="medium"
            @click="addht"
            class="btnmargin"
          >添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格部分 -->
    <el-card shadow="never">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        max-height="610px"
        :header-cell-style="{'background':'#f2f2f2'}"
      >
        <el-table-column prop="rownum" align="center" width="55" label="序号"></el-table-column>
        <el-table-column prop="HTBH" align="center" label="合同编号"></el-table-column>
        <el-table-column prop="HTMC" align="center" label="合同名称"></el-table-column>
        <el-table-column prop="FPBH" align="center" label="发票编号"></el-table-column>
        <el-table-column prop="HTJE" align="center" label="合同金额（万元）" width="90"></el-table-column>
        <el-table-column prop="FPJE" align="center" label="发票金额（万元）" width="90"></el-table-column>
        <el-table-column prop="QDRQ" align="center" label="签订时间" width="140"></el-table-column>
        <el-table-column prop="address" align="center" label="电子合同" width="90">
          <template slot-scope="scope">
            <el-button type="text" @click="setLookUrl(scope,'HTFJ')">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" align="center" label="电子发票" width="90">
          <template slot-scope="scope">
            <el-button type="text" @click="setLookUrl(scope,'FPFJ')">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" align="center" label="验收材料" width="90">
          <template slot-scope="scope">
            <el-button type="text" @click="setLookUrl(scope,'YSCLFJ')">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="address" align="center" label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" @click="editht(scope)">编辑</el-button>
            <el-button type="text" @click="delet(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="where.page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="where.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="where.total"
      ></el-pagination>
    </el-card>
    <!-- 添加合同对话框 -->
    <el-dialog
      :title="dialogVisibleTitle"
      :visible.sync="addDialogVisible"
      :close-on-click-modal = false
      @close="addDialogClosed"
      width="1000px"
    >
      <!-- 添加合同表单 -->
      <!-- 添加合同表单 -->
      <el-form ref="addform" :model="UniProp_FJ" :rules="addrules" label-width="120px">
        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="合同编号" prop="HTBH">
              <el-input v-model="UniProp_FJ.HTBH"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="合同名称" prop="HTMC">
              <el-input v-model="UniProp_FJ.HTMC"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="签订日期" prop="QDRQ">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="UniProp_FJ.QDRQ"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="合同金额(万元)" prop="HTJE">
              <el-input step="0.01" v-model="UniProp_FJ.HTJE"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="12" :offset="2">
            <el-form-item label="电子版合同" prop="HTFJ">
              <el-row>
                <!-- 点击预览 -->
                <el-col :span="8" v-if="isShowHTFJ">
                  <div class="avatar-uploader">
                    <img width="80" height="80" src="../assets/pdf.png" alt />
                    <!-- 预览删除遮罩 -->
                    <div class="mask">
                      <a :href="HTFJLooker" target="_blank" title="点击预览">
                        <i class="el-icon-zoom-in"></i>
                      </a>
                      <!-- 删除重新上传 -->
                      <i class="el-icon-delete" @click="removeFile('HTFJ')"></i>
                    </div>
                  </div>
                </el-col>
                <!-- 上传PDF -->
                <el-col :span="8" v-else>
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadURL"
                    :limit="1"
                    :beforeUpload="beforeUpload"
                    :onSuccess="succeedUploadHT"
                    :on-error="uploadError"
                    :headers="headerObj"
                    :show-file-list="false"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-col>
                <el-col :span="8">
                  <el-button size="medium" icon="el-icon-upload2">手机上传</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="供应商信息" prop="GYSXX">
              <el-input v-model="UniProp_FJ.GYSXX"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" :offset="2">
            <el-form-item label="发票编号" prop="FPBH">
              <el-input v-model="UniProp_FJ.FPBH"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="发票金额(万元)" prop="FPJE">
              <el-input step="0.01" v-model="UniProp_FJ.FPJE"></el-input>
              <!-- <span>万元</span> -->
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 电子版发票 -->
        <el-row type="flex" align="middle">
          <!-- 点击预览 -->
          <el-col :span="12" :offset="2">
            <el-form-item label="电子版发票" prop="FPFJ">
              <el-row>
                <el-col :span="8" v-if="isShowFPFJ">
                  <div class="avatar-uploader">
                    <img width="80" height="80" src="../assets/pdf.png" alt />
                    <!-- 预览删除遮罩 -->
                    <div class="mask">
                      <a :href="FPFJLooker" target="_blank" title="点击预览">
                        <i class="el-icon-zoom-in"></i>
                      </a>
                      <!-- 删除重新上传 -->
                      <i class="el-icon-delete" @click="removeFile('FPFJ')"></i>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8" v-else>
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadURL"
                    :limit="1"
                    :beforeUpload="beforeUpload"
                    :onSuccess="succeedUploadFP"
                    :on-error="uploadError"
                    :headers="headerObj"
                    :show-file-list="false"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-button size="medium" icon="el-icon-upload2">手机上传</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 验收材料 -->
        <el-row type="flex" align="middle">
          <!-- 点击预览 -->
          <el-col :span="12" :offset="2">
            <el-form-item label="验收材料" prop="YSCLFJ">
              <el-row>
                <el-col :span="8" v-if="isShowYSCLFJ">
                  <div class="avatar-uploader">
                    <img width="80" height="80" src="../assets/pdf.png" alt />
                    <!-- 预览删除遮罩 -->
                    <div class="mask">
                      <a :href="YSCLFJLooker" target="_blank" title="点击预览">
                        <i class="el-icon-zoom-in"></i>
                      </a>
                      <!-- 删除重新上传 -->
                      <i class="el-icon-delete" @click="removeFile('YSCLFJ')"></i>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8" v-else>
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadURL"
                    :beforeUpload="beforeUpload"
                    :onSuccess="succeedUploadYSCL"
                    :on-error="uploadError"
                    :headers="headerObj"
                    :show-file-list="false"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-col>
                <el-col :span="6">
                  <el-button size="medium" icon="el-icon-upload2">手机上传</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="备注">
              <el-input
                type="text"
                maxlength="200"
                show-word-limit
                placeholder="当发票和合同不唯一关联时，说明关联内容和金额"
                v-model="UniProp_FJ.MEMO"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFormData">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { QueryService, UpdateService } from "@/utils/api.js";
import { showLoading, hideLoading } from "@/loading.js";
export default {
  name: "attachmentManagement",
  data() {
    return {
      // 表格数据
      tableData: [],
      // 查询条件
      where: {
        HTBH: "",
        HTMC: "",
        FPBH: "",
        GYSXX: ""
      },
      // 控制添加合同对话框的显示与隐藏
      addDialogVisible: false,
      // 控制是否可以查看电子合同PDF
      isLookHTFJ: false,
      // 控制是否可以查看电子发票PDF
      isLookFPFJ: false,
      // 控制是否可以查看验收材料
      isLookYSCLFJ: false,
      // 添加合同表单
      UniProp_FJ: {
        HTBH: "",
        HTMC: "",
        HTJE: "",
        QDRQ: "",
        GYSXX: "",
        FPBH: "",
        FPJE: "",
        MEMO: "",
        IID: 0,
        STATUS: "0",
        HTFJ: "",
        FPFJ: "",
        YSCLFJ: ""
      },
      HTFJLooker: "javascript:;",
      FPFJLooker: "javascript:;",
      YSCLFJLooker: "javascript:;",
      // 添加表单的验证信息
      addrules: {
        htbh: [{ required: true, message: "请输入合同编号", trigger: "blur" }],
        htname: [
          { required: true, message: "请输入合同名称", trigger: "blur" }
        ],
        qdrq: [{ required: true, message: "请选择签订日期", trigger: "blur" }],
        htje: [{ required: true, message: "请输入合同金额", trigger: "blur" }],
        dzbht: [
          { required: true, message: "请上传电子版合同", trigger: "blur" }
        ],
        gysxx: [
          { required: true, message: "请输入供应商信息", trigger: "blur" }
        ],
        fpbh: [{ required: true, message: "请输入发票编号", trigger: "blur" }],
        fpje: [{ required: true, message: "请输入发票金额", trigger: "blur" }],
        dzbfp: [
          { required: true, message: "请上传电子版发票", trigger: "blur" }
        ]
      },
      // 上传组件的请求地址
      uploadURL: this.globalVar.ReqIPAddr + "/Base/Uploader",
      // 上传组件的请求头对象
      headerObj: {
        token: this.globalVar.getUserInfoByKey("utoken"),
        openid: this.globalVar.getUserInfoByKey("uid")
      },
      // 添加对话框预校验规则
      addrules: {
        HTBH: [{ required: true, message: "请输入合同编号", trigger: "blur" }],
        HTMC: [{ required: true, message: "请输入合同名称", trigger: "blur" }],
        QDRQ: [{ required: true, message: "请选择签订日期", trigger: "blur" }],
        HTJE: [
          {
            required: true,
            message: "合同金额为数字类型,最多保留两位小数",
            pattern: /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/,
            trigger: "blur"
          }
        ],
        GYSXX: [
          { required: true, message: "请输入供应商信息", trigger: "blur" }
        ],
        FPBH: [{ required: true, message: "请输入发票编号", trigger: "blur" }],
        FPJE: [
          {
            required: true,
            message: "发票金额为数字类型,最多保留两位小数",
            pattern: /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/,
            trigger: "blur"
          }
        ],
        HTFJ: [
          {
            required: true,
            message: "请上传电子版合同",
            trigger: "blur"
          }
        ],
        FPFJ: [
          {
            required: true,
            message: "请上传电子版发票",
            trigger: "blur"
          }
        ],
        YSCLFJ: [
          { required: true, message: "请上传电子版验收材料", trigger: "blur" }
        ]
      },
      // 添加/编辑对话框 title
      dialogVisibleTitle: "",
      // 控制是否可以查看电子合同PDF
      isShowHTFJ: false,
      isShowFPFJ: false,
      isShowYSCLFJ: false
    };
  },
  created() {
    // 初始化where
    this.where = this.globalVar.baseWhere(this.where);
    this.where.sidx = "CJRQ";
    // console.log(this.where)
    this.getTableInfo();
  },
  methods: {
    // 上传组件 上传前的预处理
    beforeUpload(file) {
      var ext = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      const sizeOver = file.size / 1024 / 1024 > 30;
      // this.isShowHTFillList = true;
      // this.isShowFPFillList = true;
      if (ext !== "pdf") {
        this.$message({
          message: "只能上传pdf格式!",
          type: "warning"
        });
        return false;
      }
      if (sizeOver) {
        this.$message({
          message: "文件不能超过 30MB!",
          type: "warning"
        });
        return false;
      }
      // 开启加载动画
      showLoading();
    },
    // 电子合同上传成功时的回调
    succeedUploadHT(response, file, fileList) {
      if (response.err == "") {
        this.UniProp_FJ.HTFJ = response.fn;
        this.getFileLink("HTFJ");
        this.isShowHTFJ = true;
        this.isShowHTFillList = false;
        hideLoading(); //结束加载动画
        this.$message({
          type: "success",
          message: "文件上传成功"
        });
      }
    },
    // 电子发票上传成功时的回调
    succeedUploadFP(response, file, fileList) {
      if (response.err == "") {
        this.UniProp_FJ.FPFJ = response.fn;
        this.getFileLink("FPFJ");
        this.isShowFPFJ = true;
        this.isShowFPFillList = false;
        hideLoading(); //结束加载动画
        this.$message({
          type: "success",
          message: "文件上传成功"
        });
      }
    },
    // 验收材料上传成功时的回调
    succeedUploadYSCL(response, file, fileList) {
      if (response.err == "") {
        this.UniProp_FJ.YSCLFJ = response.fn;
        this.getFileLink("YSCLFJ");
        this.isShowYSCLFJ = true;
        this.isShowYSCLFillList = false;
        hideLoading(); //结束加载动画
        this.$message({
          type: "success",
          message: "文件上传成功"
        });
      }
    },
    // 文件上传失败时的回调
    uploadError(err, file, fileList) {
      // console.log(err);
      hideLoading(); //结束加载动画
      this.$message({
        type: "error",
        message: "文件上传失败，请重新上传"
      });
    },
    // 预览遮罩层删除事件
    removeFile(e) {
      this.UniProp_FJ[e] = "";
      switch (e) {
        case "HTFJ":
          this.isShowHTFJ = false;
          break;
        case "FPFJ":
          this.isShowFPFJ = false;
          break;
        case "YSCLFJ":
          this.isShowYSCLFJ = false;
          break;
      }
    },
    // 请求表格数据信息
    getTableInfo() {
      var _this = this;
      QueryService(this.where, "post", "/DataGate/GetFJ", function(data) {
        // console.log(data)
        _this.tableData = data.data;
        _this.where.total = data.total;
      });
    },
    // 查询
    search() {
      this.getTableInfo();
    },
    // 添加/编辑 合同数据
    addFormData() {
      var _this = this;
      // 判断发票金额是否超过合同金额
      if (this.UniProp_FJ.FPJE > this.UniProp_FJ.HTJE) {
        this.$confirm("发票金额大于合同金额, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 处理表单预校验,然后发起添加操作
            _this.$refs["addform"].validate(valid => {
              if (valid) {
                console.log(valid);
                //预校验成功
                console.log(_this.UniProp_FJ);
                let pms = "data=" + JSON.stringify(_this.UniProp_FJ);
                UpdateService(
                  pms,
                  "post",
                  "/DataGate/EditModel?model=UniProp_FJ",
                  function(data) {
                    console.log(data);
                    if (data.err == "") {
                      if (_this.UniProp_FJ.IID == 0) {
                        _this.UniProp_FJ.IID = data.IID;
                      }
                      _this.addDialogVisible = false;
                      _this.getTableInfo();
                    } else {
                      _this.$message({
                        message: "操作失败",
                        type: "error"
                      });
                    }
                  }
                );
              } else {
                //预校验失败
                _this.$message({
                  message: "请保证信息填写正确！",
                  type: "error"
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消添加"
            });
          });
      } else {
        // 处理表单预校验,然后发起添加操作
        _this.$refs["addform"].validate(valid => {
          if (valid) {
            //预校验成功
            let pms = "data=" + JSON.stringify(_this.UniProp_FJ);
            UpdateService(
              pms,
              "post",
              "/DataGate/EditModel?model=UniProp_FJ",
              function(data) {
                if (data.err == "") {
                  if (_this.UniProp_FJ.IID == 0) {
                    _this.UniProp_FJ.IID = data.IID;
                  }
                  _this.addDialogVisible = false;
                  _this.getTableInfo();
                } else {
                  _this.$message({
                    message: "操作失败",
                    type: "error"
                  });
                }
              }
            );
          } else {
            //预校验失败
            _this.$message({
              message: "请保证信息填写正确！",
              type: "error"
            });
          }
        });
      }
    },
    // 添加合同按钮
    addht() {
      this.dialogVisibleTitle = "添加合同";
      //初始化表单元素
      this.isLookHTFJ = false;
      this.isLookFPFJ = false;
      this.isLookYSCLFJ = false;
      for (var it in this.UniProp_FJ) {
        if (it == "IID") {
          this.UniProp_FJ[it] = 0;
        } else if (it == "STATUS") {
          this.UniProp_FJ[it] = "0";
        } else {
          this.UniProp_FJ[it] = "";
        }
      }
      this.addDialogVisible = true;
    },
    // 编辑合同按钮
    editht(scope) {
      // console.log(scope.row);
      this.dialogVisibleTitle = "编辑合同";
      this.isShowHTFJ = true;
      this.isShowFPFJ = true;
      this.isShowYSCLFJ = true;
      for (var it in this.UniProp_FJ) {
        this.UniProp_FJ[it] = scope.row[it];
      }
      this.getFileLink("HTFJ");
      this.getFileLink("FPFJ");
      this.getFileLink("YSCLFJ");
      this.addDialogVisible = true;
    },
    // 删除合同
    delet(scope) {
      var _this = this;
      this.$confirm("您确定要删除该合同吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let pms = "ids=" + scope.row.IID;
          UpdateService(
            pms,
            "post",
            "/DataGate/DelByIID?model=UniProp_FJ",
            function(data) {
              if (data.err == "") {
                _this.getTableInfo();
                _this.$message({
                  message: "删除成功",
                  type: "success"
                });
              } else {
                _this.$message({
                  message: "操作失败",
                  type: "error"
                });
              }
            }
          );
        })
        .catch(() => {
          // 取消删除
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    },
    // 处理表格查看的路径
    setLookUrl(scope, p) {
      var url =
        this.globalVar.ReqIPAddr +
        this.globalVar.FileRoot +
        scope.row[p].split("$")[0];
      window.open(url, "_blank");
    },
    // 处理PDF预览路径    参数p是key
    getFileLink(p) {
      if (this.UniProp_FJ[p] != null) {
        let filePath =
          this.globalVar.ReqIPAddr +
          this.globalVar.FileRoot +
          this.UniProp_FJ[p].split("$")[0];
        switch (p) {
          case "HTFJ":
            this.HTFJLooker = filePath;
            break;
          case "FPFJ":
            this.FPFJLooker = filePath;
            break;
          case "YSCLFJ":
            this.YSCLFJLooker = filePath;
            break;
        }
      }
    },
    // 监听添加对话框关闭事件
    addDialogClosed() {
      this.isLookPdf = false;
    },
    // 表格数据格式化
    formatter(row, column) {
      // console.log(row)
      return row.glxm === 1 ? "是" : "否";
    },
    //
    handleSizeChange(val) {
      this.where.rows = val;
      this.getTableInfo();
    },
    //
    handleCurrentChange(val) {
      this.where.page = val;
      this.getTableInfo();
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return "text-align:center";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.attachmentManagement {
  background: #f0f2f5;
  margin-top: 10px;
}
.el-pagination {
  margin-top: 20px;
}
.searchform {
  width: 100%;
  height: 38px;
  padding-top: 0px;
}
.btnmargin {
  margin-left: 20px;
}
.el-breadcrumb {
  height: 50px;
  line-height: 50px;
}
.breadcrumb {
  padding-left: 20px;
  background: #fff;
}
.ylt {
  margin-right: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
/* 上传组件样式 */
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.el-icon-plus {
  font-size: 30px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
/* 预览遮罩 */
.mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  display: none;
}
.mask i {
  font-size: 20px;
  color: white;
}
.el-icon-delete{
  margin-top: -5px;
}
.avatar-uploader:hover .mask{
  display: block;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>