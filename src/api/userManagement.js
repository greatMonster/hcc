// eslint-disable-next-line no-unused-vars
import httpRequest from '@/utils/http-request'

// 查询接口
export function initData(data) {
  return httpRequest({
    url: 'auth/api/v1/users?username=' + data.username + '&name=' + data.name + '&status=' + data.status + '&roleId=' + data.roleId + '&userType=' + data.userType,
    method: 'get'
  })
}

export function select(data) {
  return httpRequest({
    url: '/auth/api/v1/roles?userType=' + data,
    method: 'get'
  })
}

export function addData(data) {
  return httpRequest({
    url: 'auth/api/v1/users',
    method: 'post',
    data
  })
}

export function setData(data) {
  return httpRequest({
    url: 'auth/api/v1/users/' + data + '',
    method: 'get'
  })
}
export function editData(data) {
  return httpRequest({
    url: 'auth/api/v1/users',
    method: 'put',
    data
  })
}
export function statusData(data) {
  return httpRequest({
    url: 'auth/api/v1/users/' + data + '/block',
    method: 'put'

  })
}
export function unblaockData(data) {
  return httpRequest({
    url: 'auth/api/v1/users/' + data + '/unblock',
    method: 'put'

  })
}
