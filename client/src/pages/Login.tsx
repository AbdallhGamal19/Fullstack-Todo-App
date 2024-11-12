import toast from "react-hot-toast";
import Input from "../components/ui/Input.tsx";
import InputErrorMessage from "../components/ui/InputErrorMessage.tsx";
import { LOCIN_FORM } from "../data/index.ts";
import { loginSchema } from "../validation/index.ts";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces/index.ts";
import axiosInstance from "../config/axios.config.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import Button from "../components/ui/Button.tsx";

interface IFormInput {
  identifier: string;
  password: string;
}
const Login = () => {
  //State

  const [isLoading, setIsLoading] = useState<boolean>(false);
  //Handelar
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(loginSchema) });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data
      );
      status == 200 &&
        toast.success("You will navigate to home page after 2 seconds", {
          duration: 1000,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
      localStorage.setItem("userData", JSON.stringify(resData));
      location.replace("/");
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;

      toast.error(`${errorObj.response?.data.error.message}`, {
        duration: 4000,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renders
  const renderLogiunForm = LOCIN_FORM.map(
    ({ placeholder, name, type }, idx) => (
      <div key={idx} className="box">
        <Input type={type} placeholder={placeholder} {...register(name)} />
        {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
      </div>
    )
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLogiunForm}

        <Button className="w-full">
          {" "}
          {isLoading ? "isLoading..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
