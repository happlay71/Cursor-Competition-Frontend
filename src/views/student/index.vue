<template>
  <div class="student-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-form">
        <div class="search-inputs">
          <el-input
            v-model="searchForm.studentId"
            placeholder="请输入学号"
            clearable
            style="width: 200px"
          />
          <el-input
            v-model="searchForm.studentName"
            placeholder="请输入姓名"
            clearable
            style="width: 200px"
          />
          <el-select
            v-model="searchForm.profession"
            placeholder="请选择专业"
            clearable
            filterable
            style="width: 200px"
          >
            <el-option v-for="name in majorNameList" :key="name" :label="name" :value="name" />
          </el-select>
          <el-select
            v-model="searchForm.certification"
            placeholder="认证状态"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in certificationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="studentId" label="学号" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="grade" label="年级" width="100" />
      <el-table-column prop="profession" label="专业" width="180" />
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="{ row }">
          {{ row.gender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="200" />
      <el-table-column prop="phone" label="电话" width="130" />
      <el-table-column prop="certification" label="认证状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.certification === 1 ? 'success' : 'warning'">
            {{ row.certification === 1 ? '已认证' : '未认证' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="账号状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 0 ? 'success' : 'danger'">
            {{ row.status === 0 ? '已使用' : '未使用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="{ row }">
          <div class="operation-buttons">
            <el-button size="small" type="warning" @click="handleEdit(row)">编辑</el-button>
            <el-button
              v-if="row.certification === 1"
              size="small"
              :type="row.status === 0 ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 0 ? '禁用' : '启用' }}
            </el-button>
            <el-button v-else size="small" type="info" disabled> 未认证 </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

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
      :title="
        dialogType === 'add'
          ? '新增学生信息'
          : dialogType === 'edit'
            ? '编辑学生信息'
            : '查看学生信息'
      "
      width="500px"
      destroy-on-close
    >
      <div class="dialog-header" v-if="dialogType === 'add'">
        <el-upload
          class="excel-upload"
          accept=".xlsx, .xls"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleExcelUpload"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>
            通过Excel导入
          </el-button>
        </el-upload>
        <el-link type="primary" :underline="false" @click="downloadTemplate">下载模板</el-link>
      </div>
      <el-divider v-if="dialogType !== 'edit'">或手动输入</el-divider>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        :disabled="dialogType === 'view'"
      >
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="form.studentId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="form.grade" placeholder="请输入年级" />
        </el-form-item>
        <el-form-item label="专业" prop="profession">
          <el-select
            v-model="form.profession"
            placeholder="请选择专业"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option v-for="name in majorNameList" :key="name" :label="name" :value="name" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" v-if="dialogType !== 'view'">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
  selectStudent,
  saveStudent,
  toggleStudentStatus,
  deleteStudent,
  importStudentExcel,
} from '@/api/student'
import { selectMajorName } from '@/api/major'
import { Upload } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  studentId: '',
  studentName: '',
  profession: '',
  certification: '',
})

// 认证状态选项
const certificationOptions = [
  { label: '全部', value: '' },
  { label: '已认证', value: 'pass' },
  { label: '未认证', value: 'pending' },
]

// 表格数据
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('edit') // edit 或 view
const formRef = ref(null)
const form = reactive({
  id: '',
  studentId: '',
  name: '',
  grade: '',
  profession: '',
  gender: 1,
  email: '',
  phone: '',
})

// 表单验证规则
const rules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{7,12}$/, message: '请输入7-12位数字学号', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2-20个字符之间', trigger: 'blur' },
  ],
  profession: [
    { required: true, message: '请输入专业', trigger: 'blur' },
    { min: 2, max: 50, message: '专业名称长度在2-50个字符之间', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
  ],
}

// 获取学生列表
const getStudentList = async () => {
  loading.value = true
  try {
    const params = {
      pageSize: pageSize.value,
      pageNo: currentPage.value,
      studentId: searchForm.studentId,
      studentName: searchForm.studentName,
      profession: searchForm.profession,
      certification: searchForm.certification,
    }
    const res = await selectStudent(params)
    if (res.code === 0 && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.totalCount || 0
      currentPage.value = res.data.pageNo || 1
      pageSize.value = res.data.pageSize || 10
    } else {
      ElMessage.error(res.message || '获取学生列表失败')
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
    ElMessage.error('获取学生列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getStudentList()
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
  getStudentList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getStudentList()
}

// 编辑学生信息
const handleEdit = (row) => {
  dialogType.value = 'edit'
  // 先重置表单
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
  // 再赋值，确保性别值为数字类型
  Object.assign(form, {
    ...row,
    gender: Number(row.gender), // 确保性别值为数字类型
  })
  dialogVisible.value = true
}

// 提交编辑
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const res = await saveStudent(form)
        if (res.code === 0) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          getStudentList()
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

// 切换账号状态
const handleToggleStatus = (row) => {
  const action = row.status === 0 ? '禁用' : '启用'
  ElMessageBox.confirm(`确认${action}该账号吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await toggleStudentStatus(row.id, row.status === 0 ? 1 : 0)
        if (res.code === 0) {
          ElMessage.success(`${action}成功`)
          getStudentList()
        }
      } catch (error) {
        console.error(`${action}失败:`, error)
        ElMessage.error(`${action}失败`)
      }
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}

// 新增学生信息
const handleAdd = () => {
  dialogType.value = 'add'
  // 重置表单数据
  Object.keys(form).forEach((key) => {
    form[key] = key === 'gender' ? 1 : ''
  })
  dialogVisible.value = true
}

// 删除学生
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该学生吗？删除后无法恢复，且只能删除没有获奖信息的学生。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await deleteStudent(row.id)
        if (res.code === 0) {
          ElMessage.success('删除成功')
          getStudentList()
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

// Excel导入相关
const handleExcelUpload = async (file) => {
  // 文件类型验证
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    ElMessage.error('只能上传 Excel 文件')
    return
  }
  // 文件大小验证（例如限制5MB）
  if (file.size / 1024 / 1024 > 5) {
    ElMessage.error('文件大小不能超过 5MB')
    return
  }

  try {
    const res = await importStudentExcel(file.raw)
    if (res.code === 0) {
      ElMessage.success('导入成功')
      // 刷新列表
      handleQuery()
    } else {
      ElMessage.error(res.message || '导入失败')
    }
  } catch (error) {
    console.error('导入失败:', error)
  }
}

// 下载模板
const downloadTemplate = () => {
  // 创建工作簿
  const wb = XLSX.utils.book_new()

  // 创建表头数据
  const header = ['学号', '姓名', '年级', '专业', '性别(男/女)', '邮箱', '电话']

  // 创建示例数据
  const exampleData = [
    ['2021001', '张三', '2021', '计算机科学与技术', '男', 'zhangsan@example.com', '13800138000'],
  ]

  // 合并表头和数据
  const wsData = [header, ...exampleData]

  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, '学生信息模板')

  // 下载文件
  XLSX.writeFile(wb, '学生信息导入模板.xlsx')
}

// 专业名称列表
const majorNameList = ref([])

// 获取专业名称列表
const getMajorNameList = async () => {
  try {
    const res = await selectMajorName()
    if (res.code === 0) {
      majorNameList.value = res.data || []
    }
  } catch (error) {
    console.error('获取专业名称列表失败:', error)
  }
}

// 初始化
onMounted(() => {
  getMajorNameList()
  getStudentList()
})
</script>

<style scoped>
.student-container {
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

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
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

:deep(.el-pagination) {
  justify-content: center;
  padding: 0;
}

.operation-buttons {
  display: flex;
  gap: 15px;
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

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
}

.excel-upload {
  display: inline-block;
}

:deep(.el-divider--horizontal) {
  margin: 20px 0;
}
</style>
