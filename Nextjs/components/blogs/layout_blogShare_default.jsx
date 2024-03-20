import styles from '../../styles/blogs/layout_blog_default.module.scss'
import { getBlogShareDefault } from '../../services/appService'
import { useEffect } from 'react';
import React, { useState } from 'react';
import Link from 'next/link';
import Fancybox from '../../components/product/Fancybox'
import Image from 'next/image';

const linkVideoDrive = process.env.RACT_APP_LNK_VIDEO_DRIVE

const LayoutBlogDefault = ({ id, idRoot }) => {
    const [blog, setBlog] = useState('')

    useEffect(() => {
        getBlog()
    }, [id])

    const getBlog = async () => {
        if (!id) return
        let res = await getBlogShareDefault({ idBlog: id })
        if (res && res.errCode === 0) {
            setBlog(res.data)
        }
    }

    const renderAvatarUser = (currentUser) => {
        if (!currentUser) return {}
        if (currentUser.avatarUpdate)
            return { backgroundImage: `url(${currentUser.avatarUpdate})` }

        if (currentUser?.typeAccount === 'google')
            return { backgroundImage: `url(${currentUser.avatarGoogle})` }

        if (currentUser?.typeAccount === 'facebook')
            return { backgroundImage: `url(${currentUser.avatarFacebook})` }

        if (currentUser?.typeAccount === 'github')
            return { backgroundImage: `url(${currentUser.avatarGithub})` }

        if (currentUser?.typeAccount === 'web' && currentUser?.avatar)
            return { backgroundImage: `url(${currentUser.avatar})` }

        if (currentUser?.typeAccount === 'web' && !currentUser?.avatar)
            return {}

    }

    return (
        <>
            <div className={styles.LayoutBlogDefault_container}>
                <div className={styles.LayoutBlogDefault_content}>
                    {
                        blog &&
                        <>
                            <div className={styles.top}>
                                <div className={styles.wrap_content}
                                    dangerouslySetInnerHTML={{ __html: blog?.title }}
                                >
                                </div>
                            </div>
                            <div className={styles.bottom}>
                                <div className={styles.wrap_media}>
                                    {
                                        blog?.videoBlog && blog?.videoBlog?.idDrive !== '' &&
                                        <div className={styles.video}>
                                            <video src={linkVideoDrive + blog?.videoBlog?.idDrive}
                                                controls
                                            ></video>
                                        </div>
                                    }
                                    {
                                        blog?.videoBlog && blog?.videoBlog?.idDrive === '' &&
                                        <div className={styles.video}>
                                            <iframe src={blog?.videoBlog?.video} frameborder="0">

                                            </iframe>
                                        </div>
                                    }
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
                                                        alt='sfsdf'
                                                        width={600}
                                                        height={400}
                                                        data-fancybox={`gallery` + idRoot}
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
                                <div className={styles.footer}>
                                    <Link href={`/blogs/detail-blog/${blog.id}`} className={styles.see}>
                                        Xem Bài viết
                                    </Link>
                                    <Link href={`/blogs/blog-user/${blog?.User?.id}`} className={styles.name}>
                                        {
                                            blog?.User?.firstName + ' ' + blog?.User?.lastName
                                        }
                                    </Link>
                                    <Link href={`/blogs/blog-user/${blog?.User?.id}`} className={styles.avatar}
                                        style={renderAvatarUser(blog?.User)}
                                    ></Link>
                                </div>
                            </div>
                        </>
                    }
                    {
                        !blog &&
                        <div className={styles.noData}>
                            Bài viết được chia sẻ không còn tồn tại
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default React.memo(LayoutBlogDefault)