import Head from "next/head"
import styles from '../../styles/public/files.module.scss'

import Link from "next/link"

const FilePage = () => {

    return <>
        <Head>
            <title>Files</title>
        </Head>
        <div className={styles.FilePage_container}>
            <div className={styles.FilePage_content}>
                <Link href={'/files/Ke Hoach Do An 1.pdf'} className={styles.item}>
                    Kế hoạch đồ án
                </Link>
                <Link href={'/files/NỘI DUNG ĐỒ ÁN.pdf'} className={styles.item}>
                    Nội dung đồ án
                </Link>
            </div>
        </div>




        <div className={"bg-home"}>
            <div className={"area"} >
                <ul className={"circles"}>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div >
        </div>
    </>
}

export default FilePage