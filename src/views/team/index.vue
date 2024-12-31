<template>
  <div class="team-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="学生姓名">
          <el-input v-model="queryParams.studentName" placeholder="请输入学生姓名" clearable />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="queryParams.studentId" placeholder="请输入学号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table :data="teamList" border style="width: 100%">
      <el-table-column prop="studentId" label="学号" width="120" />
      <el-table-column prop="studentName" label="学生姓名" width="120" />
      <el-table-column prop="gender" label="性别" width="80">
        <template #default="scope">
          {{ scope.row.gender === 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="年级" width="100" />
      <el-table-column prop="major" label="专业" min-width="150" />
      <el-table-column prop="className" label="班级" width="120" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="email" label="邮箱" min-width="150" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
            {{ scope.row.status === 0 ? '在校' : '已毕业' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <div class="operation-buttons">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)"> 修改 </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        :pager-count="7"
        prev-text="上一页"
        next-text="下一页"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #total>总计 {{ total }} 条</template>
        <template #sizes>每页 {{ queryParams.pageSize }} 条</template>
        <template #jumper>
          跳至第 <el-input v-model="queryParams.pageNo" style="width: 50px; margin: 0 5px" /> 页
        </template>
      </el-pagination>
    </div>

    <!-- 新增/修改对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" destroy-on-close>
      <el-form ref="teamFormRef" :model="teamForm" :rules="rules" label-width="100px">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="teamForm.studentId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="teamForm.studentName" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="teamForm.gender" placeholder="请选择性别">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-input v-model="teamForm.grade" placeholder="请输入年级" />
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="teamForm.major" placeholder="请输入专业" />
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-input v-model="teamForm.className" placeholder="请输入班级" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="teamForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="teamForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="teamForm.status" placeholder="请选择状态">
            <el-option label="在校" :value="0" />
            <el-option label="已毕业" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { selectTeam, saveTeam, deleteTeam } from '@/api/team'

// 查询参数
const queryParams = reactive({
  studentName: '',
  studentId: '',
  pageNo: 1,
  pageSize: 10,
})

// 表格数据
const teamList = ref([])
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增团队成员')
const teamFormRef = ref(null)
const teamForm = reactive({
  id: undefined,
  studentId: '',
  studentName: '',
  gender: undefined,
  grade: '',
  major: '',
  className: '',
  phone: '',
  email: '',
  status: undefined,
})

// 表单校验规则
const rules = {
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  studentName: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  className: [{ required: true, message: '请输入班级', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

// 查询方法
const handleQuery = async () => {
  try {
    const res = await selectTeam(queryParams)
    if (res.code === 0) {
      teamList.value = res.data.records
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch (error) {
    console.error('查询错误:', error)
    ElMessage.error('查询失败')
  }
}

// 新增方法
const handleAdd = () => {
  dialogTitle.value = '新增团队成员'
  Object.keys(teamForm).forEach((key) => {
    teamForm[key] = undefined
  })
  dialogVisible.value = true
}

// 修改方法
const handleEdit = (row) => {
  dialogTitle.value = '修改团队成员'
  Object.assign(teamForm, row)
  dialogVisible.value = true
}

// 删除方法
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该记录吗？', '提示', {
      type: 'warning',
    })
    const res = await deleteTeam({ teamId: id })
    if (res.code === 0) {
      ElMessage.success('删除成功')
      handleQuery()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除错误:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 保存方法
const handleSave = () => {
  teamFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const res = await saveTeam(teamForm)
        if (res.code === 0) {
          ElMessage.success(teamForm.id ? '修改成功' : '新增成功')
          dialogVisible.value = false
          handleQuery()
        } else {
          ElMessage.error(res.message || '保存失败')
        }
      } catch (error) {
        console.error('保存错误:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

// 分页大小变化
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  handleQuery()
}

// 页码变化
const handleCurrentChange = (val) => {
  queryParams.pageNo = val
  handleQuery()
}

// 初始化
onMounted(() => {
  handleQuery()
})
</script>

<style scoped>
.team-container {
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.search-form :deep(.el-form-item) {
  margin: 0;
  min-width: 200px;
}

.search-form :deep(.el-form-item:last-child) {
  margin-left: auto;
  min-width: auto;
}

:deep(.el-table) {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-table__header) {
  background: #f5f7fa !important;
}

:deep(.el-table__header-wrapper) {
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

:deep(.el-table__body-wrapper) {
  background: #fff !important;
}

:deep(.el-table__row) {
  background: #fff !important;
}

:deep(.el-table__row:hover > td) {
  background: #f5f7fa !important;
}

:deep(.el-table td),
:deep(.el-table th) {
  background: none !important;
}

:deep(.el-table--border) {
  border: 1px solid #ebeef5;
}

.pagination-wrapper {
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input),
:deep(.el-select) {
  width: 100%;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.operation-buttons .el-button {
  margin: 0;
}
</style>
