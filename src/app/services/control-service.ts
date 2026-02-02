import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

interface IControlService {
  get(controlName: string): Observable<number>;
  set(controlName: string, value: number): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class ControlService implements IControlService {
  get(controlName: string): Observable<number> {
    let value: number;

    switch (controlName) {
      case 'pressure':
        value = Math.floor(Math.random() * 100);
        break;
      case 'speed':
        value = Math.floor(Math.random() * 200);
        break;
      case 'temperature':
        value = Math.floor(Math.random() * 100);
        break;
      case 'energyLevel':
        value = Math.floor(Math.random() * 100);
        break;
      default:
        value = Math.floor(Math.random() * 100);
    }

    return of(value);
    
    // Conditional delay based on value
    //return of(value).pipe(delay(value > 100 ? 5000 : 0));
  }

  set(controlName: string, value: number): Observable<void> {
    let result = of(undefined);
    console.log('Setting value for', controlName, 'to', value);
    return result;
  }
}
