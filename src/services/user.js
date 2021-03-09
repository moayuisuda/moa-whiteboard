import { api } from "@/utils/mock";

export const getUserInfo = async () => {
  const info = await api({
    name: "An",
    token: "TEST_TOKEN",
    last_modified_project: "TEST_PROJECT",
  });
  return info;
};

export const login = async () => {
  const info = await api({
    name: "An",
    token: "TEST_TOKEN",
    last_modified_project: "TEST_PROJECT",
  });
  return info;
};

