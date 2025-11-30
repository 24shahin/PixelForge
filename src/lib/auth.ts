// Simple auth management using localStorage
export interface User {
  id: string;
  email: string;
  name: string;
  imagesGenerated: number;
  isPremium: boolean;
}

const USERS_KEY = 'pixelforge_users';
const CURRENT_USER_KEY = 'pixelforge_current_user';
const FREE_IMAGE_LIMIT = 3;

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const register = (email: string, password: string, name: string): { success: boolean; message: string; user?: User } => {
  const users = getUsers();
  
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'User already exists with this email' };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    name,
    imagesGenerated: 0,
    isPremium: false,
  };

  // Store password separately (in real app, this would be hashed)
  const userPasswords = JSON.parse(localStorage.getItem('pixelforge_passwords') || '{}');
  userPasswords[email] = password;
  localStorage.setItem('pixelforge_passwords', JSON.stringify(userPasswords));

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  return { success: true, message: 'Registration successful', user: newUser };
};

export const login = (email: string, password: string): { success: boolean; message: string; user?: User } => {
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return { success: false, message: 'User not found' };
  }

  const userPasswords = JSON.parse(localStorage.getItem('pixelforge_passwords') || '{}');
  if (userPasswords[email] !== password) {
    return { success: false, message: 'Invalid password' };
  }

  setCurrentUser(user);
  return { success: true, message: 'Login successful', user };
};

export const logout = () => {
  setCurrentUser(null);
};

export const canGenerateImage = (user: User): boolean => {
  return user.isPremium || user.imagesGenerated < FREE_IMAGE_LIMIT;
};

export const incrementImageCount = (userId: string): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return null;

  users[userIndex].imagesGenerated += 1;
  saveUsers(users);
  setCurrentUser(users[userIndex]);
  
  return users[userIndex];
};

export const getRemainingFreeImages = (user: User): number => {
  if (user.isPremium) return Infinity;
  return Math.max(0, FREE_IMAGE_LIMIT - user.imagesGenerated);
};

export const upgradeToPremium = (userId: string): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return null;

  users[userIndex].isPremium = true;
  saveUsers(users);
  setCurrentUser(users[userIndex]);
  
  return users[userIndex];
};

export const resetPassword = (email: string, newPassword: string): { success: boolean; message: string } => {
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return { success: false, message: 'User not found with this email' };
  }

  const userPasswords = JSON.parse(localStorage.getItem('pixelforge_passwords') || '{}');
  userPasswords[email] = newPassword;
  localStorage.setItem('pixelforge_passwords', JSON.stringify(userPasswords));

  return { success: true, message: 'Password reset successful' };
};

export const sendRecoveryEmail = (email: string): { success: boolean; message: string; token?: string } => {
  const users = getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return { success: false, message: 'No account found with this email' };
  }

  // Generate a mock recovery token
  const token = crypto.randomUUID().slice(0, 8);
  const recoveryTokens = JSON.parse(localStorage.getItem('pixelforge_recovery_tokens') || '{}');
  recoveryTokens[email] = { token, expires: Date.now() + 3600000 }; // 1 hour expiry
  localStorage.setItem('pixelforge_recovery_tokens', JSON.stringify(recoveryTokens));

  return { success: true, message: 'Recovery email sent! (Token shown for demo)', token };
};

export const verifyRecoveryToken = (email: string, token: string): boolean => {
  const recoveryTokens = JSON.parse(localStorage.getItem('pixelforge_recovery_tokens') || '{}');
  const recovery = recoveryTokens[email];
  
  if (!recovery) return false;
  if (recovery.token !== token) return false;
  if (Date.now() > recovery.expires) return false;

  return true;
};
