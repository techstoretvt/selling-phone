import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { FacebookProvider, CustomChat } from "react-facebook";

const id = "116661344652051";
const appid = "1131387264234227";

const FacebookChat = () => {
  const scriptRef = useRef();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div>
      <FacebookProvider appId={appid} chatSupport>
        <CustomChat pageId={id} minimized={false} />
      </FacebookProvider>
    </div>
  );
};

export default React.memo(FacebookChat);
