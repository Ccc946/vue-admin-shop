<template>
  <div>
    <!-- 头部面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/homeInfo' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card shadow="hover">
      <el-table :data="rightsListData" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag type="warning" v-else-if="scope.row.level === '1'">二级</el-tag>
                <el-tag type="danger" v-else>三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsListData: []
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        return;
      } else {
        this.rightsListData = res.data;
      }
    }
  }
};
</script>

<style scoped>
.el-card {
    margin: 20px 0;
}
</style>