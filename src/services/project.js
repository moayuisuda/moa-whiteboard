import { api } from "@/utils/mock";

export const getProjectData = async (id) => {
  const res = await api.get('/project/data/' + id);
  return JSON.parse(res.data.data);
};

export const getProjectList = async () => {
  const res = await api.get('/project/project-list');
  return res.data;
};

export const save = async (data) => {
  const res = await api.put(data)
  return res.data
}