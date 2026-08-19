import axios from 'axios'
const baseUrl= process.env.BASEURL|| 'http://localhost:3000'

const api = axios.create({
    baseURL: baseUrl
})

api.interceptors.request.use((config)=>{
    try {
        const token= localStorage.getItem('token')

        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    } catch (error) {
        return Promise.reject(error)
    }
})

api.interceptors.response.use((resposta)=>{
    try {
        return resposta
    } catch (error) {
        if (error.resposta&& error.resposta.status===401){
            console.warn('Sessão expirarda ou não autorizada. Faça login novamente.')
            localStorage.removeItem('usuario')
            localStorage.removeItem('perfil')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
})

export default api
 