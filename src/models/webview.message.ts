// WebView 메시지 타입 정의
export interface WebViewMessage {
  type: string;
  data: any;
  timestamp?: number;
}
