import Head from 'next/head';
import HeaderBottom from '../../components/home/HeaderBottom';
import FooterHome from '../../components/home/FooterHome';
import styles from '../../styles/blogs/newBlog.module.scss';
import dynamic from 'next/dynamic';
import ImageUploading from 'react-images-uploading';
import {
    createNewBlog,
    createNewImageBlog,
    createNewVideoBlog,
    getBlogById,
    updateBlog,
} from '../../services/userService';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import Fancybox from '../../components/product/Fancybox';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { DatePicker, Space } from 'antd';
import { checkLogin } from '../../services/common';
import classNames from 'classnames';
import { checkWord } from '../../services/common';
import Image from 'next/image';
import LoadingBar from 'react-top-loading-bar';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false, // Vô hiệu hóa rendering phía máy chủ
});
import 'react-quill/dist/quill.snow.css';
import { nameWeb } from '../../utils/constants';

const apiKeyYoutube = 'AIzaSyB5bUDaSvWM01HupX7P1RNnuFl9Mm3iUVU';

let maxRangeDay = 10;
let url_iframe_youtube = 'https://www.youtube.com/embed/';
const linkVideoDrive = process.env.RACT_APP_LNK_VIDEO_DRIVE;

const arrColor = [
    'transparent',
    '#242526',
    '#001830',
    '#23575c',
    '#063817',
    '#62260e',
    '#310336',
    '#0d6efd6b',
    '#4a3603',
];

