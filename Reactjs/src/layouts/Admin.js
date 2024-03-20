
import React, { Component, useRef, useState } from "react";
import { useLocation, Route, Switch } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";
import { Howl } from 'howler';
const audioPath = require('../assets/audio/hello 5 phút nửa sẽ reset trang web.mp3');
const audioPath4 = require('../assets/audio/còn 4 phút nửa.mp3');
const audioPath3 = require('../assets/audio/còn 3 phút nửa.mp3');
const audioPath2 = require('../assets/audio/còn 2 phút nửa.mp3');
const audioPath1 = require('../assets/audio/còn 1 phút nửa.mp3');

const sound = new Howl({
  src: [audioPath],
});
const sound4 = new Howl({
  src: [audioPath4],
});
const sound3 = new Howl({
  src: [audioPath3],
});
const sound2 = new Howl({
  src: [audioPath2],
});
const sound1 = new Howl({
  src: [audioPath1],
});

import sidebarImage from "assets/img/sidebar-3.jpg";

function Admin() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("purple");
  const [hasImage, setHasImage] = React.useState(true);
  const [bgColor, setBgColor] = useState('#0F5257')
  // const [timeCountDown, setTimecountDown] = useState(900)
  const timeCountDown = useRef(900)
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const countdown = React.useRef(null)
  const audioRef = React.useRef(null)
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  React.useEffect(() => {
    let colorFixedPlugin = localStorage.getItem('colorFixedPlugin') ?? ''
    if (colorFixedPlugin) {
      setColor(colorFixedPlugin)
    }

    let imageFixedPlugin = localStorage.getItem('imageFixedPlugin') ?? ''
    if (imageFixedPlugin) {
      setImage(imageFixedPlugin)
    }

    let hasImage = localStorage.getItem('hasImage') ?? ''
    if (hasImage) {
      setHasImage(hasImage === 'true' ? true : false)
    }

    let bgColor = localStorage.getItem('bgColor') ?? ''
    if (bgColor) {
      setBgColor(bgColor)
    }





  }, [])

  // React.useEffect(() => {
  //   //countdown reset
  //   setInterval(() => {

  //     timeCountDown.current = timeCountDown.current - 1
  //     if (timeCountDown.current - 1 === 300) {
  //       sound.play();
  //     }

  //     if (timeCountDown.current - 1 === 240) {
  //       sound4.play();
  //     }

  //     if (timeCountDown.current - 1 === 180) {
  //       sound3.play();
  //     }

  //     if (timeCountDown.current - 1 === 120) {
  //       sound2.play();
  //     }
  //     if (timeCountDown.current - 1 === 60) {
  //       sound1.play();
  //     }

  //     if (timeCountDown.current - 1 === 0) {
  //       window.location.reload()
  //     }


  //   }, 1000);

  // }, [])


  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);


  const handleChangeColor = (color) => {
    setColor(color)
    localStorage.setItem('colorFixedPlugin', color)

  }

  const handleChangeImage = (image) => {
    setImage(image)
    localStorage.setItem('imageFixedPlugin', image)
  }

  const handleToggleImage = () => {
    let rs = !hasImage
    setHasImage(rs)

    localStorage.setItem('hasImage', rs.toString())
  }

  const handleChangeBgColor = (color) => {
    setBgColor(color)

    localStorage.setItem('bgColor', color)
  }


  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel" ref={mainPanel} >
          <AdminNavbar />
          <div className="content" style={{ backgroundColor: bgColor }}>
            <Switch>{getRoutes(routes)}</Switch>
          </div>
          <Footer />
        </div>
      </div>
      <FixedPlugin
        hasImage={hasImage}
        setHasImage={() => handleToggleImage()}
        color={color}
        setColor={(color) => handleChangeColor(color)}
        image={image}
        setImage={(image) => handleChangeImage(image)}
        bgColor={bgColor}
        setBgColor={(color) => handleChangeBgColor(color)}
      />

      <div
        // style={{
        //   position: 'fixed', bottom: '0', left: '0', zIndex: '1000',
        //   backgroundColor: 'green',
        //   padding: '10px'

        // }}
        ref={countdown}
      >
        {/* {timeCountDown.current} */}
      </div>
    </>
  );
}

export default Admin;
