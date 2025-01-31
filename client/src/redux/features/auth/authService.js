import axios from "axios";


const BACKEND_URL = process.env.REACT_APP_API_URL
const API_URL = `${BACKEND_URL}/api/users/`

// console.log('bac: ', BACKEND_URL)
// console.log('url: ', API_URL)

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL + "register", userData)

    return response.data;
}

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + "login", userData)

    return response.data;
}

// Logout user
const logout = async () => {
    const response = await axios.get(API_URL + "logout")

    return response.data;
}

const authService = {
    register,
    login,
    logout
}

export default authService