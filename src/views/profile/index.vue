<template>
  <div class="profile-container">
    <el-card class="profile-card">
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
          <span class="label">角色：</span>
          <el-tag :type="isAdmin ? 'danger' : 'success'">
            {{ isAdmin ? '管理员' : '普通用户' }}
          </el-tag>
        </div>
        <div class="info-item">
          <span class="label">状态：</span>
          <el-tag :type="status === 0 ? 'success' : 'danger'">
            {{ status === 0 ? '已启用' : '已禁用' }}
          </el-tag>
        </div>
        <div class="info-item">
          <span class="label">认证状态：</span>
          <el-tag :type="isVerified ? 'success' : 'warning'">
            {{ isVerified ? '已认证' : '未认证' }}
          </el-tag>
          <el-button
            v-if="!isVerified"
            type="primary"
            size="small"
            class="verify-btn"
            @click="handleVerify"
          >
            学生认证
          </el-button>
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
          <el-button type="primary" @click="submitVerify"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
</script>

<style scoped>
.profile-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
}

.profile-card {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 40px;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 16px;
}

.info-item .label {
  width: 80px;
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
</style>
