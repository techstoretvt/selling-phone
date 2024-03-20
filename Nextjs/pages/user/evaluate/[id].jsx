import { useRouter } from 'next/router';
import styles from '../../../styles/user/evaluate/evaluate.module.scss';
import HeaderBottom from '../../../components/home/HeaderBottom';
import Head from 'next/head';
import { useEffect } from 'react';
import {
    // GetUserLogin, GetUserLoginRefreshToken, getListCartUser,
    createNewEvalueProduct,
    uploadVideoEvaluateProduct,
    uploadImagesEvaluateProduct,
    createNewEvaluateFailed,
    updateEvaluateProduct,
    deleteVideoEvaluate,
    updateVideoEvaluateProduct,
} from '../../../services/userService';
import { getDetailBillById } from '../../../services/graphql';
// import actionTypes from '../../../store/actions/actionTypes'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Rating from '@mui/material/Rating';
import ImageUploading from 'react-images-uploading';
import FooterHome from '../../../components/home/FooterHome';
import Swal from 'sweetalert2';
import { useRef } from 'react';
import classNames from 'classnames';
import SyncLoader from 'react-spinners/SyncLoader';
import Button from '@mui/material/Button';
import { checkWord, checkLogin } from '../../../services/common';
import LoadingBar from 'react-top-loading-bar';
import Background from '../../../components/background';
import { nameWeb } from '../../../utils/constants';

