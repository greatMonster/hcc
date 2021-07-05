import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

export function login(data) {
  return httpRequest({
    url: '/api/v1/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return httpRequest({
    url: '/auth/api/v1/users/me',
    method: 'get'
  })
}

export function logout() {
  return httpRequest({
    url: '/api/v1/logout',
    method: 'post'
  })
}
export function getVerify() {
  return request({
    url: '/user/getVerify',
    method: 'get'
  })
}

export function getRouter(airportId) {
  return httpRequest({
    url: '/auth/api/v1/users/me/pages?airportId=' + airportId,
    method: 'get'
  })
}

