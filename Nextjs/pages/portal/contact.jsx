import Head from "next/head";
import HeaderBottom from "../../components/home/HeaderBottom";
import FooterHome from "../../components/home/FooterHome";
import styles from "../../styles/portal/contact.module.scss";
import { Input, Button } from "antd";
import { useState } from "react";
const { TextArea } = Input;
import { useMediaQuery } from "react-responsive";
import { sendEmailfromContact } from "../../services/userService";
import { toast } from "react-toastify";
import Background from "../../components/background";
import {
  sdtContact,
  emailContact,
  addressContact,
} from "../../utils/constants";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [content, setContent] = useState("");
  const isScreen600 = useMediaQuery({ query: "(max-width: 600px)" });

  const handleSendEmail = async () => {
    let data = {
      name,
      email,
      sdt,
      content,
    };

    let res = await sendEmailfromContact(data);
    if (res?.errCode === 0) {
      setName("");
      setEmail("");
      setSdt("");
      setContent("");
    } else if (res?.errCode === 1) {
      toast.warning("Vui lòng điền đầy đủ thông tin");
    } else {
      toast.error(res?.errMessage);
    }
  };

  return (
    <>
      <Head>
        <title>Liên hệ</title>
      </Head>
      <HeaderBottom hideSearch={false} />
      <div className={styles.ContactPage_container}>
        <div className={styles.ContactPage_content}>
          <div className={styles.left}>
            <div className={styles.top}>
              <h3>Thông tin liên hệ</h3>
              <div className={styles.group}>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <div className={styles.icon}>
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <h4>Địa chỉ</h4>
                    <p>{addressContact}</p>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <div className={styles.icon}>
                      <i className="fa-solid fa-calendar-days"></i>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <h4>Thời gian làm việc</h4>
                    <p>
                      Thứ 2 đến Thứ 6: từ 8h đến 18h; Thứ 7 và Chủ nhật: từ 8h00
                      đến 17h00
                    </p>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <div className={styles.icon}>
                      <i className="fa-solid fa-phone"></i>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <h4>Điện thoại</h4>
                    <p>{sdtContact}</p>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.left}>
                    <div className={styles.icon}>
                      <i className="fa-regular fa-envelope"></i>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <h4>Email</h4>
                    <p>{emailContact}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.bottom}>
              <h3>Gửi thắc mắc cho chúng tôi</h3>
              <p>
                Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và
                chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể .
              </p>
              <div className={styles.form}>
                <Input
                  placeholder="Tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className={styles.wrapInput}>
                  <Input
                    placeholder="Email của bạn"
                    style={{
                      width: isScreen600 ? "100%" : "48%",
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Số điện thoại của bạn"
                    style={{
                      width: isScreen600 ? "100%" : "48%",
                    }}
                    value={sdt}
                    onChange={(e) => setSdt(e.target.value)}
                  />
                </div>
                <TextArea
                  showCount
                  maxLength={500}
                  style={{
                    marginBottom: 24,
                  }}
                  placeholder="Nội dung"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Button onClick={handleSendEmail} type="primary">
                  Gửi cho chúng tôi
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.1078237348947!2d105.72025667370532!3d10.007951772900604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08903d92d1d0d%3A0x2c147a40ead97caa!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBOYW0gQ-G6p24gVGjGoQ!5e0!3m2!1svi!2s!4v1687337876328!5m2!1svi!2s"
              // width="600"
              // height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <Background />
      <FooterHome />
    </>
  );
};

export default ContactPage;
