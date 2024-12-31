<template>
  <div class="major-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-form">
        <div class="search-inputs">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入专业名称"
            clearable
            style="width: 200px"
          />
          <el-input
            v-model="searchForm.code"
            placeholder="请输入专业代码"
            clearable
            style="width: 200px"
          />
          <el-select
            v-model="searchForm.department"
            placeholder="所属院系"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="专业名称" width="200" />
      <el-table-column prop="code" label="专业代码" width="120" />
      <el-table-column prop="department" label="所属院系" width="180" />
      <el-table-column prop="description" label="专业描述" min-width="200" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="updateTime" label="更新时间" width="180" />
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
      :title="dialogType === 'edit' ? '编辑专业信息' : '查看专业信息'"
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
        <el-form-item label="专业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入专业名称" />
        </el-form-item>
        <el-form-item label="专业代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入专业代码" />
        </el-form-item>
        <el-form-item label="所属院系" prop="department">
          <el-select v-model="form.department" placeholder="请选择所属院系">
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="专业描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="4"
            placeholder="请输入专业描述"
          />
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
  name: '',
  code: '',
  department: '',
})

// 院系选项
const departmentOptions = [
  { label: '计算机学院', value: 'computer' },
  { label: '机械工程学院', value: 'mechanical' },
  { label: '电气工程学院', value: 'electrical' },
  { label: '经济管理学院', value: 'management' },
  { label: '外国语学院', value: 'foreign' },
]

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
  name: '',
  code: '',
  department: '',
  description: '',
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入专业名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2-50个字符之间', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入专业代码', trigger: 'blur' },
    { pattern: /^\d{6,8}$/, message: '专业代码必须为6-8位数字', trigger: 'blur' },
  ],
  department: [{ required: true, message: '请选择所属院系', trigger: 'change' }],
  description: [{ required: true, message: '请输入专业描述', trigger: 'blur' }],
}

// 获取专业列表
const getMajorList = async () => {
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
    console.error('获取专业列表失败:', error)
    ElMessage.error('获取专业列表失败')
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getMajorList()
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
  getMajorList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getMajorList()
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
  ElMessageBox.confirm('确认删除该专业信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // TODO: 调用删除API
        ElMessage.success('删除成功')
        getMajorList()
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
        getMajorList()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

// 初始化
getMajorList()
</script>

<style scoped>
.major-container {
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
