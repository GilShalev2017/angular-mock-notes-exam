import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { ControlInstance } from '../../models/models';

@Component({
  selector: 'app-pressure',
  imports: [NgxGaugeModule],
  templateUrl: './pressure.component.html',
  styleUrl: './pressure.component.scss',
  standalone: true
})
export class PressureComponent {
  @Input({ required: true }) controlData!: ControlInstance;
  @Output() valueChange = new EventEmitter<number>();

  // Gauge configuration
  gaugeType = 'arch'; // Options: 'full', 'semi', 'arch'
  minPressure = 0;
  maxPressure = 100;
  gaugeColor = '#2196f3';

  // Thresholds for color zones
  pressureThresholds = {
    0: { color: '#2196f3' }, // Low - Blue
    20: { color: '#00b862' }, // Normal - Green
    40: { color: '#ff9800' }, // High - Orange
    60: { color: '#ff4514' }, // Critical - Red
    80: { color: '#d32f2f' }, // Danger - Dark Red
  };

  // Markers for important pressure points
  pressureMarkers = {
    0: { color: '#555', size: 8, label: '0', type: 'line' },
    25: { color: '#555', size: 8, label: '25', type: 'line' },
    50: { color: '#555', size: 8, label: '50', type: 'line' },
    75: { color: '#555', size: 8, label: '75', type: 'line' },
    100: { color: '#555', size: 8, label: '100', type: 'line' },
  };

  // Simulate pressure changes
  increasePressure() {
    if (this.controlData!.value < this.maxPressure) {
      this.controlData!.value += 5;
    }
    this.valueChange.emit(this.controlData!.value);
  }

  decreasePressure() {
    if (this.controlData!.value > this.minPressure) {
      this.controlData!.value -= 5;
    }
    this.valueChange.emit(this.controlData!.value);
  }

  resetPressure() {
    this.controlData!.value = 30;
    this.valueChange.emit(this.controlData!.value);
  }

  // Get pressure status based on current value
  getPressureStatus(): string {
    if (this.controlData!.value < 20) return 'Low';
    if (this.controlData!.value < 40) return 'Normal';
    if (this.controlData!.value < 60) return 'High';
    if (this.controlData!.value < 80) return 'Critical';
    return 'Danger';
  }
}