const Evaluate = () => {
    const router = useRouter();
    const accessToken = useSelector((state) => state.user.accessToken);
    const refreshToken = useSelector((state) => state.user.refreshToken);
    const dispatch = useDispatch();
    // const [listCarts, setListCarts] = useState([]);
    const [star, setStar] = useState(0);
    const [hoverStar, setHoverStar] = useState(-1);
    const [images, setImages] = useState([]);
    const maxNumber = 5;
    const [videoSrc, seVideoSrc] = useState('');
    const [videoFile, seVideoFile] = useState('');
    const text = useRef();
    const [displayName, setDisplayName] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [detailBill, setDetailBill] = useState(null);
    const [progress, setProgress] = useState(100);
    useEffect(() => {
        checkLogin(accessToken, refreshToken, dispatch).then((res) => {
            if (!res) {
                router.push('/home');
            }
        });
    }, []);

    useEffect(() => {
        getDetailBill();
    }, [router.query.id]);

    const getDetailBill = async () => {
        if (router.query.id) {
            setDetailBill(null);
            let res = await getDetailBillById(router.query.id);
            console.log(res);
            if (res && res.data && res.data.detailBillById !== null) {
                setDetailBill(res.data.detailBillById);
                if (res.data.detailBillById.isReviews === 'true') {
                    setStar(res.data.detailBillById.evaluateProduct.starNumber);
                    text.current.innerText =
                        res.data.detailBillById.evaluateProduct.content;
                    setDisplayName(
                        res.data.detailBillById.evaluateProduct.displayname ===
                            'true'
                            ? true
                            : false
                    );

                    let arrImage =
                        res.data.detailBillById.evaluateProduct.imageEvaluateProduct.map(
                            (item) => {
                                return {
                                    file: null,
                                    data_url: item.imagebase64,
                                };
                            }
                        );
                    setImages(arrImage);

                    seVideoSrc(
                        res.data.detailBillById.evaluateProduct
                            .videoEvaluateProduct?.videobase64
                    );
                    seVideoFile('');
                }
            } else {
                setDetailBill(null);
                router.push('/not-found');
            }
        }
    };

    const getLabelStar = () => {
        let labels = {
            1: 'Tệ',
            2: 'Không hài lòng',
            3: 'Bình thường',
            4: 'Hài lòng',
            5: 'Tuyệt vời',
        };

        if (hoverStar !== -1)
            return <span className={styles.label}>{labels[hoverStar]}</span>;
        else if (star !== null)
            return <span className={styles.label}>{labels[star]}</span>;
    };

    const onChangeImage = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
        console.log(imageList);
    };

    const handleChangeVideo = (info) => {
        // console.log(info)
        seVideoSrc('');
        seVideoFile('');

        if (info?.type === 'video/mp4') {
            seVideoFile(info);
            let url = URL.createObjectURL(info);
            seVideoSrc(url);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Haizzzzzzz',
                text: 'Đừng cố làm gì cho mắc công, mình tính cả rồi 😁😁',
            });
        }
    };

    const handleCreateNewEvaluate = async () => {
        if (!accessToken || !router.query.id) {
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: 'Đã có lỗi xảy ra vui lòng tải lại trang 😙😙',
            });
            return;
        }
        if (star === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan',
                text: 'Bạn chưa chọn số sao kìa 😙😙',
            });
            return;
        }

        if (!checkWord(text.current.innerText)) {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan đã',
                text: 'Từ ngữ không thân thiện hoặc không được cho phép trong hệ thống 😙😙',
            });
            return;
        }

        let data = {
            accessToken,
            idDetailBill: router.query.id,
            star,
            content: text.current.innerText,
            displayName,
        };

        setIsLoading(true);

        let res = await createNewEvalueProduct(data);

        if (res && res.errCode === 0) {
            if (images.length === 0 && videoFile === '') {
                //logic Success, done
                Swal.fire({
                    icon: 'success',
                    title: 'Đã lưu đánh giá.',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push('/user/purchase');
                    } else if (result.isDismissed) {
                        router.push('/user/purchase');
                    }
                });
                return;
            }

            // let check = true
            // let count = 0
            // let dem = 0
            // if (images.length > 0) count++;
            // if (videoFile !== '') count++;

            if (images.length > 0) {
                let form = new FormData();
                images.forEach((item) => {
                    form.append('file', item.file);
                });
                uploadImagesEvaluateProduct(form, res.data.id);
                // .then(res2 => {
                //     if (res2 && res2.errCode !== 0) {
                //         check = false;
                //         Swal.fire({
                //             icon: 'error',
                //             title: 'Sorry',
                //             text: res2.errMessage || 'Lỗi upload image 😙😙'
                //         })
                //     }
                //     else {
                //         dem++;
                //     }
                // })
            }

            if (videoFile !== '') {
                let form = new FormData();
                form.append('video', videoFile);
                uploadVideoEvaluateProduct(form, res.data.id);
                // .then(result => {
                //     if (result && result.errCode !== 0) {
                //         check = false;
                //         Swal.fire({
                //             icon: 'error',
                //             title: 'Sorry',
                //             text: result.errMessage || 'Lỗi upload video 😙😙'
                //         })
                //     }
                //     else {
                //         dem++;
                //     }
                // })
            }

            // let setinterval = setInterval(() => {
            //     if (check) {
            //         if (dem === count) {
            //             //logic success
            //             clearInterval(setinterval)
            //             Swal.fire({
            //                 icon: 'success',
            //                 title: 'Đã lưu đánh giá.',
            //                 confirmButtonText: 'OK',
            //             }).then((result) => {
            //                 if (result.isConfirmed) {
            //                     router.push('/user/purchase')
            //                 }
            //                 else if (result.isDismissed) {
            //                     router.push('/user/purchase')
            //                 }
            //             })

            //         }
            //     }
            //     else {
            //         //logic error
            //         setIsLoading(false);
            //         Swal.fire({
            //             icon: 'error',
            //             title: 'Sorry',
            //             text: "Tải ảnh hoặc video thất bại",
            //         })
            //         clearInterval(setinterval)
            //         createNewEvaluateFailed({
            //             idEvaluate: res.data.id,
            //             idDetailBill: router.query.id,
            //         })
            //     }
            // }, 1000);

            Swal.fire({
                icon: 'success',
                title: 'Đã lưu đánh giá.',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/user/purchase');
                } else if (result.isDismissed) {
                    router.push('/user/purchase');
                }
            });
        } else {
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: res?.errMessage || 'Lỗi 😙😙',
            });
            return;
        }
    };

    const renderImageProduct = () => {
        return detailBill?.product?.imageProduct?.[
            detailBill?.classifyProduct?.STTImg - 1
        ]?.imagebase64;
    };

    const handleUpdateEvaluate = async () => {
        if (!checkWord(text.current.innerText)) {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan đã',
                text: 'Từ ngữ không thân thiện hoặc không được cho phép trong hệ thống 😙😙',
            });
            return;
        }

        let listImage = images.map((item) => item.data_url);
        let data = {
            accessToken,
            idDetailBill: router.query.id,
            text: text.current.innerText,
            star,
            displayname: displayName,
            listImage,
        };
        setIsLoading(true);

        let res = await updateEvaluateProduct(data);
        if (res && res.errCode === 0) {
            let listFileImage = images.map((item) => {
                if (item.file !== null) {
                    return item.file;
                }
            });
            if (listFileImage.length !== 0) {
                let form = new FormData();
                listFileImage.forEach((item) => {
                    form.append('file', item);
                });

                uploadImagesEvaluateProduct(form, res.id);
                // if (uploadImage && uploadImage.errCode !== 0) {
                //     setIsLoading(false);
                //     Swal.fire({
                //         icon: 'error',
                //         title: 'Sorry',
                //         text: 'Upload image thất bại',
                //     })
                //     return;
                // }
            }

            if (videoFile === '' && videoSrc === '') {
                //xoa video
                deleteVideoEvaluate({ idDetailBill: router.query.id });
            }

            if (videoFile !== '') {
                let form = new FormData();
                form.append('video', videoFile);
                updateVideoEvaluateProduct(form, router.query.id);
                // if (video && video.errCode !== 0) {
                //     setIsLoading(false);
                //     Swal.fire({
                //         icon: 'error',
                //         title: 'Sorry',
                //         text: 'Upload video thất bại',
                //     })
                //     return;
                // }
            }

            Swal.fire({
                icon: 'success',
                title: 'Đã lưu đánh giá.',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/user/purchase');
                } else if (result.isDismissed) {
                    router.push('/user/purchase');
                }
            });
        } else {
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: res?.errMessage || 'Lỗi 😙😙',
            });
        }
    };

    return (
        <>
            <Head>
                <title>Đánh giá | {nameWeb}</title>
            </Head>
            <LoadingBar
                color="#5885E6"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <HeaderBottom />
            <div className={styles.evaluetaContainer}>
                <div className={styles.evaluateContent}>
                    <div className={styles.header}>Đánh giá sản phẩm</div>
                    <div className={styles.product}>
                        <div
                            className={styles.left}
                            style={{
                                backgroundImage: `url(${renderImageProduct()})`,
                            }}
                        ></div>
                        <div className={styles.right}>
                            <div className={styles.name}>
                                {detailBill &&
                                    detailBill?.product?.nameProduct
                                        .charAt(0)
                                        .toUpperCase() +
                                        detailBill?.product?.nameProduct.slice(
                                            1
                                        )}
                            </div>
                            <div className={styles.classify}>
                                Phân loại hàng:
                                <span
                                    style={{
                                        marginLeft: '4px',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {detailBill &&
                                    detailBill?.classifyProduct
                                        ?.nameClassifyProduct !== 'default'
                                        ? detailBill?.classifyProduct
                                              ?.nameClassifyProduct
                                        : 'Không có'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapStar}>
                        <div className={styles.text}>Chất lượng sản phẩm</div>
                        <div className={styles.start_content}>
                            <Rating
                                name="hover-feedback"
                                value={star}
                                size="large"
                                icon={
                                    <i
                                        className="fa-solid fa-star"
                                        style={{ margin: '0 2px' }}
                                    ></i>
                                }
                                emptyIcon={
                                    <i
                                        className="fa-regular fa-star"
                                        style={{
                                            color: '#fff',
                                            margin: '0 2px',
                                        }}
                                    ></i>
                                }
                                onChange={(event, newValue) => {
                                    setStar(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHoverStar(newHover);
                                }}
                            />
                            {getLabelStar()}
                        </div>
                    </div>
                    <div className={styles.note}>
                        <div
                            ref={text}
                            className={styles.content}
                            contentEditable
                        ></div>
                        <div className={styles.label}>
                            Hãy chia sẽ những điều bạn thích về sản phẩm với
                            người mua khác nhé.
                            <span style={{ color: '#dc3545' }}>
                                {' '}
                                ( Không bắt buộc )
                            </span>
                        </div>
                    </div>
                    <div className={styles.noteLabel}>
                        Viết tối đa 500 ký tự
                    </div>
                    <div className={styles.media}>
                        <ImageUploading
                            multiple
                            value={images}
                            onChange={onChangeImage}
                            maxNumber={maxNumber}
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
                                // write your building UI
                                <>
                                    <div className={styles.listImages}>
                                        {images &&
                                            images.length > 0 &&
                                            images.map((image, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={styles.image}
                                                    >
                                                        <div
                                                            className={
                                                                styles.img
                                                            }
                                                            style={{
                                                                backgroundImage: `url(${image['data_url']})`,
                                                            }}
                                                        ></div>
                                                        <div
                                                            className={
                                                                styles.icons
                                                            }
                                                        >
                                                            <i
                                                                className="fa-solid fa-pencil"
                                                                onClick={() =>
                                                                    onImageUpdate(
                                                                        index
                                                                    )
                                                                }
                                                            ></i>
                                                            <i
                                                                className="fa-solid fa-trash-can"
                                                                onClick={() =>
                                                                    onImageRemove(
                                                                        index
                                                                    )
                                                                }
                                                            ></i>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                    {videoSrc && (
                                        // <video src={videoSrc} width={100} controls></video>
                                        <iframe
                                            src={videoSrc.replace(
                                                'view',
                                                'preview'
                                            )}
                                            frameborder="0"
                                        ></iframe>
                                    )}
                                    <div className={styles.Btns}>
                                        <button
                                            className={classNames('btn', {
                                                'btn-danger': !isDragging,
                                                'btn-warning': isDragging,
                                            })}
                                            onClick={onImageUpload}
                                            disabled={imageList.length === 5}
                                            {...dragProps}
                                        >
                                            Thêm hình ảnh{' '}
                                            {maxNumber - images.length}/
                                            {maxNumber}
                                        </button>
                                        <Button
                                            variant="contained"
                                            component="label"
                                        >
                                            Tải video
                                            <input
                                                hidden
                                                accept="video/*"
                                                type="file"
                                                onChange={(e) =>
                                                    handleChangeVideo(
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </ImageUploading>
                    </div>
                    <div className={styles.displayName}>
                        <div
                            className={classNames(styles.left, {
                                [styles.active]: displayName,
                            })}
                            onClick={() => setDisplayName(!displayName)}
                        >
                            <div className={styles.checkbox}></div>
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.title}>
                                Hiển thị tên đăng nhập trên đánh giá này
                            </div>
                            <div className={styles.example}>
                                {displayName
                                    ? 'Tên tài khoản sẽ được hiển thị như Ho va ten'
                                    : 'Tên tài khoản sẽ được hiển thị như H*******n'}
                            </div>
                        </div>
                    </div>
                    <div className={styles.btn}>
                        {!isLoading ? (
                            <>
                                {detailBill &&
                                    detailBill.isReviews === 'false' && (
                                        <button
                                            onClick={handleCreateNewEvaluate}
                                        >
                                            Hoàn thành
                                        </button>
                                    )}
                                {detailBill &&
                                    detailBill.isReviews === 'true' && (
                                        <button
                                            style={{
                                                backgroundColor: 'orange',
                                            }}
                                            onClick={handleUpdateEvaluate}
                                        >
                                            Lưu thay đổi
                                        </button>
                                    )}
                            </>
                        ) : (
                            <button>
                                <SyncLoader
                                    color={'#36d7b7'}
                                    loading={true}
                                    size={10}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Background />
            <FooterHome />
        </>
    );
};

export default Evaluate;
