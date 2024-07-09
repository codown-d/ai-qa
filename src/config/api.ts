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

const MESSAGEAPI = "message";
export const getHistoricMessage = (data?: any) =>
  http.get(`${MESSAGEAPI}/kb?kb_name=${data}`);
export const setOpinion = (data?: any) =>
  http.put(`${MESSAGEAPI}/${data.id}?feedback=${data.feedback}`);
export const getMessageRecord = () => http.get(`${MESSAGEAPI}/kb/month`);

const BOTAPI = "bot";
export const getAIResponse = (data?: any) => http.post(`${BOTAPI}/chat`, data);
