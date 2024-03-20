import Slider from 'react-slick';
import CardProduct from './CardProduct';

import styles from '../../styles/home/SliderProduct.module.scss';
import React, { Fragment } from 'react';

const SliderProduct = (props) => {
    return (
        <>
            <div
                className={
                    styles['SliderProduct-container'] +
                    ' ' +
                    'SliderProduct-container'
                }
            >
                <div className={styles['SliderProduct-content']}>
                    {props.listProduct && props.listProduct?.length > 0 ? (
                        <Slider {...props.settings}>
                            {props?.listProduct?.map((item, index) => {
                                return (
                                    <div key={index.toString()}>
                                        <CardProduct
                                            handleOpenModalPreview={
                                                props.handleOpenModalPreview
                                            }
                                            product={item}
                                        />
                                    </div>
                                );
                            })}
                        </Slider>
                    ) : (
                        <Slider {...props.settings}>
                            <div>
                                <CardProduct />
                            </div>
                            <div>
                                <CardProduct />
                            </div>
                            <div>
                                <CardProduct />
                            </div>
                            <div>
                                <CardProduct />
                            </div>
                            <div>
                                <CardProduct />
                            </div>
                            <div>
                                <CardProduct />
                            </div>
                        </Slider>
                    )}
                </div>
            </div>
        </>
    );
};

export default React.memo(SliderProduct);
