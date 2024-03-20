const IgnoreUrl = (url) => {
    const ignore = [
        //app
        'check-start-server',
        'get-product-promotion-home',
        'get-top-sell-product',
        'get-new-collection-product',
        'get-product-type-flycam',
        'get-list-product-may-like',
        'get-evaluate-by-id-product',
        'search-product',
        'get-list-event-promotion',
        'get-list-blog',
        'get-list-hashtag',
        'get-blog-share-product',
        'get-blog-share-default',
        'get-blog-by-id',
        'get-comment-blog-by-id-blog',
        'increase-view-blog-by-id',
        'get-list-short-video',
        'get-list-comment-short-video-by-id',
        'get-list-product-hashtag-by-id-video',
        'get-product-by-id',
        'get-list-blog-home',
        'get-event-promotion-by-id',
        'get-list-event-promotion-home',
        'get-content-event-promotin-by-id',
        '/api/get-all-type-product',

        //user
        '/api/create-user',
        '/api/user-login',
        'refresh-token',
        'login-google',
        'login-facebook',
        'login-github',
        'check-key-verify',
        'update-video-evaluate',
        'upload-images-evaluate-product',
        '/api/verify-create-user',
    ];

    let check = false;
    ignore.forEach((item) => {
        if (url.indexOf(item) >= 0) check = true;
    });

    return check;
};

module.exports = {
    IgnoreUrl,
};
