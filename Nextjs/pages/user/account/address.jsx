import Head from 'next/head'
import { useRouter } from 'next/router';
import LayoutAccount from '../../../components/user/account/layoutAccount'
import styles from '../../../styles/user/account/address.module.scss'
import { getAddressUser, setDefaultAddress, deleteAddresUser, addNewAddressUser, editAddressUser } from '../../../services/userService'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import provinces from '../../../services/provinces.json'
import classNames from 'classnames';
import { Form, Input, Modal, Select } from 'antd';
import Swal from 'sweetalert2'
import LoadingBar from 'react-top-loading-bar'

const options1 = provinces.map((item, index) => {
    return {
        name: item.name,
        value: index
    }
})

const AddressUser = () => {
    const router = useRouter()
    const { sub } = router.query;
    const [listAddress, setListAddress] = useState([])
    const accessToken = useSelector(state => state.user.accessToken)
    const [idCountry, setIdCountry] = useState('');
    const [idDistrict, setIdDistrict] = useState('');
    const [listDistrict, setListDistrict] = useState([])
    const [openModaAddAddress, setOpenModalAddAddress] = useState(false)
    const [nameAddress, setNameAddress] = useState('')
    const [nameUser, setNameUser] = useState('')
    const [sdtUser, setSdtUser] = useState('')
    const [addressText, setAddressText] = useState('')
    const [typeModal, setTypeModal] = useState('add')
    const [currentIdAddress, setCurrentIdAddress] = useState('')
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        getListAddressUser()
    }, [])
    useEffect(() => {
        handleSetListDistrict()

    }, [idCountry])

    const getListAddressUser = async () => {
        setProgress(90)
        let res = await getAddressUser(accessToken)
        if (res && res.errCode === 0) {
            setListAddress(res.data)
            setProgress(100)
        }
    }

    const renderCountry = (country, district) => {
        let nameCountry = provinces[country].name
        let nameDistrict = provinces[country].districts[district].name
        return nameDistrict + ' - ' + nameCountry
    }

    const HandleSetDefaultAddress = async (id) => {
        let res = await setDefaultAddress({ accessToken, id })
        if (res && res.errCode === 0) {
            getListAddressUser();
        }
    }

    const handleDeleteAddress = async (id) => {
        let res = await deleteAddresUser({ accessToken, id })
        if (res && res.errCode === 0) {
            getListAddressUser();
        }
    }
    const handleChangeCountry = (value) => {
        setIdCountry(value)
        setIdDistrict('')
    }
    const handleChangeDistrict = (value) => {
        setIdDistrict(value)
    }
    const handleSetListDistrict = () => {
        if (idCountry === '') {
            setListDistrict([])
            return
        }
        let arr = provinces[idCountry]?.districts
        let options = arr?.map((item, index) => {
            return {
                name: item.name,
                value: index
            }
        })

        setListDistrict(options)
    }

    const handleAddAddress = async () => {
        if (!nameAddress || !nameUser || !sdtUser || !addressText || !idCountry || !idDistrict) {
            Swal.fire({
                icon: 'warning',
                title: 'Khoan',
                text: 'Vui lòng điền đầy đủ thông tin!',
            })
            return;
        }

        var regex = /^\d{10,}$/;
        if (!regex.test(sdtUser)) {
            Swal.fire({
                icon: 'warning',
                title: 'Chú ý',
                text: 'Số điện thoại không đúng định dạng!',
            })
            return
        }

        if (typeModal === 'add') {
            let data = {
                country: idCountry,
                district: idDistrict,
                nameAddress,
                nameUser,
                addressText,
                sdtUser,
                accessToken
            }

            let res = await addNewAddressUser(data)
            if (res && res.errCode === 0) {
                getListAddressUser();
                setOpenModalAddAddress(false)
                setIdCountry('')
                setIdDistrict('')
                setNameAddress('')
                setNameUser('')
                setAddressText('')
                setSdtUser('')
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Sorry',
                    text: res?.errMessage || 'Lỗi rồi, Vui lòng tải lại trang và thử lại!',
                })
            }
        }

        else {
            let data = {
                country: idCountry,
                district: idDistrict,
                nameAddress,
                nameUser,
                addressText,
                sdtUser,
                accessToken,
                id: currentIdAddress
            }
            let res = await editAddressUser(data)
            if (res && res.errCode === 0) {
                getListAddressUser();
                setOpenModalAddAddress(false)
                setIdCountry('')
                setIdDistrict('')
                setNameAddress('')
                setNameUser('')
                setAddressText('')
                setSdtUser('')
                setCurrentIdAddress('')
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Sorry',
                    text: res?.errMessage || 'Lỗi rồi, Vui lòng tải lại trang và thử lại!',
                })
            }
        }

    }

    const handleCancelModal = () => {
        setOpenModalAddAddress(false)
        setTypeModal('add')
        setCurrentIdAddress('')

        setIdCountry('')
        setIdDistrict('')
        setNameAddress('')
        setNameUser('')
        setAddressText('')
        setSdtUser('')
    }

    const setEditAddress = (item) => {
        setTypeModal('edit')
        setOpenModalAddAddress(true)
        setCurrentIdAddress(item.id)

        setNameAddress(item.nameAddress)
        setNameUser(item.fullname)
        setSdtUser(item.sdt)
        setIdCountry(+item.country)
        setIdDistrict(+item.district)
        setAddressText(item.addressText)

    }

    return (
        <>
            <Head>
                <title>Tài khoản</title>
            </Head>
            <LoadingBar
                color='#5885E6'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <LayoutAccount sub={sub}>
                <div className={styles.addressUser_container}>
                    <div className={styles.addressUser_content}>
                        <div className={styles.header}>
                            <div className={styles.left}>Địa chỉ của tôi</div>
                            <div className={styles.right}>
                                <i className="fa-solid fa-plus"></i>
                                <div className={styles.textBtn}
                                    onClick={() => setOpenModalAddAddress(true)}
                                >Thêm địa chỉ mới</div>
                            </div>
                        </div>
                        <div className={styles.list_address}>
                            {
                                listAddress &&
                                listAddress.map(item => {
                                    return (
                                        <div key={item.id} className={styles.wrap_address}>
                                            <div className={styles.left}>
                                                <div className={styles.nameAddress}>{item.nameAddress}</div>
                                                <div className={styles.nameAndSdt}>
                                                    <div className={styles.name}>{item.fullname}</div>
                                                    <div className={styles.sdt}>{item.sdt}</div>
                                                </div>
                                                <div className={styles.addressText}>
                                                    {item.addressText}
                                                </div>
                                                <div className={styles.country}>
                                                    {renderCountry(item.country, item.district)}
                                                </div>
                                                <div className={classNames(styles.btn, { [styles.active]: item.isDefault === 'true' })}>
                                                    Mặt định
                                                </div>
                                            </div>
                                            <div className={styles.right}>
                                                <div className={styles.text} onClick={() => setEditAddress(item)}>
                                                    Cập nhật
                                                </div>
                                                <div className={classNames(styles.text, { [styles.hide]: item.isDefault === 'true' })}
                                                    onClick={() => handleDeleteAddress(item.id)}
                                                >
                                                    Xóa
                                                </div>
                                                <div className={classNames(styles.btn, { [styles.hide]: item.isDefault === 'true' })}
                                                    onClick={() => HandleSetDefaultAddress(item.id)}
                                                >
                                                    Thiết lập mặt định
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <Modal
                        title={typeModal === 'add' ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
                        style={{
                            top: '20px',
                        }}
                        open={openModaAddAddress}
                        onOk={() => handleAddAddress()}
                        onCancel={() => handleCancelModal()}
                    >
                        <Form.Item label="Tên địa chỉ">
                            <Input value={nameAddress} onChange={(e) => setNameAddress(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Họ và tên">
                            <Input value={nameUser} onChange={(e) => setNameUser(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Số điện thoại">
                            <Input value={sdtUser} onChange={(e) => setSdtUser(e.target.value)} type='number' />
                        </Form.Item>
                        <Form.Item label="Tỉnh/TP">
                            <Select
                                onChange={handleChangeCountry}
                                value={idCountry}
                            >
                                {
                                    options1.map((item, index) => {
                                        return (
                                            <Select.Option key={index} value={item.value}>{item.name}</Select.Option>
                                        )
                                    })
                                }

                            </Select>
                        </Form.Item>
                        <Form.Item label="Quận/Huyện">
                            <Select
                                value={idDistrict}
                                onChange={handleChangeDistrict}
                            >
                                {
                                    listDistrict?.map((item, index) => {
                                        return (
                                            <Select.Option key={index} value={item.value}>{item.name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="Địa chỉ cụ thể">
                            <Input value={addressText} onChange={(e) => setAddressText(e.target.value)} />
                        </Form.Item>
                    </Modal>
                </div>
            </LayoutAccount>
        </>
    )
}
// export async function getServerSideProps() {
//     return { props: { data: 'sfsd' } }
// }
export default AddressUser