const NewBlog = () => {
    let router = useRouter();
    let dispatch = useDispatch();
    let { key } = router.query;
    const title =
        key === 'new'
            ? `Bài viết mới | ${nameWeb}`
            : `Chỉnh sửa bài viết | ${nameWeb}`;
    const accessToken = useSelector((state) => state.user.accessToken);
    const refreshToken = useSelector((state) => state.user.refreshToken);
    const [listImage, setListImage] = useState([]);
    const [urlVideo, setUrlVideo] = useState('');
    const [fileVideo, setFileVideo] = useState('');
    const [contentMarkdown, setContentMarkdown] = useState('rong');
    const [contentHtml, setContentHtml] = useState('');
    const [timePost, setTimePost] = useState('');
    const [isShowTimePost, setIsShowTimePost] = useState(false);
    const [typeVideo, setTypeVideo] = useState('iframe');
    const [isLoading, setIsLoading] = useState(false);
    const [bgColor, setBgColor] = useState('transparent');
    const [progress, setProgress] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [titleBlog, setTitleBlog] = useState('');

    useEffect(() => {
        checkLogin(accessToken, refreshToken, dispatch).then((res) => {
            if (!res) {
                // alert('ko login')
                router.push('/home');
            }
        });
    }, []);
    useEffect(() => {
        if (key !== 'new' && key !== undefined && accessToken) {
            getBlog();
        }
    }, [key, accessToken]);

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener(
            'webkitfullscreenchange',
            handleFullscreenChange
        );
        document.addEventListener(
            'mozfullscreenchange',
            handleFullscreenChange
        );
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        function handleFullscreenChange(e) {
            setIsFullscreen((prev) => !prev);
        }
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            );
            document.removeEventListener(
                'webkitfullscreenchange',
                handleFullscreenChange
            );
            document.removeEventListener(
                'mozfullscreenchange',
                handleFullscreenChange
            );
            document.removeEventListener(
                'MSFullscreenChange',
                handleFullscreenChange
            );
        };
    }, [isFullscreen]);

    const getBlog = async () => {
        let res = await getBlogById({
            accessToken,
            idBlog: key,
        });
        if (res && res.errCode === 0) {
            setContentHtml(res.data.contentHTML);
            setContentMarkdown(res.data.contentMarkdown);
            setTitleBlog(res.data.title);
            if (res.data?.videoBlog?.idDrive === '') {
                setTypeVideo('iframe');
                setUrlVideo(res.data.videoBlog?.video);
            }
            if (res.data?.videoBlog?.idDrive !== '') {
                setTypeVideo('video');
                setUrlVideo(linkVideoDrive + res.data?.videoBlog?.idDrive);
            }

            let arrImage = res.data.imageBlogs?.map((item) => ({
                data_url: item.image,
                file: '',
            }));

            setBgColor(res.data.backgroundColor);

            setListImage(arrImage);
        } else {
            router.push('/home');
        }
    };

    const onChangeImage = (imageList, addUpdateIndex) => {
        // data for submit
        setListImage(imageList);
    };

    const handleUpdateVideo = (e) => {
        if (e.target.files && e.target.files[0]?.type === 'video/mp4') {
            let file = e.target.files[0];
            if (file.size > 104857600) {
                toast.warning('Vui lòng chọn file có kích thướt dưới 100MB');
                e.target.value = '';
                return;
            }
            setFileVideo(file);
            let url = URL.createObjectURL(file);
            setUrlVideo(url);
            setTypeVideo('video');
        } else {
            setFileVideo('');
            setUrlVideo('');
            setTypeVideo('iframe');
        }
        e.target.value = '';
    };

    const handleCloseVideo = () => {
        setFileVideo('');
        setUrlVideo('');
        setTypeVideo('iframe');
    };

    // const onchangeMarkdown = (value) => {
    //    setContentMarkdown(value.text)
    //    setContentHtml(value.html)
    // }

    const handleCreateBlog = async () => {
        if (!accessToken) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Bạn chưa đăng nhập 😙😙',
            });
            return;
        }
        if (!titleBlog) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Vui lòng nhập tiêu đề của bài viết!',
            });
            return;
        }
        if (!contentHtml) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Không được bỏ trống nội dung!',
            });
            return;
        }
        if (listImage?.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Chọn ít nhất 1 ảnh!',
            });
            return;
        }

        if (isShowTimePost && !timePost) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Vui lòng chọn ngày đăng bài viết!',
            });
            return;
        }

        if (timePost) {
            let date = new Date().getTime();
            if (timePost < date) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Chú ý',
                    text: 'Không được phép chọn thời gian ở quá khứ!',
                });
                return;
            }
        }

        if (!checkWord(contentMarkdown)) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Nội dung chứa những từ ngữ không hợp lệ!',
            });
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        let data = {
            title: titleBlog,
            accessToken,
            contentHtml,
            contentMarkdown,
            timePost,
            typeVideo,
            urlVideo,
            bgColor,
            editImage: listImage.length > 0 ? 'true' : 'false',
            editVideo:
                fileVideo !== '' && typeVideo === 'video' ? 'true' : 'false',
        };

        let res = await createNewBlog(data);
        console.log(res);
        if (res && res.errCode === 0) {
            let idBlog = res.idBlog;

            if (listImage.length > 0) {
                console.log('upload image');
                let form = new FormData();
                listImage.forEach((item) => {
                    form.append('file', item.file);
                });
                createNewImageBlog(form, idBlog);
            }

            if (fileVideo !== '' && typeVideo === 'video') {
                console.log('upload video');
                let form = new FormData();
                form.append('video', fileVideo);
                createNewVideoBlog(form, idBlog);
            }

            toast.success('Tạo bài viết thành công.');
            router.push('/blogs/blog-user?page=1');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: res?.errMessage || 'Có lỗi xảy ra!',
            });
            setIsLoading(false);
            return;
        }
    };

    const onChangeTime = (value, dateString) => {
        let date = new Date(value);

        console.log(date.getTime());
        setTimePost(date.getTime());
    };

    const handleToggleTimePost = () => {
        setIsShowTimePost(!isShowTimePost);
        setTimePost('');
    };

    const disabledDate = (current) => {
        // Can not select days before today and today
        return (
            (current && current < dayjs().endOf('time')) ||
            current > dayjs().set('date', dayjs().get('date') + maxRangeDay)
        );
    };

    const handleUpdateBlog = async () => {
        if (!accessToken) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Bạn chưa đăng nhập 😙😙',
            });
            return;
        }
        if (!titleBlog) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Vui lòng nhập tiêu đề của bài viết!',
            });
            return;
        }
        if (!contentHtml || !contentMarkdown) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Không được bỏ trống nội dung!',
            });
            return;
        }
        if (listImage.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Chọn ít nhất 1 ảnh!',
            });
            return;
        }

        if (!checkWord(contentMarkdown)) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Nội dung chứa những từ ngữ không hợp lệ!',
            });
            return;
        }

        let countUrlImage = 0;
        let listUrlImage = listImage.map((item) => {
            if (item.file === '') {
                countUrlImage++;
                return item.data_url;
            } else {
                return '';
            }
        });
        if (isLoading) return;
        setIsLoading(true);

        let data = {
            title: titleBlog,
            accessToken,
            idBlog: key,
            contentHtml,
            contentMarkdown,
            listImage: listUrlImage,
            isVideo: urlVideo === '' ? false : true,
            typeVideo,
            urlVideo,
            bgColor,
            editVideo:
                fileVideo !== '' && typeVideo === 'video' ? 'true' : 'false',
            editImage: countUrlImage < listImage.length ? 'true' : 'false',
        };

        let res = await updateBlog(data);
        if (res && res.errCode === 0) {
            if (fileVideo !== '' && typeVideo === 'video') {
                console.log('change video');
                let form = new FormData();
                form.append('video', fileVideo);
                createNewVideoBlog(form, key);
            }
            let arrFileImage = listImage.map((item) => {
                if (item.file !== '') {
                    return item.file;
                }
            });
            if (arrFileImage.length > 0) {
                let form = new FormData();
                arrFileImage.forEach((item) => {
                    form.append('file', item);
                });
                createNewImageBlog(form, key);
            }

            toast.success('Chỉnh sửa bài viết thành công.');

            router.push('/blogs/blog-user?page=1');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: res?.errMessage || 'Có lỗi xảy ra!',
            });
            setIsLoading(false);
            return;
        }
    };

    const handleClickLinkYoutube = () => {
        setTypeVideo('iframe');
        Swal.fire({
            title: 'Nhập ID video Youtube',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'OK',
            showLoaderOnConfirm: true,
            text: 'Bấm vào xem video bất kỳ trên Youtube và copy đoạn chữ sau /watch?v=',
            imageUrl: '/images/blogs/huongdanYT.jpg',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            preConfirm: (login) => {
                console.log(login);
                if (login) {
                    fetch(
                        `https://www.googleapis.com/youtube/v3/videos?id=${login}&key=${apiKeyYoutube}&part=snippet`
                    )
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.items.length === 0) {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Chú ý',
                                    text: 'Video không tồn tại!',
                                });
                            } else {
                                setUrlVideo(url_iframe_youtube + login);
                                setFileVideo('');
                            }
                        })
                        .catch((error) => console.error(error));
                }
            },
            allowOutsideClick: () => !Swal.isLoading(),
        });
    };

    const toggleFullscreen = () => {
        // let check = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        if (!isFullscreen) {
            // Mở chế độ full màn hình
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
            // setIsFullscreen(true);
            // document.documentElement.classList.add('fullscreen');
        } else {
            // Thoát chế độ full màn hình
            if (document.exitFullscreen) {
                document?.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document?.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document?.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document?.msExitFullscreen();
            }
            // document.documentElement.classList.remove('fullscreen');
            // setIsFullscreen(false);
        }
    };

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <LoadingBar
                color="#5885E6"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <HeaderBottom hideSearch={false} />

            <div className={styles.NewBlog_container + ' NewBlog_container'}>
                <div className={styles.NewBlog_content}>
                    <div className={styles.header}>
                        <div
                            className={styles['glitch']}
                            data-text={
                                key === 'new'
                                    ? ' Bài viết mới'
                                    : 'Chỉnh sửa bài viết'
                            }
                        >
                            {key === 'new'
                                ? ' Bài viết mới'
                                : 'Chỉnh sửa bài viết'}
                        </div>
                    </div>
                    <div className={styles.title}>
                        <div
                            className={
                                styles['form__group'] + ' ' + styles['field']
                            }
                        >
                            <input
                                type="input"
                                className={styles['form__field']}
                                placeholder="title"
                                required=""
                                value={titleBlog}
                                onChange={(e) => setTitleBlog(e.target.value)}
                            />
                            <label className={styles['form__label']}>
                                Tiêu đề bài viết
                            </label>
                        </div>
                    </div>
                    <div
                        className={styles.wrap_content}
                        style={{ backgroundColor: bgColor }}
                    >
                        <div
                            className={classNames(styles.content, {
                                [styles.Fullscreen]: isFullscreen,
                            })}
                        >
                            <div className={styles.iconFullScreen}>
                                <i
                                    className="fa-solid fa-expand"
                                    onClick={toggleFullscreen}
                                ></i>
                            </div>

                            <ReactQuill
                                theme="snow"
                                value={contentHtml}
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, 3, 4, 5, false] }],
                                        [
                                            'bold',
                                            'italic',
                                            'underline',
                                            'strike',
                                        ],
                                        ['blockquote', 'code-block'],
                                        [
                                            { list: 'ordered' },
                                            { list: 'bullet' },
                                        ],
                                        [
                                            { script: 'sub' },
                                            { script: 'super' },
                                        ],
                                        [{ indent: '-1' }, { indent: '+1' }],
                                        [{ direction: 'rtl' }],
                                        [
                                            {
                                                size: [
                                                    'small',
                                                    false,
                                                    'large',
                                                    'huge',
                                                ],
                                            },
                                        ],
                                        [{ color: [] }, { background: [] }],
                                        [{ font: [] }],
                                        [{ align: [] }],
                                        ['clean', 'image', 'link', 'video'],
                                    ],
                                }}
                                onChange={setContentHtml}
                                placeholder="Nhập nội dung ở đây..."
                            />
                            {/* <div className={styles.bg}></div> */}
                        </div>
                        <div className={styles.media}>
                            <ImageUploading
                                multiple
                                value={listImage}
                                onChange={onChangeImage}
                                maxNumber={5}
                                dataURLKey="data_url"
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageRemoveAll,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                }) => (
                                    <>
                                        <div className={styles.listImage}>
                                            <Fancybox
                                                options={{
                                                    infinite: true,
                                                    hideScrollbar: true,
                                                    Toolbar: {
                                                        display: [
                                                            {
                                                                id: 'prev',
                                                                position:
                                                                    'center',
                                                            },
                                                            {
                                                                id: 'counter',
                                                                position:
                                                                    'center',
                                                            },
                                                            {
                                                                id: 'next',
                                                                position:
                                                                    'center',
                                                            },
                                                            'zoom',
                                                            'slideshow',
                                                            'fullscreen',
                                                            'download',
                                                            'thumbs',
                                                            'close',
                                                        ],
                                                    },
                                                }}
                                            >
                                                {listImage.length > 0 && (
                                                    <div
                                                        className={
                                                            styles.imageWrap
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.imageBorder
                                                            }
                                                        >
                                                            {listImage[0]
                                                                ?.data_url ? (
                                                                <>
                                                                    <Image
                                                                        className={
                                                                            styles.image
                                                                        }
                                                                        // style={{ backgroundImage: `url(${listImage[0]?.data_url})` }}
                                                                        src={
                                                                            listImage[0]
                                                                                ?.data_url
                                                                        }
                                                                        alt="sfsdfdsf"
                                                                        width={
                                                                            600
                                                                        }
                                                                        height={
                                                                            400
                                                                        }
                                                                        data-fancybox="gallery"
                                                                        data-src={
                                                                            listImage[0]
                                                                                ?.data_url
                                                                        }
                                                                        data-thumb={
                                                                            listImage[0]
                                                                                ?.data_url
                                                                        }
                                                                        data-width={
                                                                            10000
                                                                        }
                                                                        data-height={
                                                                            10000
                                                                        }
                                                                    ></Image>
                                                                    <i
                                                                        className="fa-solid fa-xmark"
                                                                        onClick={() =>
                                                                            onImageRemove(
                                                                                0
                                                                            )
                                                                        }
                                                                    ></i>
                                                                </>
                                                            ) : (
                                                                <div
                                                                    className={
                                                                        styles.layout
                                                                    }
                                                                    onClick={
                                                                        onImageUpload
                                                                    }
                                                                ></div>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.imageBorder
                                                            }
                                                        >
                                                            {listImage[1]
                                                                ?.data_url ? (
                                                                <>
                                                                    <div
                                                                        className={
                                                                            styles.image
                                                                        }
                                                                        style={{
                                                                            backgroundImage: `url(${listImage[1]?.data_url})`,
                                                                        }}
                                                                        data-fancybox="gallery"
                                                                        data-src={
                                                                            listImage[1]
                                                                                ?.data_url
                                                                        }
                                                                        data-thumb={
                                                                            listImage[1]
                                                                                ?.data_url
                                                                        }
                                                                        data-width={
                                                                            10000
                                                                        }
                                                                        data-height={
                                                                            10000
                                                                        }
                                                                    ></div>
                                                                    <i
                                                                        className="fa-solid fa-xmark"
                                                                        onClick={() =>
                                                                            onImageRemove(
                                                                                1
                                                                            )
                                                                        }
                                                                    ></i>
                                                                </>
                                                            ) : (
                                                                <div
                                                                    className={
                                                                        styles.layout
                                                                    }
                                                                    onClick={
                                                                        onImageUpload
                                                                    }
                                                                >
                                                                    Thêm <br />{' '}
                                                                    ảnh
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.imageBorder
                                                            }
                                                        >
                                                            {listImage[2]
                                                                ?.data_url ? (
                                                                <>
                                                                    <div
                                                                        className={
                                                                            styles.image
                                                                        }
                                                                        style={{
                                                                            backgroundImage: `url(${listImage[2]?.data_url})`,
                                                                        }}
                                                                        data-fancybox="gallery"
                                                                        data-src={
                                                                            listImage[2]
                                                                                ?.data_url
                                                                        }
                                                                        data-thumb={
                                                                            listImage[2]
                                                                                ?.data_url
                                                                        }
                                                                        data-width={
                                                                            10000
                                                                        }
                                                                        data-height={
                                                                            10000
                                                                        }
                                                                    ></div>
                                                                    <i
                                                                        className="fa-solid fa-xmark"
                                                                        onClick={() =>
                                                                            onImageRemove(
                                                                                2
                                                                            )
                                                                        }
                                                                    ></i>
                                                                </>
                                                            ) : (
                                                                <div
                                                                    className={
                                                                        styles.layout
                                                                    }
                                                                    onClick={
                                                                        onImageUpload
                                                                    }
                                                                >
                                                                    Thêm <br />{' '}
                                                                    ảnh
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.imageBorder
                                                            }
                                                        >
                                                            {listImage[3]
                                                                ?.data_url ? (
                                                                <>
                                                                    <div
                                                                        className={
                                                                            styles.image
                                                                        }
                                                                        style={{
                                                                            backgroundImage: `url(${listImage[3]?.data_url})`,
                                                                        }}
                                                                        data-fancybox="gallery"
                                                                        data-src={
                                                                            listImage[3]
                                                                                ?.data_url
                                                                        }
                                                                        data-thumb={
                                                                            listImage[3]
                                                                                ?.data_url
                                                                        }
                                                                        data-width={
                                                                            10000
                                                                        }
                                                                        data-height={
                                                                            10000
                                                                        }
                                                                    ></div>
                                                                    <i
                                                                        className="fa-solid fa-xmark"
                                                                        onClick={() =>
                                                                            onImageRemove(
                                                                                3
                                                                            )
                                                                        }
                                                                    ></i>
                                                                </>
                                                            ) : (
                                                                <div
                                                                    className={
                                                                        styles.layout
                                                                    }
                                                                    onClick={
                                                                        onImageUpload
                                                                    }
                                                                >
                                                                    Thêm <br />{' '}
                                                                    ảnh
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.imageBorder
                                                            }
                                                        >
                                                            {listImage[4]
                                                                ?.data_url ? (
                                                                <>
                                                                    <div
                                                                        className={
                                                                            styles.image
                                                                        }
                                                                        style={{
                                                                            backgroundImage: `url(${listImage[4]?.data_url})`,
                                                                        }}
                                                                        data-fancybox="gallery"
                                                                        data-src={
                                                                            listImage[4]
                                                                                ?.data_url
                                                                        }
                                                                        data-thumb={
                                                                            listImage[4]
                                                                                ?.data_url
                                                                        }
                                                                        data-width={
                                                                            10000
                                                                        }
                                                                        data-height={
                                                                            10000
                                                                        }
                                                                    ></div>
                                                                    <i
                                                                        className="fa-solid fa-xmark"
                                                                        onClick={() =>
                                                                            onImageRemove(
                                                                                4
                                                                            )
                                                                        }
                                                                    ></i>
                                                                </>
                                                            ) : (
                                                                <div
                                                                    className={
                                                                        styles.layout
                                                                    }
                                                                    onClick={
                                                                        onImageUpload
                                                                    }
                                                                >
                                                                    Thêm <br />{' '}
                                                                    ảnh
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Fancybox>
                                        </div>

                                        <div className={styles.listVideo}>
                                            {urlVideo &&
                                                typeVideo === 'iframe' && (
                                                    <>
                                                        <iframe
                                                            src={urlVideo}
                                                            title="video"
                                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                            allowFullScreen
                                                        ></iframe>
                                                        <i
                                                            className="fa-solid fa-xmark"
                                                            onClick={
                                                                handleCloseVideo
                                                            }
                                                        ></i>
                                                    </>
                                                )}
                                            {urlVideo &&
                                                typeVideo === 'video' && (
                                                    <>
                                                        <video
                                                            src={urlVideo}
                                                            controls
                                                        ></video>
                                                        <i
                                                            className="fa-solid fa-xmark"
                                                            onClick={
                                                                handleCloseVideo
                                                            }
                                                        ></i>
                                                    </>
                                                )}
                                        </div>

                                        <div className={styles.choose_color}>
                                            <div className={styles.header}>
                                                Màu nền
                                            </div>
                                            <div className={styles.listColor}>
                                                {arrColor.map((item, index) => {
                                                    if (
                                                        item === 'transparent'
                                                    ) {
                                                        return (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    backgroundColor:
                                                                        item,
                                                                }}
                                                                className={classNames(
                                                                    styles.color,
                                                                    {
                                                                        [styles.active]:
                                                                            item ===
                                                                            bgColor,
                                                                    }
                                                                )}
                                                                onClick={() =>
                                                                    setBgColor(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa-solid fa-ban"></i>
                                                            </div>
                                                        );
                                                    }
                                                    return (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                backgroundColor:
                                                                    item,
                                                            }}
                                                            className={classNames(
                                                                styles.color,
                                                                {
                                                                    [styles.active]:
                                                                        item ===
                                                                        bgColor,
                                                                }
                                                            )}
                                                            onClick={() =>
                                                                setBgColor(item)
                                                            }
                                                        ></div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className={styles.btns}>
                                            <div className={styles.text}>
                                                Thêm vào bài viết
                                            </div>
                                            <div className={styles.iconImage}>
                                                <i
                                                    className="fa-regular fa-image"
                                                    onClick={onImageUpload}
                                                ></i>
                                            </div>
                                            <label className={styles.iconVideo}>
                                                <i className="fa-solid fa-video"></i>
                                                <input
                                                    type="file"
                                                    accept="video/mp4"
                                                    hidden
                                                    onChange={handleUpdateVideo}
                                                />
                                            </label>
                                            <div
                                                className={styles.linkYT}
                                                onClick={handleClickLinkYoutube}
                                            >
                                                <i className="fa-solid fa-link"></i>
                                                <div className={styles.label}>
                                                    <div
                                                        className={styles.text}
                                                    >
                                                        Youtube
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.choose_time}>
                                            {key && key === 'new' && (
                                                <>
                                                    <div className={styles.top}>
                                                        <div
                                                            className={
                                                                styles.checkbok
                                                            }
                                                        >
                                                            <label
                                                                className={
                                                                    styles[
                                                                        'switch'
                                                                    ]
                                                                }
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        isShowTimePost
                                                                    }
                                                                    onChange={() =>
                                                                        handleToggleTimePost()
                                                                    }
                                                                />
                                                                <span
                                                                    className={
                                                                        styles[
                                                                            'slider'
                                                                        ]
                                                                    }
                                                                ></span>
                                                            </label>
                                                        </div>
                                                        <div className="">
                                                            Hẹn giờ đăng
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.bottom
                                                        }
                                                    >
                                                        {isShowTimePost && (
                                                            <Space
                                                                direction="vertical"
                                                                size={12}
                                                            >
                                                                <DatePicker
                                                                    showTime={{
                                                                        format: 'HH:mm',
                                                                    }}
                                                                    format="DD-MM-YYYY HH:mm"
                                                                    onChange={
                                                                        onChangeTime
                                                                    }
                                                                    allowClear={
                                                                        false
                                                                    }
                                                                    disabledDate={
                                                                        disabledDate
                                                                    }
                                                                    inputReadOnly={
                                                                        true
                                                                    }
                                                                    placeholder="Chọn thời gian"
                                                                    showNow={
                                                                        false
                                                                    }
                                                                    defaultValue={dayjs()}
                                                                />
                                                            </Space>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className={styles.btnAddBlog}>
                                            {key && key === 'new' && (
                                                <button
                                                    type="button"
                                                    className={styles['btn']}
                                                    onClick={handleCreateBlog}
                                                >
                                                    <strong>
                                                        {!isLoading ? (
                                                            'Tạo'
                                                        ) : (
                                                            <div
                                                                className={
                                                                    styles.loading
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        styles[
                                                                            'loading'
                                                                        ]
                                                                    }
                                                                >
                                                                    <span></span>
                                                                    <span></span>
                                                                    <span></span>
                                                                    <span></span>
                                                                    <span></span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </strong>
                                                    <div
                                                        id={
                                                            styles[
                                                                'container-stars'
                                                            ]
                                                        }
                                                    >
                                                        <div
                                                            id={styles['stars']}
                                                        ></div>
                                                    </div>

                                                    <div id={styles['glow']}>
                                                        <div
                                                            className={
                                                                styles['circle']
                                                            }
                                                        ></div>
                                                        <div
                                                            className={
                                                                styles['circle']
                                                            }
                                                        ></div>
                                                    </div>
                                                </button>
                                            )}

                                            {key && key !== 'new' && (
                                                <button
                                                    type="button"
                                                    className={styles['btn']}
                                                    onClick={handleUpdateBlog}
                                                >
                                                    <strong>Lưu</strong>
                                                    <div
                                                        id={
                                                            styles[
                                                                'container-stars'
                                                            ]
                                                        }
                                                    >
                                                        <div
                                                            id={styles['stars']}
                                                        ></div>
                                                    </div>

                                                    <div id={styles['glow']}>
                                                        <div
                                                            className={
                                                                styles['circle']
                                                            }
                                                        ></div>
                                                        <div
                                                            className={
                                                                styles['circle']
                                                            }
                                                        ></div>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </ImageUploading>
                        </div>
                    </div>
                </div>
                {/* <div className={styles.effect}>
               <div className={styles["cube-loader"]}>
                  <div className={styles["cube-top"]}></div>
                  <div className={styles["cube-wrapper"]}>
                     <span style={{ "--i": "0" }} className={styles["cube-span"]}></span>
                     <span style={{ "--i": "1" }} className={styles["cube-span"]}></span>
                     <span style={{ "--i": "2" }} className={styles["cube-span"]}></span>
                     <span style={{ "--i": "3" }} className={styles["cube-span"]}></span>
                  </div>
               </div>

            </div> */}
            </div>
            <div className={'bg-home'}>
                <div className={'area'}>
                    <ul className={'circles'}>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
            <FooterHome />
        </>
    );
};

export default NewBlog;
