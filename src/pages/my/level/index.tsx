import Taro, { useDidShow } from '@tarojs/taro';
import Api from '@/api';
import { useState } from 'react';
import { Image } from '@tarojs/components';

interface LevelProps {
  levelList: { name: string; desc: string }[];
  remark: string;
}

const currentBg = ''

const bg = ''
const start = ''

export default () => {
  const params: any = Taro.getCurrentInstance().router?.params || {};
  const [levelInfo, setLevelInfo] = useState<LevelProps>({
    levelList: [],
    remark: '',
  });

  useDidShow(() => {
    Api.getLevelInfo({ loading: true }).then((res) => {
      setLevelInfo(res.data);
    });
  });

  return (
    <div>
      <div className="flex flex-col justify-start items-center">
        {levelInfo?.levelList.map((ele) => (
          <div className={`w-[3/4] h-[100px] my-[10px] rounded-[8px] relative`}>
            <Image
              src={ele.name.includes(params.level) ? currentBg : bg}
              className='rounded-[8px]'
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: ele.name.includes(params.level)
                  ? ''
                  : '#FFBB7F',
              }}
            />
            <Image
              style={{
                position: 'absolute',
                top: '18px',
                left: '20px',
                height: '26px',
                width: '26px',
              }}
              src={start}
            />
            <span
              style={{
                position: 'absolute',
                top: '14px',
                left: '50px',
                width: '24px',
                fontSize: '24px',
                color: '#fff',
              }}
            >
              {ele.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
