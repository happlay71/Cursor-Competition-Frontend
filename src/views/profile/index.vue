<template>
  <div class="profile-container">
    <!-- 左侧卡片：基本信息 -->
    <el-card class="profile-card left-card">
      <div class="avatar-wrapper">
        <el-avatar :size="120" :src="userAvatar">
          {{ avatarText }}
        </el-avatar>
      </div>
      <div class="info-list">
        <div class="info-item">
          <span class="label">账号：</span>
          <span class="value">{{ userAccount }}</span>
          <span class="label">昵称：</span>
          <span class="value">{{ username }}</span>
        </div>
        <div class="info-item">
          <span class="label">状态：</span>
          <el-tag :type="status === 0 ? 'success' : 'danger'">
            {{ status === 0 ? '已启用' : '已禁用' }}
          </el-tag>
          <span class="label">身份：</span>
          <el-tag :type="isAdmin ? 'danger' : 'success'">
            {{ isAdmin ? '管理员' : '普通用户' }}
          </el-tag>
        </div>

        <div class="info-item">
          <span class="label">学生认证：</span>
          <el-tag :type="isVerified ? 'success' : 'warning'">
            {{ isVerified ? '已认证' : '未认证' }}
          </el-tag>
        </div>
      </div>
      <div class="button-group">
        <el-button type="primary" @click="handleEditInfo">修改信息</el-button>
        <el-button type="warning" @click="handleEditPassword">修改密码</el-button>
      </div>

      <!-- 修改信息对话框 -->
      <el-dialog
        v-model="editInfoDialogVisible"
        title="编辑用户信息"
        width="500px"
        destroy-on-close
      >
        <el-form
          ref="editInfoFormRef"
          :model="editInfoForm"
          :rules="editInfoRules"
          label-width="80px"
        >
          <el-form-item label="账号" prop="userAccount">
            <el-input v-model="editInfoForm.userAccount" placeholder="请输入用户账号" />
          </el-form-item>
          <el-form-item label="昵称" prop="username">
            <el-input v-model="editInfoForm.username" placeholder="请输入用户昵称" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editInfoDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitEditInfo">确认</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 修改密码对话框 -->
      <el-dialog
        v-model="editPasswordDialogVisible"
        title="修改密码"
        width="500px"
        destroy-on-close
      >
        <el-form
          ref="editPasswordFormRef"
          :model="editPasswordForm"
          :rules="editPasswordRules"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              v-model="editPasswordForm.oldPassword"
              type="password"
              placeholder="请输入原密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="editPasswordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="editPasswordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editPasswordDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitEditPassword">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>

    <!-- 右侧卡片：学生信息 -->
    <el-card class="profile-card right-card">
      <!-- 未认证状态显示 -->
      <div v-if="!isVerified" class="unverified-tips">
        <el-empty description="暂未认证" :image-size="200">
          <template #description>
            <div class="empty-text">
              <p>您还未完成学生认证</p>
              <p>认证后可以参与学生竞赛获奖信息管理</p>
            </div>
          </template>
          <el-button type="primary" @click="handleVerify">立即认证</el-button>
        </el-empty>
      </div>

      <!-- 已认证状态显示学生信息 -->
      <div v-else class="student-info">
        <div class="section-title">
          学生信息
          <el-button type="primary" size="small" style="float: right" @click="handleEditStudent"
            >修改信息</el-button
          >
        </div>
        <div class="info-grid">
          <div class="grid-item">
            <span class="label">学号：</span>
            <span class="value">{{ studentInfo.studentId }}</span>
          </div>
          <div class="grid-item">
            <span class="label">姓名：</span>
            <span class="value">{{ studentInfo.name }}</span>
          </div>
          <div class="grid-item">
            <span class="label">年级：</span>
            <span class="value">{{ studentInfo.grade }}</span>
          </div>
          <div class="grid-item">
            <span class="label">专业：</span>
            <span class="value">{{ studentInfo.profession }}</span>
          </div>
          <div class="grid-item">
            <span class="label">性别：</span>
            <span class="value">{{ studentInfo.gender === 1 ? '男' : '女' }}</span>
          </div>
          <div class="grid-item">
            <span class="label">邮箱：</span>
            <span class="value">{{ studentInfo.email }}</span>
          </div>
          <div class="grid-item">
            <span class="label">电话：</span>
            <span class="value">{{ studentInfo.phone }}</span>
          </div>
        </div>
      </div>

      <!-- 修改学生信息对话框 -->
      <el-dialog
        v-model="editStudentDialogVisible"
        title="修改学生信息"
        width="500px"
        destroy-on-close
      >
        <el-form
          ref="editStudentFormRef"
          :model="editStudentForm"
          :rules="studentRules"
          label-width="80px"
        >
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="editStudentForm.studentId" placeholder="请输入学号" disabled />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editStudentForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="年级" prop="grade">
            <el-input v-model="editStudentForm.grade" placeholder="请输入年级" />
          </el-form-item>
          <el-form-item label="专业" prop="profession">
            <el-select
              v-model="editStudentForm.profession"
              placeholder="请选择专业"
              style="width: 100%"
            >
              <el-option v-for="item in majorNameList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="editStudentForm.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editStudentForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="editStudentForm.phone" placeholder="请输入电话" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editStudentDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitEditStudent">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>

    <!-- 认证对话框 -->
    <el-dialog v-model="dialogVisible" title="学生认证" width="500px" destroy-on-close>
      <el-form ref="verifyFormRef" :model="verifyForm" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="verifyForm.studentId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="verifyForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="verifyForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="verifyForm.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitVerify">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { saveUser } from '@/api/user'
