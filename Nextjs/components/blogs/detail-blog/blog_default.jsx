import moment from 'moment/moment'
import React from 'react'
import styles from '../../../styles/blogs/detail-blog/blog_default.module.scss'
import Fancybox from '../../../components/product/Fancybox'
import Link from 'next/link'
import Image from 'next/image'

const linkVideoDrive = process.env.RACT_APP_LNK_VIDEO_DRIVE

const BlogDefault = ({ blog }) => {


    const renderAvatarUser = (item) => {
        if (!item) return
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
        return moment(date).format("hh:mm DD/MM/YYYY");
    }

    return (
        <div className={styles.BlogDefault_container}>
            <div className={styles.header}>
                <Link href={`/blogs/blog-user/${blog?.User?.id}`} className={styles.left}
                    style={renderAvatarUser(blog?.User)}
                ></Link>
                <div className={styles.right}>
                    <Link href={`/blogs/blog-user/${blog?.User?.id}`} className={styles.name}>
                        {blog?.User?.firstName + ' ' + blog?.User?.lastName}
                    </Link>
                    <div className={styles.time}>
                        {renderTime(blog?.createdAt)}
                    </div>
                </div>
            </div>
            <div className={styles.content}
                dangerouslySetInnerHTML={{ __html: blog?.contentHTML }}
            ></div>
            <div className={styles.media}>
                <div className={styles.list_image}>
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
                                        // style={{ backgroundImage: `url(${item.image})` }}
                                        src={item.image}
                                        alt='sfsd'
                                        width={600}
                                        height={400}
                                        data-fancybox={`gallery`}
                                        data-src={item.image}
                                        data-thumb={item.image}
                                        data-width={10000}
                                        data-height={10000}
                                    ></Image>
                                )
                            })
                        }

                    </Fancybox>
                </div>
                <div className={styles.video}>
                    {
                        blog?.videoBlog && blog?.videoBlog?.idDrive === '' &&
                        <iframe src={blog?.videoBlog?.video} title="[S9] Tuyển Tập Hoạt Hình Doraemon Phần 11 - Trọn Bộ Hoạt Hình Doraemon Lồng Tiếng Viêt"></iframe>
                    }
                    {
                        blog?.videoBlog && blog?.videoBlog?.idDrive !== '' &&
                        <video controls>
                            <source src={linkVideoDrive + blog?.videoBlog?.idDrive} />
                        </video>
                    }
                </div>

            </div>
        </div>
    )
}

export default React.memo(BlogDefault)