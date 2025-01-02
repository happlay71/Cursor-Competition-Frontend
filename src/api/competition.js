import request from '@/utils/request'

/**
 * 查询竞赛列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function selectCompetition(params) {
  return request({
    url: '/api/competition/selectCompetition',
    method: 'post',
    data: params,
  })
}

/**
 * 保存或更新竞赛信息
 * @param {Object} data - 竞赛信息
 * @returns {Promise}
 */
export function saveCompetition(data) {
  return request({
    url: '/api/competition/saveCompetition',
    method: 'post',
    data,
  })
}

/**
 * 删除竞赛信息
 * @param {number} id - 竞赛ID
 * @returns {Promise}
 */
export function deleteCompetition(id) {
  return request({
    url: '/api/competition/deleteCompetition',
    method: 'get',
    params: {
      id,
    },
  })
}

// 获取竞赛名称列表
export function selectCompetitionName() {
  return request({
    url: '/api/competition/selectCompetitionName',
    method: 'get',
  })
}
