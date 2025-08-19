import { useEffect, useState, useCallback } from "react";
import { WebViewMessage } from "../models/webview.message";

// 타입 정의

interface WindowWithWebView extends Window {
  IN_APP_WEBVIEW_BRIDGE_CHANNEL?: {
    postMessage: (message: string) => void;
  };
  webkit?: {
    messageHandlers?: {
      nativeHandler?: {
        postMessage: (message: WebViewMessage) => void;
      };
    };
  };
  Android?: {
    receiveMessage: (message: string) => void;
  };
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
  flutter_inappwebview?: {
    callHandler: (handlerName: string, args: any) => Promise<any>;
  };
  flutterCanvasKit?: any;
}

declare const window: WindowWithWebView;

type MessageCallback = (message: WebViewMessage) => void;

declare global {
  interface Window {
    callbackPostMessage?: (data: string) => void;
    callbackAppState?: (state: string) => void;
  }
}

export const useWebView = () => {
  const [isWebView, setIsWebView] = useState<boolean>(false);
  const [statusMessages, setStatusMessages] = useState<WebViewMessage[]>([]);

  const addStatusMessage = useCallback((message: WebViewMessage) => {
    setStatusMessages((prev) => [
      ...prev.slice(-4), // 최근 5개만 유지
      {
        ...message,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const clearStatusMessages = useCallback(() => {
    setStatusMessages([]);
  }, []);

  useEffect(() => {
    // WebView 환경 감지
    const detectWebView = (): boolean => {
      return !!(
        (window as any).IN_APP_WEBVIEW_BRIDGE_CHANNEL ||
        window.webkit?.messageHandlers ||
        window.Android ||
        // Flutter InAppWebView
        window.flutter_inappwebview ||
        // Flutter Web
        window.flutterCanvasKit ||
        window.ReactNativeWebView
      );
    };

    setIsWebView(detectWebView());
  }, []);

  // 네이티브로 메시지 전송
  const sendToNative = useCallback((type: string, data: any = {}) => {
    const message: WebViewMessage = { type, data };

    if (window.IN_APP_WEBVIEW_BRIDGE_CHANNEL?.postMessage) {
      // WebView 커스텀 채널
      window.IN_APP_WEBVIEW_BRIDGE_CHANNEL.postMessage(JSON.stringify(message));
      addStatusMessage(message);
    } else if (window.webkit?.messageHandlers?.nativeHandler) {
      // iOS WKWebView
      window.webkit.messageHandlers.nativeHandler.postMessage(message);
      addStatusMessage(message);
    } else if (window.Android?.receiveMessage) {
      // Android WebView
      window.Android.receiveMessage(JSON.stringify(message));
      addStatusMessage(message);
    } else if (window.flutter_inappwebview?.callHandler) {
      // Flutter InAppWebView
      window.flutter_inappwebview.callHandler("flutterHandler", message);
      addStatusMessage(message);
    } else if (window.ReactNativeWebView) {
      // React Native WebView
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
      addStatusMessage(message);
    } else {
      addStatusMessage(message);
      console.log("Native bridge not available:", message);
    }
  }, []);

  // 메시지를 수신하는 콜백 설정
  const setupMessageListener = useCallback(
    (callback: MessageCallback) => {
      const cleanupFunctions: (() => void)[] = [];

      if (typeof window !== "undefined") {
        // PostMessage 콜백 함수 설정
        window.callbackPostMessage = (data: string) => {
          try {
            const message: WebViewMessage = JSON.parse(data);
            callback(message);
          } catch (error) {
            console.error("Failed to parse Flutter message:", error);
          }
        };

        cleanupFunctions.push(() => {
          delete window.callbackPostMessage;
        });

        // AppState 콜백 함수 설정
        window.callbackAppState = (data: string) => {
          try {
            const message: WebViewMessage = JSON.parse(data);
            callback(message);
          } catch (error) {
            console.error("Failed to handle app state change:", error);
          }
        };

        cleanupFunctions.push(() => {
          delete window.callbackAppState;
        });

        // WebView 메시지 이벤트 리스너 추가
        const handleMessage = (event: MessageEvent) => {
          try {
            const message: WebViewMessage =
              typeof event.data === "string"
                ? JSON.parse(event.data)
                : event.data;
            callback(message);
            addStatusMessage(message);
          } catch (error) {
            console.error("Failed to parse message event:", error);
            addStatusMessage({
              type: "ERROR",
              data: { error: error },
            });
          }
        };

        window.addEventListener("message", handleMessage);
        cleanupFunctions.push(() => {
          window.removeEventListener("message", handleMessage);
        });
      }

      return () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
      };
    },
    [addStatusMessage]
  );

  return {
    isWebView,
    sendToNative,
    setupMessageListener,
    statusMessages,
    addStatusMessage,
    clearStatusMessages,
  };
};
