import { api } from "@/utils/mock";

export const getProjectData = async (id) => {
  const res = await api.get("/project/data/" + id);
  return JSON.parse(res.data.data);
};

export const getProjectList = async () => {
  const res = await api.get("/project/project-list");
  return res.data;
};

export const save = async (id, data) => {
  const res = await api.put("/project/save", {
    id,
    data,
  });
  return res.data;
};

export const add = async () => {
  const res = await api.post("/project/add");
  return res.data;
};

export const dele = async (id) => {
  const res = await api.delete("/project/dele/" + id);
  return res.data;
};