import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css'
import type { AppProps } from 'next/app'

import ScrollToTop from "react-scroll-to-top";
import { ToastContainer, toast } from 'react-toastify';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import store, { persistor } from '../store/redux';
import ButtonToTop from '../components/home/ButtonToTop'


import '../public/css/home/SliderImageHome.css'
import '../public/css/home/SliderProduct.css'
import '../public/css/home/countdownPromotionHome.css'


import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Script from 'next/script'
// import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import initializeAOS from '../utils/aos'
import { ParallaxProvider } from 'react-scroll-parallax';
// import { FacebookProvider, CustomChat } from 'react-facebook';
import FacebookChat from '../components/home/ChatFacebook'


const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
});

// declare const window: Window;

export default function App({ Component, pageProps }: AppProps) {
  const isScreen500 = useMediaQuery({ query: '(max-width: 500px)' });



  useEffect(() => {
    initializeAOS();
    const handleOffline = () => {
      toast.warning('Kiểm tra kết nối của ban!', {
        position: "bottom-left",
      });
    }
    const handleOnline = () => {
      toast.success('Đã kết nối lại!', {
        position: "bottom-left",
      });
    }



    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)


    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }

  }, [])

  return (
    <>
      <Provider store={store}>
        <ApolloProvider client={client}>
          {/* <div className={classNames('loader-container', { show: loading })}>
            <div className={classNames('loader-container show')}>
              <div className="spinner">
                <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
                  <div className="wheel"></div>
                  <div className="hamster">
                    <div className="hamster__body">
                      <div className="hamster__head">
                        <div className="hamster__ear"></div>
                        <div className="hamster__eye"></div>
                        <div className="hamster__nose"></div>
                      </div>
                      <div className="hamster__limb hamster__limb--fr"></div>
                      <div className="hamster__limb hamster__limb--fl"></div>
                      <div className="hamster__limb hamster__limb--br"></div>
                      <div className="hamster__limb hamster__limb--bl"></div>
                      <div className="hamster__tail"></div>
                    </div>
                  </div>
                  <div className="spoke"></div>
                </div>
              </div>
            </div>
          </div> */}
          <ParallaxProvider>
            <Component {...pageProps} persistor={persistor} />
          </ParallaxProvider>
          {
            !isScreen500 &&
            <ScrollToTop style={{ backgroundColor: 'transparent', boxShadow: 'none' }} smooth top={400} component={<ButtonToTop />} />
          }
          <div id="fb-customer-chat" className="fb-customerchat">
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
          />

          <FacebookChat />
          <Script src="https://kit.fontawesome.com/a19bb8670a.js" />
        </ApolloProvider>
      </Provider>
    </>
  )
}
