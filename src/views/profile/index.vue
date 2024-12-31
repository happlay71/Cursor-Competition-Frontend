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
        </div>
        <div class="info-item">
          <span class="label">昵称：</span>
          <span class="value">{{ username }}</span>
        </div>
        <div class="info-item">
          <span class="label">状态：</span>
          <el-tag :type="status === 0 ? 'success' : 'danger'">
            {{ status === 0 ? '已启用' : '已禁用' }}
          </el-tag>
        </div>
        <div class="info-item">
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
        <div class="section-title">学生信息</div>
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
            <span class="value">{{ studentInfo.majorName }}</span>
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
  studentId: '',
  name: '',
  email: '',
  phone: '',
})

// 表单验证规则
const rules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{8,12}$/, message: '请输入8-12位数字学号', trigger: 'blur' },
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
        // TODO: 调用后端认证接口
        const res = await fetch('/api/user/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify(verifyForm.value),
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
  majorName: '',
  gender: null,
  email: '',
  phone: '',
})

// 获取学生信息
const getStudentInfo = async () => {
  try {
    // TODO: 调用后端接口获取学生信息
    const res = await fetch('/api/student/info', {
      headers: {
        Authorization: localStorage.getItem('token'),
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

// 在页面加载时获取学生信息
onMounted(() => {
  getStudentInfo()
})
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
  max-width: 500px;
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
  align-items: center;
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
  width: 90px;
  color: #606266;
}

.info-item .value {
  color: #303133;
  flex: 1;
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
  width: 90px;
}

.grid-item .value {
  color: #303133;
  font-size: 14px;
}
</style>
