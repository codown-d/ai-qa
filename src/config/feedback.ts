import http from './http'

export const allFeedback = (data: any) => http.get(`/feedback/user`, data)

export const addFeedback = (data: any) => http.post(`/feedback/`, data)
