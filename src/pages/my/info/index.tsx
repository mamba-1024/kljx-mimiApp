import { useState } from 'react';
import { Button as NTButton } from '@nutui/nutui-react-taro';
import Taro, { useLoad } from '@tarojs/taro';
import Api from '@/api';
import { InfoProps } from '@/pages/tabBar/my';
import { Button, Input, Form, View, Image } from '@tarojs/components';
import { removeToken } from '@/utils';

const defaultAvatar =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

export default () => {
  const [userInfo, setUserInfo] = useState<InfoProps | null>(null);
  // 获取用户信息
  function getInfo() {
    Api.getUserInfoApi().then((res) => {
      setUserInfo(res.data);
    });
  }

  useLoad(() => {
    getInfo();
  });

  const onChooseAvatar = (event) => {
    if(event?.detail?.avatarUrl) {
      setUserInfo({
        ...userInfo as InfoProps,
        avatarUrl: event.detail.avatarUrl
      })
    }
  };

  const formSubmit = (e) => {
    const avatarUrl = userInfo?.avatarUrl
    // if(!avatarUrl) {
    //   Taro.showToast({
    //     title: '请设置头像',
    //     icon: 'error'
    //   })
    //   return
    // }
    const { nickname } = e.detail.value
    if(!nickname) {
      Taro.showToast({
        title: '请输入昵称',
        icon: 'error'
      })
      return
    }
    const params = {
      nickname: nickname,
      avatarUrl: avatarUrl,
      loading: true,
    };

    Api.postUpdateUser(params).then((res) => {
      if(res.data) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000,
          success: () => {
            Taro.navigateBack()
          }
        })
      }
    });
  };

  const handleLogout = () => {
    removeToken();
    Taro.switchTab({
      url: '/pages/tabBar/home/index',
    });
  };

  return (
    <Form onSubmit={formSubmit}>
      <View className="pt-[10px]">
        <Button
          open-type="chooseAvatar"
          onChooseAvatar={onChooseAvatar}
          className="h-[56px] w-[56px] p-0 my-[20px] rounded-full"
        >
          <Image
            className="block h-[56px] w-[56px] rounded-full"
            src={userInfo?.avatarUrl || defaultAvatar}
          ></Image>
        </Button>
        {/* <div className="flex flex-row justify-between items-center ml-10px mr-10px border-0 border-b-1 border-b-gray-200 border-solid h-50px">
      </div> */}
      <View className="flex flex-row justify-between items-center ml-[10px] mr-[10px] border-0 border-b-1 border-b-gray-200 border-solid h-[50px]">
          <span>用户名</span>
          <span>{userInfo?.userName}</span>
        </View>
        <View className="flex flex-row justify-between items-center ml-[10px] mr-[10px] border-0 border-b-1 border-b-gray-200 border-solid h-[50px]">
          <span>昵称</span>
          {/* <span>{userInfo?.nickname}</span> */}
          <span>
            <Input
              type="nickname"
              placeholder="请输入昵称"
              className="text-right"
              name='nickname'
              value={userInfo?.nickname}
            />
          </span>
        </View>
        <View className="flex flex-row justify-between items-center ml-[10px] mr-[10px] border-0 border-b-1 border-b-gray-200 border-solid h-[50px]">
          <span>手机号</span>
          <span>{userInfo?.phoneNumber}</span>
        </View>
        <View className="text-center mt-[30px] px-6">
          <NTButton block size='large' type="primary" formType="submit" className='rounded-full'>
            提交
          </NTButton>

          <NTButton block size='large' className='rounded-full mt-8' onClick={handleLogout}>
            退出登录
          </NTButton>
        </View>
      </View>
    </Form>
  );
};
