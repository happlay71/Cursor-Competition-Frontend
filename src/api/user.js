import request from '@/utils/request'

// 查询用户列表
export function selectUser(params) {
  return request({
    url: '/api/user/selectUser',
    method: 'post',
    data: params,
  })
}

// 保存或更新用户信息
export function saveUser(data) {
  return request({
    url: '/api/user/saveUser',
    method: 'post',
    data,
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/api/user/deleteUser/${id}`,
    method: 'get',
  })
}

// 修改密码
export function savePassword(data) {
  return request({
    url: '/api/user/savePassword',
    method: 'post',
    data,
  })
}

// 改变用户状态
export function updateUserStatus(data) {
  return request({
    url: '/api/user/updateStatus',
    method: 'post',
    data,
  })
}

// 用户登录
export const login = (data) => {
  return request({
    url: '/api/user/login',
    method: 'post',
    data,
  })
}

// 用户注册
export const register = (data) => {
  return request({
    url: '/api/user/register',
    method: 'post',
    data,
  })
}
