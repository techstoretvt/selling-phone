import Link from 'next/link';
import ListProduct from './ListProduct';
import { getNewCollectionProduct } from '../../services/appService';
import classNames from 'classnames';

import styles from '../../styles/home/NewCollection.module.scss';
import { useEffect, useState } from 'react';

import ModalPreviewProduct from '../../components/home/ModalPreviewProduct';

let arrType = ['chuột máy tính', 'bàn phím', 'ốp lưng', 'tai nghe'];

const NewCollection = ({ newCollectionData = [] }) => {
    const [listCollectionProduct, setListCollectionProduct] =
        useState(newCollectionData);
    const [typeProduct, setTypeProduct] = useState(1);
    const [isShowModalPreview, setIsShowModalPreview] = useState(false);
    const [currentProduct, setCurrentProduct] = useState('');
    const [domloaded, setDomloaded] = useState(false);

    useEffect(() => {
        if (domloaded || newCollectionData?.length === 0)
            getLiseNewCollection();
        setDomloaded(true);
    }, [typeProduct]);

    const getLiseNewCollection = async () => {
        setListCollectionProduct([]);
        let res = await getNewCollectionProduct(arrType[typeProduct - 1]);
        if (res && res.errCode === 0) {
            setListCollectionProduct(res.data);
        }
    };

    const closeModalPreview = () => {
        setIsShowModalPreview(false);
    };

    const handleOpenModalPreview = (product) => {
        setIsShowModalPreview(true);
        setCurrentProduct(product);
    };

    return (
        <div className={styles['NewCollection-container']}>
            <div className={styles['NewCollection-content']}>
                <div className={styles['NewCollection-top']}>
                    Bộ sưu tập mới
                </div>
                <div className={styles['NewCollection-bottom']}>
                    <Link
                        href={'/search?promotion=true'}
                        className={styles['left']}
                        data-aos="fade-right"
                    >
                        <div className={styles['left-img']}></div>
                    </Link>
                    <div className={styles['right']}>
                        <div className={styles['category']}>
                            <div
                                className={classNames(styles['category-item'], {
                                    [styles.active]: typeProduct === 1,
                                })}
                                onClick={() => setTypeProduct(1)}
                            >
                                Chuột máy tính
                            </div>
                            <div
                                className={classNames(styles['category-item'], {
                                    [styles.active]: typeProduct === 2,
                                })}
                                onClick={() => setTypeProduct(2)}
                            >
                                Bàn phím
                            </div>
                            <div
                                className={classNames(styles['category-item'], {
                                    [styles.active]: typeProduct === 3,
                                })}
                                onClick={() => setTypeProduct(3)}
                            >
                                Ốp lưng điện thoại
                            </div>
                            <div
                                className={classNames(styles['category-item'], {
                                    [styles.active]: typeProduct === 4,
                                })}
                                onClick={() => setTypeProduct(4)}
                            >
                                Tai nghe
                            </div>
                        </div>
                        <div className={styles['list-product']}>
                            <ListProduct
                                handleOpenModalPreview={handleOpenModalPreview}
                                products={listCollectionProduct}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['NewCollection-btn']}>
                    <div className={styles['wrap-btn']}>
                        <Link
                            href={`/search?keyword=${
                                arrType[typeProduct - 1]
                            }&facet=${arrType[typeProduct - 1]}`}
                            className={styles['btn']}
                        >
                            <span>
                                Xem tất cả
                                <span>
                                    {' ' +
                                        arrType[typeProduct - 1]
                                            .charAt(0)
                                            .toUpperCase() +
                                        arrType[typeProduct - 1].slice(1)}
                                </span>
                            </span>
                        </Link>
                        <div className={styles['bg-btn']}></div>
                    </div>
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
export default NewCollection;
