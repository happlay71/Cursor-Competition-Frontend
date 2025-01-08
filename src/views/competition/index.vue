<template>
  <div class="competition-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-form">
        <div class="search-inputs">
          <el-form-item label="竞赛名称">
            <el-select
              v-model="searchForm.name"
              placeholder="请选择竞赛名称"
              clearable
              filterable
              style="width: 240px"
            >
              <el-option
                v-for="name in competitionNameList"
                :key="name"
                :label="name"
                :value="name"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="primary" @click="handleAdd" v-if="isAdmin">新增</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="name" label="竞赛名称" min-width="150" />
      <el-table-column prop="description" label="竞赛描述" min-width="200">
        <template #default="{ row }">
          <div class="description-cell">{{ row.description }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="官网链接" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">
          <el-link type="primary" :href="row.url" target="_blank" v-if="row.url">{{
            row.url
          }}</el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160">
        <template #default="{ row }">
          {{ row.createTime ? new Date(row.createTime).toLocaleString() : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="160">
        <template #default="{ row }">
          {{ row.updateTime ? new Date(row.updateTime).toLocaleString() : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" v-if="isAdmin">
        <template #default="{ row }">
          <div class="operation-buttons">
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
      :title="dialogType === 'edit' ? '编辑竞赛信息' : '查看竞赛信息'"
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
        <el-form-item label="竞赛名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入竞赛名称" />
        </el-form-item>
        <el-form-item label="竞赛描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入竞赛描述"
          />
        </el-form-item>
        <el-form-item label="官网链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入官网链接" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  selectCompetition,
  saveCompetition,
  deleteCompetition,
  selectCompetitionName,
} from '@/api/competition'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isAdmin)

// 搜索表单
const searchForm = reactive({
  name: '',
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
  description: '',
  url: '',
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入竞赛名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2-50个字符之间', trigger: 'blur' },
  ],
  description: [{ required: true, message: '请输入竞赛描述', trigger: 'blur' }],
  url: [
    {
      pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
      message: '请输入正确的URL格式',
      trigger: 'blur',
    },
  ],
}

// 获取列表
const getCompetitionList = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      name: searchForm.name,
    }
    const res = await selectCompetition(params)
    if (res.code === 0 && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.totalCount || 0
      currentPage.value = res.data.pageNo || 1
      pageSize.value = res.data.pageSize || 10
    } else {
      ElMessage.error(res.message || '获取列表失败')
    }
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getCompetitionList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  handleSearch()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getCompetitionList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getCompetitionList()
}

// 编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  // 先重置表单
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
  // 再赋值
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该竞赛信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await deleteCompetition(row.id)
        if (res.code === 0) {
          ElMessage.success('删除成功')
          getCompetitionList()
        } else {
          ElMessage.error(res.message || '删除失败')
        }
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
        const res = await saveCompetition(form)
        if (res.code === 0) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          getCompetitionList()
        } else {
          ElMessage.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

// 新增
const handleAdd = () => {
  dialogType.value = 'edit'
  // 重置表单数据
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
  dialogVisible.value = true
}

// 竞赛名称列表
const competitionNameList = ref([])

// 获取竞赛名称列表
const getCompetitionNameList = async () => {
  try {
    const res = await selectCompetitionName()
    if (res.code === 0) {
      competitionNameList.value = res.data || []
    }
  } catch (error) {
    console.error('获取竞赛名称列表失败:', error)
  }
}

// 初始化
onMounted(() => {
  getCompetitionNameList()
  getCompetitionList()
})
</script>

<style scoped>
.competition-container {
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
  margin-bottom: 20px;
}

.pagination-wrapper {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: center;
}

.operation-buttons {
  display: flex;
  gap: 4px;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.operation-buttons .el-button {
  padding: 4px 8px;
  min-height: 28px;
  margin: 0;
}

:deep(.el-table .cell) {
  padding-left: 8px;
  padding-right: 8px;
}

:deep(.el-table) {
  overflow: visible;
}

:deep(.el-table__fixed-right) {
  height: 100% !important;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

:deep(.el-table__fixed-right::before) {
  background-color: var(--el-table-border-color);
}

.description-cell {
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.5;
}
</style>
