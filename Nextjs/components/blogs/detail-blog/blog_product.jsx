import moment from 'moment'
import styles from '../../../styles/blogs/detail-blog/blog_product.module.scss'
import React from 'react'
import Link from 'next/link'
import Fancybox from '../../../components/product/Fancybox'
import Image from 'next/image'

const BlogProduct = ({ blog }) => {

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
        <div className={styles.BlogProduct_container}>
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
            <div
                className={styles.nameProduct}>
                <Link href={`/product/${blog['blogs-blogShares-parent']?.product?.id}?name=${blog['blogs-blogShares-parent']?.product?.nameProduct}`} className={styles.text}>
                    {
                        blog['blogs-blogShares-parent']?.product?.nameProduct
                    }
                </Link>

            </div>
            <div className={styles.media}>
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
                        blog['blogs-blogShares-parent']?.product['imageProduct-product']?.map(item => {
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
    )
}

export default React.memo(BlogProduct)