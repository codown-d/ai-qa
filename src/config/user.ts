import http from './http'

export const getInfo = (data: any) => http.get(`/user/`, data)
