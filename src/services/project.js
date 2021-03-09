import { api } from "@/utils/mock";
import rootData from "./data.json";

export const getProjectData = async (id) => {
  const data = await api(rootData);
  return data;
};