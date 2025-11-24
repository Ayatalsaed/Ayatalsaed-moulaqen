
export enum View {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  SIMULATION = 'SIMULATION',
  BUILDER = 'BUILDER'
}

export enum PublicView {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  FEATURES = 'FEATURES',
  DEMO = 'DEMO',
  TRACKS = 'TRACKS',
  PRICING = 'PRICING',
  SCHOOLS = 'SCHOOLS',
  ENTERPRISE = 'ENTERPRISE',
  SUPPORT = 'SUPPORT',
  FAQ = 'FAQ',
  CONTACT = 'CONTACT',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type SensorType = 'ultrasonic' | 'infrared' | 'color' | 'gyro' | 'camera';

export interface RobotConfig {
  name: string;
  type: 'rover' | 'arm' | 'drone';
  sensors: SensorType[];
  sensorConfig: {
    ultrasonic?: { range: number };
    infrared?: { sensitivity: number };
    color?: { illumination: boolean };
    gyro?: { axis: '3-axis' | '6-axis' };
    camera?: { resolution: '720p' | '1080p' };
  };
  color: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
}

export interface StatData {
  name: string;
  value: number;
  fullMark: number;
}
