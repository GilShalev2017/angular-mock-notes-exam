import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ControlType, DialogConfigData, ControlInstance } from '../../models/models';

@Component({
  selector: 'app-configuration-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatError,
    MatCheckboxModule,
  ],
  templateUrl: './configuration-form.html',
  styleUrls: ['./configuration-form.scss'],
})
export class ConfigurationForm implements OnInit {
  form: FormGroup;
  controlTypes: ControlType[] = ['temperature', 'pressure', 'speed', 'energyLevel'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConfigurationForm>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfigData,
  ) {
    this.form = this.fb.group({
      pollingInterval: [data.pollingInterval, [Validators.required, Validators.min(1000), Validators.max(60000)]],
      controls: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // Initialize form controls with existing selections
    const controlArray = this.form.get('controls') as FormArray;
    this.controlTypes.forEach((type) => {
      const isSelected = this.data.existingControls?.some((c) => c!.type === type) || false;
      controlArray.push(new FormControl(isSelected));
    });
  }

  get controlsFormArray(): FormArray<FormControl<boolean>> {
    return this.form.get('controls') as FormArray<FormControl<boolean>>;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const selectedControls: ControlInstance[] = this.controlTypes
        .map((type, index) => {
          const isSelected = this.controlsFormArray.value[index];
          if (!isSelected) return null;

          // Try to find existing control data to preserve id and values
          const existingControl = this.data.existingControls?.find((c) => c!.type === type);
          
          return {
            id: existingControl?.id || `${type}-${Date.now()}`,
            type,
            value: existingControl?.value || 0,
            label: this.getControlLabel(type),
            unit: this.getControlUnit(type),
          };
        })
        .filter((control): control is ControlInstance => {
          return control !== null;
        });

      this.dialogRef.close({
        pollingInterval: this.form.value.pollingInterval,
        selectedControls: selectedControls,
      });
    }
  }

  private getControlLabel(type: ControlType): string {
    const labels: Record<ControlType, string> = {
      temperature: 'Temperature',
      pressure: 'Pressure',
      speed: 'Speed',
      energyLevel: 'Energy Level',
    };
    return labels[type];
  }

  private getControlUnit(type: ControlType): string {
    const units: Record<ControlType, string> = {
      temperature: '°C',
      pressure: 'hPa',
      speed: 'km/h',
      energyLevel: '%',
    };
    return units[type];
  }

  onCancel() {
    this.dialogRef.close();
  }
}