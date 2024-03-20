import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import styles from "../../styles/register/verify.module.scss";
import { verifyCreateUser } from "../../services/userService";
import LoadingBar from "react-top-loading-bar";
import { nameWeb } from "../../utils/constants";

var io = require("socket.io-client");
var socket;

const VerifyForm = (props) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(100);

  //websocket
  useEffect(() => {
    socket = io.connect(`${process.env.REACT_APP_BACKEND_URL}`, {
      reconnect: true,
    });

    // Add a connect listener
    socket.on("connect", function (socket) { });
  });

  useEffect(() => {
    document.title = `Xác nhận đăng ký - ${nameWeb}`;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const valueVerify = {
      id: urlParams.get("id"),
      keyVerify: urlParams.get("keyVerify"),
    };

    //call api
    const fetchData = async () => {
      let res = await verifyCreateUser(valueVerify);
      if (res && res.errCode === 2) {
        setTitle(res.errMessage);
      } else if (res && res.errCode === 0) {
        setTitle(res.errMessage);

        socket.emit("send-email-verify", `${res.keyVerify}`, "test msg");
      } else {
        setTitle("Xử lý thất bại!");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={styles["VerifyForm-container"]}>
        <div className={styles["VerifyForm-content"]}>
          {loading ? (
            <div className={styles["loading"]}>
              <ReactLoading
                type={"bubbles"}
                color={"red"}
                height={80}
                width={80}
              />
            </div>
          ) : (
            <>
              <div className={styles["top"]}>Thank you</div>
              <div className={styles["bottom"]}>
                <div className={styles["message"]}>{title}</div>
                {/* <div className='go-home'>
                                Bạn sẽ được chuyển đến
                                <Link to={'/home'}>Trang Chủ</Link>
                                sau 5 giây
                            </div> */}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyForm;
