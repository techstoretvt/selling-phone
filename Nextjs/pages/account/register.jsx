import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderLogin from "../../components/login/HeaderLogin";
import FormRegister from "../../components/register/FormRegister";
import { checkLogin } from "../../services/common";
import LoadingBar from "react-top-loading-bar";
import { useState } from "react";

const RegisterPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    checkLogin(accessToken, refreshToken, dispatch).then((res) => {
      if (res) {
        router.push("/home");
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Đăng ký | TechStore</title>
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="RegisterPage-container">
        <div className="RegisterPage-content">
          <HeaderLogin />
          <FormRegister />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
