import httpRequest from '@/utils/http-request'

// search
export function query(data) {
  return httpRequest({
    url: '/basic/api/v1/ferryBus/binLayout',
    method: 'get',
    params: { airportId: data.airportId }
  })
}

// add
export function add(data) {
  return httpRequest({
    url: '/basic/api/v1/ferryBus/binLayout',
    method: 'post',
    data
  })
}

// update
export function update(data) {
  return httpRequest({
    url: '/basic/api/v1/ferryBus/binLayout/' + data.id,
    method: 'put',
    data
  })
}

// remove
export function remove(data) {
  return httpRequest({
    url: '/basic/api/v1/ferryBus/binLayout/' + data.id,
    method: 'delete'
  })
}
