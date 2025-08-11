import { useEffect, useState, useCallback } from "react";
import { NativeMessage } from "../models/native.message";

export const useNativeMessageHandler = (
  setupMessageListener: (callback: (message: any) => void) => () => void
) => {
  const [receivedMessages, setReceivedMessages] = useState<NativeMessage[]>([]);

  const handleNativeMessage = useCallback((message: any) => {
    console.log("네이티브에서 메시지 수신:", message);

    // 받은 메시지를 상태에 추가
    setReceivedMessages((prev) => [
      ...prev,
      {
        ...message,
      },
    ]);

    // 메시지 타입에 따른 처리
    switch (message.type) {
      case "PUSH_TOKEN_RESPONSE":
        console.log(`푸시 Token 응답: ${message.data.status}`);
        break;
      case "FILE_UPLOAD_RESPONSE":
        console.log(
          `파일 업로드 응답: ${message.data.success ? "성공" : "실패"}`
        );
        break;
      case "DEVICE_INFO_RESPONSE":
        console.log(`디바이스 정보: ${JSON.stringify(message.data)}`);
        break;
      case "CAMERA_ACCESS_RESPONSE":
        console.log(
          `카메라 접근: ${message.data.granted ? "허용됨" : "거부됨"}`
        );
        break;
      case "PHOTO_LIBRARY_ACCESS_RESPONSE":
        console.log(
          `사진앨범 접근: ${message.data.granted ? "허용됨" : "거부됨"}`
        );
        break;
      default:
        console.log("알 수 없는 메시지 타입:", message.type);
    }
  }, []);

  const clearReceivedMessages = useCallback(() => {
    setReceivedMessages([]);
  }, []);

  // 네이티브에서 오는 메시지를 수신하는 리스너 설정
  useEffect(() => {
    const cleanup = setupMessageListener(handleNativeMessage);
    return cleanup;
  }, [setupMessageListener, handleNativeMessage]);

  return {
    receivedMessages,
    clearReceivedMessages,
  };
};
