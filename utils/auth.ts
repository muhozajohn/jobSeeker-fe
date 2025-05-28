// src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export interface UserInfo {
    id: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

// Safe localStorage access
export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const getUserFromToken = (): UserInfo | null => {
    const token = getToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded) return null;

    return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp
    };
};

export const isTokenValid = (): boolean => {
    const token = getToken();
    if (!token) return false;

    const decoded = decodeToken(token);
    if (!decoded) return false;

    return Date.now() < decoded.exp * 1000;
};

// Client-side only version of getUserFromToken
export const getClientUserFromToken = (): UserInfo | null => {
    if (typeof window === 'undefined') return null;
    return getUserFromToken();
};