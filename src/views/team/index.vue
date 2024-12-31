<template>
  <div class="team-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-form">
        <div class="search-inputs">
          <el-input
            v-model="searchForm.teamName"
            placeholder="请输入团队名称"
            clearable
            style="width: 200px"
          />
          <el-input
            v-model="searchForm.leader"
            placeholder="请输入队长姓名"
            clearable
            style="width: 200px"
          />
          <el-input
            v-model="searchForm.competition"
            placeholder="请输入竞赛名称"
            clearable
            style="width: 200px"
          />
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="teamName" label="团队名称" width="150" />
      <el-table-column prop="leader" label="队长" width="120" />
      <el-table-column prop="members" label="团队成员" min-width="200" />
      <el-table-column prop="competition" label="参赛竞赛" width="200" />
      <el-table-column prop="award" label="获奖等级" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" fixed="right" width="180">
        <template #default="{ row }">
          <div class="operation-buttons">
            <el-button size="small" type="primary" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="warning" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'edit' ? '编辑团队信息' : '查看团队信息'"
      width="500px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        :disabled="dialogType === 'view'"
      >
        <el-form-item label="团队名称" prop="teamName">
          <el-input v-model="form.teamName" placeholder="请输入团队名称" />
        </el-form-item>
        <el-form-item label="队长" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入队长姓名" />
        </el-form-item>
        <el-form-item label="团队成员" prop="members">
          <el-input
            v-model="form.members"
            type="textarea"
            placeholder="请输入团队成员，多个成员用逗号分隔"
          />
        </el-form-item>
        <el-form-item label="参赛竞赛" prop="competition">
          <el-input v-model="form.competition" placeholder="请输入竞赛名称" />
        </el-form-item>
        <el-form-item label="获奖等级" prop="award">
          <el-input v-model="form.award" placeholder="请输入获奖等级" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" v-if="dialogType === 'edit'">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  teamName: '',
  leader: '',
  competition: '',
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('edit')
const formRef = ref(null)
const form = reactive({
  id: '',
  teamName: '',
  leader: '',
  members: '',
  competition: '',
  award: '',
})

// 表单验证规则
const rules = {
  teamName: [
    { required: true, message: '请输入团队名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2-50个字符之间', trigger: 'blur' },
  ],
  leader: [{ required: true, message: '请输入队长姓名', trigger: 'blur' }],
  members: [{ required: true, message: '请输入团队成员', trigger: 'blur' }],
  competition: [{ required: true, message: '请输入竞赛名称', trigger: 'blur' }],
  award: [{ required: true, message: '请输入获奖等级', trigger: 'blur' }],
}

// 获取团队列表
const getTeamList = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      pageNo: currentPage.value,
      pageSize: pageSize.value,
    }
    // TODO: 调用API获取数据
    loading.value = false
  } catch (error) {
    console.error('获取团队列表失败:', error)
    ElMessage.error('获取团队列表失败')
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getTeamList()
}

// 重置搜索
const resetSearch = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = ''
  })
  handleSearch()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTeamList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getTeamList()
}

// 查看
const handleView = (row) => {
  dialogType.value = 'view'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该团队信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // TODO: 调用删除API
        ElMessage.success('删除成功')
        getTeamList()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 提交
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用保存API
        ElMessage.success('保存成功')
        dialogVisible.value = false
        getTeamList()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

// 初始化
getTeamList()
</script>

<style scoped>
.team-container {
  padding: 20px;
  min-height: 100%;
}

.search-wrapper {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.search-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-inputs {
  display: flex;
  gap: 10px;
}

.search-buttons {
  display: flex;
  gap: 10px;
}

:deep(.el-table) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.operation-buttons {
  display: flex;
  gap: 8px;
}

.operation-buttons .el-button {
  padding: 4px 8px;
  min-height: 28px;
}
</style>
