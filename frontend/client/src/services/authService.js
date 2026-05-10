import axios from "axios";

const API = `http://${window.location.hostname}:5000/api/auth`;

export const login = async (userData) => {
    const response = await axios.post(`${API}/login`, userData);
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        const { token, ...user } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
};


export const register = async (userData) => {
    const response = await axios.post(`${API}/register`, userData);
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        const { token, ...user } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};


export const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        return {};
    }
};