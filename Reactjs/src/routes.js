import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import TableProduct from "views/TableProduct.js";
import Promotion from "views/Promotion";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";
import Upgrade from "views/Upgrade.js";
import ListPurchase from "views/ListPurchase";
import KeywordSearch from "views/KeywordSearch";
import CreateNotify from "views/CreateNotify";
import AccountAdmin from "views/AccountAdmin";
import LockAccount from "views/LockAccount";
import VideoManager from "views/VideoManager";
import BlogManager from "views/BlogManager";
import TypeProductPage from "views/TypeProduct";
import TrademarkPage from "views/Trademark";
import QuanLyBaiHat from "views/QuanLyBaiHat";
import QuanLyCaSi from "views/QuanLyCaSi";
import QuanLyLoiBaiHat from "views/QuanLyLoiBaiHat";
import ServerManager from "views/ServerManager";

const dashboardRoutes = [
  // {
  //   upgrade: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "nc-icon nc-alien-33",
  //   component: Upgrade,
  //   layout: "/admin"
  // },
  {
    path: "/dashboard",
    name: "Thống kê",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "Tài khoản",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/account",
    name: "Thêm admin",
    icon: "fa-solid fa-user-plus",
    component: AccountAdmin,
    layout: "/admin",
  },
  {
    path: "/lock-user",
    name: "Quản lý người dùng",
    icon: "fa-solid fa-user",
    component: LockAccount,
    layout: "/admin",
  },
  {
    path: "/table/type-product",
    name: "Loại sản phẩm",
    icon: "fa-solid fa-mobile-screen-button",
    component: TypeProductPage,
    layout: "/admin",
  },
  {
    path: "/table/trademark",
    name: "Thương hiệu",
    icon: "fa-solid fa-mobile-screen-button",
    component: TrademarkPage,
    layout: "/admin",
  },
  {
    path: "/table/product",
    name: "Quản lý sản phẩm",
    icon: "fa-solid fa-mobile-screen-button",
    component: TableProduct,
    layout: "/admin",
  },
  {
    path: "/table/promotion",
    name: "Sự kiện khuyến mãi",
    icon: "fa-solid fa-percent",
    component: Promotion,
    layout: "/admin",
  },
  {
    path: "/table/list-purchase",
    name: "Quản lý đơn hàng",
    icon: "fa-solid fa-cart-shopping",
    component: ListPurchase,
    layout: "/admin",
  },
  // {
  //   path: "/table/video-manager",
  //   name: "Quản lý video",
  //   icon: "nc-icon nc-button-play",
  //   component: VideoManager,
  //   layout: "/admin"
  // },
  // {
  //   path: "/table/blog-manager",
  //   name: "Quản lý bài viết",
  //   icon: "nc-icon nc-badge",
  //   component: BlogManager,
  //   layout: "/admin"
  // },
  {
    path: "/table/create-notify",
    name: "quản lý Thông báo",
    icon: "fa-solid fa-bell",
    component: CreateNotify,
    layout: "/admin",
  },

  {
    path: "/table/list-keyword-search",
    name: "Từ khóa tìm kiếm",
    icon: "fa-solid fa-magnifying-glass",
    component: KeywordSearch,
    layout: "/admin",
  },
  {
    path: "/table/quan-ly-bai-hat",
    name: "Quản lý bài hát",
    icon: "nc-icon nc-headphones-2",
    component: QuanLyBaiHat,
    layout: "/admin",
  },
  {
    path: "/table/quan-ly-loi-bai-hat",
    name: "Quản lý lời bài hát",
    icon: "fa-solid fa-music",
    component: QuanLyLoiBaiHat,
    layout: "/admin",
  },
  {
    path: "/table/quan-ly-ca-si",
    name: "Quản lý ca sĩ",
    icon: "fa-solid fa-feather",
    component: QuanLyCaSi,
    layout: "/admin",
  },
  {
    path: "/typography",
    name: "Mẫu phông chữ",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "Mẫu Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Bản đồ",
    icon: "nc-icon nc-pin-3",
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/notifications",
    name: "Mẫu thông báo đẩy",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin",
  },

  {
    path: "/server-manager",
    name: "Quản lý server",
    icon: "nc-icon nc-bell-55",
    component: ServerManager,
    layout: "/admin",
  },
];

export default dashboardRoutes;
