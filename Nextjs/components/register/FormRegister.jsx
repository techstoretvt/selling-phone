import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import validator from 'email-validator';
import { useDispatch } from 'react-redux';
import ReactLoading from 'react-loading';
import ReCAPTCHA from 'react-google-recaptcha';
import { passwordStrength } from 'check-password-strength';

import styles from '../../styles/register/FormRegister.module.scss';
import {
    updateTokensSuccess,
    updateTokensFaild,
} from '../../store/actions/userAction';
import { CreateUser } from '../../services/userService';
import LoadingOverlay from 'react-loading-overlay-ts';
import PasswordStrengthBar from 'react-password-strength-bar';
import { nameWeb } from '../../utils/constants';

var io = require('socket.io-client');
var socket;

const sitekey_capcha = process.env.REACT_APP_SITEKEY_CAPCHA;

const FormRegister = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModal, setIsOpenModel] = useState(false);
    const [isCapcha, setIsCapcha] = useState(null);
    const [idTypePass, setIdTypePass] = useState('');
    const [isLoadingOverLay, setIsLoadingOverLay] = useState(false);

    const capcha = useRef();

    let isStartLogin = useRef(false);

    const [errMess, setErrMess] = useState('');
    const [isEmptyInput, setIsEmptyInput] = useState([
        false,
        false,
        false,
        false,
        false,
    ]);

    //websocket
    useEffect(() => {
        socket = io.connect(`${process.env.REACT_APP_BACKEND_URL}`, {
            reconnect: true,
        });

        // Add a connect listener
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (capcha.current) {
            capcha?.current.reset();
            if (capcha.current.getValue() === '') window.location.reload();
        }
    }, [capcha]);

    const handleSubmit = async () => {
        setIsLoading(true);

        let copyArr = [false, false, false, false, false];
        let errmess = '';

        if (!lastName || !firstName || !email || !password || !rePassword) {
            errmess = 'Vui lòng không bỏ trống thông tin!';

            if (!lastName) {
                copyArr[0] = true;
            }

            if (!firstName) {
                copyArr[1] = true;
            }

            if (!email) {
                copyArr[2] = true;
            }

            if (!password) {
                copyArr[3] = true;
            }

            if (!rePassword) {
                copyArr[4] = true;
            }

            setErrMess(errmess);
            setIsEmptyInput(copyArr);

            setIsLoading(false);
        } else {
            if (!validator.validate(email)) {
                errmess = 'Email không hợp lệ!';
                copyArr[2] = true;
            } else if (password.length < 6) {
                errmess = 'Mật khẩu quá ngắn, tối thiểu 6 ký tự!';
                copyArr[3] = true;
            } else if (password !== rePassword) {
                errmess = 'Mật khẩu không trưng khớp!';
                copyArr[3] = true;
                copyArr[4] = true;
            } else if (idTypePass === 0 || idTypePass === 0) {
                errmess = 'Mật khẩu quá yếu!';
                copyArr[3] = true;
                copyArr[4] = true;
            } else if (!isCapcha) {
                errmess = 'Vui lòng xác thực bạn không phải người máy!';
                setIsCapcha(false);
            } else {
                // Call api
                const data = {
                    lastName,
                    firstName,
                    email,
                    pass: password,
                };

                if (!isStartLogin.current) {
                    isStartLogin.current = true;
                    setErrMess('');
                    setIsEmptyInput(copyArr);

                    let res = await CreateUser(data);
                    console.log(res);

                    if (res && res.errCode === 0) {
                        updateTokensSuccess(res.data, dispatch);
                        localStorage.setItem(
                            'accessToken',
                            res.data.accessToken
                        );
                        localStorage.setItem(
                            'refreshToken',
                            res.data.refreshToken
                        );

                        socket.on(
                            `email-verify-${res.data.keyVerify}`,
                            function (data) {
                                setIsLoadingOverLay(true);
                                router.push('/home');
                            }
                        );
                        setIsOpenModel(true);
                    } else if (res && res.errCode === 2) {
                        updateTokensFaild(dispatch);
                        errmess = 'Tài khoản đã tồn tại!';
                        isStartLogin.current = false;
                    } else if (res && res.errCode === 3) {
                        updateTokensFaild(dispatch);
                        errmess = res.errMessage;
                        isStartLogin.current = false;
                    } else {
                        //Các trường hợp còn lại
                        updateTokensFaild(dispatch);
                        errmess = 'Đã có lỗi xảy ra, vui lòng thử lại sau!';
                        isStartLogin.current = false;
                    }
                }
            }
            setErrMess(errmess);
            setIsEmptyInput(copyArr);
            setIsLoading(false);
        }
    };

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            event.target.blur();
            handleSubmit();
        }
    };

    function onChangeCapcha(value) {
        setIsCapcha(true);
    }

    const onChangePass = (event) => {
        setPassword(event.target.value);
        if (event.target.value !== '') {
            setIdTypePass(passwordStrength(event.target.value).id);
            console.log(
                'strength pass: ',
                passwordStrength(event.target.value).value,
                passwordStrength(event.target.value).id
            );
        }
    };

    return (
        <div className={styles['FormRegister-container']}>
            <div className={styles['FormRegister-content']}>
                <div className={styles['container']}>
                    {isOpenModal === false ? (
                        <div className={styles['FormRegister-form']}>
                            <div className={styles['title']}>Đăng ký</div>
                            <div className={styles['errMessage']}>
                                {errMess}
                            </div>
                            {/* err */}
                            <div
                                className={classNames(styles['wrap-input'], {
                                    [styles.err]: isEmptyInput[0],
                                })}
                            >
                                <input
                                    onKeyDown={(event) => handleEnter(event)}
                                    id="lastname"
                                    onChange={(event) =>
                                        setLastName(event.target.value)
                                    }
                                    value={lastName}
                                    type="text"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="lastname">Họ</label>
                            </div>
                            <div
                                className={classNames(styles['wrap-input'], {
                                    [styles.err]: isEmptyInput[1],
                                })}
                            >
                                <input
                                    onKeyDown={(event) => handleEnter(event)}
                                    id="firstname"
                                    onChange={(event) =>
                                        setFirstName(event.target.value)
                                    }
                                    value={firstName}
                                    type="text"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="firstname">Tên</label>
                            </div>
                            <div
                                className={classNames(styles['wrap-input'], {
                                    [styles.err]: isEmptyInput[2],
                                })}
                            >
                                <input
                                    onKeyDown={(event) => handleEnter(event)}
                                    id="email"
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    value={email}
                                    type="text"
                                    required
                                    autoComplete="off"
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div
                                className={classNames(styles['wrap-input'], {
                                    [styles.err]: isEmptyInput[3],
                                })}
                            >
                                <input
                                    onKeyDown={(event) => handleEnter(event)}
                                    id="password"
                                    onChange={(event) => onChangePass(event)}
                                    value={password}
                                    type="password"
                                    required
                                    autocomplete="on"
                                />
                                <label htmlFor="password">Mật khẩu</label>
                                <span>
                                    {password && (
                                        <PasswordStrengthBar
                                            password={password}
                                        />
                                    )}
                                </span>
                            </div>
                            <div
                                className={classNames(styles['wrap-input'], {
                                    [styles.err]: isEmptyInput[4],
                                })}
                            >
                                <input
                                    onKeyDown={(event) => handleEnter(event)}
                                    id="repassword"
                                    onChange={(event) =>
                                        setRePassword(event.target.value)
                                    }
                                    value={rePassword}
                                    type="password"
                                    required
                                    autocomplete="on"
                                />
                                <label htmlFor="repassword">
                                    Nhập lại mật khẩu
                                </label>
                            </div>
                            <div
                                className={classNames(styles['recapcha'], {
                                    [styles.active]: isCapcha === false,
                                })}
                            >
                                <ReCAPTCHA
                                    ref={capcha}
                                    sitekey={sitekey_capcha}
                                    onChange={onChangeCapcha}
                                    theme="dark"
                                    // hl='tr'
                                    size="normal"
                                    onError={(e) => {
                                        setIsCapcha(false);
                                    }}
                                    onExpired={(ex) => {
                                        setIsCapcha(false);
                                    }}
                                />
                            </div>
                            {isLoading === false ? (
                                <div
                                    className={styles['btn-submit']}
                                    onClick={async () => {
                                        handleSubmit();
                                    }}
                                >
                                    Đăng ký
                                    <div className={styles['bg-btn']}></div>
                                </div>
                            ) : (
                                <div className={styles['btn-submit']}>
                                    <ReactLoading
                                        type={'spinningBubbles'}
                                        color={'#fff'}
                                        height={'30px'}
                                        width={'30px'}
                                    />
                                    <div className={styles['bg-btn']}></div>
                                </div>
                            )}

                            <div className={styles['forward-login']}>
                                Bạn đã có tài khoản?
                                <Link href={'/account/login'}>Đăng nhập</Link>
                            </div>
                            <a
                                id="forward"
                                hidden={true}
                                href={`${process.env.REACT_APP_BACKEND_URL}/account`}
                            >
                                .
                            </a>
                        </div>
                    ) : (
                        <LoadingOverlay
                            active={isLoadingOverLay}
                            spinner
                            text="Đang xử lý..."
                        >
                            <div
                                className={
                                    styles['FormRegister-form'] +
                                    ' ' +
                                    styles['modal']
                                }
                            >
                                <div className={styles['modal-wrap']}>
                                    <div className={styles['modal-title']}>
                                        Thông báo
                                    </div>
                                    <div className={styles['modal-content']}>
                                        <div className={styles['content1']}>
                                            Cảm ơn bạn đã đăng ký tài khoản trên
                                            <b style={{ color: 'orange' }}>
                                                {' '}
                                                {nameWeb}{' '}
                                            </b>
                                            với địa chỉ email:
                                            <b style={{ color: 'orange' }}>
                                                {' '}
                                                {email || 'example@gmail.com'}
                                            </b>
                                            . Một email kích hoạt tài khoản được
                                            gửi đến
                                            <b style={{ color: 'orange' }}>
                                                {' '}
                                                {email || 'example@gmail.com'}
                                            </b>
                                            . Vui lòng vào hộp thư để xem email
                                            kích hoạt tài khoản.
                                        </div>

                                        <div className={styles['content2']}>
                                            <b>
                                                Chú ý: Đôi khi email nằm trong
                                                thư mục spam,... Vui lòng vào
                                                spam để kiểm tra có email kích
                                                hoạt không?
                                            </b>
                                        </div>
                                        <div className={styles['content3']}>
                                            Cảm ơn.
                                            <br />
                                            Đội ngũ
                                            <span
                                                style={{
                                                    color: 'orange',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                {' '}
                                                {nameWeb}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LoadingOverlay>
                    )}

                    <div className={styles['blob']}></div>
                </div>
                {/* <audio src="/Audio/nhaclogin.mp3" autoPlay={true} loop></audio> */}
            </div>
        </div>
    );
};
export default FormRegister;
