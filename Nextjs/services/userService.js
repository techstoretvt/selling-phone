import axios from './axios';
import axios_header from './axios_header';

const CreateUser = async (data) => {
    try {
        return await axios.post('/api/create-user', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:8 ~ CreateUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const verifyCreateUser = async (data) => {
    try {
        return await axios.post('/api/verify-create-user', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:19 ~ verifyCreateUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const UserLogin = async (data) => {
    try {
        return await axios.post('/api/user-login', data, {
            withCredentials: true,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:30 ~ UserLogin ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const refreshTokenService = async (data) => {
    try {
        return await axios.post('/api/refresh-token', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:41 ~ refreshTokenService ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const GetUserLogin = async () => {
    try {
        return await axios.get(`/api/get-user-login`);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:24 ~ GetUserLogin ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const GetUserLoginRefreshToken = async (data) => {
    try {
        return await axios.get(
            `/api/v1/get-user-login-refresh-token?refreshToken=${data}`
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:63 ~ GetUserLoginRefreshToken ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const loginGoogle = async (data) => {
    try {
        return await axios.post('/api/login-google', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:72 ~ loginGoogle ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const loginFacebook = async (data) => {
    try {
        return await axios.post('/api/login-facebook', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:81 ~ loginFacebook ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const loginGithub = async (data) => {
    try {
        return await axios.post('/api/login-github', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:90 ~ loginGithub ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const addCartProduct = async (data) => {
    try {
        return await axios.post('/api/v1/add-product-to-cart', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:99 ~ addCartProduct ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const addCartOrMoveCart = async (data) => {
    try {
        return await axios.post('/api/v1/add-cart-or-move-cart', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:108 ~ addCartOrMoveCart ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const addNewAddressUser = async (data) => {
    try {
        return await axios.post('/api/v1/add-new-address-user', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:117 ~ addNewAddressUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getAddressUser = async (data) => {
    try {
        return await axios.get(`/api/v1/get-address-user?accessToken=${data}`);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:126 ~ getAddressUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const setDefaultAddress = async (data) => {
    try {
        return await axios.put(`/api/v1/set-default-address`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:135 ~ setDefaultAddress ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const deleteAddresUser = async (data) => {
    try {
        return await axios.delete(`/api/v1/delete-address-user`, { data });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:144 ~ deleteAddresUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const editAddressUser = async (data) => {
    try {
        return await axios.put(`/api/v1/edit-address-user`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:153 ~ editAddressUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getListCartUser = async (accessToken) => {
    try {
        return await axios.get(
            `/api/v1/get-list-cart-user?accessToken=${accessToken}`
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:184 ~ getListCartUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const editAmountCart = async (data) => {
    try {
        return await axios.put(`/api/v1/edit-amount-cart-user`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:195 ~ editAmountCart ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const chooseProdcutInCart = async (data) => {
    try {
        return await axios.put(`/api/v1/choose-product-in-cart`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:206 ~ chooseProdcutInCart ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const deleteProductInCart = async (data) => {
    try {
        return await axios.delete(`/api/v1/delete-product-in-cart`, { data });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:217 ~ deleteProductInCart ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const updateClassifyProductInCart = async (data) => {
    try {
        return await axios.put(`/api/v1/update-classify-product-in-cart`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:228 ~ updateClassifyProductInCart ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const handlePurchase = async (data) => {
    try {
        return await axios.post('/api/v1/create-new-bill', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:239 ~ handlePurchase ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const chooseAddProductInCart = async (data) => {
    try {
        return await axios.put(`/api/v1/choose-all-product-in-cart`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:250 ~ chooseAddProductInCart ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getListBillByType = async (data) => {
    try {
        return await axios.get(
            `/api/v1/get-list-bill-by-type?accessToken=${data.accessToken}&type=${data.type}&offset=${data.offset}`
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:261 ~ getListBillByType ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const userCancelBill = async (data) => {
    try {
        return await axios.put(`/api/v1/user-cancel-bill`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:272 ~ userCancelBill ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const userRepurchaseBill = async (data) => {
    try {
        return await axios.post('/api/v1/user-repurchase-bill', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:283 ~ userRepurchaseBill ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getCodeVeridyForgetPass = async (data) => {
    try {
        return await axios.put(`/apt/v1/get-code-verify-forget-pass`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:294 ~ getCodeVeridyForgetPass ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const setPassForget = async (data) => {
    try {
        return await axios.put(`/api/v1/change-pass-forget`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:305 ~ setPassForget ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const checkKeyVerify = async (data) => {
    try {
        return await axios.post('/api/v1/check-key-verify', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:316 ~ checkKeyVerify ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const hasRecievedProduct = async (data) => {
    try {
        return await axios.put(`/api/v1/has-received-product`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:327 ~ hasRecievedProduct ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const buyProductByCard = async (data) => {
    try {
        return await axios.post('/api/v1/buy-product-by-card', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:338 ~ buyProductByCard ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const createNewEvalueProduct = async (data) => {
    try {
        return await axios.post('api/v1/create-new-evaluate-product', data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:349 ~ createNewEvalueProduct ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const uploadVideoEvaluateProduct = async (data, id) => {
    try {
        return await axios.post(
            `/apit/v1/upload-video-evaluate-product?id=${id}`,
            data
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:360 ~ uploadVideoEvaluateProduct ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const uploadImagesEvaluateProduct = async (data, id) => {
    try {
        return await axios.post(
            `/apit/v1/upload-images-evaluate-product?id=${id}`,
            data
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:371 ~ uploadImagesEvaluateProduct ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const createNewEvaluateFailed = async (data) => {
    try {
        return await axios.delete(
            `/api/v2/create-new-evaluate-product-failed`,
            { data }
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:382 ~ createNewEvaluateFailed ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const updateEvaluateProduct = async (data) => {
    try {
        return await axios.put(`/api/v1/update-evaluate-product`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:393 ~ updateEvaluateProduct ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const deleteVideoEvaluate = async (data) => {
    try {
        return await axios.delete(`/api/v2/delete-video-evaluate`, { data });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:404 ~ deleteVideoEvaluate ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const updateVideoEvaluateProduct = async (data, id) => {
    try {
        return await axios.post(`/api/v1/update-video-evaluate?id=${id}`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:415 ~ updateVideoEvaluateProduct ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const updateProfileUser = async (data) => {
    try {
        return await axios.put(`/api/v1/update-profile-user`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:426 ~ updateProfileUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const updateAvatarUser = async (data, accessToken) => {
    try {
        return await axios.put(
            `/api/v1/update-avatar-user?accessToken=${accessToken}`,
            data
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:437 ~ updateAvatarUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getCodeChangePass = async (data) => {
    try {
        return await axios.put(`/api/v1/get-confirm-code-change-pass`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:448 ~ getCodeChangePass ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};
const confirmCodeChangePass = async (data) => {
    try {
        return await axios.put(`/api/v1/confirm-code-change-pass`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:458 ~ confirmCodeChangePass ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const createNewBlog = async (data) => {
    try {
        return await axios.post(`/api/v1/create-new-blog`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:469 ~ createNewBlog ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};
const createNewImageBlog = async (data, idBlog) => {
    try {
        return await axios.post(
            `/api/v1/create-new-image-blog?idBlog=${idBlog}`,
            data
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:479 ~ createNewImageBlog ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};
const createNewVideoBlog = async (data, idBlog) => {
    try {
        return await axios.post(
            `/api/v1/upload-new-video-blog?idBlog=${idBlog}`,
            data
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:489 ~ createNewVideoBlog ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getBlogById = async (data) => {
    try {
        return await axios.get(`/api/v1/get-blog-edit-by-id`, { params: data });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:500 ~ getBlogById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const updateBlog = async (data) => {
    try {
        return await axios.put(`/api/v1/update-blog`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:512 ~ updateBlog ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const shareProduct = async (data) => {
    try {
        return await axios.post(`/api/v1/share-product`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:523 ~ shareProduct ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const shareBlog = async (data) => {
    try {
        return await axios.post(`/api/v1/share-blog`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:534 ~ shareBlog ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const toggleLikeBlog = async (data) => {
    try {
        return await axios.post(`/api/v1/toggle-like-blog`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:545 ~ toggleLikeBlog ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const createNewCommentBlog = async (data) => {
    try {
        return await axios.post(`api/v1/create-new-comment-blog`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:556 ~ createNewCommentBlog ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const createNewShortVideo = async (data) => {
    try {
        return await axios.post(`/api/v1/create-new-short-video`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:567 ~ createNewShortVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const uploadCoverImageShortVideo = async (data, idShortVideo) => {
    try {
        return await axios.post(
            `/api/v1/upload-cover-image-short-video?idShortVideo=${idShortVideo}`,
            data
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:578 ~ uploadCoverImageShortVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const uploadVideoForShortVideo = async (data, idShortVideo) => {
    try {
        return await axios.post(
            `/api/v1/upload-video-for-short-video?idShortVideo=${idShortVideo}`,
            data
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:589 ~ uploadVideoForShortVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getShortVideoById = async (data) => {
    try {
        return await axios.get(`/api/v1/get-short-video-by-id`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:600 ~ getShortVideoById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const updateShortVideo = async (data) => {
    try {
        return await axios.put(`/api/v1/update-short-video-by-id`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:611 ~ updateShortVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getBlogUserByPage = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-blog-user-by-page`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:622 ~ getBlogUserByPage ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const deleteBlogUserById = async (data) => {
    try {
        return await axios.delete(`/api/v1/delete-blog-user-by-id`, { data });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:633 ~ deleteBlogUserById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const editContentBlogUserById = async (data) => {
    try {
        return await axios.put(`/api/v1/edit-content-blog-user-by-id`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:644 ~ editContentBlogUserById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const deleteCommentBlogById = async (data) => {
    try {
        return await axios.delete(`/api/v1/delete-comment-blog-by-id`, {
            data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:655 ~ deleteCommentBlogById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const updateCommentBlogById = async (data) => {
    try {
        return await axios.put(`/api/v1/updete-comment-blog-by-id`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:666 ~ updateCommentBlogById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getBlogUserByIdUser = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-blog-by-id-user`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:677 ~ getBlogUserByIdUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const saveBlogCollection = async (data) => {
    try {
        return await axios.post(`/api/v1/save-blog-collection`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:688 ~ saveBlogCollection ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getCollectionBlogUserByPage = async (data) => {
    try {
        return await axios.get(
            `/api/v1/get-list-collection-blog-user-by-page`,
            { params: data }
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:699 ~ getCollectionBlogUserByPage ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const deleteCollectBlogById = async (data) => {
    try {
        return await axios.delete(`/api/v1/delete-collect-blog-by-id`, {
            data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:710 ~ deleteCollectBlogById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const createCommentShortVideo = async (data) => {
    try {
        return await axios.post(`/api/v1/create-comment-short-video`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:721 ~ createCommentShortVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const deleteCommentShortVideoById = async (data) => {
    try {
        return await axios.delete(`/api/v1/delete-comment-shortvideo-by-id`, {
            data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:732 ~ deleteCommentShortVideoById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const editCommentShortVideoById = async (data) => {
    try {
        return await axios.put(`/api/v1/edit-comment-shortvideo-by-id`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:743 ~ editCommentShortVideoById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const toggleLikeShortVideo = async (data) => {
    try {
        return await axios.post(`/api/v1/toggle-like-shortvideo`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:754 ~ toggleLikeShortVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const checkUserLikeShortVideo = async (data) => {
    try {
        return await axios.get(`/api/v1/check-user-like-shortvideo`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:765 ~ checkUserLikeShortVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const toggleSaveCollectionShortVideo = async (data) => {
    try {
        return await axios.post(`/api/v1/save-collection-short-video`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:776 ~ toggleSaveCollectionShortVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const checkSaveCollectionShortVideo = async (data) => {
    try {
        return await axios.get(`/api/v1/check-save-collection-short-video`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:787 ~ checkSaveCollectionShortVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getListVideoByIdUser = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-video-by-id-user`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:798 ~ getListVideoByIdUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getUserById = async (data) => {
    try {
        return await axios.get(`/api/v1/get-user-by-id`, { params: data });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:809 ~ getUserById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const deleteShortVideoById = async (data) => {
    try {
        return await axios.delete(`/api/v1/delete-short-video-by-id`, { data });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:820 ~ deleteShortVideoById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const checkLikeBlogById = async (data) => {
    try {
        return await axios.get(`/api/v1/check-like-blog-by-id`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:831 ~ checkLikeBlogById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};
const checkSaveBlogById = async (data) => {
    try {
        return await axios.get(`/api/v1/check-save-blog-by-id`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:841 ~ checkSaveBlogById ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const testApi = async (data) => {
    // axios_header.defaults.headers.common['Authorization'] = `Bearer sfsdfsdsdf.sdf.sdfsd`;
    try {
        return await axios_header.get(`/api/v1/test-header-login`, {
            params: data,
            headers: {
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Qr5OSTrD3SgDeKzYsv46j5IwJRmsau_J_mYT9QkV8X',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:859 ~ testApi ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getListNotifyAll = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-notify-all`, { params: data });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:870 ~ getListNotifyAll ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getListNotifyByPage = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-notify-by-type`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:881 ~ getListNotifyByPage ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const seenNotifyOfUser = async (data) => {
    try {
        return await axios.put(`/api/v1/seen-notify-of-user`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:892 ~ seenNotifyOfUser ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const getListBillByIdBill = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-status-bill-admin`, {
            params: data,
        });
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:903 ~ getListBillByIdBill ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const sendEmailfromContact = async (data) => {
    try {
        return await axios.post(`/api/v1/send-email-from-contact`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:914 ~ sendEmailfromContact ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const createNewReportVideo = async (data) => {
    try {
        return await axios.post(`/api/v1/create-new-report-video`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:925 ~ createNewReportVideo ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

const createNewReportBlog = async (data) => {
    try {
        return await axios.post(`/api/v1/create-new-report-blog`, data);
    } catch (error) {
        console.log(
            '🚀 ~ file: userService.js:936 ~ createNewReportBlog ~ error:',
            error?.response?.data
        );
        return {
            errCode: -1,
        };
    }
};

export {
    CreateUser,
    verifyCreateUser,
    UserLogin,
    refreshTokenService,
    GetUserLogin,
    loginGoogle,
    loginFacebook,
    loginGithub,
    addCartProduct,
    addCartOrMoveCart,
    addNewAddressUser,
    getAddressUser,
    setDefaultAddress,
    deleteAddresUser,
    editAddressUser,
    getListCartUser,
    editAmountCart,
    chooseProdcutInCart,
    deleteProductInCart,
    updateClassifyProductInCart,
    handlePurchase,
    chooseAddProductInCart,
    GetUserLoginRefreshToken,
    getListBillByType,
    userCancelBill,
    userRepurchaseBill,
    getCodeVeridyForgetPass,
    setPassForget,
    checkKeyVerify,
    hasRecievedProduct,
    buyProductByCard,
    createNewEvalueProduct,
    uploadVideoEvaluateProduct,
    uploadImagesEvaluateProduct,
    createNewEvaluateFailed,
    updateEvaluateProduct,
    deleteVideoEvaluate,
    updateVideoEvaluateProduct,
    updateProfileUser,
    updateAvatarUser,
    getCodeChangePass,
    confirmCodeChangePass,
    createNewBlog,
    createNewImageBlog,
    createNewVideoBlog,
    getBlogById,
    updateBlog,
    shareProduct,
    shareBlog,
    toggleLikeBlog,
    createNewCommentBlog,
    createNewShortVideo,
    uploadCoverImageShortVideo,
    uploadVideoForShortVideo,
    getShortVideoById,
    updateShortVideo,
    getBlogUserByPage,
    deleteBlogUserById,
    editContentBlogUserById,
    deleteCommentBlogById,
    updateCommentBlogById,
    getBlogUserByIdUser,
    saveBlogCollection,
    getCollectionBlogUserByPage,
    deleteCollectBlogById,
    createCommentShortVideo,
    deleteCommentShortVideoById,
    editCommentShortVideoById,
    toggleLikeShortVideo,
    checkUserLikeShortVideo,
    toggleSaveCollectionShortVideo,
    checkSaveCollectionShortVideo,
    getListVideoByIdUser,
    getUserById,
    deleteShortVideoById,
    checkLikeBlogById,
    checkSaveBlogById,
    testApi,
    getListNotifyAll,
    getListNotifyByPage,
    seenNotifyOfUser,
    getListBillByIdBill,
    sendEmailfromContact,
    createNewReportVideo,
    createNewReportBlog,
};
