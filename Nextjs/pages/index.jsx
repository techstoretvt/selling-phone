import Head from 'next/head';
import styles from '../styles/StartServer.module.scss';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { checkStartServer } from '../services/appService';
import Link from 'next/link';
import { initNotifications, notify } from '@mycv/f8-notification';
import { useRouter } from 'next/router';
import { nameWeb } from '../utils/constants';

const StartServer = () => {
    const [numberResult, setNumberResult] = useState(1234);
    const [count, setCount] = useState(0);
    const [arrNumber, setArrNumber] = useState([]);
    const [valueInput, setValueInput] = useState('');
    const [isPlay, setIsPlay] = useState(false);
    const [isStartServer, setIsStartServer] = useState(false);
    const router = useRouter();

    useEffect(() => {
        handleCheckStartServer();
        initNotifications({ cooldown: 3000 });
    }, []);

    const handleCheckStartServer = async () => {
        let res = await checkStartServer();
        if (res?.errCode === 0) {
            setIsStartServer(true);
            notify(`Server ${nameWeb} đã hoạt động`, {
                body: 'Bạn đã có thể truy cập vào website :)',
            });
            router.push('/home');
        }
    };

    const checkArr = (arr) => {
        let dem = 0;
        for (let i = 0; i < arr?.length; i++) {
            dem = 0;
            for (let j = 0; j < arr?.length; j++) {
                if (arr[i] === arr[j]) dem++;
            }
            if (dem > 1) return false;
        }
        return true;
    };

    const handleOnchangeInput = (e) => {
        try {
            let number = e.target.value * 1;
            if (typeof number === 'number' && number < 10000) {
                let arrTam = number.toString().split('');
                if (checkArr(arrTam)) setValueInput(number);
            } else if (number === 0) {
                setValueInput('');
            } else {
                setValueInput('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        if (valueInput === '' || valueInput < 1000) return;
        if (count <= 15) {
            console.log(count);
            if (valueInput === numberResult) {
                //success
                Swal.fire({
                    icon: 'success',
                    title: 'Win',
                    text: numberResult,
                });
                //reload
                setIsPlay(false);
                setValueInput('');
                setCount(0);
                return;
            }
            if (count === 14) {
                setIsPlay(false);
                Swal.fire({
                    // icon: 'success',
                    title: 'Game Over',
                    text: numberResult,
                });
            }
            let arrTam = [...arrNumber];
            arrTam.push(valueInput);
            setArrNumber(arrTam);
            setValueInput('');
            setCount((pre) => pre + 1);
        } else {
            setCount(0);
            setIsPlay(false);
            setValueInput('');
        }
    };

    const checkDocument = (item) => {
        let arrResult = numberResult.toString().split('');
        let arrValue = item.toString().split('');
        let dem = 0;
        for (let i = 0; i < arrValue.length; i++) {
            if (arrResult.includes(arrValue[i])) dem++;
        }
        return dem;
    };

    const checkPositon = (item) => {
        let arrResult = numberResult.toString().split('');
        let arrValue = item.toString().split('');

        let dem = 0;
        for (let i = 0; i < arrValue?.length; i++) {
            if (arrResult[i] === arrValue[i]) dem++;
        }
        return dem;
    };

    const handlePlay = () => {
        setIsPlay(true);
        setValueInput('');
        setCount(0);
        setArrNumber([]);
        let number = generateRandomNumber();
        setNumberResult(number);
    };

    function generateRandomNumber() {
        let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Tất cả các chữ số có thể được sử dụng
        let result = ''; // Chuỗi kết quả

        // Lặp 4 lần để chọn ngẫu nhiên một chữ số và loại bỏ nó khỏi mảng digits
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length); // Chọn ngẫu nhiên một chỉ mục trong mảng digits
            const digit = digits[randomIndex]; // Lấy giá trị chữ số tại chỉ mục này
            result += digit.toString(); // Thêm giá trị chữ số này vào chuỗi kết quả
            digits.splice(randomIndex, 1); // Loại bỏ chữ số đã chọn khỏi mảng digits
        }

        return result * 1; // Trả về số ngẫu nhiên với 4 chữ số không trùng nhau
    }

    return (
        <>
            <Head>
                <title>TechStore Start</title>
                <meta
                    name="viewport"
                    content="width=device-width,user-scalable=no"
                />
            </Head>
            <div className={styles.StartServer_container}>
                <div className={styles.loader}>
                    {/* <div className={styles["loader"]}>
            <div className={styles["dots"]}>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
            </div>
            <div className={styles["dots"]}>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
            </div>
            <div className={styles["dots"]}>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
            </div>
            <div className={styles["dots"]}>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
            </div>
            <div className={styles["dots"]}>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
            </div>
            <div className={styles["dots"]}>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
              <div className={styles["dot"]}></div>
            </div>
          </div> */}
                    <div className="">
                        {isStartServer ? (
                            <>
                                <Link href={'/home'}>
                                    Server đã khởi động, đang chuyển sang trang
                                    chủ
                                </Link>
                            </>
                        ) : (
                            'Server đang khởi động'
                        )}
                    </div>
                </div>
                {/* <div className={styles.wrap_game}>
          <div className={styles.header}>
            Game Đoán Số
          </div>
          {isPlay ? (
            <div className={styles.content}>
              <div className={styles.left}>
                <div className={styles.row}>
                  <div className={styles.stt}>STT</div>
                  <div className={styles.number + " " + styles.title}>
                    Number
                  </div>
                  <div className={styles.count}>Đúng</div>
                  <div className={styles.position}>Vị trí</div>
                </div>
                {arrNumber.map((item, index) => {
                  return (
                    <div key={index} className={styles.row}>
                      <div className={styles.stt}>{index + 1}</div>
                      <div className={styles.number}>{item}</div>
                      <div className={styles.count}>{checkDocument(item)}</div>
                      <div className={styles.position}>
                        {checkPositon(item)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.right}>
                <input
                  value={valueInput}
                  onChange={handleOnchangeInput}
                  placeholder="Nhập số..."
                  type="text"
                  maxLength={4}
                />
                <button onClick={handleSubmit}>OK</button>
              </div>
            </div>
          ) : (
            <div className={styles.btn_play} onClick={() => handlePlay()}>
              CHƠI
            </div>
          )}
        </div> */}
            </div>
        </>
    );
};

export default StartServer;
