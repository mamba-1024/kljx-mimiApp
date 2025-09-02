import { Component } from "react";
import { Row, Col, Swiper, SwiperItem } from "@nutui/nutui-react-taro";
import Api from "@/api";
import productIcon from "@/assets/image/productIcon.png";
import messageIcon from "@/assets/image/messageIcon.png";
import aboutIcon from "@/assets/image/aboutIcon.png";
import Card from "@/components/card";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";

class Index extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      // mainUrl: '',
      mainUrls: [],
      products: [],
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    Api.getHomeInfoApi().then((res) => {
      this.setState({
        mainUrls: res.data.mainUrls,
        products: res.data.products.map((ele) => ({
          imgUrl: ele.productMainUrl,
          title: ele.title,
          shortDesc: ele.shortDesc,
          id: ele.id,
        })),
      });
    });
  }

  componentDidHide() {}

  render() {
    const { mainUrls, products } = this.state;
    return (
      <View className="py-[8px] px-[12px] h-screen">
        {/* 主图 */}
        <View>
          <Swiper
            height={180}
            autoplay={true}
          >
            {mainUrls.map((url) => (
              <SwiperItem>
                <Image className="w-full h-[180px]" src={url} />
              </SwiperItem>
            ))}
          </Swiper>
        </View>
        <Row
          type="flex"
          justify="space-around"
          gutter="8"
          className="my-[16px] bg-white rounded-[6px] pt-[12px]"
        >
          <Col span="6" className="flex flex-col justify-center items-center">
            <Image
              className="w-[44px] h-[44px]"
              src={productIcon}
              onClick={() => {
                Taro.navigateTo({ url: "/pages/home/products/index" });
              }}
            />
            <Text className="mt-[6px]">产品展示</Text>
          </Col>
          <Col span="6" className="flex flex-col justify-center items-center">
            <Image
              className="w-[44px] h-[44px]"
              src={messageIcon}
              onClick={() => {
                Taro.navigateTo({ url: "/pages/home/companyNews/index" });
              }}
            />
            <Text className="mt-[6px]">企业动态</Text>
          </Col>
          <Col span="6" className="flex flex-col justify-center items-center">
            <Image
              className="w-[44px] h-[44px]"
              src={aboutIcon}
              onClick={() => {
                Taro.navigateTo({ url: "/pages/home/aboutUs/index" });
              }}
            />
            <Text className="mt-[6px]">关于我们</Text>
          </Col>
        </Row>
        <View className="mb-[6px] text-[16px] font-bold ">推荐商品</View>
        {products?.map((ele) => (
          <Card
            type="product"
            className="mb-[20px]"
            imgUrl={ele.imgUrl}
            title={ele.title}
            shortDesc={ele.shortDesc}
            id={ele.id}
          />
        ))}
      </View>
    );
  }
}
export default Index;
