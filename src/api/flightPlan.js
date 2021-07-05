import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

export function select(token) {
  return request({
    url: '/adm/basic/data/role/select',
    method: 'get',
    params: {
      token
    }
  })
}
// 查询各类信息的数量
export function detailsCount(data) { // 航班计划
  return httpRequest({
    url: '/prepare/api/v1/flightPlan/document/' + data.id + '/documentType/' + data.type + '?beginDate=' + data.beginDate + '&endDate=' + data.endDate + '&carrier=' + data.carrier + '&deptAirport=' + data.deptAirport + '&arrAirport=' + data.arrAirport + '&acType=' + data.acType + '&deptTime=' + data.deptTime + '&arrTime=' + data.arrTime + '&throughFlag=' + data.throughFlag,
    method: 'get'
  })
}

// export function goto(byDocumentid) {
//   return request({
//     url: '/api/v1/prepare/queryCycleFlightPlanByDocumentId?documentId=' + byDocumentid,
//     method: 'get'
//   })
// }
export function circularFlights(data) { // 航班计划
  return request({
    url: '/prepare/flightSchedule/query/CycleFlightPlan/ByDocumentId?documentId=' + data,
    method: 'get'
  })
}

export function byDocumentIdAndPage(data) { // 航班计划记录
  return request({
    url: '/prepare/flightLeg/select/flightLeg/byDocumentIdAndPage?documentId=' + data.documentId + '&pageSize=' + data.pageSize + '&pageNum=' + data.pageNum + '&carrier=' + data.carrier + '&intlFlag=' + data.intlFlag + '&acType=' + data.acType + '&flightType=' + data.flightType + '&deptAirport=' + data.deptAirport + '&arrAirport=' + data.arrAirport + '&flightDate=' + data.flightDate + '&flightNo=' + data.flightNo,
    method: 'get'
  })
}

export function search(data) {
  return request({
    url: '/prepare/search/legs/byDocumentid?pageSize=' + data.pageSize + '&pageNum=' + data.pageNum + '&documentId=' + data.documentId,
    method: 'get'
    // params: { data }
  })
}

export function down(data) {
  return request({
    url: '/prepare/cycleFlightPlan/export?filename=' + data.fileName + '&documentId=' + data.documentId,
    method: 'get'
    // params: { data }
  })
}
// 航班关联页面
export function associatedflights(data) {
  return request({
    url: '/prepare/flightSchedule/getFsCycleFlight?flightType=' + data.flightType + '&relationStatus=' + data.relationStatus + '&flightNo=' + data.flightNo + '&cycleFlightScheduleId=' + data.cycleFlightScheduleId + '&carrier=' + data.carrier + '&acType=' + data.acType + '&throughFlag=' + data.throughFlag,
    method: 'get'
  })
}

export function updateThroughFflag(data) {
  return request({
    url: '/prepare/flightSchedule/updateThroughFlag?cycleFlightIds=' + data,
    method: 'POST'
  })
}

export function addLinkedFlightNo(data) {
  return request({
    url: '/prepare/flightSchedule/addLinkedFlightNo',
    method: 'POST',
    data
  })
}

export function cancelLinkedFlightNo(data) {
  return request({
    url: '/prepare/flightSchedule/cancelLinkedFlightNo?identifier=' + data.identifier,
    method: 'POST',
    data
  })
}

export function getCarrselect(data) {
  return request({
    url: '/prepare/flightSchedule/connect/getCarrierAndAcType?cycleFlightScheduleId=' + data.cycleFlightScheduleId + '&flightType=' + data.flightType,
    method: 'get'
  })
}

export function getcarrier(data) {
  return request({
    url: '/prepare/flightSchedule/getFsCycleFlight?carrier=' + data.carrier + '&acType=' + data.acType + '&cycleFlightScheduleId=' + data.cycleFlightScheduleId + '&flightType=' + data.flightType,
    method: 'get'
  })
}

export function selectData() {
  return request({
    url: 'prepare/attribute/selectAllAttributeByCategory/CYCLE_FLIGHT',
    method: 'get'
  })
}
export function addDatafcn(data) {
  return request({
    url: 'prepare/cycleFlightSchedule/cycleFlight',
    method: 'post',
    data
  })
}
export function eitDatafcn(data) {
  return request({
    url: 'prepare/cycleFlightSchedule/cycleFlight/' + data.id + '',
    method: 'put',
    data
  })
}

