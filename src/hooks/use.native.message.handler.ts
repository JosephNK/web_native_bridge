import { useEffect, useState, useCallback } from "react";
import { NativeMessage } from "../models/native.message";

export const useNativeMessageHandler = (
  setupMessageListener: (callback: (message: any) => void) => () => void
) => {
  const [receivedMessages, setReceivedMessages] = useState<NativeMessage[]>([]);

  const handleNativeMessage = useCallback((message: any) => {
    console.log("네이티브에서 메시지 수신:", message);

    // message.data가 배열이고 배열 안의 객체에 base64Data가 있는 경우 처리
    let processedMessage = { ...message };

    if (message.data && Array.isArray(message.data)) {
      // base64Data를 줄여서 표시하기 위해 데이터 수정
      processedMessage.data = message.data.map((item: any) => {
        if (item && typeof item === "object" && item.base64Data) {
          const truncatedBase64 =
            item.base64Data.length > 50
              ? `${item.base64Data.substring(0, 50)}...`
              : item.base64Data;

          return {
            ...item,
            base64Data: truncatedBase64,
          };
        }
        return item;
      });
    }

    // 받은 메시지를 상태에 추가
    setReceivedMessages((prev) => [
      ...prev,
      {
        ...processedMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const clearReceivedMessages = useCallback(() => {
    setReceivedMessages([]);
  }, []);

  // 네이티브에서 오는 메시지를 수신하는 리스너 설정
  useEffect(() => {
    const cleanup = setupMessageListener(handleNativeMessage);
    return cleanup;
  }, [setupMessageListener, handleNativeMessage]);

  console.log(receivedMessages);

  return {
    receivedMessages,
    clearReceivedMessages,
  };
};
