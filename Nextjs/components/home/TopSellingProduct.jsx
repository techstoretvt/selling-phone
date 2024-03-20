import SliderProduct from './SliderProduct';
import { getTopSellProduct } from '../../services/appService';

import styles from '../../styles/home/TopSellingProduct.module.scss';
import { useEffect, useState } from 'react';

import ModalPreviewProduct from '../../components/home/ModalPreviewProduct';

const TopSellingProduct = ({ TopSellProducts }) => {
    const [listSellProduct, setListSellProduct] = useState(TopSellProducts);
    const [isShowModalPreview, setIsShowModalPreview] = useState(false);
    const [currentProduct, setCurrentProduct] = useState('');

    useEffect(() => {
        if (TopSellProducts?.length === 0) getListSellProduct();
    }, []);

    const getListSellProduct = async () => {
        let res = await getTopSellProduct();
        if (res && res.errCode === 0) {
            setListSellProduct(res.data);
        }
    };
    const settings = {
        dots: false,
        infinite: false,
        speed: 1200,
        lazyLoad: 'ondemand',
        slidesToShow: 6,
        slidesToScroll: 6,
        rows: 2,
        responsive: [
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    speed: 300,
                },
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    speed: 300,
                    dotsClass: styles['slick-dots'],
                },
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    speed: 300,
                    dotsClass: styles['slick-dots'],
                },
            },
            {
                breakpoint: 470,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    speed: 300,
                    dotsClass: styles['slick-dots'],
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
                styles['TopSellingProduct-container'] +
                ' ' +
                'TopSellingProduct-container'
            }
        >
            <div className={styles['TopSellingProduct-content']}>
                <div className={styles['TopSellingProduct-top']}>
                    TOP SẢN PHẨM BÁN CHẠY
                </div>
                <div className={styles['TopSellingProduct-bottom']}>
                    <SliderProduct
                        handleOpenModalPreview={handleOpenModalPreview}
                        settings={settings}
                        listProduct={listSellProduct}
                    />
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
export default TopSellingProduct;
