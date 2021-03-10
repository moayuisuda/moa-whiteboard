import { api } from "@/utils/mock";
import rootData from "./data.json";

export const getProjectData = async (id) => {
  const data = await api(rootData);
  return data;
};

export const getProjectList = async () => {
  const data = await api([
    {
      name: 'hello 1',
      id: '1',
      owner: 'huahua'
    },
    {
      name: 'hello 2',
      id: '2',
      owner: 'mama'
    }
  ]);
  return data;
};