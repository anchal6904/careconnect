export const login = (username, password) => {
  let role = null;
  
  if (username === 'doctor' && password === '123') {
    role = 'doctor';
  } else if (username === 'patient' && password === '123') {
    role = 'patient';
  }

  if (role) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', username);
    return { success: true, role };
  }

  return { success: false, message: 'Invalid credentials' };
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const getUsername = () => {
  return localStorage.getItem('username');
}; 