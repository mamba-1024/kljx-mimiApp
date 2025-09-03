import { useState } from "react";
import { View, Image } from "@tarojs/components";
import { Input, Button } from "@nutui/nutui-react-taro";
import logo from "@/assets/image/wxLogo.jpg";
import {
  AgreementPrivacy,
  useAgreementPrivacy,
} from "@/components/agreementPrivacy";
import Taro from "@tarojs/taro";
import Api from "@/api";
import { setToken } from "@/utils";

export default () => {
  // const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  // 实时获取用户是否同意协议
  const { auth } = useAgreementPrivacy();
  const handleLogin = () => {
    if (!auth) {
      Taro.showToast({
        title: "请先阅读并勾选底部的协议政策",
        icon: "none",
      });
      return;
    }
    // 判断手机号和密码是否为空
    if (!userName || !password) {
      Taro.showToast({
        title: "请输入用户名和密码",
        icon: "none",
      });
      return;
    }
    // // 判断手机号是否有效
    // if (!/^1[3-9]\d{9}$/.test(userName)) {
    //   Taro.showToast({
    //     title: "请输入正确的手机号",
    //     icon: "none",
    //   });
    //   return;
    // }
    // 调用登录接口
    Api.loginByUserNameApi({
      userName,
      password,
      loading: true,
    }).then((res) => {
      setToken(res?.data?.token);
      Taro.switchTab({
        url: "/pages/tabBar/home/index",
      });
    });
  };

  return (
    <View className="h-screen p-4 flex flex-col justify-between">
      <View>
        <View className="flex flex-row items-center mb-8">
          <Image src={logo} className="w-[60px] h-[60px] rounded-full" />
          <View className="font-bold text-xl ml-2">欢迎使用科力机械</View>
        </View>
        <View className="text-sm text-[#979797] mb-1">用户名</View>
        <Input
          className="mb-2"
          placeholder="请输入用户名"
            value={userName}
          onChange={setUserName}
        />
        <View className="text-sm text-[#979797] mb-1">密码</View>
        <Input
          className="mb-2"
          placeholder="请输入密码"
          value={password}
          onChange={setPassword}
        />
        <Button
          type="primary"
          block
          onClick={handleLogin}
          className="mt-[40px] h-[40px] rounded-full"
          size="large"
        >
          登录
        </Button>
      </View>

      <AgreementPrivacy />
    </View>
  );
};
