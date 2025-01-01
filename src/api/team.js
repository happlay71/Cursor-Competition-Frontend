import request from '@/utils/request'

/**
 * 查询团队列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function selectTeam(params) {
  return request({
    url: '/api/team/selectTeam',
    method: 'post',
    data: params,
  })
}

/**
 * 保存或更新团队信息
 * @param {Object} data - 团队信息
 * @returns {Promise}
 */
export function saveTeam(data) {
  return request({
    url: '/api/team/saveTeam',
    method: 'post',
    data,
  })
}

/**
 * 删除团队信息
 * @param {number} id - 团队ID
 * @returns {Promise}
 */
export function deleteTeam(id) {
  return request({
    url: '/api/team/deleteTeam',
    method: 'get',
    params: {
      id,
    },
  })
}
