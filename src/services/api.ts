import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

// export const api = axios.create({
//   baseURL: "http://localhost:3000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

//* this is a simple api service that can be used to make requests to the backend. You can add more methods here as needed.