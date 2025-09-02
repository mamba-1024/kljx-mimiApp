import { View, Map } from "@tarojs/components";
import { Cell } from "@nutui/nutui-react-taro";
import { defaultLocation, getOverRange } from "@/utils/location";
import Taro from "@tarojs/taro";

export default () => {
  // 获取query参数
  const { latitude, longitude }: any = Taro.getCurrentInstance().router?.params || {};

  console.log('latitude, longitude', latitude, longitude);

  // 计算超出考勤范围的距离
  const overRange = (latitude: number, longitude: number) => {
    return `${getOverRange(latitude, longitude)}米`;
  };

  return (
    <View className="w-full h-full">
      {/* 引入地图组件 默认位置 */}
      <Map
        className="w-full h-[325px] mb-4"
        longitude={defaultLocation.longitude} // 经度
        latitude={defaultLocation.latitude} // 纬度
        scale={15}
        markers={[
          {
            id: 1,
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
            iconPath: "/assets/image/location-marker.svg",
            width: 32,
            height: 32,
          },
        ]}
        show-location
        onError={() => {
          console.error("地图加载失败");
        }}
      />

      {/* 打卡范围 */}
      <Cell.Group>
        <Cell title="打卡范围" extra="科力机械新厂区" />
        <Cell title="打卡半径" extra="50米" />
        <Cell title="超过考勤范围" extra={overRange(latitude, longitude)} />
        {/* 提示 */}
        <Cell>
          <View>
            高铁、电梯等环境一般定位信号弱无法准确定位,若您处于室内可以链接wifi来提高
            定位的精准度,此外微信小程序内定位准度可能会有一定误差,若您处于打卡范围外请向内移动,并尝试重新定位
          </View>
        </Cell>
      </Cell.Group>
    </View>
  );
};
