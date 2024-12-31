<template>
  <div class="layout-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo">竞赛获奖系统</div>
      <el-menu :default-active="activeMenu" class="menu" router>
        <el-menu-item index="/award">
          <el-icon><Trophy /></el-icon>
          <span>获奖信息</span>
        </el-menu-item>
        <el-menu-item index="/team">
          <el-icon><User /></el-icon>
          <span>学生获奖团队</span>
        </el-menu-item>
        <template v-if="isAdmin">
          <el-menu-item index="/competition">
            <el-icon><List /></el-icon>
            <span>竞赛信息</span>
          </el-menu-item>
          <el-menu-item index="/competition-level">
            <el-icon><Collection /></el-icon>
            <span>竞赛级别信息</span>
          </el-menu-item>
          <el-menu-item index="/major">
            <el-icon><School /></el-icon>
            <span>专业信息</span>
          </el-menu-item>
        </template>
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
import { Trophy, UserFilled, User, List, Collection, School } from '@element-plus/icons-vue'
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
}

.sidebar {
  width: 240px;
  height: 100%;
  background-color: #304156;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #2b3649;
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
  color: #bfcbd9;
}

:deep(.el-menu-item.is-active) {
  color: #409eff;
  background-color: #263445;
}

:deep(.el-menu-item:hover) {
  background-color: #263445;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;
}

.username {
  margin-left: 8px;
  font-size: 14px;
  color: #606266;
}

.content {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background-color: #f0f2f5;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 16px;
  font-size: 18px;
}
</style>
