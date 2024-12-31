<template>
  <div class="level-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-form">
        <div class="search-inputs">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入级别名称"
            clearable
            style="width: 200px"
          />
          <el-select
            v-model="searchForm.type"
            placeholder="竞赛类型"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in typeOptions"
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
      <el-table-column prop="name" label="级别名称" width="150" />
      <el-table-column prop="type" label="竞赛类型" width="120">
        <template #default="{ row }">
          {{ getTypeName(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分值" width="100" />
      <el-table-column prop="description" label="级别描述" min-width="200" />
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
      :title="dialogType === 'edit' ? '编辑级别信息' : '查看级别信息'"
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
        <el-form-item label="级别名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入级别名称" />
        </el-form-item>
        <el-form-item label="竞赛类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择竞赛类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input-number v-model="form.score" :min="0" :max="100" placeholder="请输入分值" />
        </el-form-item>
        <el-form-item label="级别描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="4"
            placeholder="请输入级别描述"
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

// 竞赛类型选项
const typeOptions = [
  { label: '学科竞赛', value: 'academic' },
  { label: '创新创业', value: 'innovation' },
  { label: '文体竞赛', value: 'sports' },
  { label: '技能竞赛', value: 'skill' },
]

// 获取竞赛类型名称
const getTypeName = (type) => {
  const option = typeOptions.find((item) => item.value === type)
  return option ? option.label : type
}

// 搜索表单
const searchForm = reactive({
  name: '',
  type: '',
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
  name: '',
  type: '',
  score: 0,
  description: '',
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入级别名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2-50个字符之间', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择竞赛类型', trigger: 'change' }],
  score: [{ required: true, message: '请输入分值', trigger: 'blur' }],
  description: [{ required: true, message: '请输入级别描述', trigger: 'blur' }],
}

// 获取级别列表
const getLevelList = async () => {
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
    console.error('获取级别列表失败:', error)
    ElMessage.error('获取级别列表失败')
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getLevelList()
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
  getLevelList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getLevelList()
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
  ElMessageBox.confirm('确认删除该级别信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // TODO: 调用删除API
        ElMessage.success('删除成功')
        getLevelList()
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
        getLevelList()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

// 初始化
getLevelList()
</script>

<style scoped>
.level-container {
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
