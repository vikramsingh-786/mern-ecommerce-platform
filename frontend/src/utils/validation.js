export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password); // Strong password validation
};

export const validateName = (name) => {
  return name.trim().length > 0;
};

export const validateAvatar = (file) => {
  if (!file) return true; // Optional field
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // Max 5MB
};