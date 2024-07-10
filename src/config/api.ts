import http from "./http";

const USERAPI = "user";
export const login = (data: any) => http.post(`${USERAPI}/login`, data);
export const register = (data: any) => http.post(`${USERAPI}/register`, data);
export const sendCode = (data: any) => http.post(`${USERAPI}/send-code`, data);
export const updatePassword = (data: any) =>
  http.put(`${USERAPI}/update_password`, data);
export const getInfo = () => http.get(`${USERAPI}/`);

const REPOSITORYAPI = "kb";
export const getKnowledgeBase = (data?: any) => {
  return http.get(`${REPOSITORYAPI}/`, data);
};
export const searchQuestion = (data?: any) =>
  http.post(`${REPOSITORYAPI}/search`, data);
export const setKnowledgeBase = (data: any) =>
  http.post(`${REPOSITORYAPI}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateKnowledgeBase = (name?: any, data: any) =>
  http.put(`${REPOSITORYAPI}/${name}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateQuestion = (data?: any) => http.put(`qa`, data);
export const rename = (name?: any, data?: any) =>
  http.put(`${REPOSITORYAPI}/${name}/rename`, data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

export const getHistoricMessage = (data?: any) =>
  http.get(`/message/kb?kb_name=${data}`);
  
export const setOpinion = (data: { id: any; feedback: any }) => {
  let { id, feedback } = data;
  return http.put(`/message/${id}?feedback=${feedback}`);
};
export const getMessageRecord = () => http.get(`/message/kb/month`);
export const getAIResponse = (data?: any) => http.post(`/bot/chat`, data);

//更新内容配置
//http://47.115.148.227:8000/api/dict/gznr
export const getDictGznr = (data?: any) => http.get(`/api/dict/gznr`, data);

//常见问题解答配置
//http://47.115.148.227:8000/api/dict/wtjd
export const getDictWtjd = (data?: any) => http.get(`/api/dict/wtjd`, data);
//隐私政策，使用条款配置
//http://47.115.148.227:8000/api/dict/ystk
export const getDictYstk = (data?: any) => http.get(`/api/dict/ystk`, data);
