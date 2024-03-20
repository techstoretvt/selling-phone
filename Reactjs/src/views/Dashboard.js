import React, { useEffect, useState } from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import {
  CheckAdminLogin, getStatisticalAdmin, StatisticalEvaluateAdmin,
  getTypeProduct, getTrademarks, getStatisticalSale, getCountBillOfMonth,
  getMoneyOfMonth, getInventoryByIdTypeProduct, handleCheckLoginAdmin

} from '../services/adminService'
import { useHistory } from 'react-router-dom';
import { formatNumber } from '../services/common'

import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import { bgCardDashboard } from '../utils/constant'

let currentYear = new Date().getFullYear()
let arrYear = []
for (let i = 0; i < 10; i++) {
  arrYear.push(currentYear - i)

}

function Dashboard() {
  const history = useHistory();
  const [countProduct, setCountProduct] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [countBill, SetCountBill] = useState(0)
  const [avgStart, setAvgStart] = useState(0)
  const [countUser, setCountUser] = useState(0)
  const [countVideo, setCountVideo] = useState(0)
  const [countBlog, setCountBlog] = useState(0)

  const [start1, setStart1] = useState(0)
  const [start2, setStart2] = useState(0)
  const [start3, setStart3] = useState(0)
  const [start4, setStart4] = useState(0)
  const [start5, setStart5] = useState(0)

  const [listTypeProduct, setListTypeProduct] = useState([])
  const [currentIdTypeProduct, setcurrentIdTypeProduct] = useState('')
  const [currentIdTrademark, setCurrentIdTrademark] = useState('')
  const [currentIdProduct, setCurrentIdProduct] = useState('')
  const [listTrademark, setListTrademark] = useState([]);
  const [listSaleMonth, setListSaleMonth] = useState([])
  const [yearSale, setYearSale] = useState(2023)
  const [yearBill, setYearBill] = useState(currentYear)
  const [arrCountBillOfMonth, setArrCountBillOfMonth] = useState([])
  const [arrMoneyNhap, setArrMoneyNhap] = useState([])
  const [arrMoneyBan, setArrMoneyBan] = useState([])
  const [countBillToday, setCountBillToday] = useState('')
  const [revenueToday, setRevenueToday] = useState('')
  const [inventory, setInventory] = useState('')


  useEffect(() => {
    handleCheckLoginAdmin('2');
  }, [])

  useEffect(() => {
    getStatistical()
    getStatisticalEvaluate()
    getListTypeProduct()
    getListTrademarks()
    handleGetMoneyMonthOfYear(currentYear)
    handleGetInventory('-')
  }, [])

  useEffect(() => {
    getListSale()
  }, [yearSale])

  useEffect(() => {
    handleGetCountBillOfMonth()
  }, [yearBill])

  let getStatistical = async () => {
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   location.href = '/login'
    //   return
    // }
    let res = await getStatisticalAdmin({ accessToken })
    // console.log(res);
    if (res?.errCode === 0) {
      setCountProduct(res.data.countProduct)
      setRevenue(res.data.revenue)
      SetCountBill(res.data.countBill)
      setAvgStart(res.data.avgStart)
      setCountUser(res.data.countUser)
      setCountVideo(res.data.countVideo)
      setCountBlog(res.data.countBlog)
      setCountBillToday(res.data.countBillToday)
      setRevenueToday(res.data.revenueToday)
    }
  }

  let getStatisticalEvaluate = async () => {
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   location.reload()
    //   return
    // }
    let res = await StatisticalEvaluateAdmin({
      accessToken,
    })

    // console.log(res);
    if (res?.errCode === 0) {
      setStart1((res.data.count1).toFixed(1))
      setStart2((res.data.count2).toFixed(1))
      setStart3((res.data.count3).toFixed(1))
      setStart4((res.data.count4).toFixed(1))
      setStart5((res.data.count5).toFixed(1))
    }
  }

  const getListTypeProduct = async () => {
    let res = await getTypeProduct()
    if (res && res.errCode === 0) {
      setListTypeProduct(res.data)
    }
  }

  const getListTrademarks = async () => {
    // if (!currentIdTypeProduct) return
    let res = await getTrademarks();
    if (res && res.errCode === 0) {
      setListTrademark(res.data);
    }
    else {
      notify('br', 3, res ? res.errMessage : 'Có lỗi khi lấy danh sách thương hiệu!');
    }
  }

  const getListSale = async () => {
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   location.reload()
    //   return
    // }
    let res = await getStatisticalSale({
      accessToken,
      year: yearSale
    })

    // console.log(res);
    if (res?.errCode === 0) {
      setListSaleMonth(res.data.arr)
    }
  }


  const handleGetMoneyMonthOfYear = async (year) => {
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   location.reload()
    //   return
    // }

    let res = await getMoneyOfMonth({
      accessToken,
      year
    })

    // console.log(res);
    if (res?.errCode === 0) {
      setArrMoneyNhap(res.data.arr1)
      setArrMoneyBan(res.data.arr2)
    }
  }

  const handleGetCountBillOfMonth = async () => {
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   // location.reload()
    //   return
    // }

    let res = await getCountBillOfMonth({
      accessToken,
      year: yearBill
    })

    // console.log(res);
    if (res?.errCode === 0) {
      setArrCountBillOfMonth(res.data)
    }
  }

  const handleGetInventory = async (idTypeProduct) => {
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   // location.reload()
    //   return
    // }
    let res = await getInventoryByIdTypeProduct({
      accessToken,
      idTypeProduct
    })

    // console.log(res);
    if (res?.errCode === 0) {
      setInventory(res.data.sum)
    }
  }

  //logic
  const handelOnchangeIDValuateProduct = async (e) => {
    setCurrentIdProduct(e.target.value)
    setcurrentIdTypeProduct('')
    setCurrentIdTrademark('')
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   // location.reload()
    //   return
    // }
    let res = await StatisticalEvaluateAdmin({
      accessToken,
      idProduct: e.target.value
    })

    console.log(res);
    if (res?.errCode === 0) {
      setStart1((res.data.count1)?.toFixed(1))
      setStart2((res.data.count2)?.toFixed(1))
      setStart3((res.data.count3)?.toFixed(1))
      setStart4((res.data.count4)?.toFixed(1))
      setStart5((res.data.count5)?.toFixed(1))
    }
  }

  const handleChangeSelectTypeEvaluate = async (e) => {
    setCurrentIdProduct('')
    setcurrentIdTypeProduct(e.target.value)
    setCurrentIdTrademark('')
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   location.reload()
    //   return
    // }
    let res = await StatisticalEvaluateAdmin({
      accessToken,
      idTypeProduct: e.target.value
    })

    console.log(res);
    if (res?.errCode === 0) {
      setStart1((res.data.count1)?.toFixed(1))
      setStart2((res.data.count2)?.toFixed(1))
      setStart3((res.data.count3)?.toFixed(1))
      setStart4((res.data.count4)?.toFixed(1))
      setStart5((res.data.count5)?.toFixed(1))
    }
  }

  const handleChangeSelectTrademarkEvaluate = async (e) => {
    setCurrentIdProduct('')
    // setcurrentIdTypeProduct('')
    setCurrentIdTrademark(e.target.value)
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   location.reload()
    //   return
    // }
    let res = await StatisticalEvaluateAdmin({
      accessToken,
      idTrademark: e.target.value
    })

    console.log(res);
    if (res?.errCode === 0) {
      setStart1((res.data.count1)?.toFixed(1))
      setStart2((res.data.count2)?.toFixed(1))
      setStart3((res.data.count3)?.toFixed(1))
      setStart4((res.data.count4)?.toFixed(1))
      setStart5((res.data.count5)?.toFixed(1))
    }
  }

  const handleChangeYearSale = async (e) => {
    setYearSale(e.target.value)

  }

  const handleChangeTypeProductSale = async (e) => {
    let accessToken = localStorage.getItem('accessToken')
    // if (!accessToken) {
    //   location.reload()
    //   return
    // }
    let res = await getStatisticalSale({
      accessToken,
      year: yearSale,
      idTypeProduct: e.target.value
    })

    console.log(res);
    if (res?.errCode === 0) {
      setListSaleMonth(res.data.arr)
    }
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12" >
            <Card style={{ backgroundColor: bgCardDashboard }}>
              <Card.Header style={{ backgroundColor: bgCardDashboard }}>
                <Card.Title as="h4">Đơn hàng</Card.Title>
                <p className="card-category">12 Month performance</p>
                <select className="form-control" style={{ width: '100px' }}
                  onChange={(e) => setYearBill(e.target.value)}
                >
                  {
                    arrYear?.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))
                  }
                </select>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartHours">
                  <ChartistGraph
                    data={{
                      labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      series: [
                        arrCountBillOfMonth,

                      ],
                    }}
                    type="Line"
                    options={{
                      low: 0,
                      // high: 1000,
                      showArea: true,
                      height: "245px",
                      axisX: {
                        showGrid: false,
                      },
                      lineSmooth: true,
                      showLine: true,
                      showPoint: true,
                      fullWidth: true,
                      chartPadding: {
                        right: 50,
                      },
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                {/* <div className="legend">
                  <i className="fas fa-circle text-info"></i>
                  Open <i className="fas fa-circle text-danger"></i>
                  Click <i className="fas fa-circle text-warning"></i>
                  Click Second Time
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated 3 minutes ago
                </div> */}
              </Card.Footer>
            </Card>
          </Col>
          <Col>
            <Card style={{ backgroundColor: bgCardDashboard }}>
              <Card.Header style={{ backgroundColor: bgCardDashboard }}>
                <Card.Title as="h4">
                  <select onChange={(e) => handleGetMoneyMonthOfYear(e.target.value)}>
                    {
                      arrYear.map(item => (
                        <option value={item}>{item}</option>
                      ))
                    }

                  </select>
                  Sales</Card.Title>
                <p className="card-category">All products including Taxes</p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      series: [
                        arrMoneyBan,
                        arrMoneyNhap,
                      ],
                    }}
                    type="Bar"
                    options={{
                      seriesBarDistance: 10,
                      axisX: {
                        showGrid: false,
                      },
                      height: "245px",
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          seriesBarDistance: 5,
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <Row>
                  <Col md='12'>
                    <div className="legend">
                      <i className="fas fa-circle text-info"></i>
                      Bán <i className="fas fa-circle text-danger"></i>
                      Nhập
                    </div>
                    <br />
                    <div>Đơn vị (Triệu)</div>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="12">
            <Card style={{ backgroundColor: bgCardDashboard }}>
              <Card.Header style={{ backgroundColor: bgCardDashboard }}>
                <Card.Title as="h4">Thống kê đánh giá</Card.Title>
                <p className="card-category">Last Campaign Performance</p>
              </Card.Header>
              <Card.Body>
                <div
                  className="ct-chart ct-perfect-fourth"
                  id="chartPreferences"
                >
                  <ChartistGraph
                    data={{
                      labels: [`${start5}%`, `${start4}%`, `${start3}%`, `${start2}%`, `${start1}%`],
                      series: [start5, start4, start3, start2, start1],
                    }}
                    type="Pie"
                  />
                </div>
                <div className="legend">
                  <i className="fas fa-circle text-info"></i>
                  5 sao <i className="fas fa-circle text-danger"></i>
                  4 sao <i className="fas fa-circle text-warning"></i>
                  3 sao <i className="fas fa-circle " style={{ color: '#9368E9' }}></i>
                  2 sao <i className="fas fa-circle" style={{ color: '#87CB16' }}></i>
                  1 sao

                </div>
                <hr></hr>
                <Row >
                  <Col md="6">
                    <input className="form-control"
                      placeholder="Nhập ID sản phẩm" style={{ border: '1px solid #000' }}
                      onChange={(e) => handelOnchangeIDValuateProduct(e)}
                      value={currentIdProduct}
                    />

                  </Col>
                  <Col md="3">
                    <select className="form-control" style={{ textTransform: 'capitalize' }}
                      onChange={(e) => handleChangeSelectTypeEvaluate(e)}
                      value={currentIdTypeProduct}
                    >
                      <option value='' hidden>-- Loại sản phẩm --</option>
                      {
                        listTypeProduct && listTypeProduct.length > 0 &&
                        listTypeProduct.map(item => {
                          return (
                            <option key={item.id} value={item.id}>{item.nameTypeProduct}</option>
                          )
                        })
                      }
                    </select>
                  </Col>
                  <Col md="3">
                    <select className="form-control" style={{ textTransform: 'capitalize' }}
                      onChange={(e) => handleChangeSelectTrademarkEvaluate(e)}
                      value={currentIdTrademark}
                    >
                      <option value='' hidden>-- Thương hiệu --</option>
                      {
                        listTrademark?.map((item, index) => {
                          if (item.typeProduct?.id === currentIdTypeProduct)
                            return (
                              <option key={item.id} value={item.id}>{item.nameTrademark}</option>
                            )
                        })
                      }
                    </select>
                  </Col>

                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }}>
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-tablet-2 text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Sản phẩm</p>
                      <Card.Title as="h4">x{countProduct}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update Now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }}>
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-credit-card text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Tổng Doanh thu</p>
                      <Card.Title as="h4">{formatNumber(revenue)}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Last day
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }}>
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-notes text-muted"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Tất cả Hóa đơn</p>
                      <Card.Title as="h4">{countBill}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>
                  In the last hour
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }} >
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Đánh giá</p>
                      <Card.Title as="h4">+{avgStart} </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }} >
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-circle-09 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Khách hàng</p>
                      <Card.Title as="h4">{countUser} </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          {/* <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }}>
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-button-play text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Video ngắn</p>
                      <Card.Title as="h4">{countVideo} </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }}>
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-ruler-pencil text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Bài viết</p>
                      <Card.Title as="h4">{countBlog}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer>
            </Card>
          </Col> */}
          <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }}>
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-notes text-muted"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Hóa đơn hôm nay</p>
                      <Card.Title as="h4">{countBillToday}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>
                  In the last hour
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }}>
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-credit-card text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Doanh thu hôm nay</p>
                      <Card.Title as="h4">{formatNumber(revenueToday)}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Last day
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats" style={{ backgroundColor: bgCardDashboard }}>
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-credit-card text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Tồn kho</p>
                      <Card.Title as="h5">{formatNumber(inventory)}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <div className="stats">
                  <select className="form-control"
                    onChange={(e) => handleGetInventory(e.target.value)}
                  >
                    <option value='-'>-- Tất cả --</option>
                    {
                      listTypeProduct && listTypeProduct.length > 0 &&
                      listTypeProduct.map(item => {
                        return (
                          <option key={item.id} value={item.id}>{item.nameTypeProduct}</option>
                        )
                      })
                    }
                  </select>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <Card style={{ backgroundColor: bgCardDashboard }}>
              <Card.Header style={{ backgroundColor: bgCardDashboard }}>
                <Card.Title as="h4">
                  <select value={yearSale} onChange={(e) => handleChangeYearSale(e)}>
                    <option value={2021}>2021</option>
                    <option value={2022}>2022</option>
                    <option value={2023} >2023</option>
                  </select>
                  Sales</Card.Title>
                <p className="card-category">All products including Taxes</p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "Mai",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                      series: [
                        listSaleMonth
                      ],
                    }}
                    type="Bar"
                    options={{
                      seriesBarDistance: 10,
                      axisX: {
                        showGrid: false,
                      },
                      height: "245px",
                    }}
                    responsiveOptions={[
                      [
                        "screen and (max-width: 640px)",
                        {
                          seriesBarDistance: 5,
                          axisX: {
                            labelInterpolationFnc: function (value) {
                              return value[0];
                            },
                          },
                        },
                      ],
                    ]}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <Row>
                  <Col md='12'>
                    <select className="form-control" onChange={(e) => handleChangeTypeProductSale(e)}>
                      <option value=''>-- Tất cả --</option>
                      {
                        listTypeProduct && listTypeProduct.length > 0 &&
                        listTypeProduct.map(item => {
                          return (
                            <option key={item.id} value={item.id}>{item.nameTypeProduct}</option>
                          )
                        })
                      }
                    </select>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
          {/* <Col md="6">
            <Card className="card-tasks">
              <Card.Header>
                <Card.Title as="h4">Tasks</Card.Title>
                <p className="card-category">Backend development</p>
              </Card.Header>
              <Card.Body>
                <div className="table-full-width">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Sign contract for "What are conference organizers
                          afraid of?"
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-488980961">
                                Edit Task..
                              </Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-506045838">Remove..</Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Lines From Great Russian Literature? Or E-mails From
                          My Boss?
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-537440761">
                                Edit Task..
                              </Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-21130535">Remove..</Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Flooded: One year later, assessing what was lost and
                          what was found when a ravaging rain swept through
                          metro Detroit
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-577232198">
                                Edit Task..
                              </Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-773861645">Remove..</Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Create 4 Invisible User Experiences you Never Knew
                          About
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-422471719">
                                Edit Task..
                              </Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-829164576">Remove..</Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>Read "Following makes Medium better"</td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-160575228">
                                Edit Task..
                              </Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-922981635">Remove..</Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                disabled
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>Unfollow 5 enemies from twitter</td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-938342127">
                                Edit Task..
                              </Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-119603706">Remove..</Tooltip>
                            }
                          >
                            <Button
                              className="btn-simple btn-link p-1"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="now-ui-icons loader_refresh spin"></i>
                  Updated 3 minutes ago
                </div>
              </Card.Footer>
            </Card>
          </Col> */}
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
