import React from 'react';

import styles from '../../styles/app/dowload.module.scss';

const listFile = [
    {
        title: 'Downdoad TechStoreTvT',
        sub: 'Mở bằng trình duyệt để tải',
        file: '/files/app.apk',
        version: "1.0"
    },
    {
        title: 'Downdoad Music App',
        sub: 'Mở bằng trình duyệt để tải',
        file: '/files/music-app.apk',
        version: '3/11'
    }
]

export default function dowload() {
    return (
        <div className={styles.container}>

            {
                listFile.map((item, index) => (
                    <div key={index} className={styles.wrapItem}>
                        <div className={styles.title}>{item.title}</div>
                        <div
                            style={{ color: '#737373', textAlign: 'center', fontSize: 12 }}
                        >
                            {item.sub}
                        </div>
                        <div className={styles.wrapFile}>
                            <a href={item.file} className={styles.btnDownload}>
                                Tải xuống
                            </a>
                        </div>
                        <div style={{ color: '#fff' }}>Version: {item.version}</div>
                    </div>
                ))
            }
        </div>
    );
}
