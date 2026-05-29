import axios from 'axios';

// instnce 
const api =axios.create({
    baseURL: "https://compliance-analysis-api.onrender.com/api", // backend api
    withCredentials: true // for cookies 
});
//request intersceptor 
api.interceptors.request.use(
    (config) => {
        return config
    },
    (error)=>{
        return Promise.reject(error);
    }
);
// response intercdeptor 
api.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.response){
            console.log("api error",error.response.data.message || error)
        }
        else if(error.request){
            console.log("network Error: No response ")
        }
        else{
            console.error("Error",error.message)
        }
        return Promise.reject(error)
    }
)
export default api;