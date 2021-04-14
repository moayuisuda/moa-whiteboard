import { api } from "@/utils/mock";

export const upload = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.put("/source/upload", formData, {
    // 'Content-Type': 'multipart/form-data'
  });
  return res.data; // return url
}