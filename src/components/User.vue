<template>
  <div>
    <!-- 头部面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeInfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card shadow="hover">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <div>
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="queryHandle"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="showAddUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="assignRoles(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 弹出添加用户框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="addUserFormBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出修改用户表单 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="addUserFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelEditBtn">取 消</el-button>
        <el-button type="primary" @click="editFormBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户：{{userInfo.username}}</p>
        <p>当前角色：{{userInfo.role_name}}</p>
        <p>
          分配角色：
          <el-select
            v-model="selectRoleId"
            filterable
            allow-create
            default-first-option
            placeholder="请选择文章标签"
          >
            <el-option
              v-for="item in rolesLsit"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //自定义邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      var regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
      if (value === "") {
        return callback(new Error("请输入邮箱地址"));
      } else {
        if (regEmail.test(value)) {
          return callback();
        } else {
          return callback(new Error("请输入正确的邮箱地址"));
        }
      }
    };
    //手机号验证规则
    var checkMobile = (rule, value, callback) => {
      var regMobile = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
      if (value === "") {
        return callback(new Error("请输入手机号"));
      } else {
        if (regMobile.test(value)) {
          return callback();
        } else {
          return callback(new Error("请输入正确的手机号码"));
        }
      }
    };
    return {
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 添加用户
      addDialogVisible: false,
      //添加的用户的信息
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户的表单规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }]
      },
      //修改用户信息
      editForm: {},
      // 修改用户
      editDialogVisible: false,

      // 分配角色对话框
      setRoleDialogVisible: false,
      // 当前需要被分配角色的用户
      userInfo: {},
      // 所有角色数据列表
      rolesLsit: [],
      // 已选中的角色Id值
      selectRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //发送请求，获取用户列表数据
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    // 监听 switch开关 状态改变
    async userStateChanged(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功！");
    },
    // 每页显示的数量改变时
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 页码改变时
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 搜索框
    queryHandle() {
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    // 添加用户按钮
    showAddUser() {
      this.addDialogVisible = true;
    },
    //  表单重置按钮时间
    cancelBtn() {
      this.addDialogVisible = false;
      this.$refs.addUserFormRef.resetFields();
    },
    // 提交添加用户表单
    addUserFormBtn() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.post(
            "users",
            this.addUserForm
          );
          if (res.meta.status !== 201) {
            return this.$message.error("添加用户失败！");
          } else {
            this.$message.success("添加用户成功！");
            // 隐藏添加用户对话框
            this.addDialogVisible = false;
            this.getUserList();
          }
        }
      });
    },
    // 修改用户信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 取消修改
    cancelEditBtn() {
      this.$refs.editFormRef.resetFields();
      this.editDialogVisible = false;
    },
    // 提交修改
    editFormBtn() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.put(
            "users/" + this.editForm.id,
            { email: this.editForm.email, mobile: this.editForm.mobile }
          );
          if (res.meta.status !== 200) {
            return this.$message.error("修改用户失败！");
          } else {
            this.$message.success("修改用户成功！");
            // 隐藏添加用户对话框
            this.editDialogVisible = false;
            this.getUserList();
          }
        }
      });
    },
    // 删除用户
    async deleteUser(id) {
      const result = await this.$confirm(
        "此操作将删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (result === "cancel") {
        this.$message.info("已取消删除操作");
      } else {
        const { data: res } = await this.$http.delete("users/" + id);
        if (!res.meta.status == 200) {
          return this.$message.error("删除用户失败！");
        } else {
          this.$message.success("删除用户成功！");
          this.getUserList();
        }
      }
    },
    //分配角色
    async assignRoles(role) {
      this.userInfo = role;
      // 展示对话框之前，获取所有角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesLsit = res.data;
      this.setRoleDialogVisible = true;
    },
    // 分配角色
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      const {
        data: res
      } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectRoleId
      });
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户角色失败！");
      }
      this.$message.success("更新角色成功！");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 分配角色对话框关闭事件
    setRoleDialogClosed() {
      this.selectRoleId = "";
      this.userInfo = {};
    }
  }
};
</script>

<style scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin: 20px 0;
}
</style>