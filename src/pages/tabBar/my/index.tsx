import { useState } from 'react';
import { Avatar, CellGroup, Cell, Rate } from '@nutui/nutui-react-taro';
import Taro, { useDidShow } from '@tarojs/taro';
import { ArrowRight, Save, Star, Warning, Phone, Order } from '@nutui/icons-react-taro'

import { View } from '@tarojs/components';
import Api from '@/api';
import './style.scss';

export interface InfoProps {
  userName?: string | undefined;
  nickname?: string | undefined;
  avatarUrl?: string | undefined;
  accumulatedPoints: number; // 累计积分
  checkInTime: string; // 本月打卡时长
  level: string; // 等级
  phoneNumber: string; // 手机号
  verified: boolean; // 实名
}

export default () => {
  const [userInfo, setUserInfo] = useState<InfoProps | null>(null);

  // 获取用户信息
  useDidShow(() => {
    Api.getUserInfoApi({ notLogin: true, loading: true }).then((res) => {
      setUserInfo(res.data);
    }).catch(() => {
      setUserInfo(null);
    });
  });

  const handleClick = () => {
    if (!userInfo) {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
    } else {
      Taro.navigateTo({
        url: '/pages/my/info/index',
      });
    }
  };

  const handleLevel = () => {
    if (userInfo) {
      Taro.navigateTo({
        url: `/pages/my/level/index?level=${userInfo?.level}`,
      });
    }
  };

  const handleVerify = () => {
    if (userInfo) {
      Taro.navigateTo({
        url: `/pages/my/verify/index?verified=${userInfo?.verified}`,
        // url: `/pages/my/verify/index?verified=${false}`
      });
    } else {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
    }
  };

  const handleAttendanceRecord = () => {
    if (userInfo) {
      Taro.navigateTo({
        url: '/pages/my/attendanceRecord/index',
      });
    } else {
      Taro.navigateTo({
        url: '/pages/login/index',
      });
    }
  };

  return (
    <View className="my-page">
      <View className="bg-gradient-to-b from-blue-400 from-10% to-blue-200">
        <View className="h-[40px] w-full"></View>
        <View className="h-[100px] mb-[6px]">
          <View className="flex flex-row items-center pl-[30px]">
            <View onClick={handleClick}>
              <Avatar
                className="overflow-hidden"
                size="large"
                src={userInfo?.avatarUrl}
              />
            </View>
            <View className="flex flex-col ml-[20px]">
              <View className="flex flex-row items-center mb-[10px]">
                <span className="text-[22px] mr-[10px]" onClick={handleClick}>
                  {userInfo ? userInfo.nickname : '点击登录'}
                </span>
                {userInfo ? (
                  <View className="star-wrap">
                    <Rate
                      value={Number(userInfo?.level)}
                      size="normal"
                      count={3}
                      readOnly
                    />
                    {/* <View className="start-modal" onClick={handleLevel}></View> */}
                  </View>
                ) : null}
              </View>
              {userInfo ? (
                <span className="text-[16px]">
                  手机号：{userInfo.phoneNumber}
                </span>
              ) : null}
            </View>
          </View>
        </View>
      </View>

      <CellGroup>
        <Cell
          extra={
            <Save color="#1677ff" className="mr-[10px]"></Save>
          }
          title="本月打卡（时）"
          description={userInfo?.checkInTime}
          className="text-[18px]"
        />
        <Cell
          title="累计积分"
          extra={
            <Star color="#64b578" className="mr-[10px]" />
          }
          description={userInfo?.accumulatedPoints.toString()}
          className="text-[18px]"
        />
      </CellGroup>
      {/* <Cell
        title="实名认证"
        description={userInfo?.verified ? '（已认证）' : '（未认证）'}
        extra={<ArrowRight color="#52c41a" className="mr-[10px]"></ArrowRight>}
        onClick={handleVerify}
        className="text-[18px]"
      /> */}
      <Cell
        title="考勤记录"
        extra={
          <ArrowRight color="#f3812e" className="mr-[10px]" />
        }
        onClick={handleAttendanceRecord}
        className="text-[18px]"
      />
      <CellGroup>
        <Cell
          title="联系管理员"
          extra={
            <Phone color="#ffc069" className="mr-[10px]" />
          }
          // subTitle={userInfo?.accumulatedPoints.toString()}
          description={
            <span className="text-[12px] text-text text-center h-[26px] leading-[26px]">
              189********（微信同号）
            </span>
          }
          // isLink
          // onClick={() => {
          //   Taro.navigateTo({ url: '/pages/home/aboutUs/index' });
          // }}
          className="text-[18px]"
        />
        <Cell
          title="常见问题"
          extra={
            <ArrowRight color="#f5222d" className="mr-[10px]" />
          }
          // subTitle={userInfo?.verified ? '已认证' : '未认证'}
          onClick={() => {
            Taro.navigateTo({ url: '/pages/my/question/index' });
          }}
          className="text-[18px]"
        />
      </CellGroup>
    </View>
  );
};
