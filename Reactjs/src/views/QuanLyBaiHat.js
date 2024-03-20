import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Table } from "react-bootstrap";

import {
  handleCheckLoginAdmin,
  layDsCaSiService,
  themBaiHat,
  layDsBaiHatService,
  xoaBaiHat,
  suaBaiHatService,
} from "../services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from "react-loading-overlay-ts";
import dayjs from 'dayjs';
import { Button, Modal, Input, U, Select, Spin, DatePicker } from "antd";
const { TextArea } = Input;

import { PlayCircleOutlined, UserOutlined, FontColorsOutlined, FileProtectOutlined } from "@ant-design/icons";

import BaiHatDefault from '../assets/audio/buong-tay.mp3';


function QuanLyBaiHat() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [urlImage, setUrlImage] = useState("");
  const [fileImage, setFileImage] = useState("");
  const [dsCaSi, setDsCaSi] = useState([]);
  const [linkMV, setLinhMV] = useState("");

  const [fileAudio, setFileAudio] = useState("");
  const [urlAudio, setUrlAudio] = useState("");
  const [loiBaiHat, setLoiBaiHat] = useState("");
  const [tenBaiHat, setTenBaiHat] = useState("");
  const [tenNhacSi, setTenNhacSi] = useState("");
  const [theLoai, setTheLoai] = useState("Việt Nam, V-Pop");
  const [nhaCungCap, setNhaCungcap] = useState("Youtube");
  const [ngayPhatHanh, setNgayPhatHanh] = useState("");
  const [loading, setLoading] = useState(false);
  const [dsBaiHat, setDsBaiHat] = useState([]);
  const [idEdit, setIdEdit] = useState("");
  const [durationAudio, setDurationAudio] = useState(0);

  const [currentListCaSi, setCurrentListCaSi] = useState([]);
  const [listHashTag, setListHashTag] = useState([]);
  const [valueSearch, setValueSearch] = useState("")

  useEffect(() => { }, []);

  useEffect(() => {
    handleCheckLoginAdmin("2");
    layDsCaSi();
    layDsBaiHat();
  }, []);

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
          <div>{content}</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const onUploadImage = async (files) => {
    let file = files[0];
    if (!file || !file.type.includes("image")) {
      return;
    }
    console.log(file);
    setFileImage(file);

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
      setUrlImage(reader.result);
    });
  };

  const layDsBaiHat = async () => {
    let res = await layDsBaiHatService();
    console.log(res);
    if (res?.errCode === 0) {
      setDsBaiHat(res.data);
    } else {
      notify("br", 3, res.errMessage);
    }
  };

  const layDsCaSi = async () => {
    let res = await layDsCaSiService();
    console.log(res);
    if (res?.errCode === 0) {
      let newArr = res.data.map(item => ({
        label: item.tenCaSi,
        value: item.id
      }))

      setDsCaSi(newArr);

    } else {
      notify("br", 3, res.errMessage);
    }
  };

  const onUploadFileAudio = async (files) => {
    let file = files[0];
    if (!file || !file.type.includes("audio")) {
      return;
    }
    setFileAudio(file);

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
      setUrlAudio(reader.result);
    });
  };

  const resetForm = () => {
    setTenBaiHat("");
    setLoiBaiHat("");
    setUrlAudio("");
    setFileAudio("");
    setUrlImage("");
    setFileImage("");
    setLinhMV("");
    setTenNhacSi("")
    setNgayPhatHanh("")
  };

  const handleThemBaiHat = async () => {
    console.log(loiBaiHat.replace("\n", ""));

    if (
      !tenBaiHat ||
      !loiBaiHat ||
      !fileAudio ||
      !fileImage ||
      !tenNhacSi ||
      !theLoai ||
      !nhaCungCap ||
      !ngayPhatHanh ||
      currentListCaSi.length === 0 ||
      loading
    ) {

      notify("br", 4, "Chưa đủ thông tin")
      return;
    }
    setLoading(true);
    let data = {
      tenBaiHat,
      loiBaiHat,
      thoiGian: durationAudio,
      linkMV: linkMV,
      tenNhacSi,
      theLoai,
      nhaCungCap,
      ngayPhatHanh,
      listIdCaSi: currentListCaSi
    };

    let form = new FormData();
    form.append("file", fileImage);
    form.append("file", fileAudio);

    let res = await themBaiHat(form, data);
    console.log(res);
    if (res?.errCode === 0) {

      let newArr = [...dsBaiHat];
      res.data.baiHat_caSis = currentListCaSi.map(casi => ({
        id: casi.value,
        tenCaSi: casi.tenCaSi
      }))
      newArr.unshift(res.data);
      setDsBaiHat(newArr);
      setOpenModal(false);
      resetForm();
    } else {
      notify("br", 3, res.errMessage);
    }

    setLoading(false);
  };

  const handleXoaBaiHat = async (id) => {
    notify("br", 4, "Tình năng xóa đã tạm khóa!")
    return;

    let res = await xoaBaiHat({ id });
    console.log(res);
    if (res?.errCode === 0) {
      let newArr = [...dsBaiHat];
      newArr = newArr.filter((item) => item.id !== id);
      setDsBaiHat(newArr);
    } else {
      notify("br", 3, res.errMessage);
    }
  };

  const handleSuaBaiHat = async () => {
    if (!tenBaiHat || !loiBaiHat || loading) {
      return;
    }
    setLoading(true);
    let data = {
      id: idEdit,
      tenBaiHat,
      loiBaiHat,
      linkMV,
    };

    let res = await suaBaiHatService(data);

    if (res?.errCode === 0) {
      let newArr = [...dsBaiHat];
      newArr.map(baihat => {
        if (baihat.id === idEdit) {
          baihat.tenBaiHat = res.data.tenBaiHat,
            baihat.linkMV = res.data.linkMV,
            baihat.loiBaiHat = res.data.loiBaiHat
        }
      })
      setDsBaiHat(newArr);
      resetForm();
      setOpenModal2(false);
    } else {
      notify("br", 3, res.errMessage);
    }

    setLoading(false);
  };

  const onLoadedDataAudio = (e) => {
    console.log(e);
    const duration = e.target.duration;
    setDurationAudio(duration * 1000);
    console.log(duration);
  };

  const handleChangeCurrentCaSi = (value) => {
    console.log(value);
    setCurrentListCaSi(value);
  };

  const handleFillter = (inputValue, option) => {
    return (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase());
  };

  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
    setNgayPhatHanh(dateString)
  };

  const onCancelModalEdit = () => {
    setOpenModal2(false);
    setTenBaiHat("");
    setLoiBaiHat("");
    setIdEdit("");
  }

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    notify("tr", 2, "Đã copy id")
  }

  return (
    <>
      <LoadingOverlay active={isShowLoading} spinner text="Đang xử lý...">
        <Container fluid>
          <NotificationAlert ref={notificationAlertRef} />
          <Row>
            {/* List keyword */}
            <Col md="12">
              <Card
                className="strpied-tabled-with-hover"
                style={{ padding: "10px" }}
              >
                <Card.Header>
                  <Card.Title as="h4">Quản lý bài hát</Card.Title>
                  <audio src={BaiHatDefault} autoPlay></audio>
                  <p className="card-category">
                    Vật chưa đạt đến độ dẻo dai có uốn cong sẽ gãy
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <input
                      className="form-control"
                      style={{ width: "200px", padding: "4px" }}
                      placeholder="Tìm kiếm ...."
                      value={valueSearch}
                      onChange={(e) => setValueSearch(e.target.value)}
                    />
                    <Button
                      type="primary"
                      onClick={() => {
                        setOpenModal(true);
                      }}
                    >
                      New
                    </Button>
                  </div>

                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-1">STT</th>
                        <th className="border-1">Tên bài hát</th>
                        <th className="border-1">Ảnh</th>
                        <th className="border-1">Ca sĩ</th>
                        <th className="border-1"></th>
                        <th className="border-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dsBaiHat?.map((item, index) => {
                        if (item.tenBaiHat.toLowerCase().includes(valueSearch.toLowerCase()))
                          return (
                            <tr key={item.id + index}>
                              <td
                                title="Copy id"
                                style={{ padding: '10px', cursor: 'pointer' }}
                                onClick={() => handleCopyId(item.id)}
                              >
                                {index + 1}
                              </td>
                              <td>{item.tenBaiHat} </td>
                              <td>
                                <img
                                  src={item.anhBia}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                  }}
                                />
                              </td>
                              <td>
                                {
                                  item.baiHat_caSis?.map((casi, index) => {
                                    return (
                                      <div key={index}>{casi.casi?.tenCaSi}</div>
                                    )
                                  })
                                }
                              </td>
                              <td>
                                <audio src={item.linkBaiHat} controls />
                              </td>
                              <td>
                                <i
                                  className="fa-solid fa-pencil"
                                  style={{
                                    color: "#e67914",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setOpenModal2(true);
                                    setTenBaiHat(item.tenBaiHat);
                                    setLoiBaiHat(item.loiBaiHat);
                                    // setIdCaSi(item.baiHat_caSis.casi.id);
                                    setIdEdit(item.id);
                                    setLinhMV(item.linkMV);
                                  }}
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can"
                                  style={{
                                    color: "red",
                                    marginLeft: "14px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleXoaBaiHat(item.id)}
                                ></i>
                              </td>
                            </tr>
                          );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </LoadingOverlay>
      <Modal
        title="Thêm bái hát"
        style={{
          top: 20,
        }}
        open={openModal}
        onOk={() => handleThemBaiHat()}
        onCancel={() => {
          setOpenModal(false);
        }}
      >
        <Spin spinning={loading}>
          <Input
            size="large"
            placeholder="Tên bài hát"
            prefix={<PlayCircleOutlined />}
            style={{ marginBottom: "10px" }}
            value={tenBaiHat}
            onChange={(e) => setTenBaiHat(e.target.value)}
          />

          <Input
            size="large"
            placeholder="Tên tác giả"
            prefix={<UserOutlined />}
            style={{ marginBottom: "10px" }}
            value={tenNhacSi}
            onChange={(e) => setTenNhacSi(e.target.value)}
          />

          <Input
            size="large"
            placeholder="Thể loại"
            prefix={<FontColorsOutlined />}
            style={{ marginBottom: "10px" }}
            value={theLoai}
            onChange={(e) => setTheLoai(e.target.value)}
          />

          <Input
            size="large"
            placeholder="Nhà cung cấp "
            prefix={<FileProtectOutlined />}
            style={{ marginBottom: "10px" }}
            value={nhaCungCap}
            onChange={(e) => setNhaCungcap(e.target.value)}
          />

          <DatePicker format={'DD/MM/YYYY'} onChange={onChangeDate} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: '20px'
            }}
          >
            <label
              style={{
                width: "100px",
                height: "100px",
                border: "1px solid #000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              {urlImage && (
                <img
                  src={urlImage}
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                  }}
                />
              )}
              {!urlImage && (
                <>
                  <i className="fa-solid fa-plus"></i>
                  <div>Ảnh bìa</div>
                </>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => onUploadImage(e.target.files)}
              />
            </label>

            {/* <select>
              <option disabled hidden value={""}>
                -- Chọn ca sĩ --
              </option>
              {dsCaSi?.map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.tenCaSi}
                  </option>
                );
              })}
            </select> */}
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "80%",
              }}
              placeholder="Danh sách ca sĩ"
              value={currentListCaSi}
              onChange={handleChangeCurrentCaSi}
              options={dsCaSi}
              filterOption={handleFillter}
              optionFilterProp="label"
              placement="topLeft"
              onClear={() => setCurrentListCaSi([])}
            />
          </div>

          <br />
          <h4>Tải âm thanh lên</h4>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => onUploadFileAudio(e.target.files)}
          />
          {urlAudio && (
            <audio
              src={urlAudio}
              controls
              style={{ marginTop: "10px" }}
              onLoadedMetadata={(e) => onLoadedDataAudio(e)}
            />
          )}

          <h5 style={{ marginTop: "20px" }}>Link MV (nếu có)</h5>
          <input
            type="text"
            value={linkMV}
            onChange={(e) => setLinhMV(e.target.files)}
          />

          <TextArea
            rows={4}
            style={{ marginTop: "20px" }}
            placeholder="Nhập lời của bài hát ..."
            value={loiBaiHat}
            onChange={(e) => setLoiBaiHat(e.target.value)}
          />
        </Spin>
      </Modal>
      <Modal
        title="Chỉnh sửa bài hát"
        style={{
          top: 20,
        }}
        open={openModal2}
        onOk={() => handleSuaBaiHat()}
        onCancel={onCancelModalEdit}
      >
        <Spin spinning={loading}>
          <Input
            size="large"
            placeholder="Tên bài hát"
            prefix={<PlayCircleOutlined />}
            style={{ marginBottom: "10px" }}
            value={tenBaiHat}
            onChange={(e) => setTenBaiHat(e.target.value)}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* <select value={idCaSi} onChange={(e) => setIdCaSi(e.target.value)}>
            <option disabled hidden value={""}>
              -- Chọn ca sĩ --
            </option>
            {dsCaSi?.map((item, index) => {
              return (
                <option key={index} value={item.id}>
                  {item.tenCaSi}
                </option>
              );
            })}
          </select> */}





          </div>
          <h5 style={{ marginTop: "20px" }}>Link MV (nếu có)</h5>
          <input
            type="text"
            value={linkMV}
            onChange={(e) => setLinhMV(e.target.files)}
          />
          <TextArea
            rows={4}
            style={{ marginTop: "20px" }}
            placeholder="Nhập lời của bài hát ..."
            value={loiBaiHat}
            onChange={(e) => setLoiBaiHat(e.target.value)}
          />
        </Spin>
      </Modal>
    </>
  );
}

export default QuanLyBaiHat;
