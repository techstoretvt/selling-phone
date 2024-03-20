import axios from './axios'

const checkStartServer = async () => {
    try {
        return await axios.get('/api/v1/check-start-server')
    }
    catch (e) {
        console.log("🚀 ~ file: appService.js:8 ~ checkStartServer ~ e:", e)
        return {
            errCode: -1
        }
    }
}

const getPromotionProduct = async () => {
    try {

        return await axios.get('/api/v1/get-product-promotion-home').catch((e) => {
            console.log('Mất kết nối tới server promotion!', e);
        })
    }
    catch (e) {
        console.log("🚀 ~ file: appService.js:23 ~ getPromotionProduct ~ e:", e)

        return {
            errCode: -1
        }
    }
}
const getTopSellProduct = async () => {
    try {

        return await axios.get('/api/vi/get-top-sell-product').catch((e) => {
            console.log('Mất kết nối tới server top-sell-product!', e);
        })
    }
    catch (e) {
        console.log("🚀 ~ file: appService.js:38 ~ getTopSellProduct ~ e:", e)

        return {
            errCode: -1
        }
    }
}

const getProductFlycam = async () => {
    try {

        return await axios.get(`/api/v1/get-product-type-flycam`).catch((e) => {
            console.log('Mất kết nối tới server product-type-flycam!', e);
        })
    }
    catch (e) {
        console.log("🚀 ~ file: appService.js:54 ~ getProductFlycam ~ e:", e)

        return {
            errCode: -1
        }
    }
}
const getAllTypeProduct = async () => {
    try {
        return await axios.get('/api/get-all-type-product');
    } catch (error) {
        console.log("🚀 ~ file: appService.js:65 ~ getAllTypeProduct ~ error:", error)
        return {
            errCode: -1
        }
    }
}


const getNewCollectionProduct = async (data) => {
    try {
        return await axios.get(`/api/vi/get-new-collection-product?typeProduct=${data}`);
    } catch (error) {
        console.log("🚀 ~ file: appService.js:77 ~ getNewCollectionProduct ~ error:", error)
        return {
            errCode: -1
        }
    }
}


const getListProductMayLike = async (nameTypeProduct, id) => {
    try {
        return await axios.get(`/api/v1/get-list-product-may-like?nameTypeProduct=${nameTypeProduct}&id=${id}`);
    } catch (error) {
        console.log("🚀 ~ file: appService.js:89 ~ getListProductMayLike ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getEvaluateById = async (data) => {
    try {
        return await axios.get(`/api/v1/get-evaluate-by-id-product`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:100 ~ getEvaluateById ~ error:", error)
        return {
            errCode: -1
        }
    }
}


const searchProduct = async (data) => {
    try {
        return await axios.get(`/api/v1/search-product`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:112 ~ searchProduct ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const createNewKeyword = async (data) => {
    try {
        return await axios.post(`/api/v1/create-new-keyword`, data);
    } catch (error) {
        console.log("🚀 ~ file: appService.js:123 ~ createNewKeyword ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getListBlogs = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-blog`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:134 ~ getListBlogs ~ error:", error)
        return {
            errCode: -1
        }
    }
}
const getListHashTag = async () => {
    try {
        return await axios.get(`/api/v1/get-list-hashtag`);
    } catch (error) {
        console.log("🚀 ~ file: appService.js:144 ~ getListHashTag ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getBlogShareProduct = async (data) => {
    try {
        return await axios.get(`/api/v1/get-blog-share-product`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:155 ~ getBlogShareProduct ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getBlogShareDefault = async (data) => {
    try {
        return await axios.get(`/api/v1/get-blog-share-default`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:166 ~ getBlogShareDefault ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getBlogById = async (data) => {
    try {
        return await axios.get(`/api/v1/get-blog-by-id`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:177 ~ getBlogById ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getCommentBlogByIdBlog = async (data) => {
    try {
        return await axios.get(`/api/v1/get-comment-blog-by-id-blog`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:188 ~ getCommentBlogByIdBlog ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const increateViewBlogById = async (data) => {
    try {
        return await axios.put(`/api/v1/increase-view-blog-by-id`, data);
    } catch (error) {
        console.log("🚀 ~ file: appService.js:199 ~ increateViewBlogById ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getListShortVideo = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-short-video`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:210 ~ getListShortVideo ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getListCommentShortVideoById = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-comment-short-video-by-id`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:221 ~ getListCommentShortVideoById ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getListProductHashTagShortVideo = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-product-hashtag-by-id-video`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:232 ~ getListProductHashTagShortVideo ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getProductById = async (data) => {
    try {
        return await axios.get(`/api/v1/get-product-by-id`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:243 ~ getProductById ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getListBlogHome = async () => {
    try {
        return await axios.get(`/api/v1/get-list-blog-home`);
    } catch (error) {
        console.log("🚀 ~ file: appService.js:254 ~ getListBlogHome ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getEventPromotionById = async (data) => {
    try {
        return await axios.get(`/api/v1/get-event-promotion-by-id`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:265 ~ getEventPromotionById ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getListEventPromotion = async (data) => {
    try {
        return await axios.get(`/api/v1/get-list-event-promotion`);
    } catch (error) {
        console.log("🚀 ~ file: appService.js:276 ~ getListEventPromotion ~ error:", error)
        return {
            errCode: -1
        }
    }
}

const getContentEventPromotionById = async (data) => {
    try {
        return await axios.get(`/api/v1/get-content-event-promotin-by-id`, { params: data });
    } catch (error) {
        console.log("🚀 ~ file: appService.js:287 ~ getContentEventPromotionById ~ error:", error)
        return {
            errCode: -1
        }
    }
}



export {
    checkStartServer,
    getPromotionProduct,
    getAllTypeProduct,
    getTopSellProduct,
    getNewCollectionProduct,
    getProductFlycam,
    getListProductMayLike,
    getEvaluateById,
    searchProduct,
    createNewKeyword,
    getListBlogs,
    getListHashTag,
    getBlogShareProduct,
    getBlogShareDefault,
    getBlogById,
    getCommentBlogByIdBlog,
    increateViewBlogById,
    getListShortVideo,
    getListCommentShortVideoById,
    getListProductHashTagShortVideo,
    getProductById,
    getListBlogHome,
    getEventPromotionById,
    getListEventPromotion,
    getContentEventPromotionById
}