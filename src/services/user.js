import { api } from "@/utils/mock";

export const getUserInfo = async () => {
  const info = await api({
    name: "An",
    token: "TEST_TOKEN",
    last_modified_project: "PROJECT_0",
    uuid: 'USER_ID_0'
  });
  return info;
};

export const login = async () => {
  const info = await api({
    name: "An",
    token: "TEST_TOKEN",
    last_modified_project: "PROJECT_0",
    uuid: 'USER_ID_0',
    visitorData: {}
  });
  return info;
};

