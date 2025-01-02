<template>
  <div class="layout-container">
    <div class="gradient-bg"></div>
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo">竞赛获奖系统</div>
      <el-menu :default-active="activeMenu" class="menu" router>
        <el-menu-item index="/award">
          <el-icon><Trophy /></el-icon>
          <span>获奖信息</span>
        </el-menu-item>
        <el-menu-item index="/team">
          <el-icon><UserFilled /></el-icon>
          <span>团队信息</span>
        </el-menu-item>
        <el-menu-item index="/competition">
          <el-icon><Medal /></el-icon>
          <span>竞赛信息</span>
        </el-menu-item>
        <el-menu-item index="/competition-level">
          <el-icon><Collection /></el-icon>
          <span>竞赛级别</span>
        </el-menu-item>
        <el-menu-item index="/major">
          <el-icon><School /></el-icon>
          <span>专业信息</span>
        </el-menu-item>
        <el-menu-item index="/student" v-if="isAdmin">
          <el-icon><User /></el-icon>
          <span>学生信息</span>
        </el-menu-item>
        <el-menu-item index="/profile">
          <el-icon><UserFilled /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="main">
      <!-- 顶部栏 -->
      <div class="header">
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" class="avatar" :src="userAvatar">
                {{ username?.charAt(0)?.toUpperCase() }}
              </el-avatar>
              <span class="username">{{ username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Trophy, UserFilled, User, List, Collection, School, Avatar } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)
const isAdmin = computed(() => userStore.isAdmin)
const username = computed(
  () => userStore.userInfo?.username || userStore.userInfo?.userAccount || '',
)
const userAvatar = computed(() => userStore.userInfo?.avatarUrl)

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.clearUserInfo()
    ElMessage.success('退出成功')
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100%;
  min-width: 1200px;
  overflow: auto;
  position: relative;
}

.gradient-bg {
  position: fixed;
  inset: 0;
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

.sidebar {
  width: 240px;
  min-width: 240px;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  color: #333;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1001;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #6e78c8;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.menu {
  border-right: none;
  background-color: transparent;
}

:deep(.el-menu) {
  border-right: none;
  background-color: transparent;
}

:deep(.el-menu-item) {
  color: #333;
}

:deep(.el-menu-item.is-active) {
  color: #6e78c8;
  background: rgba(110, 120, 200, 0.1);
}

:deep(.el-menu-item:hover) {
  background: rgba(110, 120, 200, 0.1);
}

.main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-width: 960px;
  position: relative;
  z-index: 1;
}

.header {
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  position: fixed;
  top: 0;
  right: 0;
  left: 240px;
  z-index: 1000;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right :deep(.el-avatar) {
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.header-right :deep(.el-avatar):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background: rgba(110, 120, 200, 0.1);
}

.avatar {
  background: #6e78c8;
  color: #fff;
}

.username {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
}

.content {
  flex: 1;
  padding: 20px;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  overflow: auto;
  border-radius: 8px;
  margin: 80px 20px 20px;

  height: 60px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  /* display: flex; */
  align-items: center;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  right: 0;
  left: 240px;
  z-index: 1000;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 16px;
  font-size: 18px;
  color: #6e78c8;
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
</style>
