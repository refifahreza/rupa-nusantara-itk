// Mock user database
const users = [
  {
    id: '1',
    email: 'siswa@example.com',
    password: 'password123',
    name: 'Budi Santoso',
    role: 'student',
    profileImage: null
  },
  {
    id: '2',
    email: 'guru@example.com',
    password: 'password123',
    name: 'Dewi Kusuma',
    role: 'teacher',
    profileImage: null
  },
  {
    id: '3',
    email: 'dinas@example.com',
    password: 'password123',
    name: 'Kantor Bahasa Provinsi',
    role: 'languageOffice',
    profileImage: null
  }
];

type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher' | 'languageOffice';
  profileImage: string | null;
};

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  return false;
}

// Get current logged in user
export function getCurrentUser(): User | null {
  if (typeof localStorage !== 'undefined') {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString) as User;
    }
  }
  return null;
}

// Save user session after login
export function saveUserSession(user: User): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
  }
}

// Login user
export function loginUser(email: string, password: string): User | null {
  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  return null;
}

// Logout user
export function logoutUser(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }
}

// Check if a feature requires authentication
export function requiresAuth(featureName: string): boolean {
  const publicFeatures = ['Home', 'Explore', 'About'];
  return !publicFeatures.includes(featureName);
}

// Get user role
export function getUserRole(): string | null {
  const user = getCurrentUser();
  return user ? user.role : null;
} 