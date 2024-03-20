import Head from 'next/head'
import styles from '../../../styles/user/account/profile.module.scss'
import { useRouter } from 'next/router';
import LayoutAccount from '../../../components/user/account/layoutAccount'
import { Radio, Space } from 'antd';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import {
    updateProfileUser, GetUserLogin, GetUserLoginRefreshToken,
    updateAvatarUser
} from '../../../services/userService'
import actionTypes from '../../../store/actions/actionTypes'
import Fancybox from '../../../components/product/Fancybox'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { useRef } from 'react';
import Image from 'next/image';
import LoadingBar from 'react-top-loading-bar'



const ProfileUser = () => {
    const router = useRouter()
    const { sub } = router.query;
    const currentUser = useSelector(state => state.user.currentUser)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [sdt, setSdt] = useState('')
    const [gender, setGender] = useState('nam')
    const [birtDay, setBirtDay] = useState('1/1/1990')
    const [fileAvatar, setFileAvatar] = useState('')
    const [urlAvatar, setUrlAvatar] = useState('')
    const dispatch = useDispatch()
    const accessToken = useSelector(state => state.user.accessToken)
    const refreshToken = useSelector(state => state.user.refreshToken)
    const [isShowCropper, setIsShowCropper] = useState(false)
    const cropperRef = useRef()
    const [progress, setProgress] = useState(100)


    // console.log(currentUser);


    useEffect(() => {
        if (!currentUser) return
        setLastName(currentUser?.lastName)
        setFirstName(currentUser?.firstName)
        setBirtDay(currentUser?.birtday)
        setGender(currentUser?.gender)
        setSdt(currentUser?.sdt)

    }, [currentUser])

    const getUserLogin = async () => {
        if (!accessToken && !refreshToken) {
            // router.push('/account/login')
            return;
        }
        let res = await GetUserLogin(accessToken);
        if (res && res.errCode === 0) {
            dispatch({
                type: actionTypes.GET_LOGIN_SUCCESS,
                data: res.data
            })
        }
        else if (res && res.errCode === 2) {
            let res2 = await GetUserLoginRefreshToken(refreshToken)
            if (res2 && res2.errCode === 0) {
                dispatch({
                    type: actionTypes.GET_LOGIN_SUCCESS,
                    data: res2.data
                })
                dispatch({
                    type: actionTypes.UPDATE_TOKENS_SUCCESS,
                    data: res2.tokens
                })
            }
            else if (res2 && res2.errCode !== 0) {
                dispatch({
                    type: actionTypes.UPDATE_TOKENS_FAILD,
                })
                // router.push('/account/login')
            }
        }
        else if (res && res.errCode === 3) {
            dispatch({
                type: actionTypes.UPDATE_TOKENS_FAILD,
            })
            // router.push('/account/login')
        }
    }

    const onChangeGender = (e) => {
        console.log('radio checked', e.target.value);
        setGender(e.target.value);
    };
    const onChangeDate = (date, dateString) => {
        console.log(dateString);
        setBirtDay(dateString)

        // let time = new Date(date)
        // console.log(time);
    };

    const renderAvatar = (type) => {
        if (!currentUser) return '';

        if (type === 'url') {
            if (urlAvatar !== '')
                return urlAvatar
            if (currentUser.avatarUpdate) {
                return currentUser.avatarUpdate
            }


            if (currentUser?.typeAccount === 'google') {
                return currentUser.avatarGoogle
            }
            if (currentUser?.typeAccount === 'facebook') {
                return currentUser.avatarFacebook
            }
            if (currentUser?.typeAccount === 'github') {
                return currentUser.avatarGithub
            }
            if (currentUser?.typeAccount === 'web' && currentUser?.avatar !== null &&
                currentUser?.avatar !== '') {
                return currentUser.avatar
            }

            return 'https://res.cloudinary.com/dultkpqjp/image/upload/v1683860764/avatar_user/no-user-image_axhl6d.png'
        }
        else {
            if (urlAvatar !== '')
                return { backgroundImage: `url(${urlAvatar})` }
            if (currentUser.avatarUpdate) {
                return { backgroundImage: `url(${currentUser.avatarUpdate})` }
            }


            if (currentUser?.typeAccount === 'google') {
                return { backgroundImage: `url(${currentUser.avatarGoogle})` }
            }
            if (currentUser?.typeAccount === 'facebook') {
                return { backgroundImage: `url(${currentUser.avatarFacebook})` }
            }
            if (currentUser?.typeAccount === 'github') {
                return { backgroundImage: `url(${currentUser.avatarGithub})` }
            }
            if (currentUser?.typeAccount === 'web' && currentUser?.avatar !== null &&
                currentUser?.avatar !== '') {
                return { backgroundImage: `url(${currentUser.avatar})` }
            }
        }


        // return {}
    }

    const handleChangeAvatar = (e) => {
        // setFileAvatar(file)
        let file = e.target.files[0]
        if (!file) return

        let url = URL.createObjectURL(file);
        setUrlAvatar(url)

        //
        setIsShowCropper(true)
        e.target.value = ''


    }

    const handleSaveProfile = async () => {
        if (!firstName) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Không được để trống tên 😙😙',
            })
            return;
        }

        let data = {
            accessToken,
            firstName,
            lastName,
            sdt,
            gender,
            birtDay
        }
        console.log(data);

        let res = await updateProfileUser(data)
        console.log(res);
        if (res && res.errCode === 0) {
            if (fileAvatar !== '') {
                let form = new FormData()
                form.append('file', fileAvatar)
                updateAvatarUser(form, accessToken).then(async result => {
                    console.log(result);
                    await getUserLogin()
                    setUrlAvatar('')
                    setFileAvatar('')
                })

                getUserLogin()
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Đã cập nhật hồ sơ.',
                })
            }
            else {
                getUserLogin()
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Đã cập nhật hồ sơ.',
                })
            }


        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: res?.errMessage || 'Có lỗi xảy ra !',
            })
        }
    }

    const handleCropImage = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            let url = cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
            // console.log(url);
            URL.revokeObjectURL(urlAvatar)
            setUrlAvatar(url)
            setIsShowCropper(false)

            //
            const arr = url.split(",");
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], 'sdfsdfdsfsd', { type: mime });
            setFileAvatar(file)
        }
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
                <div className={styles.profile_Container}>
                    <div className={styles.profile_Content}>
                        <div className={styles.header}>
                            <h3>Hồ sơ của tôi</h3>
                            <h4>Quản lý thông tin hồ sơ để bảo mật tài khoản</h4>
                        </div>
                        <div className={styles.Wrap}>
                            <div className={styles.left}>
                                <div className={styles.listContent}>
                                    <div className={styles.content}>
                                        <div className={styles.left}>Họ lót</div>
                                        <div className={styles.right}>
                                            <input
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                type='text' placeholder='Nhập họ lót...' />
                                        </div>
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.left}>Tên</div>
                                        <div className={styles.right}>
                                            <input
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                type='text' placeholder='Nhập tên...' />
                                        </div>
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.left}>Số điện thoại</div>
                                        <div className={styles.right}>
                                            <input
                                                value={sdt}
                                                onChange={(e) => setSdt(e.target.value)}
                                                type='number' placeholder='Nhập số dt...' />
                                        </div>
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.left}>Giới tính</div>
                                        <div className={styles.right}>
                                            <Radio.Group onChange={onChangeGender} value={gender}>
                                                <Space direction="vertical" >
                                                    <Radio style={{ color: '#fff', fontSize: '1.2rem' }} value={'nam'}>Nam</Radio>
                                                    <Radio style={{ color: '#fff', fontSize: '1.2rem' }} value={'nu'}>Nữ</Radio>
                                                    <Radio style={{ color: '#fff', fontSize: '1.2rem' }} value={'khac'}>Khác</Radio>
                                                </Space>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.left}>Ngày sinh</div>
                                        <div className={styles.right}
                                        // style={{ backgroundColor: '#fff' }}
                                        >
                                            <Space direction="vertical">
                                                <DatePicker
                                                    onChange={onChangeDate}
                                                    format='DD/MM/YYYY'
                                                    defaultValue={dayjs(birtDay)}
                                                // value={dayjs(birtDay)}
                                                />
                                            </Space>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.btn}>
                                    <button onClick={handleSaveProfile}>
                                        Lưu
                                    </button>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <Fancybox>

                                    <Image className={styles.img}
                                        style={renderAvatar()}
                                        data-fancybox="gallery"
                                        data-src={renderAvatar('url')}
                                        src={renderAvatar('url')}
                                        alt=''
                                        width={600}
                                        height={400}
                                        data-width={10000}
                                        data-height={10000}
                                    // data-thumb={item.imagebase64}
                                    ></Image>
                                </Fancybox>

                                <div className={styles.btn}>
                                    <Button variant="contained" component="label">
                                        Chọn ảnh
                                        <input hidden accept="image/*" type="file"
                                            onChange={(e) => handleChangeAvatar(e)}
                                        />
                                    </Button>
                                </div>
                                <div className={styles.note}>
                                    Dụng lượng file tối đa 100 MB <br />
                                    Định dạng:.JPEG, .PNG
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </LayoutAccount>

            {
                urlAvatar && isShowCropper &&
                <div className={styles.layout_cropImage}>

                    <Cropper
                        src={urlAvatar}
                        style={{ maxHeight: 400, width: '100%' }}
                        initialAspectRatio={1}
                        preview=".img-preview"
                        guides={false}
                        ref={cropperRef}
                        aspectRatio={1}
                    />
                    <div className={styles.btnOK}>
                        <button
                            onClick={handleCropImage}
                        >
                            OK
                        </button>
                    </div>
                </div>

            }

        </>
    )
}

export default ProfileUser