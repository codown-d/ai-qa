import http from './http'

export const getLngs = (data: any) => http.get(`/bot/languages`, data)

export const translation = (data: any) => http.post(`/bot/translation`, data)

export const emailFormat = (data: any) => http.post(`/bot/email`, data)
