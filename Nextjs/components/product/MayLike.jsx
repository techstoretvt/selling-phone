import styles from '../../styles/product/MayLike.module.scss';
import CardProduct from '../../components/home/CardProduct';
import ModalPreviewProduct from '../../components/home/ModalPreviewProduct';
import React, { useState } from 'react';

const MayLike = (props) => {
    const [isShowModalPreview, setIsShowModalPreview] = useState(false);
    const [currentProduct, setCurrentProduct] = useState('');

    const closeModalPreview = () => {
        setIsShowModalPreview(false);
    };

    const handleOpenModalPreview = (product) => {
        setIsShowModalPreview(true);
        setCurrentProduct(product);
    };

    return (
        <div data-aos="zoom-in-up" className={styles.MayLike_container}>
            {props?.listMayLikes?.length > 0 && (
                <>
                    <div className={styles.MayLike_content}>
                        <div className={styles.top}>
                            {props?.listMayLikes?.length > 0 &&
                                'Có thể bạn thích'}
                        </div>
                        <div className={styles.bottom}>
                            <div className={styles.wrap}>
                                {props.listMayLikes &&
                                    props.listMayLikes?.length > 0 &&
                                    props.listMayLikes.map((item) => {
                                        return (
                                            <div
                                                key={item.id}
                                                className={styles.item}
                                            >
                                                <CardProduct
                                                    handleOpenModalPreview={
                                                        handleOpenModalPreview
                                                    }
                                                    product={item}
                                                />
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                    <ModalPreviewProduct
                        closeModal={closeModalPreview}
                        isOpen={isShowModalPreview}
                        product={currentProduct}
                    />
                </>
            )}
        </div>
    );
};

export default React.memo(MayLike);
