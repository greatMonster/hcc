import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

export function skill(data) {
  return request({
    url: '/adm/basic/data/skill/select?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: '/adm/basic/data/skill/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/basic/data/skill/remove',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/basic/data/skill/set',
    method: 'post',
    data
  })
}

export function skillSearch(data) {
  return request({
    url: '/adm/basic/data/skillType/findAll?airportId=' + data.airportId,
    method: 'get',
    data
  })
}

export function ruleSkillSearch(data) {
  return httpRequest({
    url: '/api/v1/adm/basic/data/skill/findSkillByType?skillType=' + data.skillType + '&businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}

export function ruleSkillSearch1(data) {
  return httpRequest({
    url: '/api/v1/adm/basic/data/skill/findSkills?skillType=' + data.skillType + '&organizationId=' + data.organizationId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
