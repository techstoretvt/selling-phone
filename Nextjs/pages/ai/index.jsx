import Head from 'next/head';
import HeaderBottom from '../../components/home/HeaderBottom';
import FooterHome from '../../components/home/FooterHome';
import styles from '../../styles/ai/nhandang.module.scss';
import Script from 'next/script';
import Image from 'next/image';
import { useRef, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import classNames from 'classnames';

const NhanDang = () => {
    const image = useRef();
    const video = useRef();
    const [urlImage, setUrlImage] = useState('');
    const [urlVideo, setUrlVideo] = useState('');
    const [listImage, setListImage] = useState([]);
    const [name, setName] = useState('');
    const [confidence, setConfidence] = useState('');
    const [loading, setLoading] = useState(false);
    const intervalVideo = useRef();
    const [listNameVideo, setListNameVideo] = useState([]);

    const handleStart = () => {
        setName('');
        setConfidence('');
        setLoading(true);
        const classifier = ml5.imageClassifier('MobileNet');
        classifier.classify(image.current, gotResult);

        // Function to run when results arrive
        function gotResult(error, results) {
            // const element = document.getElementById("result");
            if (error) {
                console.log(error);
                alert('Có lỗi xảy ra!');
                setLoading(false);
            } else {
                let num = results[0].confidence * 100;
                console.log(
                    results[0].label + '<br>Confidence: ' + num.toFixed(2) + '%'
                );
                setName(results[0].label);
                setConfidence(num.toFixed(2) + '%');
                setLoading(false);
            }
        }
    };

    const handleChangeInput = (e) => {
        let file = e.target.files[0];
        URL.revokeObjectURL(urlImage);
        let url = URL.createObjectURL(file);
        setUrlImage(url);
    };

    const onChangeImage = (imageList, addUpdateIndex) => {
        // console.log(imageList[0].data_url);
        setUrlImage(imageList[0].data_url);
        // setListImage(imageList);

        handleStart();
    };

    const handleUpVideo = (e) => {
        if (!e.target.files) return;
        let file = e.target.files[0];

        if (file) {
            URL.revokeObjectURL(urlVideo);
            let url = URL.createObjectURL(file);
            setUrlVideo(url);
        }
    };

    const handleOnPlay = () => {
        setListNameVideo([]);
        intervalVideo.current = setInterval(() => {
            const canvas = document.createElement('canvas');
            canvas.width = video.current.videoWidth;
            canvas.height = video.current.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video.current, 0, 0, canvas.width, canvas.height);

            const url = canvas.toDataURL();
            const imgElement = document.createElement('img');
            imgElement.src = url;

            const classifier = ml5.imageClassifier('MobileNet');
            classifier.classify(imgElement, gotResult);

            // Function to run when results arrive
            function gotResult(error, results) {
                // const element = document.getElementById("result");
                if (error) {
                    console.log(error);
                    alert('Có lỗi xảy ra!');
                    setLoading(false);
                } else {
                    let num = results[0].confidence * 100;

                    if (num > 15) {
                        console.log(
                            results[0].label +
                                '<br>Confidence: ' +
                                num.toFixed(2) +
                                '%'
                        );
                        setListNameVideo((prev) => {
                            let arr = [...prev];
                            if (!arr.includes(results[0].label)) {
                                arr.push(results[0].label);
                                return arr;
                            } else return prev;
                        });
                    }
                }
            }
        }, 1500);
    };

    const handleOnPause = () => {
        clearInterval(intervalVideo.current);
    };

    return (
        <>
            <Head>
                <title>Nhận dạng hình ảnh</title>
            </Head>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.min.js" />
            <Script src="https://unpkg.com/ml5@latest/dist/ml5.min.js" />
            <HeaderBottom smaillIcon={true} />
            <div className={styles.NhanDang_container}>
                <div className={styles.NhanDang_content}>
                    <div className={styles.header}>
                        <div
                            className={styles['glitch']}
                            data-text="Nhận dạng hình ảnh"
                        >
                            Nhận dạng hình ảnh
                        </div>
                    </div>
                    <div className={styles.description}>
                        Nhận dạng những thứ có trong hình ảnh
                    </div>

                    <ImageUploading
                        multiple
                        // value={listImage}
                        onChange={onChangeImage}
                        maxNumber={1}
                        dataURLKey="data_url"
                    >
                        {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                        }) => (
                            <>
                                <div
                                    className={classNames(styles.wrap_image, {
                                        [styles.drap]: isDragging,
                                        [styles.isImage]: urlImage !== '',
                                    })}
                                    onClick={() =>
                                        !urlImage
                                            ? onImageUpload()
                                            : onImageUpdate(0)
                                    }
                                    {...dragProps}
                                >
                                    <div
                                        className={classNames(styles.image, {
                                            [styles.show]: urlImage !== '',
                                        })}
                                    >
                                        <Image
                                            ref={image}
                                            alt="sfsdf"
                                            src={urlImage}
                                            width={200}
                                            height={200}
                                        />
                                    </div>

                                    {loading && (
                                        <div className={styles.loading}>
                                            <section
                                                className={styles['loader']}
                                            >
                                                <div
                                                    className={styles['slider']}
                                                    style={{ ['--i']: '0' }}
                                                ></div>
                                                <div
                                                    className={styles['slider']}
                                                    style={{ ['--i']: '1' }}
                                                ></div>
                                                <div
                                                    className={styles['slider']}
                                                    style={{ ['--i']: '2' }}
                                                ></div>
                                                <div
                                                    className={styles['slider']}
                                                    style={{ ['--i']: '3' }}
                                                ></div>
                                                <div
                                                    className={styles['slider']}
                                                    style={{ ['--i']: '4' }}
                                                ></div>
                                            </section>
                                        </div>
                                    )}
                                    {!urlImage && (
                                        <div className={styles.title}>
                                            Click hoặc kéo thả ảnh vào đây
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </ImageUploading>

                    {name && confidence && (
                        <div className={styles.result}>
                            <div className={styles.name}>Tên: {name}</div>
                            <div className={styles.Confidence}>
                                Độ tin cậy: {confidence}
                            </div>
                        </div>
                    )}

                    <div className={styles.wrap_video}>
                        <div className={styles.group}>
                            <div className={styles.video}>
                                <video
                                    ref={video}
                                    src={urlVideo}
                                    controls
                                    onPlay={handleOnPlay}
                                    onPause={handleOnPause}
                                ></video>
                            </div>
                            <label className={styles.btn}>
                                Chọn video
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleUpVideo}
                                    accept="video/mp4"
                                />
                            </label>
                        </div>
                        {listNameVideo?.length > 0 && (
                            <div className={styles.listName}>
                                <ul>
                                    {listNameVideo.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <FooterHome />
        </>
    );
};

export default NhanDang;
