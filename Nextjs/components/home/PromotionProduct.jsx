import Countdown from 'react-countdown';
import Link from 'next/link';
import SliderProduct from './SliderProduct';
import ModalPreviewProduct from '../../components/home/ModalPreviewProduct';

import { getPromotionProduct } from '../../services/appService';

import styles from '../../styles/home/PromotionProduct.module.scss';
import { useEffect, useState } from 'react';

const PromotionProduct = ({ PromotionProducts = [] }) => {
    const [listProductPromotion, setListProductPromotion] =
        useState(PromotionProducts);
    const [isShowModalPreview, setIsShowModalPreview] = useState(false);
    const [currentProduct, setCurrentProduct] = useState('');

    useEffect(() => {
        if (PromotionProducts?.length === 0) getListPromotionProduct();
    }, []);

    const getListPromotionProduct = async () => {
        let res = await getPromotionProduct();
        if (res && res.errCode === 0) {
            setListProductPromotion(res.data);
        }
    };

    const renderCountDown = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <span>Hello countdown</span>;
        } else {
            // Render a countdown
            return (
                <div id="countdown">
                    <div id="tiles">
                        <span>{hours}</span>
                        <span>{minutes}</span>
                        <span>{seconds}</span>
                    </div>
                    <div className="labels">
                        <li>Days</li>
                        <li>Hours</li>
                        <li>Mins</li>
                    </div>
                </div>
            );
        }
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 1300,
        lazyLoad: 'ondemand',
        slidesToShow: 5,
        slidesToScroll: 5,
        dotsClass: styles['slick-dots'],

        responsive: [
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    speed: 300,
                },
            },
            {
                breakpoint: 940,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    speed: 300,
                    // dots: true,
                    dotsClass: styles['slick-dots'],
                },
            },
            {
                breakpoint: 670,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    swipeToSlide: true,
                    slidesToScroll: 1,
                    rows: 2,
                    speed: 300,
                    // dots: true,
                },
            },
        ],
    };

    const closeModalPreview = () => {
        setIsShowModalPreview(false);
    };

    const handleOpenModalPreview = (product) => {
        setIsShowModalPreview(true);
        setCurrentProduct(product);
    };

    return (
        <div
            className={
                styles['PromotionProduct-container'] +
                ' ' +
                'PromotionProduct-container'
            }
        >
            <div className={styles['PromotionProduct-content']}>
                <div className={styles['PromotionProduct-top']}>
                    <div className={styles.wrap}>
                        <div className={styles['dot']}></div>
                        <div className={styles['title']}>
                            SẢN PHẨM KHUYẾN MÃI
                        </div>
                    </div>
                    <div
                        className={styles['countdown'] + ' ' + 'countdown'}
                        data-aos="flip-up"
                    >
                        <Countdown
                            date={Date.now() + 5000 * 5000 * 10}
                            renderer={renderCountDown}
                        />
                    </div>
                </div>
                <div className={styles['PromotionProduct-center']}>
                    <div className={styles['pc']}>
                        <SliderProduct
                            handleOpenModalPreview={handleOpenModalPreview}
                            settings={settings}
                            listProduct={listProductPromotion}
                        />
                    </div>
                </div>
                <div className={styles['PromotionProduct-bottom']}>
                    <Link
                        href={'/search?promotion=true'}
                        className={styles['btn']}
                    >
                        <span>Xem tất cả SẢN PHẨM KHUYẾN MÃI</span>
                        <i className="fa-regular fa-circle-right"></i>
                        <div></div>
                    </Link>
                </div>
            </div>
            <ModalPreviewProduct
                closeModal={closeModalPreview}
                isOpen={isShowModalPreview}
                product={currentProduct}
            />
        </div>
    );
};
export default PromotionProduct;
