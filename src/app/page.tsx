"use client";

import { useWebView } from "../hooks/use.webview";
import { useNativeMessageHandler } from "../hooks/use.native.message.handler";
import styles from "./page.module.css";
import { EventItem, eventItems } from "../models/event.type";

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

  eventItems.forEach((item) => {
    item.action = () => {
      console.log(item.id);
      if (item.id == "SET_CLIPBOARD") {
        sendToNative(item.id, {
          text: "Hello World",
        });
      } else {
        sendToNative(item.id, {});
      }

      // 화면을 맨 아래로 스크롤
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    };
  });

  const handleTestClick = (item: EventItem) => {
    console.log(`Testing: ${item.title}`);
    if (item.action) {
      item.action();
    }
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
          {eventItems.map((item) => (
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
                      {JSON.stringify(
                        Object.fromEntries(
                          Object.entries(msg).filter(
                            ([key]) => key !== "timestamp"
                          )
                        ),
                        null,
                        2
                      )}
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
                    <div className={styles.messageHeader}>
                      <span className={styles.messageType}>{msg.type}</span>
                      <span className={styles.messageTime}>
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className={styles.messageData}>
                      {JSON.stringify(
                        Object.fromEntries(
                          Object.entries(msg).filter(
                            ([key]) => key !== "timestamp"
                          )
                        ),
                        null,
                        2
                      )}
                    </pre>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
