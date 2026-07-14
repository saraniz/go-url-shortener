import axios from "axios";


// Create reusable Axios client
const api = axios.create({

    // Backend API URL
    //
    // During development:
    // Go backend running locally
    //
    baseURL: import.meta.env.VITE_API_URL || "https://shrinklt-url-shortener.onrender.com",

});


// Export API client
export default api;