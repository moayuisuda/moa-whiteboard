import { api } from "@/utils/mock";

export const getUserInfo = async () => {
  const res = await api.get('/user/info');
  return res.data;
};

export const login = async (email, password, visitorData) => {
  const res = await api.post('/user/login', {
    email,
    password,
    visitorData
  });
  return res.data;
};

export const updateLastEditProjct = async (projectId) => {
  const res = await api.put('/user/last-edit-project', {
    projectId
  });
  return res.data;
};

