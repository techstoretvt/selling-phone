import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getAllTypeProduct } from '../../services/appService'
import Slider from "react-slick";

import styles from '../../styles/home/Category.module.scss'
import Image from 'next/image'

const Category = ({ listTypeProductData }) => {
    const [listTypeProduct, setListTypeProduct] = useState(listTypeProductData);

    useEffect(() => {
        if (listTypeProductData?.length === 0)
            getListTypeProduct();
    }, [])

    const getListTypeProduct = async () => {
        let res = await getAllTypeProduct();
        if (res && res.errCode === 0) {
            setListTypeProduct(res.data)
        }
    }

    const settings = {
        dots: false,
        infinite: false,
        lazyLoad: 'ondemand',
        speed: 500,
        slidesToShow: 12,
        rows: 2,
        slidesToScroll: 12,
        responsive: [
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 10,
                    slidesToScroll: 10,
                }
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 9,
                    slidesToScroll: 9,
                }
            },
            {
                breakpoint: 760,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 7,
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                }
            },

        ]
    };

    return (
        <div className={styles['Category-container']}>
            <div className={styles['Category-content']}>
                <div className={styles['Category-top']}>
                    DANH MỤC NỔI BẬT
                </div>
                <div data-aos='fade-right' className={styles['Category-bottom']}>

                    <Slider {...settings}>
                        {
                            listTypeProduct?.length > 0 &&
                            listTypeProduct.map(item => (
                                <Link key={item.id} href={`/search?keyword=${item.nameTypeProduct}&facet=${item.nameTypeProduct}`} className={styles['item-wrap']}>
                                    <Image
                                        src={item.imageTypeProduct}
                                        className={styles['img']}
                                        alt=''
                                        width={200}
                                        height={200}
                                    />
                                    <div className={styles['title']}>
                                        {item.nameTypeProduct}
                                    </div>
                                </Link>
                            ))
                        }
                    </Slider>

                </div>
            </div>
        </div>
    )
}
export default React.memo(Category)