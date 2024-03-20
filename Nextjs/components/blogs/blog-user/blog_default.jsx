import { Dropdown } from 'antd';
import styles from '../../../styles/blogs/blog-user/blog_default.module.scss'
import moment from "moment/moment";
import Link from 'next/link';
import React, { useState } from 'react'
import Countdown from 'react-countdown';
import Fancybox from '../../../components/product/Fancybox'
import Image from 'next/image';

const linkVideoDrive = process.env.RACT_APP_LNK_VIDEO_DRIVE


const BlogDefault = ({ blog, handleDeleteBlog, hideMenu, getListBlog }) => {
    const date = new Date().getTime()
    const [showCountDown, setShowCountdown] = useState(true)

    const renderAvatarUser = (item) => {
        if (item.avatarUpdate) {
            return {
                backgroundImage: `url(${item.avatarUpdate})`,
            }
        }
        if (item.typeAccount === 'web') {
            if (item.avatar) {
                return {
                    backgroundImage: `url(${item.avatar})`,
                }
            }
            else {
                return {

                }
            }
        }

        if (item.typeAccount === 'google') {
            return {
                backgroundImage: `url(${item.avatarGoogle})`,
            }
        }
        if (item.typeAccount === 'facebook') {
            return {
                backgroundImage: `url(${item.avatarFacebook})`,
            }
        }

        if (item.typeAccount === 'github') {
            return {
                backgroundImage: `url(${item.avatarGithub})`,
            }
        }


    }

    const renderTime = (time) => {
        let date = new Date(time).getTime()
        return 'Ngày:  ' + moment(date).format("DD/MM/YYYY hh:mm:ss");
    }

    function formatNumber(num) {
        if (num >= 1000 && num < 1000000) {
            return (num / 1000).toFixed(1) + 'k';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'm';
        } else {
            return num?.toString();
        }
    }


    return (
        <div className={styles.wrap_Blog_default}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <div className={styles.left}
                        style={renderAvatarUser(blog?.User)}
                    ></div>
                    <div className={styles.right}>
                        <div className={styles.name}>{blog?.User?.firstName + ' ' + blog?.User?.lastName}</div>
                        <div className={styles.typeBlog}>Bài viết cá nhân</div>
                    </div>
                </div>
                <div className={styles.right}>
                    {
                        hideMenu !== true &&
                        <Dropdown
                            trigger={['click']}
                            placement="bottomRight"
                            menu={{
                                items: [
                                    {
                                        label:
                                            <Link
                                                href={`/blogs/detail-blog/${blog?.id}`}
                                            >Xem chi tiết</Link>,
                                        key: '0',
                                    },
                                    {
                                        label: <Link href={`/blogs/${blog?.id}`}>Chỉnh sửa bài viết</Link>,
                                        key: '1',
                                    },
                                    {
                                        label:
                                            <div style={{ color: 'red' }}
                                                onClick={() => handleDeleteBlog(blog?.id, '')}
                                            >Xóa bài viết</div>,
                                        key: '3',
                                    },
                                ],
                            }}
                        >
                            <div>
                                <i className="fa-solid fa-ellipsis"></i>
                            </div>
                        </Dropdown>
                    }
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.wrap_content}
                        dangerouslySetInnerHTML={{ __html: blog?.title ? blog?.title : blog?.contentHTML.replaceAll('\n', '<br/>') }}
                    >
                    </div>
                </div>
                <div className={styles.right}>
                    <Fancybox options={{
                        infinite: true, hideScrollbar: true,
                        Toolbar: {
                            display: [
                                { id: "prev", position: "center" },
                                { id: "counter", position: "center" },
                                { id: "next", position: "center" },
                                "zoom",
                                "slideshow",
                                "fullscreen",
                                "download",
                                "thumbs",
                                "close",
                            ],
                        },
                    }}
                    >
                        {
                            blog?.imageBlogs?.length > 0 &&
                            blog?.imageBlogs?.map(item => {
                                return (
                                    <Image key={item.id} className={styles.image}
                                        src={item.image}
                                        alt='sfsdf'
                                        width={500}
                                        height={500}
                                        data-fancybox={`gallery` + blog?.id}
                                        data-src={item.image}
                                        data-thumb={item.image}
                                        data-width={10000}
                                        data-height={10000}
                                    ></Image>
                                )
                            })
                        }
                    </Fancybox>
                    {
                        blog?.videoBlog && blog?.videoBlog?.idDrive === '' &&
                        <div className={styles.video}>
                            <iframe
                                src={blog?.videoBlog?.video}
                                title="Maléna - Cheri Cheri Lady Remix ♫ Khóc Cho Người Ai Khóc Cho Em | Nhạc Remix Hot Trend TikTok 2023">
                            </iframe>

                        </div>
                    }
                    {
                        blog?.videoBlog && blog?.videoBlog?.idDrive !== '' &&
                        <div className={styles.video}>
                            <video src={linkVideoDrive + blog?.videoBlog?.idDrive}
                                controls
                            ></video>
                        </div>
                    }


                </div>
            </div>
            <div className={styles.data}>
                <div className={styles.countLike}>
                    <i className="fa-regular fa-thumbs-up"></i>
                    {formatNumber(blog?.amountLike)}
                </div>
                <div className={styles.countLike}>
                    <i className="fa-solid fa-share-from-square"></i>
                    {formatNumber(blog?.amountShare)}
                </div>
                <div className={styles.countLike}>
                </div>
                <div className={styles.countLike}>
                    <i className="fa-solid fa-eye"></i>
                    {formatNumber(blog?.viewBlog)}
                </div>
                <div className={styles.countLike}>
                    <i className="fa-regular fa-comment"></i>
                    {formatNumber(blog?.amountComment)}
                </div>
            </div>
            <div className={styles.footer}>
                {
                    renderTime(blog?.createdAt)
                }
            </div>

            {
                blog?.timePost > date && showCountDown &&
                <div className={styles.layout}>
                    <div className={styles.title}>
                        Bài viết được chia sẻ sau:
                    </div>
                    <div className={styles.time}>
                        <Countdown
                            date={Date.now() + (blog?.timePost - date)}
                            daysInHours={true}
                            renderer={props =>
                                <>
                                    <div>{props.hours} h</div>
                                    <div>{props.minutes} m</div>
                                    <div>{props.seconds} s</div>
                                </>
                            }
                            onComplete={() => { getListBlog(), setShowCountdown(false) }}
                        />
                    </div>
                </div>

            }


        </div>
    )
}

export default React.memo(BlogDefault)