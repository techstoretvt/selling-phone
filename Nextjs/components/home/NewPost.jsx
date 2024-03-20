import Link from 'next/link';
import styles from '../../styles/home/NewPost.module.scss';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDate } from '../../services/common';
import { getListBlogHome } from '../../services/appService';

const NewPost = ({ listBlogHomeData }) => {
    const [listBlogs, setListBlogs] = useState(listBlogHomeData);

    useEffect(() => {
        if (listBlogHomeData?.length === 0) {
            const getBlog = async () => {
                let res = await getListBlogHome();
                // console.log(res);
                if (res.errCode === 0) setListBlogs(res.data);
            };
            getBlog();
        }
    }, []);

    return (
        <div className={styles['NewPost-container']}>
            <div className={styles['NewPost-content']}>
                <div data-aos="zoom-in-up" className={styles['NewPost-main']}>
                    <div className={styles['top']}>
                        <div className={styles['title']}>Bài Viết Mới Nhất</div>
                        <Link href={'/blogs/all'} className={styles['more']}>
                            Xem Thêm
                        </Link>
                    </div>
                    {listBlogs?.length > 0 && (
                        <div className={styles['content']}>
                            <div className={styles['content-left']}>
                                <Link
                                    href={`/blogs/detail-blog/${listBlogs[0]?.id}`}
                                    className={styles['image']}
                                >
                                    <Image
                                        src={listBlogs[0]?.imageBlogs[0]?.image}
                                        alt=""
                                        width={300}
                                        height={300}
                                    />
                                </Link>
                                <Link
                                    href={'/home'}
                                    className={styles['name']}
                                    title="Điểm qua các loại tivi có mặt trên thị trường hiện nay"
                                >
                                    {listBlogs[0].title
                                        ? listBlogs[0].title
                                        : listBlogs[0].contentHTML}
                                </Link>
                                <div className={styles['time']}>
                                    {formatDate(listBlogs[0]?.createdAt)}
                                </div>
                            </div>
                            <div className={styles['content-right']}>
                                {listBlogs.map((item, index) => {
                                    if (index !== 0)
                                        return (
                                            <div
                                                key={index}
                                                className={
                                                    styles['content-right-wrap']
                                                }
                                            >
                                                <Link
                                                    href={`/blogs/detail-blog/${item?.id}`}
                                                    className={styles['image']}
                                                >
                                                    <Image
                                                        src={
                                                            item?.imageBlogs[0]
                                                                ?.image
                                                        }
                                                        height={200}
                                                        width={200}
                                                        alt=""
                                                    />
                                                </Link>
                                                <div
                                                    className={
                                                        styles['content']
                                                    }
                                                >
                                                    <Link
                                                        href={'/home'}
                                                        className={
                                                            styles['name']
                                                        }
                                                        title=" Điểm qua các loại tivi có mặt trên thị trường hiện nay"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <div
                                                        className={
                                                            styles['time']
                                                        }
                                                    >
                                                        {formatDate(
                                                            item.createdAt
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                {/* <Link href={'/search?keyword=flycam&promotion=true'} className={styles['NewPost-img'] + ' ' + 'light-effect light-effect-flash'}>
               <Image
                  src={'/images/home/NewPostImage-right.webp'}
                  width={200}
                  height={200}
                  alt='' />
            </Link> */}
            </div>
        </div>
    );
};
export default NewPost;
