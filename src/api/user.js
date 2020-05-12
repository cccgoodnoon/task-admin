import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/user/login',
    url: '/api/anon/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/user/info',
    url: '/api/anon/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    // url: '/user/logout',
    url: '/api/anon/logout',
    method: 'get'
  })
}
