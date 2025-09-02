export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  pages: [
    'pages/tabBar/home/index',
    'pages/tabBar/attendance/index',
    'pages/tabBar/my/index',
    'pages/login/index',
    'pages/agreement/index',
    'pages/privacy/index'
  ],
  subPackages: [
    {
      root: 'pages/home/',
      pages: [
        'products/index',
        'companyNews/index',
        'aboutUs/index',
        'productsDetail/index'
      ],
    },
    {
      root: 'pages/attendance/',
      pages: [
        'attendanceScope/index'
      ],
    },
    {
      root: 'pages/my/',
      pages: [
        'level/index',
        'info/index',
        'verify/index',
        'attendanceRecord/index',
        'question/index',
        'passwordLogin/index',
        'register/index'
      ],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#60A5FA',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#707070',
    selectedColor: '#1677ff',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/tabBar/home/index',
        text: '首页',
        iconPath: './assets/image/home-bar.png',
        selectedIconPath: './assets/image/home-bar-selected2.png'
      },
      {
        pagePath: 'pages/tabBar/attendance/index',
        text: '打卡',
        iconPath: './assets/image/attendance-bar.png',
        selectedIconPath: './assets/image/attendance-bar-selected2.png'
      },
      {
        pagePath: 'pages/tabBar/my/index',
        text: '我的',
        iconPath: './assets/image/my-bar.png',
        selectedIconPath: './assets/image/my-bar-selected2.png'
      }
    ]
  },
  // 声明需要使用的隐私接口
  requiredPrivateInfos: [
    'getLocation', // 获取位置信息
    'chooseLocation', // 选择位置
    'choosePoi', // 选择POI
  ],
  permission: {
    "scope.userLocation": {
      "desc": "你的位置信息将用于打卡定位功能"
    },
    "scope.userPhoneNumber": {
      "desc": "你的手机号将用于登录功能"
    }
  }
})
