import Taro from '@tarojs/taro';

export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
}

// 默认的打卡位置
// 默认的打卡位置 纬度: 31.286248, 经度: 119.86139
export const defaultLocation = {
  name: "科力机械新厂区",
  latitude: 31.286248,
  longitude: 119.86139,
  address: "江苏省无锡市宜兴市湖光中路6号",
};

/**
 * 检查位置权限
 * @returns Promise<boolean>
 */
export const checkLocationPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Taro.getSetting({
      success: (res) => {
        const hasPermission = res.authSetting['scope.userLocation'] === true;
        resolve(hasPermission);
      },
      fail: () => resolve(false)
    });
  });
};

/**
 * 请求位置权限
 * @returns Promise<boolean>
 */
export const requestLocationPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    Taro.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] === false) {
          // 用户之前拒绝了位置权限
          Taro.showModal({
            title: '需要位置权限',
            content: '打卡功能需要获取您的位置信息，请在设置中开启位置权限',
            confirmText: '去设置',
            cancelText: '取消',
            success: (modalRes) => {
              if (modalRes.confirm) {
                Taro.openSetting({
                  success: (settingRes) => {
                    resolve(settingRes.authSetting['scope.userLocation'] || false);
                  },
                  fail: () => resolve(false)
                });
              } else {
                resolve(false);
              }
            }
          });
        } else if (res.authSetting['scope.userLocation'] === undefined) {
          // 首次使用，直接请求权限
          resolve(true);
        } else {
          resolve(true);
        }
      },
      fail: () => resolve(false)
    });
  });
};

/**
 * 获取当前位置
 * @returns Promise<LocationInfo>
 */
export const getCurrentLocation = (): Promise<LocationInfo> => {
  return new Promise(async (resolve, reject) => {
    try {
      // 先检查权限
      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        const granted = await requestLocationPermission();
        if (!granted) {
          reject(new Error('用户拒绝了位置权限'));
          return;
        }
      }

      Taro.getLocation({
        type: 'gcj02',
        success: (res) => {
          console.log('获取位置成功:', res);
          const locationInfo: LocationInfo = {
            latitude: res.latitude,
            longitude: res.longitude,
            address: `纬度: ${res.latitude.toFixed(6)}, 经度: ${res.longitude.toFixed(6)}`
          };

          // 可以在这里调用腾讯地图API获取详细地址
          // getAddressFromCoordinates(res.latitude, res.longitude)
          //   .then(address => {
          //     locationInfo.address = address;
          //     resolve(locationInfo);
          //   })
          //   .catch(() => resolve(locationInfo));

          resolve(locationInfo);
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          let errorMessage = '获取位置失败';

          if (err.errMsg.includes('auth deny')) {
            errorMessage = '位置权限被拒绝，请在设置中开启';
          } else if (err.errMsg.includes('timeout')) {
            errorMessage = '定位超时，请检查网络连接';
          } else if (err.errMsg.includes('unsupported')) {
            errorMessage = '当前设备不支持定位功能';
          }

          reject(new Error(errorMessage));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 根据坐标获取地址信息（需要腾讯地图API Key）
 * @param latitude 纬度
 * @param longitude 经度
 * @param key 腾讯地图API Key
 * @returns Promise<string>
 */
export const getAddressFromCoordinates = (
  latitude: number,
  longitude: number,
  key: string = 'YOUR_TENCENT_MAP_KEY'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}&get_poi=1`,
      method: 'GET',
      success: (res) => {
        if (res.data.status === 0) {
          resolve(res.data.result.address);
        } else {
          reject(new Error('获取地址失败'));
        }
      },
      fail: (err) => {
        console.error('请求地址失败:', err);
        reject(new Error('获取地址失败'));
      }
    });
  });
};

/**
 * 计算两点之间的距离（米）
 * @param lat1 第一个点的纬度
 * @param lng1 第一个点的经度
 * @param lat2 第二个点的纬度
 * @param lng2 第二个点的经度
 * @returns number 距离（米）
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371000; // 地球半径（米）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * 获取当前位置超过考勤范围的距离
 * @param latitude 当前位置的纬度
 * @param longitude 当前位置的经度
 * @returns 距离（米）
 */
export const getOverRange = (latitude: number, longitude: number) => {
  const distance = calculateDistance(latitude, longitude, defaultLocation.latitude, defaultLocation.longitude);
  // 保留两位小数
  return Number((distance - 50).toFixed(2));
};

/**
 * 检查是否在指定范围内
 * @param currentLocation 当前位置
 * @param targetLocation 目标位置
 * @param maxDistance 最大距离（米）
 * @returns boolean
 */
export const isWithinRange = (
  currentLocation: LocationInfo,
  targetLocation: LocationInfo,
  maxDistance: number = 50
): boolean => {

  if (!currentLocation || !targetLocation) {
    return false;
  }

  const distance = calculateDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    targetLocation.latitude,
    targetLocation.longitude
  );
  return distance <= maxDistance;
};

/**
 * 选择位置（如果需要手动选择打卡位置）
 * @returns Promise<LocationInfo>
 */
export const chooseLocation = (): Promise<LocationInfo> => {
  return new Promise((resolve, reject) => {
    Taro.chooseLocation({
      success: (res) => {
        console.log('选择位置成功:', res);
        const locationInfo: LocationInfo = {
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address || res.name || `纬度: ${res.latitude.toFixed(6)}, 经度: ${res.longitude.toFixed(6)}`
        };
        resolve(locationInfo);
      },
      fail: (err) => {
        console.error('选择位置失败:', err);
        reject(new Error('选择位置失败'));
      }
    });
  });
};
