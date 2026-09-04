import api from "./axios"

export const signupUser = async (userData) => {
    const response = await api.post(
        "/auth/signup", userData
    )

    return response.data
}

export const loginUser = async (Credentials) => {
    const response = await api.post("/auth/login", Credentials)

    return response.data
}
