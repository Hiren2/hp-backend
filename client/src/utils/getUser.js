export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;
    return JSON.parse(user);
  } catch (err) {
    console.error("Invalid user in localStorage");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
};
