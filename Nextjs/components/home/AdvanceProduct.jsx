import ListProduct from './ListProduct'
import { getNewCollectionProduct } from '../../services/appService'

import styles from '../../styles/home/AdvanceProduct.module.scss'
import { useEffect, useState } from 'react';
import classNames from 'classnames';

import ModalPreviewProduct from '../../components/home/ModalPreviewProduct'

const AdvanceProduct = ({ newCollectionData = [] }) => {

    const [listAdvanceProduct, setListAdvanceProduct] = useState(newCollectionData);
    const [typeProduct, setTypeProduct] = useState(1);
    const [isShowModalPreview, setIsShowModalPreview] = useState(false);
    const [currentProduct, setCurrentProduct] = useState('');
    const [domloaed, setDomloaded] = useState(false)

    useEffect(() => {
        if (domloaed || newCollectionData?.length === 0)
            getLiseNewCollection();
        setDomloaded(true)
    }, [typeProduct])

    const getLiseNewCollection = async () => {
        let arrType = ['điện thoại', 'laptop', 'ti vi', 'đồng hồ']

        let res = await getNewCollectionProduct(arrType[typeProduct - 1])
        if (res && res.errCode === 0) {
            setListAdvanceProduct(res.data)
        }
        else {
            setListAdvanceProduct([])
        }
    }

    const closeModalPreview = () => {
        setIsShowModalPreview(false);
    }

    const handleOpenModalPreview = (product) => {
        setIsShowModalPreview(true);
        setCurrentProduct(product);
    }

    return (
        <div className={styles['AdvanceProduct-container']}>
            <div className={styles['AdvanceProduct-content']}>
                <div className={styles['AdvanceProduct-top']} data-aos="zoom-in-down">
                    Sản phẩm cao cấp
                </div>
                <div className={styles['AdvanceProduct-bottom']}>
                    <div className={styles['AdvanceProduct-category']} data-aos="zoom-in-up">
                        <div className={classNames(styles['category'],
                            { [styles.active]: typeProduct === 1 })}
                            onClick={() => setTypeProduct(1)}
                        >
                            Điện thoại
                        </div>
                        <div className={classNames(styles['category'],
                            { [styles.active]: typeProduct === 2 })}
                            onClick={() => setTypeProduct(2)}
                        >
                            Laptop
                        </div>
                        <div className={classNames(styles['category'],
                            { [styles.active]: typeProduct === 3 })}
                            onClick={() => setTypeProduct(3)}
                        >
                            Ti vi
                        </div>
                        <div className={classNames(styles['category'],
                            { [styles.active]: typeProduct === 4 })}
                            onClick={() => setTypeProduct(4)}
                        >
                            Đồng hồ
                        </div>
                    </div>
                    <div className={styles['AdvanceProduct-list']}>
                        <ListProduct handleOpenModalPreview={handleOpenModalPreview} products={listAdvanceProduct} />
                    </div>
                </div>
            </div>
            <ModalPreviewProduct closeModal={closeModalPreview} isOpen={isShowModalPreview} product={currentProduct} />
        </div>
    )
}
export default AdvanceProduct;