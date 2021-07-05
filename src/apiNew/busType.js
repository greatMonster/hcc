import httpRequest from '@/utils/http-request'

// search
export function query1(data) {
  return httpRequest({
    url: '/basic/api/v1/ferryBus/info?airportId=' + data.airportId,
    method: 'get'
  })
}

// add
export function add(data) {
  return httpRequest({
    url: '/basic/api/v1/ferryBus/info',
    method: 'post',
    data
  })
}

// update
export function update(data) {
  return httpRequest({
    url: '/basic/api/v1/ferryBus/info/' + data.id,
    method: 'put',
    data
  })
}

// remove
export function remove(data) {
  return httpRequest({
    url: '/basic/api/v1/ferryBus/info/' + data.id,
    method: 'delete'
  })
}
