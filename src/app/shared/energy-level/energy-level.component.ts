import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ControlInstance } from '../../models/models';

@Component({
  selector: 'app-energy-level',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './energy-level.component.html',
  styleUrls: ['./energy-level.component.scss'],
})
export class EnergyLevelComponent {
  @Input({ required: true }) controlData!: ControlInstance;
  @Output() valueChange = new EventEmitter<number>();

  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
}