import { saveStudent } from '@/api/student'
import { selectMajorName } from '@/api/major'

const userStore = useUserStore()
const userAccount = computed(() => userStore.userInfo?.userAccount)
const username = computed(() => userStore.userInfo?.username)
const userAvatar = computed(() => userStore.userInfo?.avatarUrl)
const isAdmin = computed(() => userStore.isAdmin)
const status = computed(() => userStore.userInfo?.status ?? 0)

// 头像文本
const avatarText = computed(() => {
  const name = username.value || userAccount.value
  if (!name) return ''
  return name.charAt(0).toUpperCase()
})

// 认证状态（模拟数据）
const isVerified = ref(false)

// 认证对话框
const dialogVisible = ref(false)
const verifyFormRef = ref(null)
const verifyForm = ref({
  id: userStore.userInfo?.id,
  studentId: '',
  name: '',
  email: '',
  phone: '',
})

// 表单验证规则
const rules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{7,12}$/, message: '请输入8-12位数字学号', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2-20个字符之间', trigger: 'blur' },
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

// 打开认证对话框
const handleVerify = () => {
  dialogVisible.value = true
}

// 提交认证
const submitVerify = () => {
  verifyFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const token = localStorage.getItem('token')
        const formData = {
          ...verifyForm.value,
          id: userStore.userInfo?.id,
        }
        const res = await fetch('/api/student/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (data.code === 0) {
          ElMessage.success('认证申请提交成功')
          dialogVisible.value = false
          // 更新认证状态
          isVerified.value = true
        } else {
          ElMessage.error(data.message || '认证失败')
        }
      } catch (error) {
        console.error('认证错误:', error)
        ElMessage.error('认证失败')
      }
    }
  })
}

// 学生信息（模拟数据，实际应该从后端获取）
const studentInfo = ref({
  studentId: '',
  name: '',
  grade: '',
  profession: '',
  gender: '',
  email: '',
  phone: '',
})

// 获取学生信息
const getStudentInfo = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/student/info', {
      headers: {
        token: token,
      },
    })
    const data = await res.json()
    if (data.code === 0) {
      studentInfo.value = data.data
      isVerified.value = true
    }
  } catch (error) {
    console.error('获取学生信息失败:', error)
  }
}

// 专业名称列表
const majorNameList = ref([])

// 获取专业名称列表
const getMajorNameList = async () => {
  try {
    const res = await selectMajorName()
    if (res.code === 0) {
      majorNameList.value = res.data
    }
  } catch (error) {
    console.error('获取专业名称列表失败:', error)
  }
}

// 在页面加载时获取学生信息
onMounted(() => {
  getStudentInfo()
  getMajorNameList()
})

// 修改信息相关
const editInfoDialogVisible = ref(false)
const editInfoFormRef = ref(null)
const editInfoForm = ref({
  userAccount: '',
  username: '',
})

