export type ControlType = 'temperature' | 'pressure' | 'speed' | 'energyLevel';

export type ControlInstance = {
  id: string; 
  type: ControlType;
  value: number;
  label: string;
  unit: string;
} | null;

export interface DashboardData {
  pressure: number;
  temperature: number;
  speed: number;
  energyLevel: number;
}

export interface DialogConfigData {
  pollingInterval: number;
  existingControls: ControlInstance[];
}

export interface Note {
  id: string;
  title?: string;
  content?: string;
  createdAt: Date;
}