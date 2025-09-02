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
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // 实时获取用户是否同意协议
  const { auth } = useAgreementPrivacy();
  const handleRegister = () => {
    if (!auth) {
      Taro.showToast({
        title: "请先阅读并勾选底部的协议政策",
        icon: "none",
      });
      return;
    }
    // 判断手机号和密码是否为空
    if (!phone || !password || !confirmPassword) {
      Taro.showToast({
        title: "请输入手机号和密码",
        icon: "none",
      });
      return;
    }
    // 判断手机号是否有效
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({
        title: "请输入正确的手机号",
        icon: "none",
      });
      return;
    }
    // 判断密码是否一致
    if (password !== confirmPassword) {
      Taro.showToast({
        title: "密码不一致",
        icon: "none",
      });
      return;
    }
    // 调用注册接口
    Api.registerApi({
      phone,
      password,
      confirmPassword,
      loading: true,
    }).then((res) => {
      setToken(res?.data);
      Taro.showToast({
        title: "注册成功",
        icon: "success",
      });
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
        <View className="text-sm text-[#979797] mb-1">手机号</View>
        <Input
          className="mb-2"
          placeholder="请输入手机号"
          value={phone}
          onChange={setPhone}
        />
        <View className="text-sm text-[#979797] mb-1">密码</View>
        <Input
          className="mb-2"
          placeholder="请输入密码"
          value={password}
          onChange={setPassword}
        />
        <View className="text-sm text-[#979797] mb-1">确认密码</View>
        <Input
          className="mb-2"
          placeholder="请输入确认密码"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        <Button
          type="primary"
          block
          onClick={handleRegister}
          className="mt-[40px] h-[40px] rounded-full"
          size="large"
        >
          注册
        </Button>
      </View>

      <AgreementPrivacy />
    </View>
  );
};