export function delDatafcn(data) {
  return request({
    url: 'prepare/cycleFlightSchedule/cycleFlight/' + data + '',
    method: 'DELETE'
  })
}
export function seachData(data) {
  return request({
    url: 'prepare/cycleFlightSchedule/cycleFlight/' + data.id + '',
    method: 'post',
    data
  })
}
export function selectData2(data) {
  return request({
    url: 'prepare/flightSchedule/query/getSearchParam/' + data + '',
    method: 'get'
  })
}
export function eitdData(data) {
  return request({
    url: 'prepare/cycleFlightSchedule/cycleFlight/' + data + '',
    method: 'get'
  })
}
export function automatic(data) {
  return httpRequest({
    url: '/rtm/api/v1/autoAddLinkedFlightNo',
    method: 'post',
    data
  })
}
export function prohibit(id) {
  return httpRequest({
    url: '/prepare/api/v1/flightPlan/prohibit/' + id + '',
    method: 'get'

  })
}
export function remove(id) {
  return httpRequest({
    url: '/prepare/api/v1/flightPlan/prohibit/record/' + id + '',
    method: 'DELETE'

  })
}
export function addDate(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightPlan/prohibit/' + data.id + '',
    method: 'post',
    data
  })
}
export function seachDataNew(data) { // 航班计划
  return httpRequest({
    url: '/prepare/api/v1/flightSchedule/info/' + data.documentId + '/?terminalId=' + data.terminalId + '&intlFlag=' + data.intlFlag + '&weekday=' + data.weekday + '&startDate=' + data.startDate + '&endDate=' + data.endDate + '&flightNo=' + data.flightNo + '&flightNatureCode=' + data.flightNatureCode + '&flightType=' + data.flightType + '&flightStatus=' + data.flightStatus + '&deptAirport=' + data.deptAirport + '&arrAirport=' + data.arrAirport + '&acType=' + data.acType + '&executeStart=' + data.executeStart + '&executeEnd=' + data.executeEnd + '&carrier=' + data.carrier + '&aircraftType=' + data.aircraftType + '&pageNum=' + data.pageNum + '&pageSize=' + data.pageSize,
    method: 'get'
  })
}
// 默认数据统计
export function defaultStatistics(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightSchedule/info/statistics/' + data + '',
    method: 'get'
  })
}
// 查询数据统计
export function seachDataNew2(data) { // 航班计划
  return httpRequest({
    url: '/prepare/api/v1/flightSchedule/info/statistics/dynamic/' + data.documentId + '/?terminalId=' + data.terminalId + '&intlFlag=' + data.intlFlag + '&weekday=' + data.weekday + '&startDate=' + data.startDate + '&endDate=' + data.endDate + '&flightNo=' + data.flightNo + '&flightNatureCode=' + data.flightNatureCode + '&flightType=' + data.flightType + '&flightStatus=' + data.flightStatus + '&deptAirport=' + data.deptAirport + '&arrAirport=' + data.arrAirport + '&acType=' + data.acType + '&executeStart=' + data.executeStart + '&aircraftType=' + data.aircraftType + '&executeEnd=' + data.executeEnd + '&carrier=' + data.carrier + '&pageNum=' + data.pageNum + '&pageSize=' + data.pageSize,
    method: 'get'
  })
}
// 航站楼
export function terminalData(data) {
  return httpRequest({
    url: '/basic/api/v1/airports/' + data + '?includeTerminals=true',
    method: 'get'
  })
}
// 航班性质
export function attributOptionsFcn(data) {
  return httpRequest({
    url: 'basic/api/v1/flightNature?flag=' + data,
    method: 'get'
  })
}
// 航班波
export function flightWavesFcn(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightSchedule/' + data.documentId + '/flightWaves?flightType=' + data.flightWave + '&size=' + data.size + '&fromDate=' + data.fromDate + '&toDate=' + data.toDate + '&regionType=' + data.regionType,
    method: 'get'
  })
}
// 运力波
export function flightSeatWavesFcn(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightSchedule/' + data.documentId + '/flightSeatWaves?flightType=' + data.flightWave + '&size=' + data.size + '&fromDate=' + data.fromDate + '&toDate=' + data.toDate,
    method: 'get'
  })
}
export function carrierData(data) {
  return httpRequest({
    url: 'api/v1/adm/carrier/find',
    method: 'get'
  })
}
// 航班号搜索
export function flightNumSelect(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightSchedule/list/flightNo?documentId=' + data.documentId + '&throughType=' + data.throughType,
    method: 'get'
  })
}
// 始发航后设置接口
export function throughFlag(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightSchedule/throughFlag',
    method: 'put',
    data
  })
}
// 二字码查询承运人
export function carriersOptions(data) {
  return httpRequest({
    url: 'api/v1/prepare/flightSchedule/query/getCarriers/' + data.documentId + '?nameOrCode=' + data.searchData,
    method: 'get'
  })
}
export function selectAllData(data) {
  return httpRequest({
    url: '/api/v1/prepare/flightSchedule/query/getDaySearchParam/' + data,
    method: 'get'
  })
}
