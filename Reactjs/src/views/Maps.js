import React from "react";

// react-bootstrap components
import { Badge, Button, Navbar, Nav, Container } from "react-bootstrap";

function Maps() {
  const mapRef = React.useRef(null);
  // React.useEffect(() => {
  //   let google = window.google;
  //   let map = mapRef.current;
  //   let lat = "40.748817";
  //   let lng = "-73.985428";
  //   const myLatlng = new google.maps.LatLng(lat, lng);
  //   const mapOptions = {
  //     zoom: 13,
  //     center: myLatlng,
  //     scrollwheel: false,
  //     zoomControl: true,
  //   };

  //   map = new google.maps.Map(map, mapOptions);

  //   const marker = new google.maps.Marker({
  //     position: myLatlng,
  //     map: map,
  //     animation: google.maps.Animation.DROP,
  //     title: "Light Bootstrap Dashboard PRO React!",
  //   });

  //   const contentString =
  //     '<div class="info-window-content"><h2>Light Bootstrap Dashboard PRO React</h2>' +
  //     "<p>A premium Admin for React-Bootstrap, Bootstrap, React, and React Hooks.</p></div>";

  //   const infowindow = new google.maps.InfoWindow({
  //     content: contentString,
  //   });

  //   google.maps.event.addListener(marker, "click", function () {
  //     infowindow.open(map, marker);
  //   });
  // }, []);
  return (
    <>
      <div className="map-container">
        {/* <div id="map" ref={mapRef}></div> */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14621.827441497308!2d105.7159816622886!3d10.004223366462169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08903d92d1d0d%3A0x2c147a40ead97caa!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBOYW0gQ-G6p24gVGjGoQ!5e0!3m2!1svi!2s!4v1687256294980!5m2!1svi!2s"
          // width="600"
          // height="450"
          style={{ border: 0, width: '100%', height: '100%' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  );
}

export default Maps;
