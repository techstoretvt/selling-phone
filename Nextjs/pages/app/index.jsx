import React from 'react';
import { QRCode } from 'antd';

import styles from '../../styles/app/index.module.scss';

export default function index() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>Quét mã QR</div>
            <div className={styles.wrapQr}>
                <QRCode
                    value={process.env.REACT_APP_FRONTEND_URL + '/app/download'}
                    style={{
                        marginBottom: 5,
                        marginTop: 5,
                    }}
                    size={300}
                />
            </div>
        </div>
    );
}
