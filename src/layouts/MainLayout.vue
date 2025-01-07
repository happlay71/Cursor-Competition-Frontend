<template>
  <div class="layout-container" :class="{ dark: isDark }">
    <div class="gradient-bg"></div>
    <!-- 左侧导航栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
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
        <el-menu-item index="/user" v-if="isAdmin">
          <el-icon><UserFilled /></el-icon>
          <span>用户信息</span>
        </el-menu-item>
        <el-menu-item index="/profile">
          <el-icon><UserFilled /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧内容区 -->
    <el-container class="right-container">
      <!-- 顶部栏 -->
      <div class="header">
        <!-- <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
        </div> -->
        <div class="header-right">
          <!-- 使用一个容器包裹主题切换按钮和用户信息 -->
          <div class="button-container">
            <!-- 主题切换按钮 -->
            <el-button
              class="theme-switch"
              :icon="isDark ? 'Sunny' : 'Moon'"
              circle
              @click="toggleTheme"
            />
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
      </div>

      <!-- 主要内容区域 -->
      <div class="content">
        <router-view></router-view>
      </div>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Trophy, UserFilled, User, List, Collection, School, Avatar } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

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
    userStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确认退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.logout()
      router.push('/login')
      ElMessage.success('退出登录成功')
    })
    .catch(() => {
      ElMessage.info('已取消退出')
    })
}

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

