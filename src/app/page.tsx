"use client";

import { useWebView } from "../hooks/useWebView";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

interface TestItem {
  id: string;
  title: string;
  description: string;
  action: () => void;
}

export default function Home() {
  const { isWebView, sendToNative, setupMessageListener, statusMessages } =
    useWebView();
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);

  // 네이티브에서 오는 메시지를 수신하는 리스너 설정
  useEffect(() => {
    const cleanup = setupMessageListener((message) => {
      console.log("네이티브에서 메시지 수신:", message);

      // 받은 메시지를 상태에 추가
      setReceivedMessages((prev) => [
        ...prev,
        {
          ...message,
          receivedAt: new Date().toLocaleTimeString(),
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
    });

    // 컴포넌트 언마운트 시 리스너 정리
    return cleanup;
  }, [setupMessageListener]);

  const testItems: TestItem[] = [
    {
      id: "push-token",
      title: "앱 Push Token 요청",
      description: "앱 Push Token 요청을 테스트합니다",
      action: () => {
        sendToNative("PUSH_TOKEN_TEST", {
          message: "Push Token 테스트 요청",
          timestamp: new Date().toISOString(),
        });
      },
    },
    {
      id: "device-info",
      title: "디바이스 정보 요청",
      description: "앱의 기본 정보를 요청합니다",
      action: () => {
        sendToNative("GET_DEVICE_INFO", {});
      },
    },
    {
      id: "camera-access",
      title: "카메라 접근",
      description: "카메라 접근 권한을 요청합니다",
      action: () => {
        sendToNative("CAMERA_ACCESS", {
          type: "photo",
        });
      },
    },
    {
      id: "photo-library-access",
      title: "사진앨범 접근",
      description: "사진앨범 접근 권한을 요청합니다",
      action: () => {
        sendToNative("PHOTO_LIBRARY_ACCESS", {
          type: "photo",
        });
      },
    },
  ];

  const handleTestClick = (item: TestItem) => {
    console.log(`Testing: ${item.title}`);
    item.action();
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>App-Web Communication Test</h1>
          <p className={styles.subtitle}>
            WebView 환경: {isWebView ? "✅ 감지됨" : "❌ 일반 브라우저"}
          </p>
        </div>

        <div className={styles.testList}>
          {testItems.map((item) => (
            <div
              key={item.id}
              className={styles.testItem}
              onClick={() => handleTestClick(item)}
            >
              <h3 className={styles.testTitle}>{item.title}</h3>
              <p className={styles.testDescription}>{item.description}</p>
              <button className={styles.testButton}>테스트 실행</button>
            </div>
          ))}
        </div>

        {/* 받은 메시지 로그 섹션 */}
        {receivedMessages.length > 0 && (
          <div className={styles.messageLog}>
            <h2 className={styles.logTitle}>수신된 메시지</h2>
            <button
              className={styles.clearButton}
              onClick={() => setReceivedMessages([])}
            >
              로그 지우기
            </button>
            <div className={styles.messages}>
              {receivedMessages
                .slice(-5)
                .reverse()
                .map((msg, index) => (
                  <div key={index} className={styles.message}>
                    <div className={styles.messageHeader}>
                      <span className={styles.messageType}>{msg.type}</span>
                      <span className={styles.messageTime}>
                        {msg.receivedAt}
                      </span>
                    </div>
                    <pre className={styles.messageData}>
                      {JSON.stringify(msg.data, null, 2)}
                    </pre>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 상태 메시지 표시 */}
        {statusMessages.length > 0 && (
          <div className={styles.statusMessages}>
            <h3 className={styles.statusTitle}>전송 상태 메시지</h3>
            {statusMessages
              .slice(-3)
              .reverse()
              .map((msg, index) => (
                <div key={index} className={styles.statusMessage}>
                  {msg}
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
