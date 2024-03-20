import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styles from '../../styles/home/ModalPreviewProduct.module.scss';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
    FacebookShareButton,
    FacebookMessengerShareButton,
    TwitterShareButton,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Swal from 'sweetalert2';
import { addCartProduct, getListCartUser } from '../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import actionTypes from '../../store/actions/actionTypes';
import Fancybox from '../../components/product/Fancybox';
import { nameWeb } from '../../utils/constants';

const ModalPreviewProduct = ({ product, isOpen, closeModal }) => {
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const [listClassify, setListClassify] = useState([]);
    const [currentClassify, setCurrentClassify] = useState(0);
    const accessToken = useSelector((state) => state.user.accessToken);
    const dispatch = useDispatch();
    // const [metaImage, setMetaImage] = useState('');

    useEffect(() => {
        renderStatusProduct();
        if (product) {
            setListClassify(product['classifyProduct-product']);
        }
    }, [product]);

    // useEffect(() => {
    //    if (!product) return
    //    // console.log('stt', product['classifyProduct-product'][indexClassify]?.STTImg);
    //    if (product['classifyProduct-product'][currentClassify]?.STTImg !== -1) {
    //       product['imageProduct-product']?.forEach(item => {
    //          if (item.STTImage === product['classifyProduct-product'][currentClassify]?.STTImg) {
    //             setMetaImage(item?.imagebase64)
    //             // let metaE = document.querySelector('meta[property=image]')
    //             // metaE.content = item?.imagebase64
    //          }
    //       })
    //    }
    //    else
    //       setMetaImage(product['imageProduct-product'][0]?.imagebase64)
    // }, [currentClassify, product])

    const settings = {
        infinite: false,
        speed: 200,
        slidesToShow: 1,
        responsive: [
            // {
            //     breakpoint: 550,
            //     settings: {
            //         slidesToShow: 3,
            //         arrows: false,
            //     }
            // },
        ],
    };

    const settings2 = {
        infinite: false,
        speed: 200,
        slidesToShow: 10,
        arrows: false,
        focusOnSelect: true,
    };

    const renderStatusProduct = () => {
        if (!product) return;
        if (product.isSell === 'false') return 'Nghĩ bán';

        return 'Còn bán';
    };

    const renderPriceProduct = () => {
        if (!product) return;
        if (product.promotionProducts?.length === 0) {
            let priceProduct = product['classifyProduct-product'][0]
                ?.priceClassify
                ? +product['classifyProduct-product'][0]?.priceClassify
                : +product.priceProduct;
            return (
                <div>
                    {new Intl.NumberFormat('ja-JP').format(priceProduct)}₫
                </div>
            );
        } else if (product.promotionProducts[0].numberPercent === 0) {
            let priceProduct = product['classifyProduct-product'][0]
                ?.priceClassify
                ? +product['classifyProduct-product'][0]?.priceClassify
                : +product.priceProduct;
            return (
                <div>
                    {new Intl.NumberFormat('ja-JP').format(priceProduct)}₫
                </div>
            );
        } else {
            let dateCurrent = new Date().getTime();
            let timePromotion = +product.promotionProducts[0].timePromotion;
            if (timePromotion < dateCurrent) {
                let priceProduct = product['classifyProduct-product'][0]
                    ?.priceClassify
                    ? +product['classifyProduct-product'][0]?.priceClassify
                    : +product.priceProduct;
                return (
                    <div>
                        {new Intl.NumberFormat('ja-JP').format(priceProduct)}₫
                    </div>
                );
            } else {
                let persent = product.promotionProducts[0].numberPercent;

                let priceProduct = product['classifyProduct-product'][0]
                    ?.priceClassify
                    ? +product['classifyProduct-product'][0]?.priceClassify
                    : +product.priceProduct;
                let pricePromotion = parseInt(
                    (priceProduct * (100 - persent)) / 100
                );
                return (
                    <>
                        <div>
                            {new Intl.NumberFormat('ja-JP').format(
                                pricePromotion
                            )}
                            ₫
                        </div>
                        <div>
                            {new Intl.NumberFormat('ja-JP').format(
                                priceProduct
                            )}
                            ₫
                        </div>
                        <div>-{persent}%</div>
                    </>
                );
            }
        }
    };

    const renderClassify = () => {
        if (!product) return;
        if (listClassify?.length === 0) {
            return;
        }
        if (listClassify[0].nameClassifyProduct === 'default') {
            return;
        }
        // alert('th3')
        return (
            <>
                <div className={styles.title}>Phân loại:</div>
                <div className={styles.GroupClassify}>
                    {listClassify?.length > 0 &&
                        listClassify.map((item, index) => {
                            if (index === currentClassify) {
                                return (
                                    <div
                                        key={index}
                                        className={styles.item}
                                        style={{
                                            color: 'orange',
                                            border: '1px solid orange',
                                        }}
                                        onClick={() => {
                                            setCurrentClassify(index);
                                            nav1.slickGoTo(item.STTImg - 1);
                                        }}
                                    >
                                        {item.nameClassifyProduct
                                            ? item.nameClassifyProduct
                                            : item.nameClassifyProdu}
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={index}
                                        className={styles.item}
                                        onClick={() => {
                                            setCurrentClassify(index);
                                            nav1.slickGoTo(item.STTImg - 1);
                                        }}
                                    >
                                        {item.nameClassifyProduct
                                            ? item.nameClassifyProduct
                                            : item.nameClassifyProdu}
                                    </div>
                                );
                            }
                        })}
                </div>
            </>
        );
    };
    const handleCopy = () => {
        Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Đã sao chép Url vào khay nhớ tạm.',
        });
    };

    const getListCarts = async () => {
        let res = await getListCartUser(accessToken);
        if (res && res.errCode === 0) {
            dispatch({
                type: actionTypes.UPDATE_LIST_CART,
                data: res.data,
            });
        }
    };

    const handleAddCart = async () => {
        if (!accessToken) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Đăng nhập để thực hiện',
            });
            return;
        }
        let data = {
            accessToken: accessToken,
            idProduct: product?.id,
            amount: 1,
            idClassifyProduct: listClassify[currentClassify]?.id,
        };

        let res = await addCartProduct(data);
        console.log(res);

        if (res && res.errCode === 0) {
            getListCarts();
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Đã thêm sản phẩm vào giỏ hàng',
            });
        } else if (res && res.errCode === 4) {
            // getListCarts()
            Swal.fire({
                icon: 'warning',
                title: 'Oh no',
                text: 'Sản phẩm này đã tạm ngừng bán!',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Xin lỗi',
                text: res.errMessage,
            });
            window.location.reload();
        }
    };

    return (
        <>
            <Head>{/* <meta property="image" content={metaImage} /> */}</Head>
            <div
                className={styles.ModalPreviewProductContainer}
                id="ModalPreviewProductContainer"
            >
                <Modal
                    width="80vw"
                    className={
                        styles.ModalPreviewProductContent +
                        ' ' +
                        'ModalPreviewProductContent'
                    }
                    isOpen={isOpen || false}
                    centered={true}
                    size="lg"
                    toggle={closeModal}
                >
                    <ModalBody
                        style={{
                            backgroundColor: 'var(--bg-primary-color)',
                            borderRadius: '4px',
                        }}
                    >
                        <div className={styles.ModalPreviewProductWrap}>
                            <div className={styles.close} onClick={closeModal}>
                                <i className="fa-solid fa-xmark"></i>
                                <i className="fa-solid fa-minus"></i>
                            </div>
                            <div className={styles.left}>
                                <div className={styles.sliderTop}>
                                    <Fancybox
                                        options={{
                                            infinite: true,
                                            hideScrollbar: true,
                                            Toolbar: {
                                                display: [
                                                    {
                                                        id: 'prev',
                                                        position: 'center',
                                                    },
                                                    {
                                                        id: 'counter',
                                                        position: 'center',
                                                    },
                                                    {
                                                        id: 'next',
                                                        position: 'center',
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
                                        <Slider
                                            {...settings}
                                            asNavFor={nav2}
                                            ref={(slider) => setNav1(slider)}
                                        >
                                            {product &&
                                                product['imageProduct-product']
                                                    ?.length >= 2 &&
                                                product[
                                                    'imageProduct-product'
                                                ].map((item, index) => {
                                                    let date =
                                                        new Date().getTime();
                                                    return (
                                                        <div key={index}>
                                                            <div
                                                                style={{
                                                                    backgroundImage: `url('${item.imagebase64}')`,
                                                                }}
                                                                className={
                                                                    styles.item
                                                                }
                                                                data-fancybox={`preview-product-${date}`}
                                                                data-src={
                                                                    item.imagebase64
                                                                }
                                                                data-width={
                                                                    10000
                                                                }
                                                                data-height={
                                                                    10000
                                                                }
                                                            ></div>
                                                        </div>
                                                    );
                                                })}
                                        </Slider>
                                    </Fancybox>
                                </div>
                                <div
                                    className={
                                        styles.sliderBottom +
                                        ' ' +
                                        'sliderBottom'
                                    }
                                >
                                    <Slider
                                        {...settings2}
                                        asNavFor={nav1}
                                        ref={(slider) => setNav2(slider)}
                                    >
                                        {product &&
                                            product['imageProduct-product']
                                                ?.length >= 2 &&
                                            product['imageProduct-product'].map(
                                                (item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div
                                                                style={{
                                                                    backgroundImage: `url('${item.imagebase64}')`,
                                                                }}
                                                                className={
                                                                    styles.item
                                                                }
                                                            ></div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </Slider>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <h2>{product?.nameProduct}</h2>
                                <div className={styles.statusAndTrademark}>
                                    <div className={styles.statusWrap}>
                                        <div>Tình trạng:</div>
                                        <h4>{renderStatusProduct()}</h4>
                                    </div>
                                    <div className={styles.trademarkWrap}>
                                        <div>Thương hiệu:</div>
                                        <h4>
                                            {product?.trademark?.nameTrademark}
                                        </h4>
                                    </div>
                                </div>
                                <div className={styles.wrapPrice}>
                                    <div>Giá:</div>
                                    {renderPriceProduct()}
                                </div>

                                <div className={styles.classifyWrap}>
                                    {renderClassify()}
                                </div>
                                <div className={styles.wrapSocial}>
                                    <div>Chia sẻ:</div>
                                    <div className={styles.wrapIcon}>
                                        <FacebookShareButton
                                            url={`${process.env.REACT_APP_FRONTEND_URL_DOMAIN1}/product/${product?.id}?name=${product?.nameProduct}&classify=${listClassify[currentClassify]?.id}`}
                                            quote={'noi dung'}
                                            hashtag={`#${product?.nameProduct?.replaceAll(
                                                ' ',
                                                ''
                                            )}`}
                                        >
                                            <div className={styles.fb}>
                                                <i className="fa-brands fa-facebook-f"></i>
                                                <div className={styles.label}>
                                                    Facebook
                                                </div>
                                            </div>
                                        </FacebookShareButton>
                                        <FacebookMessengerShareButton
                                            appId={
                                                process.env.REACT_APP_APPID_FACE
                                            }
                                            url={`${process.env.REACT_APP_FRONTEND_URL_DOMAIN1}/product/${product?.id}?name=${product?.nameProduct}&classify=${listClassify[currentClassify]?.id}`}
                                        >
                                            <div className={styles.msg}>
                                                <i className="fa-brands fa-facebook-messenger"></i>
                                                <div className={styles.label}>
                                                    Messenger
                                                </div>
                                            </div>
                                        </FacebookMessengerShareButton>
                                        <TwitterShareButton
                                            title={nameWeb}
                                            hashtags={['abc', 'def']}
                                            url={`${process.env.REACT_APP_FRONTEND_URL_DOMAIN1}/product/${product?.id}?name=${product?.nameProduct}&classify=${listClassify[currentClassify]?.id}`}
                                        >
                                            <div className={styles.tt}>
                                                <i className="fa-brands fa-twitter"></i>
                                                <div className={styles.label}>
                                                    Twitter
                                                </div>
                                            </div>
                                        </TwitterShareButton>
                                        {/* <div>
                                 <i className="fa-brands fa-pinterest-p"></i>
                                 <div className={styles.label}>Pinterest</div>
                              </div> */}
                                        <CopyToClipboard
                                            text={`${process.env.REACT_APP_FRONTEND_URL_DOMAIN1}/product/${product?.id}?name=${product?.nameProduct}?classify=${listClassify[currentClassify]?.id}`}
                                            onCopy={handleCopy}
                                        >
                                            <div>
                                                <i className="fa-regular fa-copy"></i>
                                                <div className={styles.label}>
                                                    Copy link
                                                </div>
                                            </div>
                                        </CopyToClipboard>
                                    </div>
                                </div>
                                <div className={styles.btnAddcart}>
                                    <button onClick={handleAddCart}>
                                        Thêm vào giỏ
                                    </button>
                                </div>
                                <div className={styles.more}>
                                    <Link
                                        href={`/product/${product?.id}?name=${product?.nameProduct}`}
                                    >
                                        Xem chi tiết sản phẩm
                                    </Link>
                                    <i className="fa-solid fa-angles-right"></i>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </>
    );
};

export default ModalPreviewProduct;
