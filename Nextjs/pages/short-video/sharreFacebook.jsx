import { FacebookShareButton } from 'react-share';

function ShareButton({ url, quote, hashtag }) {
   return (
      <FacebookShareButton url={url} quote={quote} hashtag={hashtag}>
         Chia sẻ lên Facebook
      </FacebookShareButton>
   );
}

export default ShareButton;
