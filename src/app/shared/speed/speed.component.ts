import { Component,EventEmitter,Input, Output } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { ControlInstance } from '../../models/models';

@Component({
  selector: 'app-speed',
  imports: [NgxGaugeModule],
  templateUrl: './speed.component.html',
  styleUrls: ['./speed.component.scss'],
  standalone: true
})
export class SpeedComponent {
  @Input({ required: true }) controlData!: ControlInstance;
  @Output() valueChange = new EventEmitter<number>();
  
  speedThresholds = {
    '0': { color: 'green' },
    '50': { color: 'orange' },
    '75': { color: 'red' }
  };
}
