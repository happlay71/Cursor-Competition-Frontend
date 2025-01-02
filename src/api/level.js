import request from '@/utils/request'

/**
 * 查询竞赛级别列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function selectLevel(params) {
  return request({
    url: '/api/competition-level/selectLevel',
    method: 'post',
    data: {
      pageNo: params.pageNo,
      pageSize: params.pageSize,
      competition: params.competition,
      level: params.level,
    },
  })
}

/**
 * 保存或更新竞赛级别信息
 * @param {Object} data - 竞赛级别信息
 * @returns {Promise}
 */
export function saveLevel(data) {
  return request({
    url: '/api/competition-level/saveLevel',
    method: 'post',
    data: {
      id: data.id,
      competition: data.competition,
      level: data.level,
      ranking: data.ranking,
      credit: data.credit,
      achievement: data.achievement,
    },
  })
}

/**
 * 删除竞赛级别信息
 * @param {number} id - 竞赛级别ID
 * @returns {Promise}
 */
export function deleteLevel(id) {
  return request({
    url: '/api/competition-level/deleteLevel',
    method: 'get',
    params: {
      id,
    },
  })
}

// 获取竞赛级别列表
export function selectLevelName() {
  return request({
    url: '/api/competition-level/selectLevelName',
    method: 'get',
  })
}

// 获取获奖名次名称列表
export function selectRankingName() {
  return request({
    url: '/api/competition-level/selectRankingName',
    method: 'get',
  })
}
