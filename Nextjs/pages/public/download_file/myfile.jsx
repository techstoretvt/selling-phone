import Head from "next/head"
import styles from '../../../styles/public/download_file/downloadFile.module.scss'
import HeaderBottom from "../../../components/home/HeaderBottom"
import FooterHome from "../../../components/home/FooterHome"

const MyFile = () => {

   return (
      <>
         <Head>
            <title>Tệp của tôi</title>
         </Head>
         <HeaderBottom />
         <div className={styles.MyFile_container}>
            <div className={styles.MyFile_content}>
               <div className={styles.wrap_file}>

               </div>
            </div>
         </div>
         <FooterHome />
      </>
   )
}

export default MyFile