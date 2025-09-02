import { Component } from "react";
import Api from "@/api";
import Card from "@/components/card";
import { View } from "@tarojs/components";

class Index extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentDidMount() {
    Api.getProductApi().then((res) => {
      this.setState({
        products: res.data.map((ele) => ({
          imgUrl: ele.productMainUrl,
          title: ele.title,
          shortDesc: ele.shortDesc,
          id: ele.id,
        })),
      });
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { products } = this.state;
    return (
      <View className="py-[8px] px-[12px]  h-screen">
        {products?.map((ele) => (
          <Card
            type="product"
            max={true}
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
