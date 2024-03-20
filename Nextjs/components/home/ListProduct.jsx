// import CardProduct from './CardProduct'
import dynamic from 'next/dynamic';
// const CardProduct = dynamic(
//     () => import('./CardProduct'),
//     { ssr: false }
// )

import CardProduct from './CardProduct';

import styles from '../../styles/home/ListProduct.module.scss';

const ListProduct = ({ products, handleOpenModalPreview }) => {
    return (
        <div className={styles['ListProduct-container']}>
            {products && products?.length > 0 ? (
                <div className={styles['ListProduct-content']}>
                    {products.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className={styles['ListProduct-item']}
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
            ) : (
                <div className={styles['ListProduct-content']}>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                    <div className={styles['ListProduct-item']}>
                        <CardProduct />
                    </div>
                </div>
            )}
        </div>
    );
};
export default ListProduct;
