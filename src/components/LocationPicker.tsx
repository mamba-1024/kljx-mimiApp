import React, { useState } from "react";
import { View, Text, Button as TaroButton } from "@tarojs/components";
import { Button, Popup, Cell } from "@nutui/nutui-react-taro";
import { Location } from "@nutui/icons-react-taro";
import { chooseLocation, getCurrentLocation } from "@/utils/location";
import Taro from "@tarojs/taro";

interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (location: LocationInfo) => void;
  currentLocation?: LocationInfo | null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  onClose,
  onConfirm,
  currentLocation,
}) => {
  console.log("currentLocation", currentLocation);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(
    currentLocation || null
  );
  const [loading, setLoading] = useState(false);

  // 获取当前位置
  const handleGetCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await getCurrentLocation();
      setSelectedLocation(location);
      Taro.showToast({
        title: "位置获取成功",
        icon: "success",
      });
    } catch (error) {
      Taro.showToast({
        title: error.message || "获取位置失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 选择位置
  const handleChooseLocation = async () => {
    setLoading(true);
    try {
      const location = await chooseLocation();
      setSelectedLocation(location);
      Taro.showToast({
        title: "位置选择成功",
        icon: "success",
      });
    } catch (error) {
      Taro.showToast({
        title: error.message || "选择位置失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  // 确认选择
  const handleConfirm = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation);
      onClose();
    } else {
      Taro.showToast({
        title: "请先选择位置",
        icon: "none",
      });
    }
  };

  return (
    <Popup
      visible={visible}
      position="bottom"
      style={{ height: "60%" }}
      onOverlayClick={onClose}
      title="选择打卡位置"
    >
      <View className="p-4">

        {/* 当前位置显示 */}
        {selectedLocation && (
          <View className="bg-blue-50 p-4 rounded-lg mb-4">
            <View className="flex items-center mb-2">
              <Location color="#4096ff" size={16} />
              <Text className="ml-2 text-sm font-medium">已选择位置</Text>
            </View>
            <Text className="text-sm text-gray-700">
              {selectedLocation.address}
            </Text>
            <View className="text-xm text-gray-500">
              纬度: {selectedLocation.latitude.toFixed(6)}, 经度:{" "}
              {selectedLocation.longitude.toFixed(6)}
            </View>
          </View>
        )}

        {/* 位置选择按钮 */}
        <View className="space-y-3">
          <Button
            type="primary"
            className="w-full"
            onClick={handleGetCurrentLocation}
            loading={loading}
            disabled={loading}
            size="large"
            icon={<Location color="white" size={16} />}
          >
            <Text className="ml-2">获取当前位置</Text>
          </Button>

          <Button
            type="default"
            className="w-full"
            onClick={handleChooseLocation}
            loading={loading}
            disabled={loading}
            size="large"
            icon={<Location color="#4096ff" size={16} />}
          >
            <Text className="ml-2">手动选择位置</Text>
          </Button>
        </View>

        {/* 确认按钮 */}
        <View className="mt-6 flex space-x-2">
          <Button
            type="default"
            onClick={onClose}
            className="flex-1 mr-8"
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className="flex-1"
          >
            确认
          </Button>
        </View>

        {/* 说明文字 */}
        <View className="mt-4 p-3 bg-gray-50 rounded-lg">
          <Text className="text-xs text-gray-600">
            提示：建议使用"获取当前位置"功能，系统会自动获取您当前所在位置。如需选择其他位置，可使用"手动选择位置"功能。
          </Text>
        </View>
      </View>
    </Popup>
  );
};

export default LocationPicker;
