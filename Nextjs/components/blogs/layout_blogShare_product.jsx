import React, { useEffect, useState } from 'react';
import styles from '../../styles/blogs/layout_blog_product.module.scss'
import { getBlogShareProduct } from '../../services/appService'
import Link from 'next/link';
import Fancybox from '../../components/product/Fancybox'
import Image from 'next/image';

const LayoutBlogProduct = ({ id, idRoot }) => {
    const [blog, setBlog] = useState('')

    useEffect(() => {
        getBlog()
    }, [id])

    const getBlog = async () => {
        if (!id) return;
        let res = await getBlogShareProduct({
            idBlog: id
        })
        if (res && res.errCode === 0)
            setBlog(res.data)
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
            <div className={styles.shareBlog_product}>
                {
                    blog &&
                    <>
                        <div className={styles.top}>
                            <div className={styles.wrap_content}
                                dangerouslySetInnerHTML={{ __html: blog?.title || blog?.textShare?.replaceAll('\n', '<br/>') }}
                            >
                            </div>
                        </div>
                        <div className={styles.bottom}>
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
                                    blog['blogs-blogShares-parent']?.product['imageProduct-product']?.length > 0 &&
                                    blog['blogs-blogShares-parent']?.product['imageProduct-product']?.map(item => {

                                        return (
                                            <Image key={item.id} className={styles.img}
                                                style={{ backgroundImage: `url(${item.imagebase6})` }}
                                                src={item.imagebase6}
                                                alt='sfsdf'
                                                width={600}
                                                height={400}
                                                data-fancybox={`gallery` + idRoot}
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
                        <Link href={`/product/${blog['blogs-blogShares-parent']?.product?.id}`} className={styles.nameProduct}>
                            {
                                blog['blogs-blogShares-parent']?.product?.nameProduct
                            }
                        </Link>
                        <div className={styles.footer}>
                            <Link
                                href={`/blogs/detail-blog/${blog?.id}`}
                                className={styles.see}> Xem Bài viết</Link>
                            <Link href={`/blogs/blog-user/${blog?.User?.id}`} className={styles.name}>
                                {
                                    blog?.User?.firstName + ' ' + blog?.User?.lastName
                                }
                            </Link>
                            <Link href={`/blogs/blog-user/${blog?.User?.id}`} className={styles.avatar}
                                style={renderAvatarUser(blog?.User)}
                            ></Link>
                        </div>
                    </>
                }
                {
                    !blog &&
                    <div className={styles.noData}>
                        Bài viết không còn tồn tại
                    </div>
                }
            </div>
        </>
    )
}

export default React.memo(LayoutBlogProduct)