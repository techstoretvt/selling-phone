import Head from "next/head";

import HeaderLogin from "../../components/login/HeaderLogin";
// import FormLogin from "../../components/Login/FormLogin";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { checkLogin } from "../../services/common";
import { nameWeb } from "../../utils/constants";

const FormLogin = dynamic(() => import("../../components/login/FormLogin"), {
  ssr: false,
});
import LoadingBar from "react-top-loading-bar";

const Login = () => {
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
    <div>
      <Head>
        <title>Đăng nhập | {nameWeb}</title>
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={classNames("LoginPage-container")}>
        <div className="LoginPage-content">
          <HeaderLogin />
          <FormLogin />
        </div>
      </div>
    </div>
  );
};
Login.displayName = "LoginPage";
export default Login;
