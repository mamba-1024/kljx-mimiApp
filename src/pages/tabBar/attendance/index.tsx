import { useState, useEffect } from "react";
import Taro, { useLoad, useDidShow } from "@tarojs/taro";
import Api from "@/api";
import {
  ActionSheet,
  Cell,
  Popup,
  Button,
  Dialog,
  CellGroup,
  Image,
} from "@nutui/nutui-react-taro";
import { Notice, Clock, ArrowRight } from "@nutui/icons-react-taro";
import {
  ScrollView,
  View,
  Text,
  Map,
  Button as TaroButton,
} from "@tarojs/components";
import { formatTime, formatTimeIOS } from "@/utils/formatTime";
import {
  getCurrentLocation,
  isWithinRange,
  defaultLocation,
} from "@/utils/location";
import LocationPicker from "@/components/LocationPicker";
import MapIcon from "@/assets/image/map.png";

interface ItemType {
  id?: number;
  name?: string;
  [key: string]: any;
}

// 是否需要重新gitInit
let needGitInit = true;

export default () => {
  const [isVisible, setIsVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<ItemType[]>([]);
  // 班次
  const [workShift, setWorkShift] = useState<ItemType | null>(null);
  const [time, setTime] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  // 安全须知倒计时弹窗
  const [showBottom, setShowBottom] = useState<boolean>(false);
  // 已经确认了安全须知
  const [canCheckIn, setCanCheckIn] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(6);
  const [visible, setVisible] = useState<boolean>(false);
  const [seasonalName, setSeasonalName] = useState<string>("");

  // 位置相关状态
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // 是否在打卡范围内
  const isInDefaultLocation = isWithinRange(
    currentLocation,
    defaultLocation,
    50
  );

  // 倒计时6秒钟
  useEffect(() => {
    let timer: any = null;
    if (showBottom) {
      timer = setInterval(() => {
        setCountDown(countDown - 1);
      }, 1000);
      if (countDown === 0) {
        clearInterval(timer);
        // 倒计时结束后方可以点击打卡
        setCanCheckIn(true);
      }
    }
    return () => clearInterval(timer);
  }, [showBottom, countDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  function gitInit() {
    if (!needGitInit) {
      return;
    }
    Api.getAttendanceApi().then((res) => {
      setMenuItems(
        res.data?.workShifts?.map((ele) => ({ name: ele.shiftName, ...ele })) ||
          []
      );
      setAttendanceRecords(res?.data?.attendanceRecords || []);
      if (!workShift) {
        setWorkShift(res.data?.workShifts[0]);
      }
      setSeasonalName(res.data?.seasonalName);
      needGitInit = false;
    });
  }

  useDidShow(() => {
    gitInit();
    // 获取当前位置
    getCurrentLocationWithPermission();
  });

  // 获取当前位置（带权限检查）
  const getCurrentLocationWithPermission = async () => {
    setLocationLoading(true);
    // setLocationError("");
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      console.log("位置获取成功:", location);
    } catch (error) {
      console.error("位置获取失败:", error);
      // setLocationError(error.message || "获取位置失败");
      Taro.showToast({
        title: error.message || "获取位置失败",
        icon: "none",
        duration: 2000,
      });
    } finally {
      setLocationLoading(false);
    }
  };

  // 手动刷新位置
  const refreshLocation = () => {
    getCurrentLocationWithPermission();
  };

  // 位置选择器确认回调
  const handleLocationConfirm = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setCurrentLocation(location);
    setLocationError("");
    Taro.showToast({
      title: "位置设置成功",
      icon: "success",
    });
  };

  const chooseItem = (itemParams: any) => {
    setIsVisible(false);
    setWorkShift(itemParams);
  };

  // 打卡
  const attendanceAction = () => {
    console.log("打开逻辑请求");

    if (!currentLocation) {
      Taro.showToast({
        title: "无法获取位置信息，请检查定位权限",
        icon: "none",
      });
      return;
    }

    const params = {
      attendanceTime: formatTime(new Date(), "yyyy-MM-dd HH:mm:ss"),
      punchType: renderBtn(attendanceRecords, workShift).punchType, // 0 上班；1 下班
      workShiftId: workShift?.id,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      address: currentLocation.address,
    };

    Api.doAttendanceApi(params).then(() => {
      Taro.showToast({
        title: "打卡成功",
        icon: "none",
      });
      // 刷新数据
      gitInit();
      setCanCheckIn(false);
    });
  };

  const handleClick = () => {
    if (!isInDefaultLocation) {
      Taro.showToast({
        title: "打卡位置不在打卡范围内，请重新选择打卡位置",
        icon: "none",
      });
      return;
    }
    console.log("点击打卡");
    // 如果已经打卡下班，不能重复打卡
    const punchType = renderBtn(attendanceRecords, workShift).punchType;
    if (punchType === 2) {
      Taro.showToast({
        title: "已打卡",
        icon: "success",
      });
      return;
    }

    // 普通班次上班打卡需要弹窗
    if (
      (workShift?.id === 1 || workShift?.id === 3) &&
      punchType === 0 &&
      !canCheckIn
    ) {
      setShowBottom(true);
      return;
    }
    // 当前的下班打卡是否小于约定的下班时间
    if (renderBtn(attendanceRecords, workShift).punchType === 1) {
      console.log("提前打卡判断逻辑");
      // 截止时间
      const endTime =
        formatTime(new Date(), "yyyy-MM-dd") + " " + workShift?.endTime;
      if (new Date().valueOf() < new Date(formatTimeIOS(endTime)).valueOf()) {
        // 早退打卡确认
        setVisible(true);
        return;
      }
    }

    attendanceAction();
  };

  // 判断是上班打卡还是下班打卡
  function renderBtn(records, workShift) {
    // 判断是否在打卡范围内，如果不在打卡范围内，则不允许打卡
    if (!isInDefaultLocation) {
      return { name: "不在打卡范围内" };
    }

    const workShiftId = workShift?.id;
    // 当前班次的打卡记录
    const currentWorkShift = records.filter(
      (ele) => ele.workShiftId === workShiftId
    );
    if (!currentWorkShift || currentWorkShift.length === 0) {
      return { name: "上班打卡", punchType: 0 };
    }
    // 是否上班打卡
    const hasStart = currentWorkShift.some((ele) => ele.punchType === 0);
    // 是否下班打卡
    const hasEnd = currentWorkShift.some((ele) => ele.punchType === 1);

    if (hasStart && hasEnd) {
      return { name: "已打卡", punchType: 2 };
    }

    if (hasStart) {
      return { name: "下班打卡", punchType: 1 };
    } else {
      return { name: "上班打卡", punchType: 0 };
    }
  }

  // 早退打卡确认
  const onOk = () => {
    setVisible(false);
    attendanceAction();
  };

  return (
    <View className="flex flex-col items-center h-full bg-gray-50">
      {/* 基础信息区域 */}
      <CellGroup className="w-full mb-4">
        <Cell className="flex-1 justify-between items-center">
          <span className="flex">
            <Notice color="#4096ff"></Notice>
            <span className="ml-[5px]">打卡时令</span>
          </span>
          <div className="text-right">
            <span>{seasonalName}</span>
          </div>
        </Cell>
        <Cell className="flex-1 justify-between items-center">
          <span className="flex">
            <Clock color="#4096ff"></Clock>
            <span className="ml-[5px]">日期</span>
          </span>
          <div className="text-right">
            <span>{formatTime(new Date(), "yyyy-MM-dd")}</span>
          </div>
        </Cell>
      </CellGroup>

      {/* 班次选择 */}
      <Cell
        title="班次"
        onClick={() => setIsVisible(!isVisible)}
        extra={<Clock color="#4096ff"></Clock>}
        description={
          <View className="flex flex-row items-center">
            <View>
              {workShift?.shiftName} {workShift?.startTime} -{" "}
              {workShift?.endTime}
            </View>
            <ArrowRight></ArrowRight>
          </View>
        }
        className="w-full mb-4"
      ></Cell>

      {/* 打卡按钮区域 */}
      <View className="w-full flex flex-col flex-1">
        <Cell className="flex-col justify-center items-center flex-1">
          <View
            onClick={handleClick}
            className={`h-[140px] w-[140px] rounded-full flex flex-col justify-center items-center text-white ${
              !isInDefaultLocation
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            style={{
              opacity: !isInDefaultLocation ? 0.6 : 1,
            }}
          >
            <span className="text-lg font-medium">
              {renderBtn(attendanceRecords, workShift).name}
            </span>
            <span className="text-sm mt-1">{`${hours}:${minutes}:${seconds}`}</span>
          </View>
          {locationLoading ? (
            <View className="flex items-center justify-center py-2 mt-2">
              <Text className="text-gray-500">正在获取位置...</Text>
            </View>
          ) : (
            <View
              className="flex items-center justify-center py-2 mt-2"
              onClick={refreshLocation}
            >
              <Text className="text-blue-500">重新获取定位</Text>
            </View>
          )}
        </Cell>

        {/* 位置信息区域 */}
        {/* <View className="w-full bg-white rounded-lg mb-4 p-4">
          {locationLoading ? (
            <View className="flex items-center justify-center py-4">
              <Text className="text-gray-500">正在获取位置...</Text>
            </View>
          ) : currentLocation ? (
            <View className="space-y-3">
              <View className="bg-green-50 p-3 rounded-lg">
                <Text className="text-sm text-green-700">
                  {currentLocation.address}
                </Text>
              </View>
              <View className="flex space-x-2">
                <Button
                  type="primary"
                  className="flex-1"
                  onClick={refreshLocation}
                >
                  刷新位置
                </Button>
                <Button
                  type="default"
                  className="flex-1 ml-4"
                  onClick={() => setShowLocationPicker(true)}
                >
                  重新选择
                </Button>
              </View>
            </View>
          ) : (
            <View className="space-y-3">
              <View className="bg-red-50 p-3 rounded-lg">
                <Text className="text-sm text-red-700">
                  {locationError || "位置获取失败"}
                </Text>
              </View>
              <View className="flex space-x-2">
                <TaroButton
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                  onClick={refreshLocation}
                >
                  重试获取
                </TaroButton>
                <TaroButton
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                  onClick={() => setShowLocationPicker(true)}
                >
                  手动选择
                </TaroButton>
              </View>
            </View>
          )}
        </View> */}
        {/* 不在打卡范围内 */}
        {!isInDefaultLocation ? (
          <Cell
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/attendance/attendanceScope/index?latitude=${currentLocation?.latitude}&longitude=${currentLocation?.longitude}`,
              });
            }}
          >
            <View className="flex flex-row items-center justify-between w-full">
              <View className="flex flex-row items-center">
                <Image src={MapIcon} className="w-[30px] h-[30px] mr-2" />
                <View>
                  <View className="text-title text-[16px]">
                    您不在管理员设置的打卡范围
                  </View>
                  <View className="text-desc text-[13px]">请检查异常</View>
                </View>
              </View>
              <ArrowRight />
            </View>
          </Cell>
        ) : null}

        {/* 打卡说明 */}
        <View className="px-2 mt-4 pb-4">
          <span className="text-base font-medium mb-2 block">
            {seasonalName}打卡说明：
          </span>
          <View className="text-sm text-gray-600 space-y-2">
            <View>
              {seasonalName === "冬令时"
                ? "1.普通班次：7:00-17:00，当天6:00开始可以打卡，6:00-7:00打卡均按7:00开始计算工时，11:30-12:00为午餐时间不计入工时，17:00后可以进行下班打卡，均按17:00下班统计工时，请假或提前下班会二次确认是否早退，一旦确认无法更改。当天下班未打卡工时计算为0，需联系人工补卡。"
                : "1.普通班次：7:00-17:30，当天6:00开始可以打卡，6:00-7:00打卡均按7:00开始计算工时，11:30-12:30为午餐时间不计入工时，17:30后可以进行下班打卡，均按17:30下班统计工时，请假或提前下班会二次确认是否早退，一旦确认无法更改。当天下班未打卡工时计算为0，需联系人工补卡"}
            </View>
            <View>
              {seasonalName === "冬令时"
                ? "2.加班班次：17:30-20:00，当天17:00后可以进行打卡（需普通班次下班完成后），均按17:30开始计算，20:00后可以进行下班打卡，均按20:00下班统计工时，20:00前下班打卡按照打卡时间计算工时。如有超过2.5小时加班的按带队计算为准。"
                : "2.加班班次：18:00-20:30，当天17:30后可以进行打卡（须普通班次下班完成后），均按18：00开始计算，20:30后可以进行下班打卡，均按20:30下班统计工时，20:30前下班打卡按照打卡时间计算工时。如有超过2.5小时加班的按带队计算为准。"}
            </View>
          </View>
        </View>
      </View>

      {/* 弹窗组件 */}
      <ActionSheet
        visible={isVisible}
        options={menuItems}
        onSelect={chooseItem}
        onCancel={() => setIsVisible(false)}
        cancelText="取消"
      />

      <Popup
        visible={showBottom}
        style={{ height: "80%", paddingTop: "20px", paddingBottom: "20px" }}
        position="bottom"
        round={true}
        onOverlayClick={() => {
          return false;
        }}
      >
        <View className="h-full flex flex-col justify-between items-center px-[12px]">
          <ScrollView
            scrollY
            scrollWithAnimation
            className="flex-1"
            style={{ height: "80%" }}
          >
            <View className="text-[18px] text-center">入厂安全须知</View>
            <View>
              <View>尊敬的工友：</View>
              <View>
                <View>
                  &ensp;&ensp;&ensp;&ensp;欢迎来到宜兴市科力建材机械设备有限公司工作，为保证你及他人的安全和健康，预防发生安全事故，请你熟知并遵守如下要求：
                </View>
                <View>
                  1、新工人进入施工现场前，必须接受安全教育，未经安全教育和培训考试合格的，不得进入施工现场操作。
                </View>
                <View>
                  2、进入施工现场，必须穿戴安全帽、防护鞋等防护用品。高空、临边作业必须系好安全带。电焊、气焊作业必须佩戴护目镜、面罩、防护手套、高帮鞋。电气作业必须戴橡胶手套或带胶底的绝缘鞋。施工现场禁止穿硬底、易滑、高跟、带钉的鞋。
                </View>
                <View>
                  3、吊装施工前必须确保环境安全，规范施工。塔内作业必须强制通风，规范使用安全行灯，严禁单独作业。起重作业必须确认场地平整、安全，操作平稳和缓，严禁猛操作或带载伸缩，严禁超载作业。
                </View>
                <View>
                  4、施工现场应确保使用标识明确、有效的起重机具，每次施工前应进行检查确保安全性能，排除隐患，严禁使用不符合技术要求的设备。
                </View>
                <View>
                  5、高空作业必须规范搭建脚手架或其他防护措施，必须设安全通道，必须用绳索传递物件，严禁直接上下投掷材料或工具。
                </View>
                <View>
                  6、有限空间作业必须提前申请，未经审批，不得独自施工。
                </View>
                <View className="text-right mt-20px">
                  宜兴市科力建材机械设备有限公司
                </View>
              </View>
            </View>
          </ScrollView>

          <Button
            style={{ marginTop: 8 }}
            className="w-3/5"
            type="primary"
            onClick={() => {
              setShowBottom(false);
              setCanCheckIn(true);
            }}
            disabled={countDown !== 0}
          >
            我已知晓 {countDown}
          </Button>
        </View>
      </Popup>

      <Dialog
        title="确认下班打卡"
        visible={visible}
        onConfirm={onOk}
        onCancel={() => setVisible(false)}
      >
        还没有到下班时间，确定要早退吗？
      </Dialog>

      {/* 位置选择器 */}
      {showLocationPicker && (
        <LocationPicker
          visible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onConfirm={handleLocationConfirm}
          currentLocation={currentLocation}
        />
      )}
    </View>
  );
};
