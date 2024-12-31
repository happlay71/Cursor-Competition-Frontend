<template>
  <div class="award-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="竞赛名称">
          <el-input v-model="queryParams.competitionName" placeholder="请输入竞赛名称" clearable />
        </el-form-item>
        <el-form-item label="获奖等级">
          <el-input v-model="queryParams.competitionLevel" placeholder="请输入获奖等级" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table :data="awardList" border style="width: 100%">
      <el-table-column prop="applicant" label="申请人ID" width="120" />
      <el-table-column prop="competitionName" label="竞赛名称" min-width="150" />
      <el-table-column prop="competitionLevel" label="获奖等级" width="120" />
      <el-table-column prop="competitionRanking" label="获奖名次" width="120" />
      <el-table-column prop="studentName" label="学生姓名" width="120" />
      <el-table-column prop="advisor" label="指导老师" width="120" />
      <el-table-column prop="awardYear" label="获奖年份" width="100" />
      <el-table-column prop="awardDate" label="获奖日期" width="180">
        <template #default="scope">
          {{ formatDateTime(scope.row.awardDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="填表日期" width="120">
        <template #default="scope">
          {{ formatDate(scope.row.entryDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag
            :type="scope.row.status === 0 ? 'info' : scope.row.status === 1 ? 'success' : 'danger'"
          >
            {{ scope.row.status === 0 ? '审核中' : scope.row.status === 1 ? '已通过' : '已驳回' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 0"
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="scope.row.status === 0"
            type="danger"
            size="small"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
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
      <el-form ref="awardFormRef" :model="awardForm" :rules="rules" label-width="100px">
        <el-form-item label="竞赛名称" prop="competitionName">
          <el-input v-model="awardForm.competitionName" placeholder="请输入竞赛名称" />
        </el-form-item>
        <el-form-item label="竞赛等级" prop="competitionLevel">
          <el-input v-model="awardForm.competitionLevel" placeholder="请输入竞赛等级" />
        </el-form-item>
        <el-form-item label="获奖等级" prop="competitionRanking">
          <el-input v-model="awardForm.competitionRanking" placeholder="请输入获奖等级" />
        </el-form-item>
        <el-form-item label="指导老师" prop="advisor">
          <el-input v-model="awardForm.advisor" placeholder="请输入指导老师" />
        </el-form-item>
        <el-form-item label="获奖年份" prop="awardYear">
          <el-date-picker
            v-model="awardForm.awardYear"
            type="year"
            placeholder="请选择获奖年份"
            value-format="YYYY"
          />
        </el-form-item>
        <el-form-item label="获奖日期" prop="awardDate">
          <el-date-picker
            v-model="awardForm.awardDate"
            type="datetime"
            placeholder="请选择获奖日期"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="学生学号" prop="firstPlaceStudentId">
          <el-input v-model.number="awardForm.firstPlaceStudentId" placeholder="请输入学生学号" />
        </el-form-item>
        <el-form-item label="填表日期" prop="entryDate">
          <el-date-picker
            v-model="awardForm.entryDate"
            type="date"
            placeholder="请选择填表日期"
            value-format="YYYY-MM-DD"
          />
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
import { selectAward, saveAward, deleteAward } from '@/api/award'
import dayjs from 'dayjs'

// 查询参数
const queryParams = reactive({
  competitionName: '',
  competitionLevel: '',
  pageNo: 1,
  pageSize: 10,
})

// 表格数据
const awardList = ref([])
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增获奖记录')
const awardFormRef = ref(null)

// 表单数据
const awardForm = reactive({
  id: undefined,
  applicant: undefined,
  competitionName: '',
  competitionLevel: '',
  competitionRanking: '',
  advisor: '',
  awardYear: '',
  awardDate: '',
  firstPlaceStudentId: '',
  studentName: '',
  entryDate: dayjs().format('YYYY-MM-DD'), // 默认当前日期
})

// 表单校验规则
const rules = {
  competitionName: [{ required: true, message: '请输入竞赛名称', trigger: 'blur' }],
  competitionLevel: [{ required: true, message: '请输入竞赛等级', trigger: 'blur' }],
  competitionRanking: [{ required: true, message: '请输入获奖等级', trigger: 'blur' }],
  advisor: [{ required: true, message: '请输入指导老师', trigger: 'blur' }],
  awardYear: [{ required: true, message: '请选择获奖年份', trigger: 'change' }],
  awardDate: [{ required: true, message: '请选择获奖日期', trigger: 'change' }],
  firstPlaceStudentId: [
    { required: true, message: '请输入学生学号', trigger: 'blur' },
    { type: 'number', message: '学号必须为数字', trigger: 'blur' },
  ],
  entryDate: [{ required: true, message: '请选择填表日期', trigger: 'change' }],
}

// 状态值常量
const AWARD_STATUS = {
  PENDING: 0, // 审核中
  APPROVED: 1, // 已通过
  REJECTED: 2, // 已驳回
}

// 审核操作常量
const AUDIT_ACTIONS = {
  APPROVE: 'approve', // 通过
  REJECT: 'reject', // 驳回
}

// 状态显示配置
const STATUS_CONFIG = {
  [AWARD_STATUS.PENDING]: {
    type: 'info',
    label: '审核中',
  },
  [AWARD_STATUS.APPROVED]: {
    type: 'success',
    label: '已通过',
  },
  [AWARD_STATUS.REJECTED]: {
    type: 'danger',
    label: '已驳回',
  },
}

// 查询方法
const handleQuery = async () => {
  try {
    const res = await selectAward(queryParams)
    if (res.code === 0 && res.data) {
      awardList.value = res.data.list
      total.value = res.data.totalCount
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch (error) {
    console.error('查询错误:', error)
    ElMessage.error('查询失败')
  }
}

// 新增按钮点击事件
const handleAdd = () => {
  dialogTitle.value = '新增获奖记录'
  dialogVisible.value = true
  // 重置表单
  Object.assign(awardForm, {
    id: undefined,
    applicant: undefined,
    competitionName: '',
    competitionLevel: '',
    competitionRanking: '',
    advisor: '',
    awardYear: '',
    awardDate: '',
    firstPlaceStudentId: '',
    studentName: '',
    entryDate: dayjs().format('YYYY-MM-DD'),
  })
}

// 修改按钮点击事件
const handleEdit = (row) => {
  dialogTitle.value = '修改获奖记录'
  dialogVisible.value = true
  // 填充表单数据
  Object.assign(awardForm, {
    ...row,
    awardYear: row.awardYear?.toString(),
  })
}

// 删除方法
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该记录吗？', '提示', {
      type: 'warning',
    })
    const res = await deleteAward({ awardId: id })
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
  awardFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        // 转换年份为数字
        const submitData = {
          ...awardForm,
          awardYear: parseInt(awardForm.awardYear),
        }

        const res = await saveAward(submitData)
        if (res.code === 0) {
          ElMessage.success(awardForm.id ? '修改成功' : '新增成功')
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

// 格式化日期时间
const formatDateTime = (date) => {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

// 初始化
onMounted(() => {
  handleQuery()
})
</script>
<style scoped>
.award-container {
  /* background: rgba(255, 255, 255, 0.8); */
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-wrapper {
  background: transparent;
  width: 100%;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: flex-end;
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
  width: 100%;
  background: transparent;
  border-radius: 8px;
}

:deep(.el-table__inner-wrapper) {
  background: transparent;
}

:deep(.el-table__header) {
  background: rgba(255, 255, 255, 0.5);
}

:deep(.el-table__row) {
  background: rgba(255, 255, 255);
}

:deep(.el-table__row:hover) {
  background: rgba(255, 255, 255, 0.5);
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background: transparent;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

:deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input),
:deep(.el-date-picker) {
  width: 100%;
}
</style>
