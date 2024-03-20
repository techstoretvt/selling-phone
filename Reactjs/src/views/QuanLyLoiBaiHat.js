import React, { useEffect, useRef, useState } from "react";
import { Card, Container, Row, Col, Table } from "react-bootstrap";

import {
  timKiemBaiHatById,
  themLoiBaiHat,
  getListLoiBaiHat,
  suaLoiBaiHatById,
  suaThoiGianBaiHatById,
  xoaLoiBaiHat
} from "../services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from "react-loading-overlay-ts";
import dayjs from 'dayjs';
import { Button, Modal, Input, Slider, Select, Spin, DatePicker, Checkbox } from "antd";
const { TextArea } = Input;

import { PlayCircleOutlined, UserOutlined, FontColorsOutlined, FileProtectOutlined } from "@ant-design/icons";
import BaiHatDefault from '../assets/audio/buong-tay.mp3';

function QuanLyLoiBaiHat() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [currentBaiHat, setCurrentBaiHat] = useState(null);
  const [durationAudio, setDurationAudio] = useState(0);
  const [valueSlider, setValueSlider] = useState(0)
  const refAudio = useRef(null)
  const containerLoiBH = useRef(null)
  const [listLoiBaiHat, setListLoiBaiHat] = useState([])
  const [isChangeTG, setIsChangeTG] = useState(false);
  const [indexLoiBH, setIndexLoiBH] = useState(0);
  const [isPlay, setIsPlay] = useState(false)
  const [isSeekto, setIsSeekto] = useState(false)
  const [isAutoNext, setIsAutoNext] = useState(false)

  useEffect(() => {
    window.addEventListener('keyup', handleTogglePlayByKeyUp)

    return () => {
      window.removeEventListener('keyup', handleTogglePlayByKeyUp)
    }

  }, [isPlay])

  const handleTogglePlayByKeyUp = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 191) {
      if (isPlay) {
        setIsPlay(false)
        console.log(false);
        refAudio?.current?.pause()
      }
      else {
        setIsPlay(true)
        console.log(false);
        refAudio?.current?.play()
      }
    }
  }


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

  const handleTimKiemBaiHat = async (id) => {
    if (id === "") return;

    let res = await timKiemBaiHatById({ idBaiHat: id })
    if (res?.errCode === 0) {
      setCurrentBaiHat(res.data)
      getLoiBaiHat(res.data.id)
      setIsPlay(false)
      setIndexLoiBH(0)
    }
    else {
      setCurrentBaiHat(null)
    }


  }

  const getLoiBaiHat = async (id) => {
    let res = await getListLoiBaiHat({
      idBaiHat: id
    })
    console.log(res);
    if (res?.errCode === 0) {
      setListLoiBaiHat(res.data)
    }
    else {
      setListLoiBaiHat([])
    }
  }

  const onChangeSlider = (value) => {
    if (isNaN(value) || currentBaiHat === null) {
      return;
    }
    console.log(value);
    refAudio.current.currentTime = value

  }

  const onLoadedDataAudio = (e) => {
    const duration = e.target.duration;
    setDurationAudio(duration);
    console.log(duration);
  };

  const handleChangeDuration = (e) => {
    let currentTime = e.target.currentTime.toFixed(2);
    setValueSlider(+currentTime)

    if (isSeekto || !isAutoNext) return
    for (let i = 0; i < listLoiBaiHat.length; i++) {
      if (listLoiBaiHat[i].thoiGian >= currentTime) {
        containerLoiBH.current.getElementsByTagName("div")[i - 2 <= 0 ? 0 : i - 2]
          .scrollIntoView({ behavior: "smooth" });

        if (i === listLoiBaiHat.length)
          setIndexLoiBH(i)

        else
          setIndexLoiBH(i - 1)
        break
      }
    }

  }

  const handleAddLoiBaiHat = async (event) => {

    let currentTime = valueSlider;

    const text = await navigator.clipboard.readText();
    console.log(text);

    let res = await themLoiBaiHat({
      idBaiHat: currentBaiHat.id,
      thoiGian: currentTime - 0.25,
      loiBaiHat: text || ""
    });

    console.log(res);
    if (res?.errCode === 0) {
      console.log("success");
      getLoiBaiHat(currentBaiHat.id)
    }
    else {
      notify('br', 4, res?.errMessage)
      console.log('fail');
    }
  }

  let idTimeOut_sualoi = useRef();
  let idTimeOut_suatg = useRef();

  const handleChangeLoiBaihat = async (value, id) => {

    clearTimeout(idTimeOut_sualoi.current);

    idTimeOut_sualoi.current = setTimeout(async () => {
      let res = await suaLoiBaiHatById({
        idLoiBaiHat: id,
        loiBaiHat: value
      })
      if (res?.errCode !== 0) {
        notify('br', 4, res?.errMessage)
      }

      console.log(res);
    }, 1000);


  }

  const handleChangeThoigian = async (value, id, index) => {
    setIsChangeTG(true)
    if (isNaN(value) || value === "") {
      console.log("Ko phai so");
      setIsChangeTG(false)
      return;
    }

    clearTimeout(idTimeOut_suatg.current);

    idTimeOut_suatg.current = setTimeout(async () => {
      let res = await suaThoiGianBaiHatById({
        idLoiBaiHat: id,
        thoiGian: value
      })

      console.log(res);
      if (res?.errCode === 0) {
        listLoiBaiHat[index].thoiGian = value
      }
      else {
        notify('br', 4, res?.errMessage)
      }

      setIsChangeTG(false)

    }, 500);


  }


  const handleXoaLoiBaiHat = async (id) => {
    let res = await xoaLoiBaiHat({ idLoiBaiHat: id })
    console.log(res);
    if (res?.errCode === 0) {
      getLoiBaiHat(currentBaiHat.id)
    }
    else {
      notify('br', 4, res?.errMessage)
    }
  }

  const handleCopyLoiBaiHat = () => {
    navigator.clipboard.writeText(currentBaiHat?.loiBaiHat);
    notify("tr", 2, "Đã copy lời bài hát")
  }

  const handleSeekTo = (item, index) => {
    if (isChangeTG) return;
    console.log('vao', item.thoiGian);
    refAudio.current.currentTime = item.thoiGian
    refAudio.current.play()
    setIndexLoiBH(index)
    setIsPlay(true)
    setIsSeekto(true)

    setTimeout(() => {
      setIsSeekto(false)
    }, 500);
  }

  const handleNextToLoiBH = () => {
    let newIndex = +indexLoiBH + 1
    if (newIndex >= listLoiBaiHat.length || isChangeTG || +indexLoiBH < 0) return
    setIndexLoiBH(newIndex)
    setIsPlay(true)

    let tg = listLoiBaiHat[newIndex].thoiGian
    refAudio.current.currentTime = tg
    refAudio.current.play()

    console.log(containerLoiBH.current.getElementsByTagName("div")[newIndex]);
    containerLoiBH.current.getElementsByTagName("div")[newIndex - 1 < 0 ? 0 : newIndex - 1]
      .scrollIntoView({ behavior: "smooth" });
  }

  const handlePrevToLoiBH = () => {
    let newIndex = +indexLoiBH - 1
    if (newIndex < 0 || isChangeTG || +indexLoiBH < 0) return
    setIndexLoiBH(newIndex)
    setIsPlay(true)

    let tg = listLoiBaiHat[newIndex].thoiGian
    refAudio.current.currentTime = tg
    refAudio.current.play()

    console.log(containerLoiBH.current.getElementsByTagName("div")[newIndex]);
    containerLoiBH.current.getElementsByTagName("div")[newIndex - 1 < 0 ? 0 : newIndex - 1]
      .scrollIntoView({ behavior: "smooth" });
  }

  const onchangIndexLoiBH = (value) => {
    setIndexLoiBH(value)
    containerLoiBH.current.getElementsByTagName("div")[+value - 1 < 0 ? 0 : +value - 1]
      .scrollIntoView({ behavior: "smooth" });
  }


  const togglePlayAudio = () => {

    if (!isPlay) {
      refAudio.current.play()
    }
    else {
      refAudio.current.pause()
    }

    setIsPlay(!isPlay)
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
                style={{ padding: "0 10px" }}
              >
                <Card.Header>
                  <b>Quản lý lời bài hát</b>
                  <audio src={BaiHatDefault} autoPlay></audio>
                  <p className="card-category">
                    Vật chất quyết định ý thức
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0 py-0">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: 'flex-start',
                      padding: "0 10px",

                    }}
                  >
                    <div>
                      <input
                        className="form-control"
                        style={{ width: "200px", padding: "4px" }}
                        placeholder="Id bài hát..."
                        onChange={(e) => handleTimKiemBaiHat(e.target.value)}
                      />

                      {
                        currentBaiHat != null &&
                        <Button
                          type="primary"
                          style={{ marginTop: '10px' }}
                          onClick={handleCopyLoiBaiHat}
                        >Copy lời bài hát</Button>

                      }
                    </div>

                    {
                      currentBaiHat !== null &&
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h5 style={{ fontWeight: 'bold' }}>{currentBaiHat?.tenBaiHat}</h5>
                        <audio ref={refAudio} src={currentBaiHat?.linkBaiHat} controls
                          onLoadedMetadata={(e) => onLoadedDataAudio(e)}
                          onTimeUpdate={handleChangeDuration}
                          hidden
                        />
                        {
                          !isPlay ?
                            <i className="fa-regular fa-circle-play" style={{ color: 'blue', fontSize: '50px', cursor: 'pointer' }} onClick={togglePlayAudio}></i> :
                            <i className="fa-regular fa-circle-pause" style={{ color: 'blue', fontSize: '50px', cursor: 'pointer' }} onClick={togglePlayAudio}></i>
                        }
                      </div>
                    }


                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '10px',
                      gap: '10px',
                    }}
                  >

                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>0</div>

                    <Slider
                      value={valueSlider}
                      disabled={false}
                      step={0.01}
                      min={0}
                      max={Math.floor(durationAudio)}
                      onChange={onChangeSlider}
                      tooltip={{
                        open: listLoiBaiHat?.length !== 0,
                      }}
                      style={{ flex: 1 }}
                    />

                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {
                        refAudio?.current?.duration?.toFixed(2)
                      }
                    </div>

                  </div>

                  <div style={{ display: 'flex', gap: '30px' }}>
                    <Button type="primary" onClick={handleAddLoiBaiHat}>Add</Button>

                    {
                      listLoiBaiHat?.length !== 0 &&
                      <div style={{ display: 'flex', alignItems: 'center' }}>

                        <i className="fa-solid fa-backward"
                          style={{
                            padding: '0 10px', cursor: 'pointer', margin: '0',
                            color: isChangeTG ? '#ccc' : '#000'
                          }}
                          onClick={() => handlePrevToLoiBH()}

                        ></i>
                        <Input
                          value={indexLoiBH}
                          onChange={(e) => onchangIndexLoiBH(e.target.value)}
                          type="number"
                          style={{ width: '60px', height: '30px', textAlign: 'center' }} />


                        <i className="fa-solid fa-forward"
                          style={{
                            padding: '0 10px', cursor: 'pointer', margin: '0',
                            color: isChangeTG ? '#ccc' : '#000'
                          }}
                          onClick={() => handleNextToLoiBH()}

                        ></i>
                      </div>
                    }


                    <div>

                      <Checkbox
                        onChange={(e) => setIsAutoNext(e.target.checked)}
                        style={{ color: '#000' }}
                      >Auto Next</Checkbox>
                    </div>

                  </div>



                  <div style={{
                    height: '40vh',
                    border: '1px solid #000',
                    padding: '20px 0px',
                    overflowY: 'auto',
                    marginTop: '10px',
                    marginBottom: '10px',
                    resize: 'vertical'
                  }}
                    ref={containerLoiBH}
                  >

                    {
                      listLoiBaiHat?.map((item, index) => {
                        return (
                          <div key={item.id + index} style={{
                            display: 'flex',
                            padding: '10px',
                            height: '50px',
                            alignItems: 'flex-start',
                            // border: '1px solid #000'
                          }}>

                            <i className="fa-solid fa-forward"
                              style={{
                                marginRight: '10px', padding: '10px', cursor: 'pointer',
                                color: isChangeTG ? '#ccc' : '#000'
                              }}
                              onClick={() => handleSeekTo(item, index)}

                            ></i>

                            <input defaultValue={item.loiBaiHat}
                              onChange={(e) => handleChangeLoiBaihat(e.target.value, item.id)}
                              style={{
                                flex: 1,
                                backgroundColor: index === +indexLoiBH ? 'green' : '#fff'
                              }}
                            />

                            <input style={{ width: '100px', textAlign: 'center', marginLeft: '10px' }}
                              defaultValue={item.thoiGian}
                              onChange={(e) => handleChangeThoigian(e.target.value, item.id, index)}
                              type="number"
                              step='0.2'
                            />

                            <i
                              className="fa-solid fa-trash"
                              style={{
                                marginLeft: '10px',
                                color: 'red',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleXoaLoiBaiHat(item.id)}

                            ></i>

                          </div>
                        )
                      })
                    }







                  </div>




                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </LoadingOverlay>
    </>
  );
}

export default QuanLyLoiBaiHat;
