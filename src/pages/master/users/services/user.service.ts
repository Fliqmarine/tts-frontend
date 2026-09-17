import { api } from "../../../../services/api";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user.types";
import { parseUser, parseUsers } from "../types/user.types";

export const getUsers = async () => {
  const response = await api.get("/users");
  return parseUsers(response.data);
};

export const getUser = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return parseUser(response.data);
};

// export const createUser = async (
//   data: CreateUserRequest,
// ): Promise<User> => {
//   const response = await api.post<User>(
//     "/users",
//     data,
//   );

//   return response.data;
// };

export const createUser = async (
  data: CreateUserRequest,
  avatar?: File | null,
): Promise<User> => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("role", data.role);
  formData.append("isActive", String(data.isActive ?? true),);

  if (data.employeeId) formData.append("employeeId", data.employeeId);
  if (data.jobTitle) formData.append("jobTitle", data.jobTitle);
  if (data.department) formData.append("department", data.department);

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const response = await api.post<User>(
    "/users",
    formData, {
    headers: {
      "Content-Type": undefined, //* let the browser set multipart boundary
    },
  });

  return response.data;
};

export const updateUser = async (
  id: number,
  data: UpdateUserRequest,
  avatar?: File | null,
): Promise<User> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("role", data.role);

  formData.append(
    "isActive",
    String(data.isActive ?? true),
  );

  if (data.employeeId) formData.append("employeeId", data.employeeId);
  if (data.jobTitle) formData.append("jobTitle", data.jobTitle);
  if (data.department) formData.append("department", data.department);

  if (data.password) {
    formData.append("password", data.password);
  }

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const response = await api.patch<User>(
    `/users/${id}`,
    formData,
  );

  return response.data;
};

export const deleteUser = async (
  id: number,
): Promise<void> => {
  await api.delete(`/users/${id}`);
};