
export const getLocalData = (key) => JSON.parse(localStorage.getItem(key)) || [];
export const saveLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const findUserByEmail = (email) => {
  const users = getLocalData('users');
  return users.find(u => u.email === email);
};