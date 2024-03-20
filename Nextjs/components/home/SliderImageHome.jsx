import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from '../../styles/home/SliderImageHome.module.scss';
import { getListEventPromotion } from '../../services/appService';

import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SliderImageHome = ({ listEventData }) => {
    const isScreen600 = useMediaQuery({ query: '(max-width: 600px)' });
    const [listEvent, setListEvent] = useState(listEventData);

    useEffect(() => {
        if (listEventData?.length === 0) {
            const getListEvent = async () => {
                let res = await getListEventPromotion();
                if (res?.errCode === 0) setListEvent(res.data);
            };

            getListEvent();
        }
    }, []);

    const settings = {
        infinite: true,
        speed: 300,
        lazyLoad: 'ondemand',
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        swipeToSlide: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    arrows: false,
                    swipeToSlide: true,
                },
            },
        ],
    };

    return (
        <>
            {listEventData?.length > 0 && (
                <div
                    data-aos="fade-up"
                    className={styles['slider-image-container']}
                    id="slider-image-container"
                >
                    <div className={styles['slider-image-content']}>
                        <div className={styles.bottom}>
                            <div className={styles.sliderTop}>
                                <div className={styles.sliderTopWrap}>
                                    <Slider {...settings}>
                                        {listEvent?.map((item, index) => (
                                            <Link
                                                href={`/promotion/${item.id}`}
                                                key={index}
                                                className={
                                                    styles['slider-item']
                                                }
                                            >
                                                <Image
                                                    src={item.cover}
                                                    width={
                                                        isScreen600 ? 300 : 900
                                                    }
                                                    height={
                                                        isScreen600 ? 300 : 900
                                                    }
                                                    alt=""
                                                    // quality={100}
                                                />
                                            </Link>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default SliderImageHome;
