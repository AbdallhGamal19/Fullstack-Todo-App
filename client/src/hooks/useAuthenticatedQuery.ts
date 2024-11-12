import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config.ts";
import { AxiosRequestConfig } from "axios";
interface IathenticatedQuery {
  queryKey: string[];
  url: string;
  config?: AxiosRequestConfig;
}
const useCustomQuery = ({ queryKey, url, config }: IathenticatedQuery) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, config);
      return data;
    },
  });
};
export default useCustomQuery;
// {
//   headers: {
//     Authorization: `Bearer ${userData.jwt}`,
//   },
// }
