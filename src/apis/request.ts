import axios from "axios";

const Axios=axios.create({
    baseURL:"https://wangyi-cloud-music-api.vercel.app",
    timeout:5000
})

export default Axios