import axios from "../axios";
import axios2 from "axios";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
});

const addTypeProduct = async (data) => {
  try {
    return await axios.post(
      `/api/add-type-product?nameTypeProduct=${data.nameTypeProduct}&accessToken=${data.accessToken}`,
      data.file
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:13 ~ addTypeProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getTypeProduct = async () => {
  try {
    return await axios.get("/api/get-all-type-product");
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:22 ~ getTypeProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const editTypeProduct = async (data) => {
  try {
    return await axios.put(
      `/api/update-type-produt-by-id?idTypeProduct=${data.id}&nameTypeProduct=${data.nameTypeProduct}&accessToken=${data.accessToken}`,
      data.form
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:31 ~ editTypeProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getTrademarks = async (data) => {
  try {
    return await axios.get("/api/get-all-trademark", { params: data });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:40 ~ getTrademarks ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const addTrademark = async (data) => {
  try {
    return await axios.post("/api/add-trademark", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:49 ~ addTrademark ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const editTrademark = async (data) => {
  try {
    return await axios.put("/api/update-trademark-by-id", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:58 ~ editTrademark ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const cloudinaryUpload = async (fileToUpload, idProduct) => {
  try {
    return await axios.post(
      `/cloudinary-upload?idProduct=${idProduct}`,
      fileToUpload
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:67 ~ cloudinaryUpload ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const addNewProduct = async (data) => {
  try {
    return await axios.post("/api/create-new-product", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:76 ~ addNewProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getProductByPage = async (page, idTypeProduct, nameFillterProduct) => {
  try {
    return await axios.get(
      `/api/get-list-product-by-page?page=${page}&idTypeProduct=${idTypeProduct}&nameProduct=${nameFillterProduct}`
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:85 ~ getProductByPage ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const blockProduct = async (isSell, idProduct) => {
  try {
    return await axios.put("/api/block-product", {
      isSell,
      idProduct,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:98 ~ blockProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const editProductById = async (data) => {
  try {
    return await axios.put("/api/edit-product-by-id", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:107 ~ editProductById ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const editImageProduct = async (fileImg, num, idProduct) => {
  try {
    return await axios.put(
      `/api/edit-image-product?num=${num}&idProduct=${idProduct}`,
      fileImg
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:116 ~ editImageProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const swapImageProduct = async (data) => {
  try {
    return await axios.post("/api/swap-image-product", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:125 ~ swapImageProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getProductPromotion = async (data) => {
  try {
    return await axios.get(
      `/api/get-list-product-by-swap-and-page?currentPage=${data.currentPage}&typeSwap=${data.typeSwap}`
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:134 ~ getProductPromotion ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const addPromotionByIdProduct = async (data) => {
  try {
    return await axios.post("/api/add-promotion-by-idproduct", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:143 ~ addPromotionByIdProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const deleteErrorProduct = async (id) => {
  try {
    return await axios.delete("/api/v1/delete-error-product", {
      data: {
        id,
      },
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:156 ~ deleteErrorProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};
const getListBillsByType = async (type) => {
  return await client.query({
    query: gql`
        query listBill {

listBillByType(type: "${type}") {
  id
  note
  timeBill
  totals

  detailBill {
    amount
    isReviews
    classifyProduct {
      nameClassifyProduct
      priceClassify
    }

    product {
        id
      nameProduct
      priceProduct
      promotionProduct {
        numberPercent
        timePromotion
      }
    }
  }
  addressUser {
      id
      addressText
      country
      fullname
      sdt
      district
    }
  
}
}
        `,
    fetchPolicy: "network-only",
  });
};

const confirmBillById = async (data) => {
  try {
    return await axios.put("/api/v1/confirm-bill-by-id", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:210 ~ confirmBillById ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const cancelBillById = async (data) => {
  try {
    return await axios.put("/api/v1/cancel-bill-by-id", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:219 ~ cancelBillById ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const createNewKeyword = async (data) => {
  try {
    return await axios.post("/api/v1/create-new-keyword", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:228 ~ createNewKeyword ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const createNotify_noimage = async (data) => {
  try {
    return await axios.post("/api/v1/create-notify-noimage", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:237 ~ constcreateNotify_noimage= ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const createNotify_image = async (form, data) => {
  try {
    return await axios.post(
      `/api/v1/create-notify-image?title=${data.title}&content=${data.content}&link=${data.link}&typeNotify=${data.typeNotify}&accessToken=${data.accessToken}&timePost=${data.timePost}`,
      form
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:246 ~ constcreateNotify_image= ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const adminLogin = async (data) => {
  try {
    return await axios.post("/api/user-login", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:255 ~ adminLogin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const CheckAdminLogin = async (data) => {
  try {
    return await axios.post("/api/v1/check-login-admin-access-token", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:264 ~ CheckAdminLogin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const createNewUserAdmin = async (data) => {
  try {
    return await axios.post("/api/v1/create-new-user-admin", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:273 ~ createNewUserAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListUserAdmin = async (data) => {
  try {
    return await axios.get("/api/v1/get-list-user", {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:284 ~ getListUserAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const lockUserAdmin = async (data) => {
  try {
    return await axios.put("/api/v1/lock-user", data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:293 ~ lockUserAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListProductPromotion = async () => {
  return await client.query({
    query: gql`
      query ExampleQuery {
        products {
          nameProduct
          id
          promotionProduct {
            numberPercent
          }
          trademark {
            nameTrademark
          }
          typeProduct {
            nameTypeProduct
          }
        }
      }
    `,
    fetchPolicy: "network-only",
  });
};

const createEventPromotion = async (data) => {
  try {
    return await axios.post(`/api/v1/create-event-promotion`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:328 ~ createEventPromotion ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const uploadImageCoverPromotion = async (form, data) => {
  try {
    return await axios.post(
      `/api/v1/upload-image-cover-promotion?idEventPromotion=${data.idEventPromotion}`,
      form
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:337 ~ uploadImageCoverPromotion ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListEventPromotion = async () => {
  try {
    return await axios.get(`/api/v1/get-list-event-promotion`);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:346 ~ getListEventPromotion ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const editEventPromotionById = async (data) => {
  try {
    return await axios.put(`/api/v1/edit-event-promotion`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:355 ~ editEventPromotionById ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListBillByTypeAdmin = async (data) => {
  try {
    return await axios.get(`/api/v1/get-list-bill-by-type-admin`, {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:364 ~ getListBillByTypeAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const updateStatusBillAdmin = async (data) => {
  try {
    return await axios.put(`/api/v1/update-status-bill-admin-web`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:373 ~ updateStatusBillAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListVideoAdminbyPage = async (data) => {
  try {
    return await axios.get(`/api/v1/get-list-video-admin-by-page`, {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:382 ~ getListVideoAdminbyPage ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const deleteShortVideoAdmin = async (data) => {
  try {
    return await axios.delete("/api/v1/delete-short-video-admin", {
      data: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:393 ~ deleteShortVideoAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListReportVideoAdmin = async (data) => {
  try {
    return await axios.get(`/api/v1/get-list-report-admin`, { params: data });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:402 ~ getListReportVideoAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const skipReportVideoAdmin = async (data) => {
  try {
    return await axios.put(`/api/v1/skip-report-video-admin`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:411 ~ skipReportVideoAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListBlogAdminByPage = async (data) => {
  try {
    return await axios.get(`/api/v1/get-list-blog-admin-by-page`, {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:420 ~ getListBlogAdminByPage ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const deleteBlogVideoAdmin = async (data) => {
  try {
    return await axios.delete("/api/v1/delete-blog-admin-by-id", {
      data: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:431 ~ deleteBlogVideoAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListReportBlogAdmin = async (data) => {
  try {
    return await axios.get(`/api/v1/get-list-report-blog-admin`, {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:440 ~ getListReportBlogAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const skipReportBlogAdmin = async (data) => {
  try {
    return await axios.put(`/api/v1/skip-report-blog-admin`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:449 ~ skipReportBlogAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getContentEventPromotionAdmin = async (data) => {
  try {
    return await axios.get(`/api/v1/get-content-event-promotin-by-id`, {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:458 ~ getContentEventPromotionAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getStatisticalAdmin = async (data) => {
  try {
    return await axios.get(`/api/v1/get-statistical-admin`, { params: data });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:467 ~ getStatisticalAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const StatisticalEvaluateAdmin = async (data) => {
  try {
    return await axios.get(`/api/v1/statistical-evaluate-admin`, {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:476 ~ StatisticalEvaluateAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getStatisticalSale = async (data) => {
  try {
    return await axios.get(`/api/v1/get-statistical-sale`, { params: data });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:485 ~ getStatisticalSale ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListKeyWord = async (data) => {
  try {
    return await axios.get(`/api/v1/get-list-key-word`, { params: data });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:494 ~ getListKeyWord ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const editKeywordSearch = async (data) => {
  try {
    return await axios.put(`/api/v1/edit-keyword-search-admin`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:503 ~ editKeywordSearch ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const deleteKeyWordSearchAdmin = async (data) => {
  try {
    return await axios.delete("/api/v1/delete-keyword-admin", {
      data: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:514 ~ deleteKeyWordSearchAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListTypeUser = async (data) => {
  try {
    return await axios.get(`/api/v1/get-list-user-type-admin`, {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:523 ~ getListTypeUser ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const deleteEventProdmotionAdmin = async (data) => {
  try {
    return await axios.delete("/api/v1/delete-event-promotion-admin", {
      data: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:534 ~ deleteEventProdmotionAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getCountBillOfMonth = async (data) => {
  try {
    return await axios.get(`/api/v1/get-count-bill-of-month`, { params: data });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:544 ~ getCountBillOfMonth ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getMoneyOfMonth = async (data) => {
  try {
    return await axios.get(`/api/v1/get-money-of-month`, { params: data });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:553 ~ getMoneyOfMonth ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getDetailBillByIdAdmin = async (data) => {
  try {
    return await axios.get(`/api/v1/get-detail-bill-by-id-admin`, {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:562 ~ getDetailBillByIdAdmin ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getInventoryByIdTypeProduct = async (data) => {
  try {
    return await axios.get(`/api/v1/get-inventory-by-type-product`, {
      params: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:571 ~ getInventoryByIdTypeProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const adminLoginV2 = async (data) => {
  try {
    return await axios.post(`/api/v2/admin-login`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:580 ~ adminLoginV2 ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const handleCheckLoginAdmin = async (idType = "2") => {
  try {
    let res = await axios.post("/api/v2/check-login-with-admin", { idType });
    console.log("Check login: ", res);

    if (res?.errCode === 1) {
      window.location.href = "/";
      return;
    }

    if (res?.errCode !== 0) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshTolen");

      window.location.href = "/login";
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:597 ~ handleCheckLoginAdmin ~ error:",
      error
    );

    if (error?.response?.status < 500) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshTolen");

      window.location.href = "/login";
    }
  }
};

//mucic app
const ThemCaSiService = async (form, data) => {
  try {
    return await axios.post(
      `/api/v2/them-ca-si?tenCaSi=${data.tenCaSi}&moTa=${data.moTa}`,
      form
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:13 ~ addTypeProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const layDsCaSiService = async () => {
  try {
    return await axios.get(`/api/v2/lay-ds-ca-si`);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:544 ~ getCountBillOfMonth ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const xoaCaSiService = async (data) => {
  try {
    return await axios.delete("/api/v2/xoa-ca-si", {
      data: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:534 ~ xoaCaSiService ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const suaCaSiService = async (data) => {
  try {
    return await axios.put(`/api/v2/sua-ca-si`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:503 ~ suaCaSiService ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const themBaiHat = async (form, data) => {
  try {
    return await axios.post(
      `/api/v2/them-bai-hat`,
      form, {
      params: data
    }
    );
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:13 ~ addTypeProduct ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const layDsBaiHatService = async () => {
  try {
    return await axios.get(`/api/v2/lay-ds-bai-hat`);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:544 ~ getCountBillOfMonth ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const xoaBaiHat = async (data) => {
  try {
    return await axios.delete("/api/v2/xoa-bai-hat", {
      data: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:534 ~ xoaBaiHat ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const suaBaiHatService = async (data) => {
  try {
    return await axios.put(`/api/v2/sua-bai-hat`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:503 ~ suaCaSiService ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const timKiemBaiHatById = async (data) => {
  try {
    return await axios.get(`/api/v2/tim-kiem-bai-hat-by-id`, { params: data });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:503 ~ suaCaSiService ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const themLoiBaiHat = async (data) => {
  try {
    return await axios.post(`/api/v2/them-loi-bai-hat`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:503 ~ suaCaSiService ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const getListLoiBaiHat = async (data) => {
  try {
    return await axios.get(`/api/v2/get-list-loi-bai-hat`, { params: data });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:503 ~ suaCaSiService ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const suaLoiBaiHatById = async (data) => {
  try {
    return await axios.put(`/api/v2/sua-loi-bai-hat-by-id`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:503 ~ suaCaSiService ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const suaThoiGianBaiHatById = async (data) => {
  try {
    return await axios.put(`/api/v2/sua-thoi-gian-bai-hat-by-id`, data);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:503 ~ suaCaSiService ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const xoaLoiBaiHat = async (data) => {
  try {
    return await axios.delete("/api/v2/xoa-loi-bai-hat-by-id", {
      data: data,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:534 ~ xoaBaiHat ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};

const checkStatusServer = async (link) => {
  try {
    return await axios2.get(link);
  } catch (error) {
    console.log(
      "🚀 ~ file: adminService.js:503 ~ suaCaSiService ~ error:",
      error?.response?.data || error
    );
    return error?.response?.data || { errCode: -1, errMessage: "Error" };
  }
};



//end music app

export {
  addTypeProduct,
  getTypeProduct,
  editTypeProduct,
  getTrademarks,
  addTrademark,
  editTrademark,
  cloudinaryUpload,
  addNewProduct,
  getProductByPage,
  blockProduct,
  editProductById,
  editImageProduct,
  swapImageProduct,
  getProductPromotion,
  addPromotionByIdProduct,
  deleteErrorProduct,
  getListBillsByType,
  confirmBillById,
  cancelBillById,
  createNewKeyword,
  createNotify_noimage,
  createNotify_image,
  adminLogin,
  CheckAdminLogin,
  createNewUserAdmin,
  getListUserAdmin,
  lockUserAdmin,
  getListProductPromotion,
  createEventPromotion,
  uploadImageCoverPromotion,
  getListEventPromotion,
  editEventPromotionById,
  getListBillByTypeAdmin,
  updateStatusBillAdmin,
  getListVideoAdminbyPage,
  deleteShortVideoAdmin,
  getListReportVideoAdmin,
  skipReportVideoAdmin,
  getListBlogAdminByPage,
  deleteBlogVideoAdmin,
  getListReportBlogAdmin,
  skipReportBlogAdmin,
  getContentEventPromotionAdmin,
  getStatisticalAdmin,
  StatisticalEvaluateAdmin,
  getStatisticalSale,
  getListKeyWord,
  editKeywordSearch,
  deleteKeyWordSearchAdmin,
  getListTypeUser,
  deleteEventProdmotionAdmin,
  getCountBillOfMonth,
  getMoneyOfMonth,
  getDetailBillByIdAdmin,
  getInventoryByIdTypeProduct,
  adminLoginV2,
  handleCheckLoginAdmin,
  checkStatusServer,

  //music app
  ThemCaSiService,
  layDsCaSiService,
  xoaCaSiService,
  suaCaSiService,
  themBaiHat,
  layDsBaiHatService,
  xoaBaiHat,
  suaBaiHatService,
  timKiemBaiHatById,
  themLoiBaiHat,
  getListLoiBaiHat,
  suaLoiBaiHatById,
  suaThoiGianBaiHatById,
  xoaLoiBaiHat
  //end music app
};
