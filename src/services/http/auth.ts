import { auth } from '@/configs/firebase';
import { AUTH_STORAGE_KEY } from '@/constants/auth';
import type { LoginFormValues } from '@/schemas/auth';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

export async function login({ email, password }: LoginFormValues) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const { user } = userCredential;
  const idTokenResult = await user.getIdTokenResult();

  const idToken = await user.getIdToken();
  const refreshToken = user.refreshToken;

  const expirationTime = new Date(idTokenResult.expirationTime).getTime();

  const authData = {
    user: {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
    },
    token: idToken,
    refreshToken,
    expirationTime,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

  return authData;
}

export async function logout() {
  await signOut(auth);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthData() {
  const data = localStorage.getItem(AUTH_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export async function refreshAccessToken() {
  const authData = getAuthData();
  if (!authData.refreshToken) return null;

  try {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: authData.refreshToken,
        }),
      },
    );

    if (!response.ok) throw new Error('Failed to refresh token');

    const data = await response.json();

    const newAuthData = {
      ...authData,
      token: data.id_token,
      refreshToken: data.refresh_token,
      expirationTime: Date.now() + Number(data.expires_in) * 1000,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthData));
    return newAuthData.token;
  } catch (error) {
    console.error('Error refresh token', error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    await logout();
    return null;
  }
}

export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
