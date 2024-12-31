<template>
  <div class="register-container">
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
    <div class="register-box">
      <el-form ref="registerForm" :model="formData" :rules="registerRules" class="register-form">
        <h3 class="title">注册账号</h3>
        <el-form-item prop="userAccount">
          <el-input v-model="formData.userAccount" placeholder="账号" type="text" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" placeholder="密码" type="password" show-password />
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="用户昵称" type="text" />
        </el-form-item>
        <el-button :loading="loading" type="primary" @click="handleRegister"> 注册 </el-button>
        <div class="login-link">
          <router-link to="/login">返回登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/user'

const router = useRouter()
const loading = ref(false)

const formData = reactive({
  userAccount: '',
  password: '',
  username: '',
})

const registerRules = {
  userAccount: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
}

// 预定义小球配置
const balls = [
  { id: 1, x: 15, y: 15, size: 120, color: 'rgba(173, 216, 230, 0.3)', opacity: 0.6 },
  { id: 2, x: 85, y: 10, size: 80, color: 'rgba(240, 248, 255, 0.3)', opacity: 0.6 },
  { id: 3, x: 75, y: 85, size: 100, color: 'rgba(230, 230, 250, 0.3)', opacity: 0.6 },
  { id: 4, x: 5, y: 70, size: 90, color: 'rgba(245, 245, 255, 0.3)', opacity: 0.6 },
]

const handleRegister = async () => {
  loading.value = true
  try {
    const res = await register(formData)
    if (res.code === 0) {
      ElMessage.success('注册成功')
      router.push('/login')
    } else {
      ElMessage.error(res.message || '注册失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('注册失败')
  }
  loading.value = false
}
</script>

<style scoped>
.register-container {
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

.register-box {
  position: relative;
  width: 100%;
  max-width: 460px;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin-right: 30%;
}

.register-form {
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

.login-link {
  margin-top: 20px;
  text-align: center;
  width: 100%;
}

.login-link a {
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
  .register-form {
    padding: 40px 25px;
  }

  .title {
    font-size: 28px;
    margin-bottom: 40px;
  }
}
</style>
