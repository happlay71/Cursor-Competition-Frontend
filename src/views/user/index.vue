<template>
  <div class="user-container">
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <div class="search-form">
        <div class="search-inputs">
          <el-form-item label="用户账号">
            <el-input
              v-model="searchForm.userAccount"
              placeholder="请输入用户账号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="用户名称">
            <el-input
              v-model="searchForm.username"
              placeholder="请输入用户名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="userAccount" label="用户账号" min-width="120" align="center" />
      <el-table-column prop="username" label="用户昵称" min-width="120" align="center">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar :size="32" :src="row.avatarUrl" class="avatar">
              {{ row.username?.charAt(0)?.toUpperCase() }}
            </el-avatar>
            <span class="username">{{ row.username }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="用户角色" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.isDelete === 1 ? 'danger' : row.status === 0 ? 'success' : 'warning'">
            {{ row.isDelete === 1 ? '已删除' : row.status === 0 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" align="center">
        <template #default="{ row }">
          {{ row.createTime ? new Date(row.createTime).toLocaleString() : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180" align="center">
        <template #default="{ row }">
          {{ row.updateTime ? new Date(row.updateTime).toLocaleString() : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right" align="center">
        <template #default="{ row }">
          <div class="operation-buttons">
            <el-button
              size="small"
              type="warning"
              @click="handleEdit(row)"
              :disabled="row.isDelete === 1"
              >编辑</el-button
            >
            <el-button
              size="small"
              :type="row.status === 0 ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
              :disabled="row.isDelete === 1"
            >
              {{ row.status === 0 ? '禁用' : '启用' }}
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleChangePassword(row)"
              :disabled="row.isDelete === 1"
              >修改密码</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(row)"
              :disabled="row.isDelete === 1"
              >删除</el-button
            >
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
      :title="dialogType === 'edit' ? '编辑用户信息' : '查看用户信息'"
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
        <el-form-item label="头像" prop="avatarUrl">
          <el-avatar :size="60" :src="form.avatarUrl" class="avatar">
            {{ form.username?.charAt(0)?.toUpperCase() }}
          </el-avatar>
        </el-form-item>
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="form.userAccount" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择用户角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
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

    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="400px" destroy-on-close>
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="passwordForm.password"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePasswordSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { selectUser, saveUser, deleteUser, savePassword, updateUserStatus } from '@/api/user'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 搜索表单
const searchForm = reactive({
  userAccount: '',
  username: '',
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
  userAccount: '',
  username: '',
  role: 'user',
  avatarUrl: '',
})

// 表单验证规则
const rules = {
  userAccount: [
    { required: true, message: '请输入用户账号', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2-20个字符之间', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2-20个字符之间', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
}

// 修改密码相关
const passwordDialogVisible = ref(false)
const passwordFormRef = ref(null)
const passwordForm = reactive({
  id: '',
  password: '',
})

const passwordRules = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在6-20个字符之间', trigger: 'blur' },
  ],
}

// 打开修改密码对话框
const handleChangePassword = (row) => {
  passwordForm.id = row.id
  passwordForm.password = ''
  passwordDialogVisible.value = true
}

// 提交修改密码
const handlePasswordSubmit = () => {
  passwordFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const res = await savePassword({
          id: Number(passwordForm.id),
          password: passwordForm.password,
        })
        if (res.code === 0) {
          ElMessage.success('密码修改成功')
          passwordDialogVisible.value = false
          // 如果修改的是当前登录用户的密码，更新store中的用户信息
          if (Number(passwordForm.id) === Number(userStore.userInfo?.id)) {
            userStore.setUserInfo({
              ...userStore.userInfo,
              password: passwordForm.password,
            })
          }
        } else {
          ElMessage.error(res.message || '密码修改失败')
        }
      } catch (error) {
        console.error('密码修改失败:', error)
        ElMessage.error('密码修改失败')
      }
    }
  })
}

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      userAccount: searchForm.userAccount,
      username: searchForm.username,
    }
    const res = await selectUser(params)
    if (res.code === 0 && res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.totalCount || 0
      currentPage.value = res.data.pageNo || 1
      pageSize.value = res.data.pageSize || 10
    } else {
      ElMessage.error(res.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getUserList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.userAccount = ''
  searchForm.username = ''
  handleSearch()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getUserList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getUserList()
}

// 编辑
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await deleteUser(row.id)
        if (res.code === 0) {
          ElMessage.success('删除成功')
          getUserList()
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
        const res = await saveUser(form)
        if (res.code === 0) {
          ElMessage.success('保存成功')
          dialogVisible.value = false
          getUserList()
          // 如果修改的是当前登录用户的信息，更新store中的用户信息
          if (Number(form.id) === Number(userStore.userInfo?.id)) {
            userStore.setUserInfo({
              ...userStore.userInfo,
              userAccount: form.userAccount,
              username: form.username,
              role: form.role,
              avatarUrl: form.avatarUrl,
            })
          }
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

// 切换用户状态
const handleToggleStatus = (row) => {
  const newStatus = row.status === 0 ? 1 : 0
  const actionText = newStatus === 0 ? '启用' : '禁用'

  // 如果是当前用户，不允许禁用自己
  if (Number(row.id) === Number(userStore.userInfo?.id) && newStatus === 1) {
    ElMessage.warning('不能禁用当前登录的用户')
    return
  }

  ElMessageBox.confirm(`确认${actionText}该用户吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await updateUserStatus({
          id: row.id,
          status: newStatus,
        })
        if (res.code === 0) {
          ElMessage.success(`${actionText}成功`)
          getUserList()
          // 如果修改的是当前登录用户的状态，更新store中的用户信息
          if (Number(row.id) === Number(userStore.userInfo?.id)) {
            userStore.setUserInfo({
              ...userStore.userInfo,
              status: newStatus,
            })
          }
        } else {
          ElMessage.error(res.message || `${actionText}失败`)
        }
      } catch (error) {
        console.error(`${actionText}失败:`, error)
        ElMessage.error(`${actionText}失败`)
      }
    })
    .catch(() => {
      ElMessage.info(`已取消${actionText}`)
    })
}

// 初始化
getUserList()
</script>

<style scoped>
.user-container {
  padding: 20px;
  min-height: 100%;
}

.search-wrapper {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
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

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.operation-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: #333;
}

.avatar {
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>
