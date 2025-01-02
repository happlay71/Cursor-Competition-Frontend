<template>
  <div class="level-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-form">
        <div class="search-inputs">
          <el-input
            v-model="searchForm.competition"
            placeholder="请输入竞赛名称"
            clearable
            style="width: 200px"
          />
          <el-input
            v-model="searchForm.level"
            placeholder="请输入竞赛等级"
            clearable
            style="width: 200px"
          />
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleAdd" v-if="isAdmin">新增</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="competition" label="竞赛名称" min-width="180" />
      <el-table-column prop="level" label="竞赛等级" width="120" />
      <el-table-column prop="ranking" label="获奖名次" width="120" />
      <el-table-column prop="credit" label="认定学分" width="120" />
      <el-table-column prop="achievement" label="折算成绩" width="120" />
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
      :title="dialogType === 'edit' ? '编辑竞赛级别信息' : '查看竞赛级别信息'"
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
        <el-form-item label="竞赛名称" prop="competition">
          <el-input v-model="form.competition" placeholder="请输入竞赛名称" />
        </el-form-item>
        <el-form-item label="竞赛等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入竞赛等级" />
        </el-form-item>
        <el-form-item label="获奖名次" prop="ranking">
          <el-input v-model="form.ranking" placeholder="请输入获奖名次" />
        </el-form-item>
        <el-form-item label="认定学分" prop="credit">
          <el-input v-model="form.credit" placeholder="请输入认定学分" />
        </el-form-item>
        <el-form-item label="折算成绩" prop="achievement">
          <el-input-number
            v-model="form.achievement"
            :min="0"
            :max="100"
            placeholder="请输入折算成绩"
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { selectLevel, saveLevel, deleteLevel } from '@/api/level'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isAdmin)

// 搜索表单
const searchForm = reactive({
  competition: '',
  level: '',
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
  competition: '',
  level: '',
  ranking: '',
  credit: '',
  achievement: 0,
})

// 表单验证规则
const rules = {
  competition: [
    { required: true, message: '请输入竞赛名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2-50个字符之间', trigger: 'blur' },
  ],
  level: [{ required: true, message: '请输入竞赛等级', trigger: 'blur' }],
  ranking: [{ required: true, message: '请输入获奖名次', trigger: 'blur' }],
  credit: [{ required: true, message: '请输入认定学分', trigger: 'blur' }],
  achievement: [
    { required: true, message: '请输入折算成绩', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '折算成绩在0-100之间', trigger: 'blur' },
  ],
}

// 获取列表
const getLevelList = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      competition: searchForm.competition,
      level: searchForm.level,
    }
    const res = await selectLevel(params)
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

// 编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  // 先重置表单
  Object.keys(form).forEach((key) => {
    form[key] = key === 'achievement' ? 0 : ''
  })
  // 再赋值
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该竞赛级别信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await deleteLevel(row.id)
        if (res.code === 0) {
          ElMessage.success('删除成功')
          getLevelList()
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
        const res = await saveLevel(form)
        if (res.code === 0) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          getLevelList()
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
    form[key] = key === 'achievement' ? 0 : ''
  })
  dialogVisible.value = true
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
</style>
