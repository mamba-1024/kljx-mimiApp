import { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { Checkbox } from '@nutui/nutui-react-taro';
import Taro from '@tarojs/taro';

// 全局状态
let globalAuth = false;
let listeners: Array<(auth: boolean) => void> = [];

// 更新全局状态并通知所有监听器
const setGlobalAuth = (auth: boolean) => {
  globalAuth = auth;
  listeners.forEach(listener => listener(auth));
};

// 订阅状态变化
const subscribe = (listener: (auth: boolean) => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

// 定义 hook 用于获取用户是否同意协议
export const useAgreementPrivacy = () => {
  const [auth, setAuth] = useState(globalAuth);

  useEffect(() => {
    const unsubscribe = subscribe((newAuth) => {
      setAuth(newAuth);
    });
    return unsubscribe;
  }, []);

  const updateAuth = (newAuth: boolean) => {
    setGlobalAuth(newAuth);
  };
  return { auth, setAuth: updateAuth };
}

export const AgreementPrivacy = () => {
  const { auth, setAuth } = useAgreementPrivacy();

  return (
    <View className="flex flex-row justify-center items-center font-[14px] mb-[20px]">
        <Checkbox checked={auth} onChange={(e) => setAuth(e)}>
          <text>已阅读并同意</text>
        </Checkbox>
        <text
          className="text-primary"
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/agreement/index',
            });
          }}
        >
          《用户服务协议1》
        </text>
        <text>与</text>
        <text
          className="text-primary"
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/privacy/index',
            });
          }}
        >
          《隐私政策》
        </text>
      </View>
  )
}
