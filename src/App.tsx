import { useEffect, useState } from "react";
import "./App.css";
import Spinner from "./components/helper/Spinner";
import AppRoutes from "./utility/AppRoutes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { customAxios } from "./services/AxiosHttpCommon";
//import UseSessionManagement from "./utility/hooks/UseSessionManagement";

function App() {
  //UseSessionManagement();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //request interceptor
    customAxios.interceptors.request.use(
      function (config: any) {
        setLoading(true);
        return config;
      },
      function (error) {
        setLoading(false);
        return Promise.reject(error);
      }
    );
    //response interceptor
    customAxios.interceptors.response.use(
      function (config: any) {
        setLoading(false);
        return config;
      },
      function (error) {
        setLoading(false);
        return Promise.reject(error);
      }
    );
  }, [])

  return (
    <>
      <Spinner show={loading} />
      <ToastContainer />
      <AppRoutes />
    </>
  );
}

export default App;
