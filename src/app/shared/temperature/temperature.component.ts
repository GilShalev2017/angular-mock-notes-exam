import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { ControlInstance, ControlType } from '../../models/models';

@Component({
  selector: 'app-temperature',
  imports: [NgxGaugeModule],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.scss',
  standalone: true,
})
export class TemperatureComponent {
  @Input({ required: true }) controlData!: ControlInstance;
  @Output() valueChange = new EventEmitter<number>();
  
  tempThresholds: { [key: number]: { color: string } } = {
    0: { color: '#2196f3' }, // Cold - Blue
    20: { color: '#00b862' }, // Normal - Green
    30: { color: '#ff9800' }, // Warm - Orange
    40: { color: '#ff4514' }, // Hot - Red
  };
}

