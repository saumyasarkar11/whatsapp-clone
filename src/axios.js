import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://whatsapp-saumya.herokuapp.com'
})

export default instance