const editInfoRules = {
  userAccount: [
    { required: true, message: '请输入用户账号', trigger: 'blur' },
    { min: 4, max: 20, message: '账号长度在4-20个字符之间', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在2-20个字符之间', trigger: 'blur' },
  ],
}

const handleEditInfo = () => {
  editInfoForm.value.userAccount = userStore.userInfo?.userAccount || ''
  editInfoForm.value.username = userStore.userInfo?.username || ''
  editInfoDialogVisible.value = true
}

const submitEditInfo = () => {
  editInfoFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const token = localStorage.getItem('token')
        let role = 'user'
        try {
          // 尝试从token中解析用户角色
          const tokenData = JSON.parse(atob(token.split('.')[1]))
          role = tokenData.role
        } catch (error) {
          console.error('解析token失败:', error)
        }

        // 调用保存用户信息的API
        const res = await saveUser({
          id: userStore.userInfo?.id,
          userAccount: editInfoForm.value.userAccount,
          username: editInfoForm.value.username,
          role: role,
        })

        // 根据返回结果判断是否修改成功
        if (res.code === 0) {
          ElMessage.success('修改成功')
          editInfoDialogVisible.value = false
          // 更新userStore中的用户信息
          userStore.setUserInfo({
            ...userStore.userInfo,
            userAccount: editInfoForm.value.userAccount,
            username: editInfoForm.value.username,
          })
        } else {
          ElMessage.error(res.message || '修改失败')
        }
      } catch (error) {
        console.error('修改失败:', error)
      }
    }
  })
}

// 修改密码相关
const editPasswordDialogVisible = ref(false)
const editPasswordFormRef = ref(null)
const editPasswordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const editPasswordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== editPasswordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const handleEditPassword = () => {
  editPasswordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  editPasswordDialogVisible.value = true
}

const submitEditPassword = () => {
  editPasswordFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/user/updatePassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: token,
          },
          body: JSON.stringify({
            id: userStore.userInfo?.id,
            oldPassword: editPasswordForm.value.oldPassword,
            newPassword: editPasswordForm.value.newPassword,
          }),
        })
        const data = await res.json()
        if (data.code === 0) {
          ElMessage.success('修改成功，请重新登录')
          editPasswordDialogVisible.value = false
          // 退出登录
          userStore.logout()
          router.push('/login')
        } else {
          ElMessage.error(data.message || '修改失败')
        }
      } catch (error) {
        console.error('修改失败:', error)
      }
    }
  })
}

// 修改学生信息相关
const editStudentDialogVisible = ref(false)
const editStudentFormRef = ref(null)
const editStudentForm = ref({
  id: '',
  studentId: '',
  name: '',
  grade: '',
  profession: '',
  gender: 1,
  email: '',
  phone: '',
})

const studentRules = {
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

const handleEditStudent = () => {
  editStudentForm.value = { ...studentInfo.value }
  editStudentDialogVisible.value = true
}

const submitEditStudent = () => {
  editStudentFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const res = await saveStudent(editStudentForm.value)
        if (res.code === 0) {
          ElMessage.success('修改成功')
          editStudentDialogVisible.value = false
          // 重新获取学生信息
          await getStudentInfo()
        } else {
          ElMessage.error(res.message || '修改失败')
        }
      } catch (error) {
        console.error('修改失败:', error)
        ElMessage.error('修改失败')
      }
    }
  })
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 20px;
  min-height: 100%;
}

.profile-card {
  flex: 1;
  max-width: 580px;
  min-width: 400px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 600px;
}

.left-card {
  position: relative;
  overflow: visible;
}

.left-card :deep(.el-dialog) {
  position: absolute !important;
  margin: 0 !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
}

.left-card :deep(.el-overlay) {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.right-card {
  align-items: stretch;
}

.avatar-wrapper {
  margin: 40px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-wrapper :deep(.el-avatar) {
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  color: #fff;
  font-size: 48px;
  transition: all 0.3s ease;
}

.avatar-wrapper :deep(.el-avatar):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.info-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 0 40px;
}

.info-item {
  padding: 10px 0;
  display: flex;
  align-items: center;
}

.info-item .label {
  width: 75px;
  color: #606266;
  margin-left: 50px;
}

.info-item .value {
  color: #303133;
  flex: 1;
  margin-right: 50px;
}

.verify-btn {
  margin-left: 20px;
}

:deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-tag--light) {
  margin-left: 10px;
  margin-right: 25px;
}

.unverified-tips {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.empty-text {
  color: #909399;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.student-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.info-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  align-content: flex-start;
}

.grid-item {
  display: flex;
  align-items: center;
}

.grid-item .label {
  width: 60px;
}

.grid-item .value {
  color: #303133;
  font-size: 14px;
}

.button-group {
  margin-top: 30px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.button-group .el-button {
  width: 120px;
}

.left-card-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.left-card-dialog :deep(.el-dialog) {
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.left-card {
  position: relative;
  overflow: visible;
}

.left-card :deep(.el-dialog) {
  position: absolute !important;
  margin: 0 !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.left-card :deep(.el-overlay) {
  position: absolute;
}
</style>
