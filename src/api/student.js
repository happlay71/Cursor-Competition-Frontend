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

// 查询学生列表
export function selectStudent(data) {
  return request({
    url: '/api/student/selectStudent',
    method: 'post',
    data,
  })
}

// 保存或更新学生信息
export function saveStudent(data) {
  return request({
    url: '/api/student/saveStudent',
    method: 'post',
    data,
  })
}

// 切换学生账号状态
export function toggleStudentStatus(id, status) {
  return request({
    url: '/api/student/status',
    method: 'post',
    params: {
      id: Number(id),
      status,
    },
  })
}

// 删除学生
export function deleteStudent(id) {
  return request({
    url: '/api/student/deleteStudent',
    method: 'get',
    params: { id },
  })
}
