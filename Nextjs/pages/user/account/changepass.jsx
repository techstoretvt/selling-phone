import Head from 'next/head'
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import LayoutAccount from '../../../components/user/account/layoutAccount'
import styles from '../../../styles/user/account/changepass.module.scss'
import VerificationInput from "react-verification-input";
import classNames from 'classnames';
import Swal from 'sweetalert2'
import { BeatLoader } from 'react-spinners';
import { passwordStrength } from 'check-password-strength'
import { getCodeChangePass, confirmCodeChangePass } from '../../../services/userService'
import { Button, Result } from 'antd';
import LoadingBar from 'react-top-loading-bar'


const ChangePassUser = () => {
    const router = useRouter()
    const { sub } = router.query;
    const currentUser = useSelector(state => state.user.currentUser)
    const [passOld, setPassOld] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [tabs, setTab] = useState(1);
    const [isLoading, setIsLoading] = useState(false)
    const [valueInputCode, setValueInputCode] = useState('')
    const [progress, setProgress] = useState(100)

    // console.log(currentUser);

    const handleConfirmChangePass = async () => {
        if (isLoading) return
        if (!passOld || !newPass || !confirmPass) {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan',
                text: 'Vui lòng điền đầy đủ thông tin!',
            })
            return
        }
        if (newPass !== confirmPass) {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan',
                text: 'Mật khẩu và xác nhận mật khẩu không giống nhau!',
            })
            return
        }
        if (passwordStrength(newPass).id <= 1) {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan',
                text: 'Mật khẩu quá yếu thử với mật khẩu khác!',
            })
            return
        }
        setIsLoading(true)
        let res = await getCodeChangePass({
            email: currentUser.email,
            passOld
        })
        if (res && res.errCode === 0) {
            setTab(2);
            setIsLoading(false)
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan',
                text: res?.errMessage || 'Lỗi rồi!',
            })
            setIsLoading(false)
        }

    }

    const handleOnchangeVerify = (value) => {
        console.log(value);
        setValueInputCode(value)
    }

    const handleConfirmCode = async () => {
        if (isLoading) return
        if (valueInputCode.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan',
                text: 'Vui lòng nhập đủ mã xác nhận!',
            })
            return
        }
        setIsLoading(true)
        let res = await confirmCodeChangePass({
            email: currentUser.email,
            pass: newPass,
            keyVerify: valueInputCode,

        })
        if (res && res.errCode === 0) {
            setTab(3)
            setIsLoading(false)
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan',
                text: res?.errMessage || 'Lỗi rồi!',
            })
            setIsLoading(false)
        }

    }

    const handleOnEnter = (e) => {
        if (e.keyCode === 13)
            handleConfirmChangePass()
    }

    return (
        <>
            <Head>
                <title>Tài khoản</title>
            </Head>
            <LoadingBar
                color='#5885E6'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <LayoutAccount sub={sub}>
                <div className={styles.ChangePass_container}>
                    <div className={styles.ChangePass_content}>
                        <div className={styles.header}>
                            <h3>Đổi Mật Khẩu</h3>
                            <h4>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</h4>
                        </div>
                        <div className={styles.content}>
                            {
                                currentUser?.typeAccount === 'web' && tabs === 1 &&
                                <>
                                    <div className={styles.left}>
                                        <div className={styles.WrapInput}>
                                            <div className={styles.text}>Mật Khẩu Hiện Tại</div>
                                            <input type="password"
                                                value={passOld}
                                                onChange={(e) => setPassOld(e.target.value)}
                                                onKeyUp={(e) => handleOnEnter(e)}
                                            />
                                        </div>
                                        <div className={styles.WrapInput}>
                                            <div className={styles.text}>Mật Khẩu Mới</div>
                                            <input type="password"
                                                value={newPass}
                                                onChange={(e) => setNewPass(e.target.value)}
                                                onKeyUp={(e) => handleOnEnter(e)}
                                            />
                                        </div>
                                        <div className={styles.WrapInput}>
                                            <div className={styles.text}>Xác Nhận Mật Khẩu</div>
                                            <input type="password"
                                                value={confirmPass}
                                                onChange={(e) => setConfirmPass(e.target.value)}
                                                onKeyUp={(e) => handleOnEnter(e)}
                                            />
                                        </div>
                                        <div className={styles.WrapInput}>
                                            <div className={styles.text}></div>
                                            <button
                                                className={classNames({ [styles.active]: passOld && newPass && confirmPass })}
                                                onClick={handleConfirmChangePass}
                                            >
                                                {
                                                    isLoading ?
                                                        <BeatLoader
                                                            color='#36d7b7'
                                                            size='7'
                                                        /> :
                                                        'Xác nhận'
                                                }


                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.right}>

                                    </div>
                                </>
                            }
                            {
                                currentUser?.typeAccount === 'web' && tabs === 2 &&
                                <div className={styles.confirm}>

                                    <div className={styles["subscribe"]}>
                                        <p>Nhập mã</p>
                                        <VerificationInput
                                            validChars={'0-9'}
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
                                        <br />
                                        <div className={styles["submit-btn"]}
                                            onClick={handleConfirmCode}
                                        >
                                            {/* OK */}
                                            {
                                                isLoading ?
                                                    <BeatLoader
                                                        color='#36d7b7'
                                                        size='7'
                                                    /> :
                                                    'OK'
                                            }
                                        </div>
                                    </div>

                                </div>
                            }
                            {
                                currentUser?.typeAccount === 'web' && tabs === 3 &&
                                <div className={styles.success}>
                                    {/* <i className="fa-solid fa-circle-check"></i>
                                    <p>Mật khẩu của bạn đã được cập nhật</p> */}
                                    <Result
                                        status="success"
                                        title={<p style={{ color: '#fff', fontSize: '15px' }}>Mật khẩu của bạn đã được cập nhật</p>}
                                        subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                                    />

                                </div>
                            }
                            {
                                currentUser?.typeAccount !== 'web' &&
                                <div className={styles.impossible}>
                                    Chức năng này chỉ dành cho tài khoản được đăng ký trên website
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </LayoutAccount>
        </>
    )
}
// export async function getServerSideProps() {
//     return { props: { data: 'sfsd' } }
// }
export default ChangePassUser