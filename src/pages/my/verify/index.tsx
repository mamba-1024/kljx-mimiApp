import { useState } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Uploader,
  Cell,
  ConfigProvider,
} from "@nutui/nutui-react-taro";
import Taro, { useLoad } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Api from "@/api";
import { getToken } from "@/utils/index";
import { getVersion } from "@/service";

const details = {
  isAuthenticated: "认证状态",
  name: "姓名",
  idCard: "身份证号码",
  idCardIsUpload: "身份证照片",
  bankName: "银行名称",
  bankCard: "银行卡号",
  auditStatus: "审核状态",
};

const mapping = {
  isAuthenticated: "已认证",
  idCardIsUpload: "已上传",
};

const auditStatusMap = {
  WAIT_AUDIT: "待审核",
  PASS: "审核通过",
  REJECT: "审核不通过",
};

const editInfo = {
  userName: "姓名",
  idCard: "身份证号码",
  bankCard: "银行卡号",
  bankReservePhone: "银行预留手机号",
  frontIdCardUrl: "身份证正面",
  backendIdCardUrl: "身份证反面",
};

// 防止用户重复点击
let isClick = false;

const theme = {
  // 设置 --nutui-form-item-required-color 为红色
  "--nutui-form-item-required-color": "#f00",
  "--nutui-form-item-error-message-color": "#f00",
};

