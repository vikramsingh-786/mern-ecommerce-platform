const useAuth = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const isAuthenticated = !!token;
  const role = user?.role || null;

  return { user, token, isAuthenticated, role };
};

export default useAuth;

