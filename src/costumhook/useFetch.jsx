import { useEffect,useState } from "react";
import { fetchDataFromApi } from "../utils/api";
const useFetch=(url,params)=>{
  const  [data,setData]=useState(null);
  const  [loading, setloading]=useState(null);
  const [error,setError]=useState(null);

  useEffect(()=>{
    setloading('Loading...');
    setData(null);
    setError(null);
     fetchDataFromApi(url,params).then((res)=>{
        setloading(false);
        setData(res);
     }).catch((err)=>{
        setloading(false)
        setError("Something went wrong in Api calling")
     })
  },[url]);
  return {data,loading,error}
}
export default  useFetch;