const App = () => {
  // 是否已经实名
  const [verifiedState, setVerifiedState] = useState(false);
  const [state, setState] = useState({
    userName: "",
    idCard: "",
    bankCard: "",
    bankReservePhone: "",
    frontIdCardUrl: "",
    backendIdCardUrl: "",
  });
  const [detailInfo, setDetailInfo] = useState<any>({});

  useLoad(() => {
    const { verified }: any = Taro.getCurrentInstance().router?.params || {};
    setVerifiedState(verified === "true");
    if (verified === "true") {
      Api.getUserDetail({ loading: true }).then((res) => {
        setDetailInfo(res.data);
      });
    }
  });

  const handleSubmit = (values: any) => {
    const params = {
      ...values,
      frontIdCardUrl: values.frontIdCardUrl[0].url || "",
      backendIdCardUrl: values.backendIdCardUrl[0].url || "",
    };

    if (isClick) return;

    isClick = true;
    Api.postVerifyUser({ ...params, loading: true }).then(() => {
      Taro.navigateBack();
    });
    isClick = false;
  };

  const handleRewrite = () => {
    setVerifiedState(false);
    setDetailInfo({});
  };


  return verifiedState ? (
    <View className="bg-white mt-10px h-full">
      <Cell.Group>
        {Object.keys(details).map((ele) => (
          <Cell>
            <View
              key={ele}
              className="flex-1 flex flex-row justify-between items-center"
            >
              <span>{details[ele]}</span>
              <span>
                {auditStatusMap[detailInfo?.[ele]] ||
                  mapping[ele] ||
                  detailInfo?.[ele]}
              </span>
            </View>
          </Cell>
        ))}
        {detailInfo?.auditStatus === "REJECT" && (
          <Cell>
            <View className="flex-1 flex flex-row justify-between items-center">
              <span>拒绝原因</span>
              <span>{detailInfo?.rejectReason}</span>
            </View>
          </Cell>
        )}
        {detailInfo?.auditStatus === "REJECT" && (
          <Cell>
            <View className="flex-1 flex flex-row justify-between items-center">
              <Button type="primary" block onClick={handleRewrite}>
                重新填写个人信息
              </Button>
            </View>
          </Cell>
        )}
      </Cell.Group>
    </View>
  ) : (
    <View className="h-full w-full bg-white">
      <ConfigProvider theme={theme}>
        <Form
          divider
          labelPosition="left"
          footer={
            <Button
              type="primary"
              block
              size="large"
              className="rounded-full"
              // onClick={handleSubmit}
              nativeType="submit"
            >
              提交
            </Button>
          }
          onFinish={handleSubmit}
        >
          <Form.Item
            name="userName"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="姓名" />
          </Form.Item>
          <Form.Item
            name="idCard"
            label="身份证号码"
            rules={[{ required: true, message: "请输入身份证号码" }]}
          >
            <Input placeholder="身份证号码" />
          </Form.Item>
          <Form.Item
            name="bankCard"
            label="银行卡号"
            rules={[{ required: true, message: "请输入银行卡号" }]}
          >
            <Input placeholder="银行卡号" />
          </Form.Item>
          <Form.Item
            name="bankReservePhone"
            label="银行预留手机号"
            rules={[{ required: true, message: "请输入银行预留手机号" }]}
          >
            <Input placeholder="银行预留手机号" />
          </Form.Item>
          <Form.Item
            name="frontIdCardUrl"
            label="身份证正面"
            rules={[{ required: true, message: "请上传身份证正面" }]}
          >
            <Uploader
              upload={(file) => {
                return new Promise((resolve, reject) => {
                  Taro.uploadFile({
                    url: getVersion() + "/upload",
                    filePath: file.tempFilePath,
                    name: "file",
                    header: {
                      Authorization: getToken(),
                    },
                    success: (res) => {
                      try {
                        const data = JSON.parse(res.data);
                        resolve({
                          status: "success",
                          message: "上传成功",
                          url: data.data,
                        });
                      } catch (error) {
                        reject({
                          status: "error",
                          message: "解析响应失败",
                        });
                      }
                    },
                    fail: (err) => {
                      reject({
                        status: "error",
                        message: "上传失败",
                      });
                    },
                  });
                });
              }}
              // 只能上传一张图片
              maxCount={1}
              mediaType={["image"]}
              uploadIcon={<span>身份证正面</span>}
            />
          </Form.Item>
          <Form.Item
            name="backendIdCardUrl"
            label="身份证反面"
            rules={[{ required: true, message: "请上传身份证反面" }]}
          >
            <Uploader
              upload={(file) => {
                return new Promise((resolve, reject) => {
                  Taro.uploadFile({
                    url: getVersion() + "/upload",
                    filePath: file.tempFilePath,
                    name: "file",
                    header: {
                      Authorization: getToken(),
                    },
                    success: (res) => {
                      try {
                        const data = JSON.parse(res.data);
                        resolve({
                          status: "success",
                          message: "上传成功",
                          url: data.data,
                        });
                      } catch (error) {
                        reject({
                          status: "error",
                          message: "解析响应失败",
                        });
                      }
                    },
                    fail: (err) => {
                      reject({
                        status: "error",
                        message: "上传失败",
                      });
                    },
                  });
                });
              }}
              // 只能上传一张图片
              maxCount={1}
              mediaType={["image"]}
              uploadIcon={<span>身份证反面</span>}
            />
          </Form.Item>
        </Form>
      </ConfigProvider>
      {/* <View className="">
        <Input
          name="userName"
          placeholder="姓名"
          defaultValue={state.userName}
          onChange={(val) => onChangeInput(val, "userName")}
        />
        <Input
          name="idCard"
          placeholder="身份证号码"
          defaultValue={state.idCard}
          onChange={(val) => onChangeInput(val, "idCard")}
        />
        <Input
          name="bankCard"
          placeholder="银行卡号"
          defaultValue={state.bankCard}
          type="digit"
          onChange={(val) => onChangeInput(val, "bankCard")}
        />
        <Input
          name="bankReservePhone"
          placeholder="银行预留手机号"
          defaultValue={state.bankReservePhone}
          type="tel"
          onChange={(val) => onChangeInput(val, "bankReservePhone")}
        />
        <View className="mt-[20px] pl-[12px] mb-[12px] nut-input nut-input-required">
          身份证正反面:
        </View>
        <Row type="flex" justify="space-around" className="pt-10px">
          <Col span="8" className="flex justify-center">
            <Uploader
              url={getVersion() + "/upload"}
              onBeforeXhrUpload={beforeXhrUpload}
              onBeforeDelete={() => {
                setState({ ...state, frontIdCardUrl: "" });
                return true;
              }}
              onSuccess={(response) => {
                setState({
                  ...state,
                  frontIdCardUrl: response.responseText.data,
                });
                Taro.hideLoading();
              }}
              onFailure={() => {
                Taro.hideLoading();
              }}
              mediaType={["image"]}
            ></Uploader>
          </Col>
          <Col span="8" className="flex justify-center">
            <Uploader
              url={getVersion() + "/upload"}
              onBeforeXhrUpload={beforeXhrUpload}
              onBeforeDelete={() => {
                setState({ ...state, backendIdCardUrl: "" });
                return true;
              }}
              onSuccess={(response) => {
                setState({
                  ...state,
                  backendIdCardUrl: response.responseText.data,
                });
                Taro.hideLoading();
              }}
              onFailure={() => {
                Taro.hideLoading();
              }}
              mediaType={["image"]}
            ></Uploader>
          </Col>
        </Row>
      </View> */}
    </View>
  );
};
export default App;
