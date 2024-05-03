import React from 'react'
import {useParams} from "react-router-dom";
import MyPageTabs from "src/views/user/mypage/MyPageTabs";


const Login_my = React.lazy(() => import('./views/base/login_my/My_page'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const NewAccordion = React.lazy(() => import('./views/base/accordion/NewAccordion'))
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

// admin

// 회원
// 회원 목록
const AdminUserList = React.lazy(() => import('./views/admin/member/UserList'))
const AdminAdminList = React.lazy(() => import('./views/admin/member/AdminList'))
const AdminUnregisterList = React.lazy(() => import('./views/admin/member/UnregisterList'))
// 회원 수정
const AdminUserDetail = React.lazy(() => import('./views/admin/member/UserDetail'))
const AdminAdminDetail = React.lazy(() => import('./views/admin/member/AdminDetail'))
const AdminUnregisterDetail = React.lazy(() => import('./views/admin/member/UnregisterDetail'))

// 주문내역



//  카테고리
const AdminCategory = React.lazy(() => import('./views/admin/category/AdminCategory'))

//  상품
const AdminItemForm = React.lazy(() => import('./views/admin/item/form'))
const AdminItemList = React.lazy(() => import('./views/admin/item/list/ItemList'))
const AdminItem = React.lazy(() => import('./views/admin/item/detail/form'))

//  색상
const AdminItemColor = React.lazy(() => import('./views/admin/color/form'))




//  user

//  index
const Index = React.lazy(() => import('./views/user/items'))

// 상품 검색
const SearchItem = React.lazy(() => import('./views/user/item/SearchItems'))

//  상품 상세
const Item = React.lazy(() => import('./views/user/item/Item'))

//  주문 페이지
const Order = React.lazy(() => import('./views/user/item/order/Orders'))

//  회원가입
const Signup = React.lazy(() => import('./views/user/member/Signup'))

//  로그인
const Signin = React.lazy(() => import('./views/user/member/Signin'))

// 로그아웃
const Logout = React.lazy(() => import('./views/user/Logout'))

// 마이페이지
//마이페이지 홈
const Mypage = React.lazy(() => import('./views/user/mypage/MyPageTabs'))
//정보수정
const Myinfo = React.lazy(() => import('./views/user/mypage/MyInfo'))

const routes = [
  { path: '/items', exact: true, element: Index },
  { path: `/items/search/:category_id`, name: 'Search', exact: true, element: SearchItem },
  { path: `/item/:itemGroupId`, name: '상품', exact: true, element: Item },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/admin/member/userList', name:'AdminUserList', element: AdminUserList},
  { path: '/admin/member/userDetail/:id', name:'AdminUserDetail', element: AdminUserDetail},
  { path: '/admin/member/adminList', name:'AdminAdminList', element: AdminAdminList},
  { path: '/admin/member/adminDetail/:id', name:'AdminAdminDetail', element: AdminAdminDetail},
  { path: '/admin/member/unregisterList', name:'AdminUnregisterList', element: AdminUnregisterList},
  { path: '/admin/member/unregisterDetail/:id', name:'AdminUnregisterDetail', element: AdminUnregisterDetail},
  { path: '/admin/category', name: 'Admin', element: AdminCategory },
  { path: '/admin/item/form', name: '상품 등록', element: AdminItemForm },
  { path: '/admin/item/list', name: '상품 리스트', element: AdminItemList },
  { path: '/admin/item/:itemGroupId', name: '상품 상세', element: AdminItem },
  { path: '/admin/item/color/form', name: 'Admin', element: AdminItemColor },
  { path: '/base/login_my', name: 'login_my', element: Login_my },
  { path: '/base/NewAccordion', name: 'Accordion', element: NewAccordion },
  { path: '/signup', name: '회원가입', element: Signup},
  { path: '/signin', name: '로그인', element: Signin},
  { path: '/logout', name: '로그아웃', element: Logout},
  { path: '/user/mypage/MyPageTabs', name: '마이페이지', element: Mypage},
  { path: '/user/mypage/MyInfo', name: '정보수정', element: Myinfo},
  { path: '/order/:orderId', name: '주문', element: Order},
  { path: '/order', name: '주문', element: Order},
]

export default routes
