import Link from 'next/link';
import { useEffect, useState } from 'react';
import Slider from 'react-slick'
import PacmanLoader from "react-spinners/PacmanLoader";
import LazyLoad from 'react-lazyload'

import { getProductFlycam } from '../../services/appService'


import styles from '../../styles/home/GenuineFlycam.module.scss'

const GenuineFlycam = ({ ProductFlycams }) => {
    const [listProduct, setListProduct] = useState(ProductFlycams)

    useEffect(() => {
        if (ProductFlycams?.length === 0)
            getListFlycam()
    }, [])

    const getListFlycam = async () => {
        let res = await getProductFlycam();
        if (res && res.errCode === 0) {
            setListProduct(res.data);
        }
    }

    const settings = {
        dots: false,
        infinite: false,
        speed: 200,
        lazyLoad: 'ondemand',
        slidesToShow: 4,
        slidesToScroll: 1,
        rows: 3,
        responsive: [
            {
                breakpoint: 1070,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    speed: 500,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    speed: 500,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 500,
                    // arrows: false
                }
            },
        ]
    };

    const RenderPrice = ({ item }) => {
        //get price
        let price;

        if (item['classifyProduct-product']?.length === 0 || (item['classifyProduct-product']?.length === 1 && item['classifyProduct-product'][0]?.nameClassifyProduct === 'default')) {
            price = +item.priceProduct || 3000
        }
        else {
            price = +item['classifyProduct-product'][0]?.priceClassify || 2000
            console.log('item', item);
        }


        if (!item.promotionProducts || item.promotionProducts?.length === 0) {
            return (
                <>
                    <div className={styles['price-promotion']}>

                    </div>
                    <div className={styles['price-wrap']}>
                        {/* active */}
                        <div className={styles['price-number'] + ' ' + styles.active}>
                            {new Intl.NumberFormat('ja-JP').format(price)} VND
                        </div>
                        {/* <div className={styles['price-number-promotion']}>
                            
                        </div> */}
                    </div>
                </>
            )
        }

        if (item.promotionProducts[0].timePromotion === '0') {
            return (
                <>
                    <div className={styles['price-promotion']}>

                    </div>
                    <div className={styles['price-wrap']}>
                        {/* active */}
                        <div className={styles['price-number'] + ' ' + styles.active}>
                            {new Intl.NumberFormat('ja-JP').format(price)} VND
                        </div>
                        {/* <div className={styles['price-number-promotion']}>
        
                        </div> */}
                    </div>
                </>
            )
        }

        let time = +item.promotionProducts[0].timePromotion
        let date = new Date().getTime()

        if (time < date) {
            return (
                <>
                    <div className={styles['price-promotion']}>

                    </div>
                    <div className={styles['price-wrap']}>
                        {/* active */}
                        <div className={styles['price-number'] + ' ' + styles.active}>
                            {new Intl.NumberFormat('ja-JP').format(price)} VND
                        </div>
                        {/* <div className={styles['price-number-promotion']}>
        
                        </div> */}
                    </div>
                </>
            )
        }
        else {
            let percent = item.promotionProducts[0].numberPercent;
            let priceSell = parseInt(price - (price * percent / 100))


            return (
                <>
                    <div className={styles['price-promotion']}>
                        {new Intl.NumberFormat('ja-JP').format(priceSell)} VND
                    </div>
                    <div className={styles['price-wrap']}>
                        {/* active */}
                        <div className={styles['price-number']}>
                            {new Intl.NumberFormat('ja-JP').format(price)} VND
                        </div>
                        <div className={styles['price-number-promotion']}>
                            {percent}%
                        </div>
                    </div>
                </>
            )
        }
    }


    return (
        <div className={styles['GenuineFlycam-container']} id='GenuineFlycam-container'>
            <div className={styles['GenuineFlycam-content']}>
                <div className={styles['GenuineFlycam-top']}>
                    FLYCAM CHÍNH HÃNG
                </div>
                <div className={styles['GenuineFlycam-bottom']}>
                    {
                        listProduct && listProduct?.length > 0 ?
                            <Slider {...settings}>
                                {
                                    listProduct.map(item => {
                                        const linkProduct = `/product/${item.id}?name=${item.nameProduct}`

                                        return (
                                            <LazyLoad key={item.id} className={styles['GenuineFlycam-bottom-container']}>
                                                <div className={styles['GenuineFlycam-wrap']}>
                                                    <div className={styles['GenuineFlycam-item']}>
                                                        <Link
                                                            style={{ backgroundImage: `url(${item['imageProduct-product'][0]?.imagebase64})` }}
                                                            href={linkProduct} className={styles['left']}
                                                            draggable="false"
                                                        >

                                                        </Link>
                                                        <div className={styles['right']}>
                                                            <Link href={linkProduct} className={styles['name']} title={item.nameProduct}
                                                                draggable="false"
                                                            >
                                                                {item.nameProduct}
                                                            </Link>
                                                            {
                                                                <RenderPrice item={item} />
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </LazyLoad>
                                        )
                                    })
                                }


                            </Slider> :
                            <div className={styles.loading}>
                                <PacmanLoader
                                    color={'#fff'}
                                    loading={true}
                                    size={45}
                                />
                            </div>
                    }

                </div>
            </div>
        </div >
    )
}
export default GenuineFlycam