.aside {
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

.right-container {
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

.button-container {
  display: flex;
  align-items: center;
  gap: 8px; /* 主题按钮和用户信息之间的间距 */
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

/* 主题切换按钮样式 */
.theme-switch {
  /* position: fixed; */
  cursor: pointer;
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

/* 暗色主题布局组件 */
.dark .layout-container {
  /* background-color: var(--bg-primary);
  background: linear-gradient(
    45deg,
    rgba(48, 56, 65, 1) 0%,
    rgba(64, 158, 255, 0.2) 25%,
    rgba(48, 56, 65, 1) 50%,
    rgba(64, 158, 255, 0.2) 75%,
    rgba(48, 56, 65, 1) 100%
  ); */
  color: var(--text-primary);
}

.dark .aside {
  background: rgba(30, 34, 39, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid var(--border-color);
}

.dark .header {
  background: rgba(30, 34, 39, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.dark .logo {
  color: #409eff;
  background: rgba(30, 34, 39, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.dark .content {
  background: rgba(35, 39, 47, 0.95);
  backdrop-filter: blur(10px);
}

/* 暗色主题菜单 */
.dark .el-menu {
  background-color: transparent;
  border-right: none;
}

.dark .el-menu-item {
  color: var(--text-primary);
}

.dark .el-menu-item:hover {
  background-color: var(--hover-color);
}

.dark .el-menu-item.is-active {
  background-color: var(--active-color);
  color: #409eff;
}

.dark .el-menu-item .el-icon {
  color: var(--text-secondary);
}

.dark .el-menu-item.is-active .el-icon {
  color: #409eff;
}

/* 暗色主题用户信息 */
.dark .user-info {
  color: var(--text-primary);
}

.dark .user-info:hover {
  background: var(--hover-color);
}

.dark .username {
  color: var(--text-primary);
}

/* 暗色主题下拉菜单 */
.dark .el-dropdown-menu {
  background: rgba(35, 39, 47, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
}

.dark .el-dropdown-menu__item {
  color: var(--text-primary);
}

.dark .el-dropdown-menu__item:hover {
  background-color: var(--hover-color);
}

/* 暗色主题头像 */
.dark .el-avatar {
  background: linear-gradient(120deg, #409eff 0%, #66b1ff 100%);
  border: 2px solid var(--border-color);
  box-shadow: 0 2px 12px var(--shadow-color);
}

.dark .el-avatar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--shadow-color);
}

/* 暗色主题切换按钮 */
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

/* 暗色主题组件样式 */
.dark {
  /* 表格样式 */
  --el-table-border-color: var(--border-color);
  --el-table-border: 1px solid var(--border-color);
  --el-table-text-color: var(--text-primary);
  --el-table-header-text-color: var(--text-primary);
  --el-table-header-bg-color: rgba(35, 39, 47, 0.95);
  --el-table-row-hover-bg-color: var(--hover-color);

  /* 表单样式 */
  --el-input-bg-color: rgba(35, 39, 47, 0.8);
  --el-input-border-color: var(--border-color);
  --el-input-hover-border-color: #409eff;
  --el-input-focus-border-color: #409eff;
  --el-input-text-color: var(--text-primary);
  --el-input-placeholder-color: var(--text-secondary);

  /* 按钮样式 */
  --el-button-bg-color: rgba(35, 39, 47, 0.8);
  --el-button-border-color: var(--border-color);
  --el-button-hover-bg-color: var(--hover-color);
  --el-button-hover-text-color: #409eff;
  --el-button-disabled-bg-color: rgba(35, 39, 47, 0.5);
  --el-button-disabled-text-color: var(--text-secondary);

  /* 对话框样式 */
  --el-dialog-bg-color: rgba(35, 39, 47, 0.95);
  --el-dialog-border-color: var(--border-color);
  --el-dialog-title-color: var(--text-primary);
  --el-dialog-content-color: var(--text-primary);

  /* 卡片样式 */
  --el-card-bg-color: rgba(35, 39, 47, 0.95);
  --el-card-border-color: var(--border-color);

  /* 分页样式 */
  --el-pagination-bg-color: transparent;
  --el-pagination-text-color: var(--text-primary);
  --el-pagination-button-bg-color: rgba(35, 39, 47, 0.8);
  --el-pagination-button-disabled-bg-color: rgba(35, 39, 47, 0.5);
  --el-pagination-hover-color: #409eff;

  /* 下拉菜单样式 */
  --el-select-dropdown-bg-color: rgba(35, 39, 47, 0.95);
  --el-select-dropdown-border-color: var(--border-color);
  --el-select-dropdown-item-hover-bg: var(--hover-color);
  --el-select-dropdown-item-selected-bg: var(--active-color);
}

/* 暗色主题表格 */
.dark .el-table {
  background-color: transparent;
}

.dark .el-table tr {
  background-color: rgba(35, 39, 47, 0.8);
}

.dark .el-table th.el-table__cell {
  background-color: rgba(35, 39, 47, 0.95);
}

/* 暗色主题表单 */
.dark .el-input__wrapper {
  background-color: rgba(35, 39, 47, 0.8);
  box-shadow: 0 0 0 1px var(--border-color) !important;
}

.dark .el-input__wrapper:hover,
.dark .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #409eff !important;
}

/* 暗色主题按钮 */
.dark .el-button {
  background-color: rgba(35, 39, 47, 0.8);
  border-color: var(--border-color);
}

.dark .el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}

.dark .el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

/* 暗色主题对话框 */
.dark .el-dialog {
  background-color: rgba(35, 39, 47, 0.95);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

/* 暗色主题卡片 */
.dark .el-card {
  background-color: rgba(35, 39, 47, 0.95);
  border-color: var(--border-color);
  backdrop-filter: blur(10px);
}

/* 暗色主题分页 */
.dark .el-pagination button {
  background-color: rgba(35, 39, 47, 0.8);
}

.dark .el-pagination .el-pager li {
  background-color: rgba(35, 39, 47, 0.8);
}

.dark .el-pagination .el-pager li.active {
  background-color: #409eff;
  color: #fff;
}

/* 暗色主题下拉菜单 */
.dark .el-select-dropdown {
  background-color: rgba(35, 39, 47, 0.95);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.dark .el-select-dropdown__item.selected {
  background-color: var(--active-color);
  color: #409eff;
}
</style>
