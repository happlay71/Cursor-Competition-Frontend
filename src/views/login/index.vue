<template>
  <div class="login-container" :class="{ dark: isDark }">
    <div class="gradient-bg"></div>
    <div class="background">
      <!-- 静态小球 -->
      <div
        v-for="ball in balls"
        :key="ball.id"
        class="ball"
        :style="{
          left: `${ball.x}%`,
          top: `${ball.y}%`,
          width: `${ball.size}px`,
          height: `${ball.size}px`,
          backgroundColor: ball.color,
          opacity: ball.opacity,
        }"
      ></div>
    </div>
    <div class="login-box">
      <!-- 主题切换按钮 -->
      <el-button
        class="theme-switch"
        :icon="isDark ? 'Sunny' : 'Moon'"
        circle
        @click="toggleTheme"
      />
      <el-form ref="loginForm" :model="formData" :rules="loginRules" class="login-form">
        <h3 class="title">竞赛获奖系统</h3>
        <el-form-item prop="userAccount">
          <el-input v-model="formData.userAccount" placeholder="账号" type="text" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" placeholder="密码" type="password" show-password />
        </el-form-item>
        <el-button :loading="loading" type="primary" @click="handleLogin">登录</el-button>
        <div class="register-link">
          <router-link to="/register">注册账号</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const loading = ref(false)

// 使用 ref 引用 el-form
const loginForm = ref(null)

const formData = reactive({
  userAccount: '',
  password: '',
})

const loginRules = {
  userAccount: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 预定义小球配置
const balls = [
  { id: 1, x: 15, y: 15, size: 120, color: 'rgba(173, 216, 230, 0.3)', opacity: 0.6 },
  { id: 2, x: 85, y: 10, size: 80, color: 'rgba(240, 248, 255, 0.3)', opacity: 0.6 },
  { id: 3, x: 75, y: 85, size: 100, color: 'rgba(230, 230, 250, 0.3)', opacity: 0.6 },
  { id: 4, x: 5, y: 70, size: 90, color: 'rgba(245, 245, 255, 0.3)', opacity: 0.6 },
]

const userStore = useUserStore()

// 登录方法
const handleLogin = async () => {
  loading.value = true
  try {
    // 使用 refs 访问 form 验证
    await loginForm.value.validate()

    // 调用登录接口
    const res = await login(formData)
    if (res.code === 0 && res.data) {
      const userInfo = {
        id: res.data.id,
        userAccount: res.data.userAccount,
        username: res.data.username,
        avatarUrl: res.data.avatarUrl,
        status: res.data.status,
        isDelete: res.data.isDelete,
        token: res.data.token,
      }

      // 登录成功后将信息存储到 localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      localStorage.setItem('token', res.data.token)

      // 保存用户信息到 userStore
      userStore.setUserInfo(userInfo)

      // 登录成功后的提示
      ElMessage.success('登录成功')

      // 跳转到奖项页面
      await router.push('/award')
    } else {
      // 如果登录失败，展示错误信息
      ElMessage.error(res.message || '登录失败')
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败')
  } finally {
    // 无论成功或失败，都将 loading 状态设置为 false
    loading.value = false
  }
}

// 页面加载时恢复用户信息
onMounted(() => {
  userStore.restoreUserInfo() // 恢复用户信息
})

// 主题切换相关
const isDark = ref(false)

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.className = isDark.value ? 'dark' : ''
}

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.className = 'dark'
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.gradient-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    45deg,
    rgba(240, 248, 255, 1) 0%,
    rgba(230, 230, 250, 1) 25%,
    rgba(240, 255, 255, 1) 50%,
    rgba(245, 245, 255, 1) 75%,
    rgba(240, 248, 255, 1) 100%
  );
  background-size: 400% 400%;
  animation: gradientBg 15s ease infinite;
  z-index: 0;
}

.background {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
}

.ball {
  position: absolute;
  border-radius: 50%;
  filter: blur(30px);
}

.login-box {
  position: relative;
  width: 100%;
  max-width: 460px;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin-right: 30%;
}

.login-form {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  text-align: center;
  margin-bottom: 40px;
  color: #6e78c8;
  font-size: 28px;
  font-weight: 500;
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 25px;
  width: 100%;
  max-width: 380px;
}

:deep(.el-form-item__content) {
  display: flex;
  justify-content: center;
  width: 100%;
}

:deep(.el-input) {
  width: 100%;
  --el-input-height: 42px;
}

:deep(.el-input__wrapper) {
  width: 100%;
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  padding: 1px 15px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #6e78c8 inset !important;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #6e78c8 inset !important;
}

:deep(.el-button--primary) {
  width: 100%;
  max-width: 380px;
  height: 42px;
  margin-top: 20px;
  background-color: #6e78c8;
  border-color: #6e78c8;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  width: 100%;
}

.register-link a {
  color: #6e78c8;
  text-decoration: none;
  font-size: 14px;
}

@keyframes gradientBg {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 响应式布局 */
@media screen and (max-width: 576px) {
  .login-form {
    padding: 40px 25px;
  }

  .title {
    font-size: 28px;
    margin-bottom: 40px;
  }
}

/* 暗色主题背景 */
.dark .gradient-bg {
  background: linear-gradient(
    45deg,
    rgba(48, 56, 65, 1) 0%,
    rgba(64, 158, 255, 0.2) 25%,
    rgba(48, 56, 65, 1) 50%,
    rgba(64, 158, 255, 0.2) 75%,
    rgba(48, 56, 65, 1) 100%
  );
  background-size: 400% 400%;
  animation: gradientBg 15s ease infinite;
}

/* 主题切换按钮样式 */
.theme-switch {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.dark .theme-switch {
  background: rgba(35, 39, 47, 0.95);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.dark .theme-switch:hover {
  background: var(--hover-color);
  border-color: #409eff;
  color: #409eff;
}

/* 暗色主题变量 */
.dark {
  --bg-primary: #1e2227;
  --bg-secondary: #23272f;
  --text-primary: #e5eaf3;
  --text-secondary: #a9b2c8;
  --border-color: rgba(255, 255, 255, 0.1);
  --hover-color: rgba(255, 255, 255, 0.05);
  --active-color: rgba(64, 158, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.3);
}
</style>
