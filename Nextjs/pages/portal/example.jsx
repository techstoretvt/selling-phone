import Head from "next/head"
import styles from '../../styles/portal/portal.module.scss'
import HeaderBottom from '../../components/home/HeaderBottom'
import FooterHome from '../../components/home/FooterHome'


const Example = () => {

    return (
        <>
            <Head>
                <title>Ví dụ</title>
            </Head>
            <HeaderBottom />
            <div className={styles.Portal_container}>



            </div>
            <FooterHome />
        </>
    )
}

export default Example