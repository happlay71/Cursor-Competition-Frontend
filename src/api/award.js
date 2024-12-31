import request from '@/utils/request'

// 查询获奖信息
export function selectAward(data) {
  return request({
    url: '/api/award/selectAward',
    method: 'post',
    data,
  })
}

// 新增或修改获奖信息
export function saveAward(data) {
  return request({
    url: '/api/award/saveAward',
    method: 'post',
    data,
  })
}

// 删除获奖信息
export function deleteAward(awardId) {
  return request({
    url: '/api/award/deleteAward',
    method: 'get',
    params: { awardId },
  })
}

// 审核获奖信息
export function auditAward(awardId, action) {
  return request({
    url: '/api/award/auditAward',
    method: 'post',
    params: {
      awardId,
      action,
    },
  })
}
