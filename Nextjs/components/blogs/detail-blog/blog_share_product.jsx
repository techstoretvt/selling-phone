import React, { useEffect } from 'react'
import { useState } from 'react'
import styles from '../../../styles/blogs/detail-blog/blog_share_product.module.scss'
import { getBlogShareProduct } from '../../../services/appService'
import moment from 'moment'
import Fancybox from '../../../components/product/Fancybox'
import Link from 'next/link'
import Image from 'next/image'

const linkVideoDrive = process.env.RACT_APP_LNK_VIDEO_DRIVE

const BlogShareProduct = ({ blog }) => {
    const [blogShare, setBlogShare] = useState('')

    useEffect(() => {
        getBlogShare()
    }, [blog])

    const getBlogShare = async () => {
        if (!blog) return
        let id = blog['blogs-blogShares-parent']['blogs-blogShares-child']?.id || ''
        let res = await getBlogShareProduct({ idBlog: id })
        if (res && res.errCode === 0) {
            setBlogShare(res.data)
        }
    }

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
        <div className={styles.BlogShareDefault_container}>
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
            <div className={styles.text}
                dangerouslySetInnerHTML={{ __html: blog?.contentHTML?.replaceAll('\n', '<br/>') }}
            ></div>
            <div className={styles.blog_child}>
                {
                    blogShare &&
                    <>
                        <div className={styles.header}>
                            <Link href={`/blogs/blog-user/${blogShare?.User?.id}`} className={styles.left}
                                style={renderAvatarUser(blogShare?.User)}
                            ></Link>
                            <div className={styles.right}>
                                <Link href={`/blogs/blog-user/${blogShare?.User?.id}`} className={styles.name}>
                                    {blogShare?.User?.firstName + ' ' + blogShare?.User?.lastName}
                                </Link>
                                <div className={styles.time}>
                                    {renderTime(blogShare?.createdAt)}
                                </div>
                            </div>
                        </div>
                        <div className={styles.text}
                            dangerouslySetInnerHTML={{ __html: blogShare?.contentHTML?.replaceAll('\n', '<br/>') }}
                        ></div>
                        <div className={styles.media}>
                            <div className={styles.nameProduct}>
                                <Link href={`/product/${blogShare['blogs-blogShares-parent']?.product?.id}`} className={styles.text}>
                                    {
                                        blogShare['blogs-blogShares-parent']?.product?.nameProduct
                                    }
                                </Link>
                            </div>
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
                                        blogShare['blogs-blogShares-parent']?.product['imageProduct-product']?.map(item => {
                                            return (
                                                <Image key={item.id}
                                                    // style={{ backgroundImage: `url(${item.imagebase6})` }}
                                                    src={item.imagebase6}
                                                    alt='sfsdf'
                                                    width={600}
                                                    height={400}
                                                    className={styles.image}
                                                    data-fancybox={`gallery`}
                                                    data-src={item.imagebase6}
                                                    data-thumb={item.imagebase6}
                                                    data-width={10000}
                                                    data-height={10000}
                                                ></Image>
                                            )
                                        })
                                    }
                                </Fancybox>
                            </div>
                        </div>
                        <Link href={`/blogs/detail-blog/${blogShare?.id}`} style={{ marginTop: '10px', width: 'fit-content' }}>
                            Xem bài viết
                        </Link>
                    </>
                }
                {
                    !blogShare &&
                    <div className={styles.noData}>
                        Bài viết không còn tồn tại
                    </div>
                }
            </div>
        </div>
    )
}

export default React.memo(BlogShareProduct)