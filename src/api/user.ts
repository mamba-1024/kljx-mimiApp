// 引入封装后的请求方法
import request from '@/service'

/**
 * 账户密码登录
 */
export const loginByPasswordApi = (data: any) => {
  return request.post('/employee/login/login', data)
}

export const loginByUserNameApi = (data: any) => {
  return request.post('/employee/login/loginByName', data)
}

/**
* 登录
* '/wechat/login'
* @returns
*/
export const loginApi = (data: any) => {
  return request.post('/wechat/login', data)
}

/**
 * 注册
 * /wechat/register
 * @param data {
    "phone": "13800138000",
    "password": "MyPassword123",
    "confirmPassword": "MyPassword123",
  }
 *
 */
export const registerApi = (data: any) => {
  return request.post('/wechat/register', data)
}

/**
 * 注册
 * /wechat/registerByName
 * @param data {
    "name": "张三",
    "password": "MyPassword123",
    "confirmPassword": "MyPassword123",
  }
 *
 */
export const registerByNameApi = (data: any) => {
  return request.post('/wechat/registerByName', data)
}


/**
* 一键获取手机号登录
* /wechat/getPhoneNum
* @returns
*/
export const loginByPhoneApi = (data: any) => {
  return request.post('/wechat/getPhoneNum', data)
}

/**
 * 获取用户信息
 * /employee/getUserInfo
 */
export const getUserInfoApi = (data?: any) => {
  return request.get('/employee/getUserInfo', data)
}

/**
 * 获取登记
 * /employee/levelInfo
 */
export const getLevelInfo = (data?: any) => {
  return request.get('/employee/levelInfo', data)
}

/**
 * 获取实名认证信息
 *  /employee/userDetail
 */
export const getUserDetail = (data?:any) => {
  return request.get('/employee/userDetail', data)
}

/**
 * 实名认证
 * /employee/verifyUser
 */
export const postVerifyUser = (data: any) => {
  return request.post('/employee/verifyUser', data)
}

/**
 * 更新员工信息，头像昵称
 * /employee/update
 */
export const postUpdateUser = (data: any) => {
  return request.post('/employee/update', data)
}

/**
 * 上传
 * /upload
 */
export const postUpload = (data: any) => {
  return request.post('/upload', data)
}

