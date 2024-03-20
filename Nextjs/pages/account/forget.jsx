import Head from "next/head";

import HeaderLogin from "../../components/login/HeaderLogin";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "../../styles/forgetpass/forgetpass.module.scss";
import VerificationInput from "react-verification-input";
import {
  getCodeVeridyForgetPass,
  setPassForget,
  checkKeyVerify,
} from "../../services/userService";
import Swal from "sweetalert2";
import SyncLoader from "react-spinners/SyncLoader";
import ClipLoader from "react-spinners/ClipLoader";
// import { passwordStrength } from 'check-password-strength'
import PasswordStrengthBar from "react-password-strength-bar";
import { checkLogin } from "../../services/common";
import LoadingBar from "react-top-loading-bar";
import { nameWeb } from "../../utils/constants";

const Forgetpass = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState(1);
  const [keyVerify, setKeyVefify] = useState("");
  const [isStartGetKeyVerify, setIsStartGetKeyVerify] = useState(false);
  const [isStartSetPass, setIsStartSetPass] = useState(false);
  const [inputPass, setInputPass] = useState("");
  const [inputRePass, setInputRePass] = useState("");
  const [timeReSend, setTimeReSend] = useState(0);
  const [valueInputCode, setValueInputCode] = useState("");
  const [numberStrength, setNumberStrength] = useState(0);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    checkLogin(accessToken, refreshToken, dispatch).then((res) => {
      if (res) {
        router.push("/home");
      }
    });
  }, [accessToken, refreshToken, dispatch, router]);

  useEffect(() => {
    if (timeReSend > 0) {
      setTimeout(() => {
        console.log(timeReSend);
        setTimeReSend((prev) => prev - 1);
      }, 1000);
    }
  }, [timeReSend]);

  const handleSubmit = async () => {
    if (isStartGetKeyVerify) return;
    setKeyVefify("");
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Oh, no",
        text: "Vui lòng nhập email!",
      });
      return;
    }

    setIsStartGetKeyVerify(true);
    setTimeout(async () => {
      let res = await getCodeVeridyForgetPass({ email });
      console.log(res);
      if (res && res.errCode === 0) {
        setIsStartGetKeyVerify(false);
        setValueInputCode("");
        setTab(2);
        setTimeReSend(60);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res?.errMessage || "Đã có lỗi xảy ra!",
        });
        setKeyVefify("");
        setIsStartGetKeyVerify(false);
      }
    }, 1000);
  };

  const handleOnchangeVerify = async (value) => {
    setValueInputCode(value);
    if (value.length === 6) {
      let res = await checkKeyVerify({
        email,
        keyVerify: value,
      });
      if (res && res.errCode === 0) {
        setKeyVefify(value);

        setTimeout(() => {
          setTab(3);
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Sorry",
          text: res?.errMessage || "Lỗi!",
        });
      }
    }
  };

  const handleConfirmPass = async () => {
    if (isStartSetPass) return;
    if (!inputPass || !inputRePass) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Nhập mật khẩu!",
      });
      return;
    }
    if (inputPass !== inputRePass) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Mật khẩu không trùng khớp!",
      });
      return;
    }

    if (numberStrength < 3) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Mật khẩu chưa đủ mạnh!",
      });
      return;
    }

    setIsStartSetPass(true);
    let res = await setPassForget({
      keyVerify,
      email,
      pass: inputPass,
    });
    if (res && res.errCode === 0) {
      setIsStartSetPass(false);
      Swal.fire({
        icon: "success",
        title: "OK",
        text: "Đã lưu mật khẩu.",
      });
      setTimeout(() => {
        Swal.close();
        router.push("/account/login");
      }, 1500);
    } else {
      setIsStartSetPass(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res?.errMessage || "Đã có lỗi xảy ra!",
      });
    }
  };

  const handleKeyDownEmail = (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleKeyDownPass = (e) => {
    if (e.keyCode === 13) {
      handleConfirmPass();
    }
  };

  const handleReSend = () => {
    if (timeReSend === 0) {
      console.log("resend otp");
      handleSubmit();
    }
  };

  const handleOnChangeScore = (score, feedback) => {
    console.log("score: ", score);
    setNumberStrength(score);
  };

  return (
    <div>
      <Head>
        <title>Quên mật khẩu | {nameWeb}</title>
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={classNames("LoginPage-container")}>
        <div className="LoginPage-content">
          <HeaderLogin />
          <div className={styles.formEmail}>
            <div
              className={classNames(styles.subscribe, {
                [styles.active]: tab === 1,
              })}
            >
              <p>QUÊN MẬT KHẨU</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                className={styles["subscribe-input"]}
                placeholder="Nhập email..."
                onKeyDown={(e) => handleKeyDownEmail(e)}
              />
              <br />
              <div className={styles["submit-btn"]} onClick={handleSubmit}>
                {!isStartGetKeyVerify ? (
                  "Gửi mã"
                ) : (
                  <SyncLoader color={"#36d7b7"} loading={true} size={7} />
                )}
              </div>
            </div>
            <div
              className={classNames(styles.VerificationInput, {
                [styles.active]: tab === 2,
              })}
            >
              <div className={styles.title}>Nhập mã xác nhận</div>
              <div className={styles.label}></div>
              <VerificationInput
                validChars={"0-9"}
                autoFocus={true}
                onChange={handleOnchangeVerify}
                value={valueInputCode}
                classNames={{
                  container: styles["container"],
                  character: styles["character"],
                  characterInactive: styles["character--inactive"],
                  characterSelected: styles["character--selected"],
                }}
              />
              <div className={styles.reSend} onClick={handleReSend}>
                Gửi lại {timeReSend > 0 && " " + timeReSend + "s"}
              </div>
            </div>

            <div
              className={classNames(styles.wrapPass, {
                [styles.active]: tab === 3,
              })}
            >
              <div className={styles["card"]}>
                <div className={styles["card2"]}>
                  <div className={styles.input}>
                    <div className={styles["form-control"]}>
                      <input
                        value={inputPass}
                        type="password"
                        required
                        onChange={(e) => setInputPass(e.target.value)}
                        onKeyDown={(e) => handleKeyDownPass(e)}
                      />
                      <label>
                        <span style={{ transitionDelay: "0ms" }}>M</span>
                        <span style={{ transitionDelay: "50ms" }}>ậ</span>
                        <span style={{ transitionDelay: "100ms" }}>t</span>
                        <span style={{ transitionDelay: "150ms" }}>&nbsp;</span>
                        <span style={{ transitionDelay: "200ms" }}>k</span>
                        <span style={{ transitionDelay: "250ms" }}>h</span>
                        <span style={{ transitionDelay: "300ms" }}>ẩ</span>
                        <span style={{ transitionDelay: "350ms" }}>u</span>
                        <span style={{ transitionDelay: "400ms" }}>&nbsp;</span>
                        <span style={{ transitionDelay: "450ms" }}>m</span>
                        <span style={{ transitionDelay: "500ms" }}>ớ</span>
                        <span style={{ transitionDelay: "550ms" }}>i</span>
                      </label>

                      <div>
                        <PasswordStrengthBar
                          password={inputPass}
                          style={{ marginTop: "10px" }}
                          onChangeScore={handleOnChangeScore}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.input}>
                    <div className={styles["form-control"]}>
                      <input
                        value={inputRePass}
                        type="password"
                        required
                        onChange={(e) => setInputRePass(e.target.value)}
                        onKeyDown={(e) => handleKeyDownPass(e)}
                      />
                      <label>
                        <span style={{ transitionDelay: "0ms" }}>N</span>
                        <span style={{ transitionDelay: "50ms" }}>h</span>
                        <span style={{ transitionDelay: "100ms" }}>ậ</span>
                        <span style={{ transitionDelay: "150ms" }}>p</span>
                        <span style={{ transitionDelay: "200ms" }}>&nbsp;</span>
                        <span style={{ transitionDelay: "250ms" }}>l</span>
                        <span style={{ transitionDelay: "300ms" }}>ạ</span>
                        <span style={{ transitionDelay: "350ms" }}>i</span>
                        <span style={{ transitionDelay: "400ms" }}>&nbsp;</span>
                        <span style={{ transitionDelay: "450ms" }}>m</span>
                        <span style={{ transitionDelay: "500ms" }}>ậ</span>
                        <span style={{ transitionDelay: "550ms" }}>t</span>
                        <span style={{ transitionDelay: "600ms" }}>&nbsp;</span>
                        <span style={{ transitionDelay: "650ms" }}>k</span>
                        <span style={{ transitionDelay: "700ms" }}>h</span>
                        <span style={{ transitionDelay: "750ms" }}>ẩ</span>
                        <span style={{ transitionDelay: "800ms" }}>u</span>
                      </label>
                    </div>
                  </div>
                  <div className={styles.btn}>
                    <button onClick={handleConfirmPass}>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      {!isStartSetPass ? (
                        "Xác nhận"
                      ) : (
                        <ClipLoader
                          color={"#36d7b7"}
                          loading={true}
                          size={20}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Forgetpass.displayName = "Forgetpass";
export default Forgetpass;
