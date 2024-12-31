import request from '@/utils/request'

// 查询团队列表
export function selectTeam(params) {
  return request({
    url: '/api/team/list',
    method: 'get',
    params,
  })
}

// 保存团队信息（新增/修改）
export function saveTeam(data) {
  return request({
    url: '/api/team/save',
    method: 'post',
    data,
  })
}

// 删除团队成员
export function deleteTeam(params) {
  return request({
    url: '/api/team/delete',
    method: 'post',
    params,
  })
}
