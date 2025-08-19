export enum EventType {
  PUSH_TOKEN = "PUSH_TOKEN",
  DEVICE_INFO = "DEVICE_INFO",
  CAMERA_ACCESS = "CAMERA_ACCESS",
  PHOTO_LIBRARY_ACCESS = "PHOTO_LIBRARY_ACCESS",
  SET_CLIPBOARD = "SET_CLIPBOARD",
  GET_CLIPBOARD = "GET_CLIPBOARD",
  OPEN_APP_SETTINGS = "OPEN_APP_SETTINGS",
  OPEN_IN_APP_BROWSER = "OPEN_IN_APP_BROWSER",
  OPEN_EXTERNAL_BROWSER = "OPEN_EXTERNAL_BROWSER",
  EXIT_APP = "EXIT_APP",
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  action?: () => void;
}

export const eventItems: EventItem[] = [
  {
    id: EventType.PUSH_TOKEN,
    title: "Push Token 요청",
    description: "앱의 Push Token 요청합니다",
  },
  {
    id: EventType.DEVICE_INFO,
    title: "디바이스 정보 요청",
    description: "앱의 디바이스 정보를 요청합니다",
  },
  {
    id: EventType.CAMERA_ACCESS,
    title: "카메라 접근",
    description: "카메라 접근 권한을 요청합니다",
  },
  {
    id: EventType.PHOTO_LIBRARY_ACCESS,
    title: "사진앨범 접근",
    description: "사진앨범 접근 권한을 요청합니다",
  },
  {
    id: EventType.SET_CLIPBOARD,
    title: "클립보드에 데이터 저장",
    description: "클립보드에 데이터를 저장합니다",
  },
  {
    id: EventType.GET_CLIPBOARD,
    title: "클립보드 데이터 가져오기",
    description: "클립보드에 저장된 데이터를 가져옵니다",
  },
  {
    id: EventType.OPEN_APP_SETTINGS,
    title: "앱 설정 열기",
    description: "앱 설정을 엽니다",
  },
  {
    id: EventType.OPEN_IN_APP_BROWSER,
    title: "인앱 브라우저 열기",
    description: "인앱 브라우저를 엽니다",
  },
  {
    id: EventType.OPEN_EXTERNAL_BROWSER,
    title: "외부 브라우저 열기",
    description: "외부 브라우저를 엽니다",
  },
  {
    id: EventType.EXIT_APP,
    title: "앱 종료",
    description: "앱을 종료합니다",
  },
];
