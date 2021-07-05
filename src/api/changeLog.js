
import httpRequest from '@/utils/http-request'
export function initData2(data) {
  return httpRequest({
    url: 'prepare/api/v1/employees/calendars/changeLog?employeeName=' + data.employeeName + '&absenceTypeIds=' + data.absenceTypeId + '&beginDate=' + data.beginDate + '&endDate=' + data.endDate + '&businessDomainId=' + data.businessDomainId,
    method: 'get'
  })
}
export function selectData2() {
  return httpRequest({
    url: '/api/v1/adm/basic/data/absence/select/all',
    method: 'get'
  })
}
