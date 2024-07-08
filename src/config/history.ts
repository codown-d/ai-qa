import http from './http'

export const messageHistory = (data: any) => {
  let url = `/message/kb/month?kb_name=${data.kb_name||''}&keyword=${data.keyword||''}`
  if (data.month) url += `&month=${data.month}`
  return http.get(url)
}

export const favoritesList = (data: any) => http.get(`/message/favorites`, data)

export const favoritMessage = (message_id: any, is_favorite: any) => http.put(`/message/${message_id}/favorite?message_id=${message_id}&is_favorite=${is_favorite}`)
