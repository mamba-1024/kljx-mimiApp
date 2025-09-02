import Taro, { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import { Button, View, Text } from '@tarojs/components';
import { Button as NutButton } from '@nutui/nutui-react-taro';
import Api from '@/api';
import { setToken } from '@/utils';
import './index.scss';
import logo from '@/assets/image/wxLogo.jpg';
import { AgreementPrivacy, useAgreementPrivacy } from '@/components/agreementPrivacy';

export default () => {
  const [code, setCode] = useState<any>();
  const { auth } = useAgreementPrivacy();

  useDidShow(() => {
    Taro.login({
      success: function (res) {
        if (res.code) {
          setCode(res.code);
        }
      },
    });
  });

  const onGetPhoneNumber = ({ detail }) => {
    console.log('getPhoneNumber detail:', detail);
    console.log('当前小程序环境:', process.env.NODE_ENV);
    console.log('小程序版本:', Taro.getSystemInfoSync().version);

    if (detail.errMsg === 'getPhoneNumber:ok') {
      // 获取手机号成功
      Taro.checkSession({
        success: function () {
          // session 有效，直接使用
        },
        fail: function () {
          // session 失效，重新登录获取 code
          Taro.login({
            success: function (res) {
              if (res.code) {
                setCode(res.code);
              }
            },
          });
        },
        complete() {
          const params = {
            encryptedData: detail.encryptedData,
            iv: detail.iv,
            code: code || detail.code,
            loading: true,
          };
          Api.loginByPhoneApi(params).then((res) => {
            setToken(res?.data);
            Taro.navigateBack();
            // Taro.switchTab({
            //   url: '/pages/tabBar/home/index',
            // });
          }).catch((error) => {
            console.error('登录失败:', error);
            Taro.showToast({
              title: '登录失败，请重试',
              icon: 'error'
            });
          });
        },
      });
    } else if (detail.errMsg === 'getPhoneNumber:fail no permission') {
      // 用户拒绝授权获取手机号
      Taro.showModal({
        title: '提示',
        content: '需要获取您的手机号才能登录，请在设置中开启手机号权限',
        confirmText: '去设置',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 引导用户去设置页面
            Taro.openSetting({
              success: (settingRes) => {
                console.log('设置页面结果:', settingRes);
                if (settingRes.authSetting['scope.phoneNumber']) {
                  Taro.showToast({
                    title: '权限已开启，请重新登录',
                    icon: 'success'
                  });
                }
              }
            });
          }
        }
      });
    } else if (detail.errMsg.includes('operateWXData:fail') || detail.errMsg.includes('jsapi has no permission')) {
      // API 权限问题
      Taro.showModal({
        title: '提示',
        content: '当前小程序版本不支持获取手机号功能，请使用账号密码登录',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({
              url: '/pages/my/passwordLogin/index',
            });
          }
        }
      });
    } else {
      // 其他错误
      console.error('获取手机号失败:', detail.errMsg);
      Taro.showToast({
        title: '获取手机号失败，请重试',
        icon: 'error'
      });
    }
  };

  return (
    <View className="nutui-react-demo">
      <View className="index">
        <View className="h-[260px] flex flex-col justify-center items-center">
          <img
            src={logo}
            className="w-[90px] h-[80px]"
          />
          {/* <View>科力机械</View> */}
        </View>
        <Button
          openType={auth ? 'getPhoneNumber' : undefined}
          className="nut-button nut-button-primary nut-button-primary-solid nut-button-large nut-button-round nut-button-round-large nut-button-block rounded-full"
          onGetPhoneNumber={onGetPhoneNumber}
          onClick={() => {
            if (!auth) {
              Taro.showToast({
                icon: 'none',
                title: `请先阅读并勾选底部的协议政策`
              });
            }
          }}
        >
          手机号快捷登录
        </Button>
        <NutButton
          fill="none"
          size="large"
          block
          className="mt-[30px] rounded-full"
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/my/passwordLogin/index',
            });
          }}
        >
          <Text className=" text-primary">切换到账号密码登录</Text>
        </NutButton>
        <NutButton
          fill="none"
          size="large"
          block
          className="mt-[30px] rounded-full"
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/my/register/index',
            });
          }}
        >
          <Text className=" text-primary">暂无账号，去注册</Text>
        </NutButton>
      </View>
      <AgreementPrivacy />
    </View>
  );
};
