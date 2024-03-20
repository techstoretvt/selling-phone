import Image from 'next/image';
import styles from '../../styles/home/ShortVideo.module.scss';
import Link from 'next/link';
import { getListShortVideo } from '../../services/appService';
import { useEffect, useState } from 'react';

const ShortVideo = ({ listShortVideoData = [] }) => {
    const [listVideo, setListVideo] = useState([]);

    useEffect(() => {
        if (listShortVideoData?.length === 0) {
            const getListVideo = async () => {
                let res = await getListShortVideo();
                if (res?.errCode === 0) setListVideo(res.data);
            };
            getListVideo();
        }
    }, []);

    return (
        <>
            <div className={styles.ShortVideo_container}>
                <div className={styles.ShortVideo_content}>
                    <div className={styles.header}>Xem video ngắn</div>
                    <div className={styles.content}>
                        <div className={styles.left}>
                            {listShortVideoData.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/short-video/foryou?_isv=${item.id}`}
                                    className={styles.shortvideo_item}
                                >
                                    <Image
                                        alt=""
                                        src={item.urlImage}
                                        width={400}
                                        height={600}
                                    />
                                </Link>
                            ))}
                        </div>
                        <div className={styles.right}>
                            <Image
                                alt=""
                                src={'/images/home/slider-image/msi-2.webp'}
                                width={400}
                                height={400}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShortVideo;
