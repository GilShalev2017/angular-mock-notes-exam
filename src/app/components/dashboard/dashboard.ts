import { Component, DestroyRef, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TemperatureComponent } from '../../shared/temperature/temperature.component';
import { SpeedComponent } from '../../shared/speed/speed.component';
import { PressureComponent } from '../../shared/pressure/pressure.component';
import { EnergyLevelComponent } from '../../shared/energy-level/energy-level.component';
import { ControlInstance, DialogConfigData } from '../../models/models';
import { exhaustMap, forkJoin, interval, Observable, Subscription, tap, timer } from 'rxjs';
import { ControlService } from '../../services/control-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfigurationForm } from '../configuration-form/configuration-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  providers: [ControlService],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TemperatureComponent,
    SpeedComponent,
    PressureComponent,
    EnergyLevelComponent,
    MatButtonModule,
    MatDialogModule,
    MatIcon,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: true,
})
export class Dashboard implements OnInit /*, OnDestroy */ {
  existingControls = signal<ControlInstance[]>([]);
  pollInterval = signal(2000);
  isStale = signal(false);

  private intervalSubscription: Subscription | null = null;

  constructor(
    private controlService: ControlService,
    private dialog: MatDialog,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.setupPolling();
  }

  // ngOnDestroy(): void {
  //   this.cleanupPolling();
  // }

  private setupPolling(): void {
    this.cleanupPolling(); // Clean up any existing subscription

    this.intervalSubscription = timer(0, this.pollInterval())
      .pipe(
        exhaustMap(() => this.refreshAll()),
        takeUntilDestroyed(this.destroyRef), // takeUntilDestroyed() - eliminates the need for ngOnDestroy
      )
      .subscribe();
  }

  private cleanupPolling(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = null;
    }
  }

  refreshAll() {
    // Start polling request → mark data as stale
    this.isStale.set(true);

    const controls = this.existingControls();

    if (controls.length === 0) {
      return forkJoin({});
    }

    // Create an object where each control's type maps to its Observable
    const observables = controls.reduce(
      (acc, control) => {
        acc[control!.type] = this.controlService.get(control!.type);
        return acc;
      },
      {} as { [key: string]: Observable<number> },
    );

    return forkJoin(observables).pipe(
      tap((result) => {
        // Data arrived → clear stale flag
        this.isStale.set(false);
        // Update controls with new values - create NEW objects for change detection
        this.existingControls.update((controls) =>
          controls.map((control) => ({
            ...control!,
            value: result[control!.type] ?? control!.value,
          })),
        );
      }),
    );
  }

  configure() {
    const dialogConfig: DialogConfigData = {
      pollingInterval: this.pollInterval(),
      existingControls: [...this.existingControls()],
    };

    const dialogRef = this.dialog.open(ConfigurationForm, {
      data: dialogConfig,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return; // User cancelled the dialog

      // Update polling interval if changed
      if (result.pollingInterval !== undefined) {
        this.pollInterval.set(Number(result.pollingInterval));
        this.setupPolling();
      }

      // Update controls based on selection
      if (result.selectedControls) {
        this.existingControls.set(result.selectedControls);
      }
    });
  }

  onGauageValueChanged(control: ControlInstance, event: number) {
    console.log('Gauge value changed:', event);
    this.controlService.set(control!.type, event).subscribe();
  }
}

/*
  myNaiveRefreshAll() {
    this.controlService.get('temperature').subscribe((temperature) => {
      this.temperature.set(temperature);
    });
    this.controlService.get('temperature').subscribe((temperature) => {
      this.temperature.set(temperature);
    });
    this.controlService.get('temperature').subscribe((temperature) => {
      this.temperature.set(temperature);
    });
    this.controlService.get('temperature').subscribe((temperature) => {
      this.temperature.set(temperature);
    });
  }*/

/*
 this.cdr.detectChanges();
 return forkJoin({
      pressure: this.controlService.get('pressure'),
      temperature: this.controlService.get('temperature'),
      speed: this.controlService.get('speed'),
      energyLevel: this.controlService.get('energyLevel'),
    });
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }   

  this.data$ = interval(2000).pipe(
    startWith(0),
    switchMap(() => this.loadAllData()),
  );
this.ngZone.run(() => {
        this.pressure = pressure;
        this.temperature = temperature;
        this.speed = speed;
        this.energyLevel = energyLevel;
      });
      */

// pressure = signal(0);
// temperature = signal(0);
// speed = signal(0);
// energyLevel = signal(0);

// refreshAll() {
//   return forkJoin({
//     // pressure: this.controlService.get('pressure'),
//     // temperature: this.controlService.get('temperature'),
//     // speed: this.controlService.get('speed'),
//     // energyLevel: this.controlService.get('energyLevel'),
//   }).pipe(
//     tap((result) => {
//       // this.pressure.set(result.pressure);
//       // this.temperature.set(result.temperature);
//       // this.speed.set(result.speed);
//       // this.energyLevel.set(result.energyLevel);
//     }),
//   );
// }
