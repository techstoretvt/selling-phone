import React, { useEffect, useState } from "react";
// import { Card, Container, Row, Col } from "react-bootstrap";

import { adminLogin, adminLoginV2 } from "../services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from "react-loading-overlay-ts";
import { useHistory } from "react-router-dom";
import "../assets/css/login.css";
import { logo } from "../utils/constant";

function ListPurchase() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [valueInput, setValueInput] = useState("");

  const [username, setUsername] = useState("admin@gmail.com");
  const [pass, setPass] = useState("Thoai@12345");
  const history = useHistory();

  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      history.push("/");
    }
  }, []);

  const notify = (place, color, content) => {
    // var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{content}</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const handleLogin = async () => {
    if (!username || !pass) {
      notify("br", 4, "Vui lòng điền username và password!");
      return;
    }

    let res = await adminLoginV2({
      email: username,
      pass,
    });
    // console.log(res);
    if (res?.errCode === 0) {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      history.push("/");
    } else if (res?.errCode !== 0) {
      notify("br", 3, res?.errMessage || "error");
    }
  };

  return (
    <>
      {/* <LoadingOverlay active={isShowLoading} spinner text="Đang xử lý...">
        <Container fluid>
          <NotificationAlert ref={notificationAlertRef} />
          <Row>
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Đăng nhập</Card.Title>
                  <p className="card-category">Tài khoản admin mới vào được</p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Col md="6">
                    <div className="form-group">
                      <label>Tên người dùng</label>
                      <input
                        style={{ border: "1px solid #000" }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        // onKeyDown={handleOnkeyDown}
                        className="form-control"
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label>Mật khẩu</label>
                      <input
                        style={{ border: "1px solid #000" }}
                        type="password"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        // onKeyDown={handleOnkeyDown}
                        className="form-control"
                      />
                    </div>
                  </Col>
                  <Col md="12">
                    <button className="btn btn-primary" onClick={handleLogin}>
                      Đăng nhập
                    </button>
                  </Col>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </LoadingOverlay> */}
      <div class="container">
        <NotificationAlert ref={notificationAlertRef} />
        <div class="content">
          <i
            // style='background-image: url("https://static.cdninstagram.com/rsrc.php/v3/yS/r/ajlEU-wEDyo.png"); background-position: 0px -52px; background-size: auto; width: 175px; height: 51px; background-repeat: no-repeat; display: inline-block;'
            role="img"
            style={{
              // backgroundImage: `url("${logo}")`,
              backgroundPosition: "0px -52px",
              backgroundSize: "auto",
              width: "175px",
              height: "51px",
              backgroundRepeat: "no-repeat",
              display: "inline-block",
            }}
            class=""
            aria-label="Đăng nhập"
            data-visualcompletion="css-img"
          >
            Đăng nhập
          </i>
          <div class="content__form">
            <div class="content__inputs">
              <label>
                <input
                  required=""
                  value={username}
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span>Phone number, username, or email</span>
              </label>
              <label>
                <input
                  required=""
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <span>Password</span>
              </label>
            </div>
            <button onClick={handleLogin}>Log In</button>
          </div>
          <div class="content__or-text">
            <span></span>
            <span>OR</span>
            <span></span>
          </div>
          <div class="content__forgot-buttons">
            <button>
              <span>
                {/* <svg
                  class=""
                  xml:space="preserve"
                  // style="enable-background:new 0 0 512 512"
                  viewBox="0 0 408.788 408.788"
                  y="0"
                  x="0"
                  height="512"
                  width="512"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      class=""
                      data-original="#475993"
                      fill="#475993"
                      d="M353.701 0H55.087C24.665 0 .002 24.662.002 55.085v298.616c0 30.423 24.662 55.085 55.085 55.085h147.275l.251-146.078h-37.951a8.954 8.954 0 0 1-8.954-8.92l-.182-47.087a8.955 8.955 0 0 1 8.955-8.989h37.882v-45.498c0-52.8 32.247-81.55 79.348-81.55h38.65a8.955 8.955 0 0 1 8.955 8.955v39.704a8.955 8.955 0 0 1-8.95 8.955l-23.719.011c-25.615 0-30.575 12.172-30.575 30.035v39.389h56.285c5.363 0 9.524 4.683 8.892 10.009l-5.581 47.087a8.955 8.955 0 0 1-8.892 7.901h-50.453l-.251 146.078h87.631c30.422 0 55.084-24.662 55.084-55.084V55.085C408.786 24.662 384.124 0 353.701 0z"
                    ></path>
                  </g>
                </svg> */}
              </span>
              <span>Log in with Facebook</span>
            </button>
            <button>Forgot password?</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListPurchase;