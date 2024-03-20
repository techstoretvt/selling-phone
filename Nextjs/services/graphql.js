import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
});

const getTypeProductGQL = async () => {
  return await
    client.query({
      query: gql`
        query getTypeProduct {
          typeproducts {
            id
            nameTypeProduct
          }
        }
      `,
    })
}
const getProductById = async (idProduct) => {
  return await
    client.query({
      query: gql`
      query getProductById {
 product(id: "${idProduct}") {
   id
   nameProduct
   priceProduct
   contentHTML
   isSell
   sold
   typeProduct {
     nameTypeProduct
   }
   trademark {
     nameTrademark
   }
   imageProduct {
     imagebase64
     STTImage
   }
   classifyProduct {
     id
     amount
     nameClassifyProduct
     priceClassify
     STTImg
   }
   promotionProduct {
     numberPercent
     timePromotion
   }
   countEvaluate
   persentElevate
 }
}
    `,
    })
}

const getBillById = async (idBill) => {
  return await
    client.query({
      query: gql`
      query BillById {
  BillById(id:"${idBill}") {
    id
    idStatusBill
    timeBill
    updatedAt
    createdAt
    totals
    payment
    addressUser {
      fullname
      sdt
      addressText
      district
      country
    }
    detailBill {
      id
      amount
      product {
        id
        nameProduct
        priceProduct
        imageProduct {
          STTImage
          imagebase64
        }
        promotionProduct {
          numberPercent
          timePromotion
        }
      }
      classifyProduct {
        amount
        nameClassifyProduct
        priceClassify
        STTImg
      }
      isReviews
    }
  }
}
    `,
      fetchPolicy: 'network-only'
    })
}

const getDetailBillById = async (idDetailBill) => {
  return await
    client.query({
      query: gql`
query DetailBillById {
  detailBillById(id: "${idDetailBill}") {
    id
    idBill
    isReviews
    product {
      id
      nameProduct
      priceProduct
      imageProduct {
        imagebase64
        STTImage
      }
      promotionProduct {
        timePromotion
        numberPercent
      }
    }
    classifyProduct {
      id
      nameClassifyProduct
      STTImg
      priceClassify
    }
    evaluateProduct {
      id
      idUser
      starNumber
      content
      displayname
      imageEvaluateProduct {
        imagebase64
      }
      videoEvaluateProduct {
        videobase64
      }
    }
  }
}
    `,
      fetchPolicy: 'network-only'
    })
}


const getTypeAndTrademark = async (keywordType, keywordTrademark) => {
  return await
    client.query({
      query: gql`
query ListTypeProductSearch {
  listTypeProductSearch(keyword: "${keywordType}") {
    id
    nameTypeProduct
    nameTypeProductEn
  }
  listTrademarkSearch(keyword: "${keywordTrademark}") {
    id
    nameTrademark
    nameTrademarkEn
    typeProduct {
      nameTypeProduct
    }
  }
}
  `,
      fetchPolicy: 'network-only'
    })
}

const getListKeyword = async (keyword) => {
  return await
    client.query({
      query: gql`
query ListTypeProductSearch {
  listKeyword(keyword: "${keyword}") {
    keyword
    amount
  }
}
  `,
      fetchPolicy: 'network-only'
    })
}



export {
  getTypeProductGQL,
  getProductById,
  getBillById,
  getDetailBillById,
  getTypeAndTrademark,
  getListKeyword,
}