import request from '@/utils/request'

// 验证学生身份信息
export function verifyStudent(data) {
  return request({
    url: '/api/student/verify',
    method: 'post',
    data,
  })
}

// 获取自身学生身份信息
export function getStudentInfo() {
  return request({
    url: '/api/student/info',
    method: 'get',
  })
}

// 查询学生信息（管理员）
export function selectStudent(data) {
  return request({
    url: '/api/student/selectStudent',
    method: 'post',
    data,
  })
}

// 更新学生信息
export function updateStudent(data) {
  return request({
    url: '/api/student/update',
    method: 'post',
    data,
  })
}

// 切换学生账号状态
export function toggleStudentStatus(id, status) {
  return request({
    url: '/api/student/updateStatus',
    method: 'post',
    data: { id, status },
  })
}
