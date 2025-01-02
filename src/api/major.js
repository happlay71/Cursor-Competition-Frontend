import request from '@/utils/request'

/**
 * 查询专业列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function selectMajor(params) {
  return request({
    url: '/api/major/selectMajor',
    method: 'post',
    data: {
      pageNo: params.pageNo,
      pageSize: params.pageSize,
      name: params.name,
    },
  })
}

/**
 * 保存或更新专业信息
 * @param {Object} data - 专业信息
 * @returns {Promise}
 */
export function saveMajor(data) {
  return request({
    url: '/api/major/saveMajor',
    method: 'post',
    data: {
      id: data.id,
      name: data.name,
      awardCount: data.awardCount,
    },
  })
}

/**
 * 删除专业信息
 * @param {number} id - 专业ID
 * @returns {Promise}
 */
export function deleteMajor(id) {
  return request({
    url: '/api/major/deleteMajor',
    method: 'get',
    params: {
      id,
    },
  })
}

/**
 * 获取专业名称列表
 * @returns {Promise}
 */
export function selectMajorName() {
  return request({
    url: '/api/major/selectMajorName',
    method: 'get',
  })
}
