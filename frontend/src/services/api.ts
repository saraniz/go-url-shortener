import axios from "axios";


// Create reusable Axios client
const api = axios.create({

    // Backend API URL
    //
    // During development:
    // Go backend running locally
    //
    baseURL: "http://localhost:8080",

});


// Export API client
export default api;