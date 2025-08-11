"use client";

import { useWebView } from "../hooks/use.webview";
import { useNativeMessageHandler } from "../hooks/use.native.message.handler";
import styles from "./page.module.css";
import { TestItem } from "../models/test.item";

export default function Home() {
  const {
    isWebView,
    sendToNative,
    setupMessageListener,
    statusMessages,
    clearStatusMessages,
  } = useWebView();
  const { receivedMessages, clearReceivedMessages } =
    useNativeMessageHandler(setupMessageListener);

  const testItems: TestItem[] = [
    // {
    //   id: "push-token",
    //   title: "앱 Push Token 요청",
    //   description: "앱 Push Token 요청을 테스트합니다",
    //   action: () => {
    //     sendToNative("PUSH_TOKEN", {});
    //   },
    // },
    {
      id: "device-info",
      title: "디바이스 정보 요청",
      description: "앱의 기본 정보를 요청합니다",
      action: () => {
        sendToNative("DEVICE_INFO", {});
      },
    },
    {
      id: "camera-access",
      title: "카메라 접근",
      description: "카메라 접근 권한을 요청합니다",
      action: () => {
        sendToNative("CAMERA_ACCESS", {});
      },
    },
    {
      id: "photo-library-access",
      title: "사진앨범 접근",
      description: "사진앨범 접근 권한을 요청합니다",
      action: () => {
        sendToNative("PHOTO_LIBRARY_ACCESS", {});
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
            <div className={styles.logHeader}>
              <h2 className={styles.logTitle}>수신된 메시지</h2>
              <button
                className={styles.clearButton}
                onClick={() => clearReceivedMessages()}
              >
                로그 지우기
              </button>
            </div>
            <div className={styles.messages}>
              {receivedMessages
                .slice(-5)
                .reverse()
                .map((msg, index) => (
                  <div key={index} className={styles.message}>
                    <div className={styles.messageHeader}>
                      <span className={styles.messageType}>{msg.type}</span>
                      <span className={styles.messageTime}>
                        {msg.timestamp}
                      </span>
                    </div>
                    <pre className={styles.messageData}>
                      {JSON.stringify(msg, null, 2)}
                    </pre>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 전송 상태 메시지 로그 섹션 */}
        {statusMessages.length > 0 && (
          <div className={styles.messageLog}>
            <div className={styles.logHeader}>
              <h2 className={styles.logTitle}>전송 상태 메시지</h2>
              <button
                className={styles.clearButton}
                onClick={() => clearStatusMessages()}
              >
                로그 지우기
              </button>
            </div>
            <div className={styles.messages}>
              {statusMessages
                .slice(-3)
                .reverse()
                .map((msg, index) => (
                  <div key={index} className={styles.message}>
                    <div className={styles.messageContent}>{msg}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
