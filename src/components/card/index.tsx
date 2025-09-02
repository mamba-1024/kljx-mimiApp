import { Card } from '@nutui/nutui-react-taro';
import './card.scss';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';


interface Props {
  id?: number;
  imgUrl: string;
  title: string;
  shortDesc: string;
  max?: boolean;
  className?: string;
  type?: 'product' | 'action';
}

export default (props: Props) => {
  const {id, imgUrl, title, shortDesc, max = false, className, type } = props;

  const Des = () => {
    return <View className="desc">{shortDesc}</View>;
  };

  const handleDetail = () => {
    if(id) {
      Taro.navigateTo({
        url: `/pages/home/productsDetail/index?id=${id}&type=${type}`
      })
    }
  }

  return (
    <View onClick={handleDetail} className={`card-custom ${max ? 'card-custom-max' : ''} ${className}`}>
      <Card
        src={imgUrl}
        title={title}
        price=""
        vipPrice=""
        description={<Des />}
      />
    </View>
  );
};
