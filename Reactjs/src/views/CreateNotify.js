import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col
} from "react-bootstrap";
import { CheckAdminLogin, handleCheckLoginAdmin } from '../services/adminService'
import { useHistory } from 'react-router-dom';

import {
  createNotify_noimage, createNotify_image
} from "../services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from 'react-loading-overlay-ts';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';


function Notifycations() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [urlImage, setUrlImage] = useState('')
  const [fileImage, setFileImage] = useState(null)
  const [title, setTitle] = useState('')
  const [typeNotify, setTypeNotify] = useState('system')
  const [content, setContent] = useState('')
  const [link, setLink] = useState('/user/notifycations/system')
  const [showTime, setShowTime] = useState(false)
  const [timePost, setTimePost] = useState(0)


  const history = useHistory();
  useEffect(() => {
    handleCheckLoginAdmin('2')
  }, [])


  const notify = (place, color, content) => {
    // var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {content}
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  // notify("br", 4, 'Vui lòng nhập keyword')


  const handleUpImage = (e) => {
    // console.log(e);
    let file = e.target.files[0]

    URL.revokeObjectURL(urlImage)
    let url = URL.createObjectURL(file)

    setUrlImage(url)
    setFileImage(file)
  }

  const handleAddNotify = async () => {
    if (!title || !content || !typeNotify || !link) {
      notify("br", 4, 'Vui lòng điền đầy đủ thông tin!')
      return
    }

    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let data = {
      title,
      content,
      typeNotify,
      link,
      timePost,
      accessToken
    }

    if (fileImage !== null) {
      let form = new FormData()
      form.append('file', fileImage)
      let res = await createNotify_image(form, data)
      if (res?.errCode === 0) {
        notify("br", 2, 'Đã thêm thông báo')
        setTitle('')
        setTypeNotify('system')
        setContent('')
        setLink('/user/notifycations/system')
        setFileImage(null)
        URL.revokeObjectURL(urlImage)
        setUrlImage('')
        setShowTime(false)
        setTimePost(0)
      }
    }
    else {
      let res = await createNotify_noimage(data)
      console.log(res);
      if (res?.errCode === 0) {
        notify("br", 2, 'Đã thêm thông báo')
        setTitle('')
        setTypeNotify('system')
        setContent('')
        setLink('/user/notifycations/system')
        setShowTime(false)
        setTimePost(0)
      }
    }
  }

  const handleChangeTypeNotify = (e) => {
    setTypeNotify(e.target.value)
    setLink(`/user/notifycations/${e.target.value}`)
  }

  const onChangeTime = (value, dateString) => {
    let date = new Date(value)
    let timeCurrent = new Date().getTime()

    // console.log(date.getTime());
    setTimePost(date.getTime())

  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    let maxRangeDay = 10
    return current && current < dayjs().endOf('time') || current > dayjs().set('date', dayjs().get('date') + maxRangeDay);
  };

  const handleChangeTime = (e) => {
    setShowTime(e.target.checked)
  }

  return (
    <>
      <LoadingOverlay
        active={isShowLoading}
        spinner
        text='Đang xử lý...'
      >
        <Container fluid>
          <NotificationAlert ref={notificationAlertRef} />
          <Row>
            {/* List keyword */}
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Tạo thông báo mới</Card.Title>
                  <p className="card-category">
                    Thông báo đến người dùng trên website
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Row className="p-3">
                    <Col md="6">
                      <div className="form-group">
                        <h5>Tiêu đề thông báo <span style={{ color: 'red' }}>*</span></h5>
                        <input value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="form-control" />

                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <h5>Loại thông báo <span style={{ color: 'red' }}>*</span></h5>
                        <select value={typeNotify}
                          onChange={(e) => handleChangeTypeNotify(e)}
                          className="form-control">
                          <option value={'system'}>Hệ thống</option>
                          <option value={'promotion'}>Khuyến mãi</option>
                        </select>

                      </div>
                    </Col>
                    <Col md="12">
                      <div className="form-group">
                        <h5>Nội dung <span style={{ color: 'red' }}>*</span></h5>
                        <textarea value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={6} className="form-control" />

                      </div>
                    </Col>
                    <Col md="6">
                      <div className="form-group">
                        <h5>Đường dẫn liên kết <span style={{ color: 'red' }}>*</span></h5>
                        <input value={link} readOnly
                          onChange={(e) => setLink(e.target.value)}
                          className="form-control" />

                      </div>
                    </Col>
                    <Col md="12">
                      <div className="form-group mt-5">
                        <h5>Thêm ảnh (Không bắt buộc)</h5>
                        <input type="file" className="form-control-file mb-3"
                          onChange={handleUpImage}
                        />
                        {
                          urlImage &&
                          <img src={urlImage} height={100} />
                        }
                      </div>
                    </Col>
                    <Col md="12">
                      <div className="form-group mt-5">

                        <span >Hẹn giờ đăng</span>
                        <input style={{
                          transform: 'translateY(2px)'
                        }} className="mx-2" type="checkbox"
                          checked={showTime}
                          onChange={(e) => handleChangeTime(e)}
                        />

                        <br />
                        {
                          showTime &&
                          <DatePicker
                            showTime={{
                              format: 'HH:mm',
                            }}
                            format="DD-MM-YYYY HH:mm"
                            onChange={onChangeTime}
                            allowClear={false}
                            disabledDate={disabledDate}
                            inputReadOnly={true}
                            placeholder="Chọn thời gian"
                            showNow={false}
                            defaultValue={dayjs()}
                          />
                        }
                      </div>
                    </Col>
                  </Row>

                  <Col md="12">
                    <button className="btn btn-primary"
                      onClick={handleAddNotify}

                    >Thêm</button>
                  </Col>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </LoadingOverlay>
    </>
  );
}

export default Notifycations;
