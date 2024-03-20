// import { Link, useNavigate } from 'react-router-dom';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../../styles/login/FormLogin.module.scss';
import actionTypes from '../../store/actions/actionTypes';

import { useEffect, useState } from 'react';
import validator from 'email-validator';
import classNames from 'classnames';
import {
    UserLogin,
    loginGoogle,
    loginFacebook,
    loginGithub,
} from '../../services/userService';
import {
    updateTokensSuccess,
    updateTokensFaild,
} from '../../store/actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay-ts';
// import jwt_decode from "jwt-decode";

import { LoginSocialGithub, LoginSocialGoogle } from 'reactjs-social-login';
import {
    FacebookLoginButton,
    GithubLoginButton,
    GoogleLoginButton,
} from 'react-social-login-buttons';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Swal from "sweetalert2";

var io = require('socket.io-client');
var socket;

const client_id_gg = process.env.REACT_APP_CLIENT_ID_GG;
const appid_face = process.env.REACT_APP_APPID_FACE;

const client_id_git = process.env.CLIENT_ID_GIT;
const client_secret_git = process.env.CLIENT_SECRET_GIT;
const redirect_uri_git = process.env.REDIRECT_URI_GIT;

const FormLogin = ({ params, props }) => {
    //variable
    const [email, setEmail] = useState('admin@gmail.com');
    const [pass, setPass] = useState('Thoai@12345');
    const [errMessEmail, setErrMessEmail] = useState('');
    const [errMessPass, setErrMessPass] = useState('');
    const [errMess, setErrMess] = useState('');
    const [isOpenLoading, setIsOpenLoading] = useState(false);
    const [hideShowPass, setHideShowPass] = useState(false);

    const dispatch = useDispatch();
    const link_redirect_login = useSelector(
        (state) => state.user.link_redirect_login
    );
    const router = useRouter();

    useEffect(() => {
        console.log("test param", router.query);
        socket = io.connect(`${process.env.REACT_APP_BACKEND_URL}`, {
            reconnect: true,
        });

        // Add a connect listener
        return () => {
            socket.disconnect();
        };
    }, [])

    //google
    async function handleLoginGoogleSuccess(response) {
        console.log(response);
        setIsOpenLoading(true);
        const data = {
            firstName: response.data.given_name,
            lastName: response.data.family_name,
            // email: response.data.email,
            avatar: response.data.picture,
            idGoogle: response.data.sub,
        };

        let res = await loginGoogle(data);

        if (res && res.errCode === 0) {
            if (router?.query?.key) {
                socket.emit("login-desktop-success", `${router?.query?.key}`, res.data.accessToken);
                Swal.fire({
                    icon: "success",
                    title: "Đăng nhập thành công",
                    text: "Giờ bạn có thế quay trở lại app",
                });
                return;
            }
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            updateTokensSuccess(res.data, dispatch);
            //redirect
            if (link_redirect_login !== '') {
                let link = link_redirect_login;
                router.push(`${link}`);
                dispatch({
                    type: actionTypes.UPDATE_REDIRECT_LOGIN,
                    data: '',
                });
            } else {
                router.push('/home');
            }
        } else if (res && res.errCode !== 0) {
            setErrMess(res?.errMessage);
            setIsOpenLoading(false);
        }
    }

    const handleSubmitLogin = async (event) => {
        if (event) event.preventDefault();

        var check = checkValueInput();
        if (check) {
            setIsOpenLoading(true);
            let res = await UserLogin({
                email,
                pass,
            });

            if (res && res.errCode === 0) {


                //login desktop
                if (router?.query?.key) {
                    socket.emit("login-desktop-success", `${router?.query?.key}`, res.data.accessToken);
                    Swal.fire({
                        icon: "success",
                        title: "Đăng nhập thành công",
                        text: "Giờ bạn có thế quay trở lại app",
                    });
                    setTimeout(() => {
                        window.close();
                    }, 1000);
                    return;
                }

                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('refreshToken', res.data.refreshToken);
                updateTokensSuccess(res.data, dispatch);

                //redirect
                if (link_redirect_login !== '') {
                    let link = link_redirect_login;
                    router.push(`${link}`);
                    dispatch({
                        type: actionTypes.UPDATE_REDIRECT_LOGIN,
                        data: '',
                    });
                } else {
                    router.push('/home');
                }
            } else if (res && res.errCode === 2) {
                updateTokensFaild(dispatch);
                setErrMess(res.errMessage);
                setIsOpenLoading(false);
            } else if (res && res.errCode === 3) {
                setErrMess('Tài khoản này đã bị khóa!');
                setIsOpenLoading(false);
            } else if (res && res.errCode === 4) {
                setErrMess(res.errMessage);
                setIsOpenLoading(false);
            } else {
                updateTokensFaild(dispatch);
                setErrMess('Đã có lỗi xảy ra, vui lòng thử lại sau!');
                setIsOpenLoading(false);
            }
        } else {
            setIsOpenLoading(false);
        }
    };

    const checkValueInput = () => {
        let check = true;
        if (email === '') {
            setErrMessEmail('Vui lòng nhập email của bạn!');
            check = false;
        } else if (!validator.validate(email)) {
            setErrMessEmail('Email không hợp lệ!');
            check = false;
        } else {
            setErrMessEmail('');
        }
        if (pass === '') {
            setErrMessPass('Vui lòng nhập mật khẩu!');
            check = false;
        } else if (pass?.length < 6) {
            setErrMessPass('Tối thiểu 6 ký tự!');
            check = false;
        } else {
            setErrMessPass('');
        }

        return check;
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            event.target.blur();
            handleSubmitLogin();
        }
    };

    const handleLoginFacebookCuccess = async (response) => {
        setIsOpenLoading(true);
        const data = {
            firstName: response.name,
            lastName: ' ',
            idFacebook: response.userID,
            avatarFacebook: response.picture.data.url,
        };
        console.log(data);

        let res = await loginFacebook(data);
        if (res && res.errCode === 0) {
            if (router?.query?.key) {
                socket.emit("login-desktop-success", `${router?.query?.key}`, res.data.accessToken);
                Swal.fire({
                    icon: "success",
                    title: "Đăng nhập thành công",
                    text: "Giờ bạn có thế quay trở lại app",
                });
                return;
            }
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            updateTokensSuccess(res.data, dispatch);
            //redirect
            if (link_redirect_login !== '') {
                let link = link_redirect_login;
                router.push(`${link}`);
                dispatch({
                    type: actionTypes.UPDATE_REDIRECT_LOGIN,
                    data: '',
                });
            } else {
                router.push('/home');
            }
        }
        if (res && res.errCode !== 0) {
            setErrMess(res.errMessage);
            setIsOpenLoading(false);
        }
    };

    const handleLoginGithubCuccess = async (response) => {
        console.log('response: ', response);

        const data = {
            firstName: response.data.login,
            avatarGithub: response.data.avatar_url,
            idGithub: response.data.id,
        };
        // console.log('data: ', data);

        // return;
        let res = await loginGithub(data);
        console.log('res', res);
        if (res && res.errCode === 0) {
            if (router?.query?.key) {
                socket.emit("login-desktop-success", `${router?.query?.key}`, res.data.accessToken);
                Swal.fire({
                    icon: "success",
                    title: "Đăng nhập thành công",
                    text: "Giờ bạn có thế quay trở lại app",
                });
                return;
            }
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            updateTokensSuccess(res.data, dispatch);
            //redirect
            if (link_redirect_login !== '') {
                let link = link_redirect_login;
                router.push(`${link}`);
                dispatch({
                    type: actionTypes.UPDATE_REDIRECT_LOGIN,
                    data: '',
                });
            } else {
                router.push('/home');
            }
        }
        if (res && res.errCode !== 0) {
            setErrMess(res.errMessage);
            setIsOpenLoading(false);
        }
    };

    return (
        <div className={styles['FormLogin-container']}>
            <div className={styles['FormLogin-content']}>
                <LoadingOverlay
                    active={isOpenLoading}
                    spinner
                    text="Đang xử lý..."
                >
                    <div className={styles['container']}>
                        <div className={styles['login-box']}>
                            <div className={styles.left}>
                                <h2>Đăng nhập</h2>
                                <div className={styles['login-box-mess']}>
                                    {errMess}
                                </div>
                                <form>
                                    <div
                                        className={
                                            styles['redirect-to-register']
                                        }
                                    >
                                        <Link href={'/account/register'}>
                                            Đăng ký
                                        </Link>
                                    </div>
                                    <div
                                        className={classNames(
                                            styles['user-box'],
                                            {
                                                [styles.errValid]:
                                                    !!errMessEmail,
                                            }
                                        )}
                                    >
                                        <input
                                            onKeyDown={(event) => {
                                                setErrMessEmail('');
                                                handleEnter(event);
                                            }}
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(event.target.value)
                                            }
                                            type="text"
                                            name=""
                                            required
                                            autocomplete="on"
                                        />
                                        <label>Email</label>
                                        <span>{errMessEmail}</span>
                                    </div>
                                    <div
                                        className={classNames(
                                            styles['user-box'],
                                            {
                                                [styles.errValid]:
                                                    !!errMessPass,
                                            }
                                        )}
                                    >
                                        <input
                                            onKeyDown={(event) => {
                                                setErrMessPass('');
                                                handleEnter(event);
                                            }}
                                            value={pass}
                                            onChange={(event) =>
                                                setPass(event.target.value)
                                            }
                                            name="password"
                                            required
                                            type={
                                                !hideShowPass
                                                    ? 'password'
                                                    : 'text'
                                            }
                                            autocomplete="on"
                                        />
                                        <label>Mật khẩu</label>
                                        <span>{errMessPass}</span>
                                        <span
                                            className={classNames(
                                                styles.showHidePass,
                                                {
                                                    [styles.hide]: hideShowPass,
                                                }
                                            )}
                                            onClick={() =>
                                                setHideShowPass(!hideShowPass)
                                            }
                                        >
                                            <i className="fa-regular fa-eye"></i>
                                            <i className="fa-regular fa-eye-slash"></i>
                                        </span>
                                    </div>
                                    <div
                                        className={styles['forgot-pass']}
                                        onClick={() =>
                                            router.push('/account/forget')
                                        }
                                    >
                                        Quên mật khẩu
                                    </div>

                                    <a
                                        href=""
                                        onClick={(event) =>
                                            handleSubmitLogin(event)
                                        }
                                    >
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        Đăng nhập
                                    </a>
                                </form>
                            </div>
                            <div className={styles.right}>
                                <div className={styles['or']}>
                                    <div></div>
                                    <div>HOẶC</div>
                                    <div></div>
                                </div>

                                <div className={styles['wrap-btn-social']}>
                                    <div
                                        className={styles['google']}
                                        id="google"
                                    >
                                        <LoginSocialGoogle
                                            className={styles['google-btn']}
                                            client_id={client_id_gg}
                                            onResolve={(response) => {
                                                handleLoginGoogleSuccess(
                                                    response
                                                );
                                            }}
                                            onReject={(err) => {
                                                console.log(err);
                                                setIsOpenLoading(false);
                                            }}
                                        >
                                            <GoogleLoginButton />
                                        </LoginSocialGoogle>
                                    </div>
                                    <div className={styles['facebook']}>
                                        {/* <LoginSocialFacebook
                                            appId={appid_face}
                                            redirect_uri={'/account/login'}
                                            className={styles["facebook-btn"]}
                                            onLoginStart={() => {
                                                setIsOpenLoading(true)
                                            }}
                                            onResolve={(response) => {
                                                handleLoginFacebookCuccess(response)
                                            }}
                                            onReject={(error) => {
                                                console.log(error);
                                                setIsOpenLoading(false)
                                            }}
                                        >
                                            <FacebookLoginButton />
                                        </LoginSocialFacebook> */}
                                        <FacebookLogin
                                            appId={appid_face}
                                            // autoLoad={true}
                                            fields="name,email,picture"
                                            callback={
                                                handleLoginFacebookCuccess
                                            }
                                            render={(renderProps) => (
                                                <div
                                                    onClick={
                                                        renderProps.onClick
                                                    }
                                                >
                                                    <FacebookLoginButton text="Đăng nhập với Facebook" />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div className={styles['github']}>
                                        <LoginSocialGithub
                                            client_id={client_id_git}
                                            client_secret={client_secret_git}
                                            redirect_uri={redirect_uri_git}
                                            className={styles['github-btn']}
                                            onLoginStart={() => {
                                                setIsOpenLoading(true);
                                            }}
                                            onResolve={(response) => {
                                                handleLoginGithubCuccess(
                                                    response
                                                );
                                            }}
                                            onReject={(err) => {
                                                console.log('err', err);
                                                setIsOpenLoading(false);
                                            }}
                                        >
                                            <GithubLoginButton />
                                        </LoginSocialGithub>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['blob']}></div>
                    </div>
                </LoadingOverlay>

                {/* <audio src="/Audio/nhaclogin.mp3" autoPlay={true} loop></audio> */}
            </div>
        </div>
    );
};
export default FormLogin;
