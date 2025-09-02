import React, { useState, useEffect } from 'react';
import { View, Text, Button as TaroButton } from '@tarojs/components';
import { Button, Dialog } from '@nutui/nutui-react-taro';
import { Location, Setting } from '@nutui/icons-react-taro';
import { checkLocationPermission, requestLocationPermission } from '@/utils/location';
import Taro from '@tarojs/taro';

interface LocationPermissionProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
  children?: React.ReactNode;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({
  onPermissionGranted,
  onPermissionDenied,
  children
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // 检查权限状态
  const checkPermission = async () => {
    try {
      const permission = await checkLocationPermission();
      setHasPermission(permission);
      if (permission) {
        onPermissionGranted();
      }
    } catch (error) {
      console.error('检查权限失败:', error);
      setHasPermission(false);
    }
  };

  // 请求权限
  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const granted = await requestLocationPermission();
      setHasPermission(granted);
      if (granted) {
        onPermissionGranted();
        Taro.showToast({
          title: '权限获取成功',
          icon: 'success'
        });
      } else {
        onPermissionDenied();
        setShowPermissionDialog(true);
      }
    } catch (error) {
      console.error('请求权限失败:', error);
      setHasPermission(false);
      onPermissionDenied();
      setShowPermissionDialog(true);
    } finally {
      setLoading(false);
    }
  };

  // 跳转到设置页面
  const goToSettings = () => {
    Taro.openSetting({
      success: (res) => {
        const locationPermission = res.authSetting['scope.userLocation'];
        setHasPermission(locationPermission || false);
        if (locationPermission) {
          onPermissionGranted();
          Taro.showToast({
            title: '权限已开启',
            icon: 'success'
          });
        }
      },
      fail: () => {
        Taro.showToast({
          title: '打开设置失败',
          icon: 'none'
        });
      }
    });
    setShowPermissionDialog(false);
  };

  // 组件挂载时检查权限
  useEffect(() => {
    checkPermission();
  }, []);

  // 如果权限检查中，显示加载状态
  if (hasPermission === null) {
    return (
      <View className="flex items-center justify-center py-8">
        <Text className="text-gray-500">检查位置权限中...</Text>
      </View>
    );
  }

  // 如果已有权限，显示子组件
  if (hasPermission) {
    return <>{children}</>;
  }

  // 权限被拒绝，显示权限请求界面
  return (
    <View className="flex flex-col items-center justify-center py-8 px-4">
      <View className="bg-white rounded-lg p-6 w-full max-w-sm">
        <View className="flex items-center justify-center mb-4">
          <Location color="#ff6b6b" size={48} />
        </View>

        <Text className="text-lg font-medium text-center mb-2">
          需要位置权限
        </Text>

        <Text className="text-sm text-gray-600 text-center mb-6">
          打卡功能需要获取您的位置信息，以便准确记录您的打卡位置。请在设置中开启位置权限。
        </Text>

        <View className="space-y-3">
          <Button
            type="primary"
            className="w-full"
            onClick={handleRequestPermission}
            loading={loading}
            disabled={loading}
          >
            <Location color="white" size={16} />
            <Text className="ml-2">开启位置权限</Text>
          </Button>

          <Button
            type="default"
            className="w-full"
            onClick={() => setShowPermissionDialog(true)}
          >
            <Setting color="#4096ff" size={16} />
            <Text className="ml-2">去设置页面</Text>
          </Button>
        </View>

        <View className="mt-4 p-3 bg-blue-50 rounded-lg">
          <Text className="text-xs text-blue-700">
            提示：位置信息仅用于打卡定位，我们不会收集或存储您的其他位置数据。
          </Text>
        </View>
      </View>

      {/* 权限说明弹窗 */}
      <Dialog
        title="位置权限说明"
        visible={showPermissionDialog}
        onConfirm={goToSettings}
        onCancel={() => setShowPermissionDialog(false)}
        confirmText="去设置"
        cancelText="取消"
      >
        <View className="p-4">
          <Text className="text-sm text-gray-700">
            为了确保打卡功能的正常使用，请在微信设置中开启位置权限：
          </Text>
          <View className="mt-3 space-y-2">
            <Text className="text-xs text-gray-600">1. 点击"去设置"按钮</Text>
            <Text className="text-xs text-gray-600">2. 找到"位置信息"选项</Text>
            <Text className="text-xs text-gray-600">3. 选择"使用期间"或"始终"</Text>
            <Text className="text-xs text-gray-600">4. 返回小程序即可正常使用</Text>
          </View>
        </View>
      </Dialog>
    </View>
  );
};

export default LocationPermission;
