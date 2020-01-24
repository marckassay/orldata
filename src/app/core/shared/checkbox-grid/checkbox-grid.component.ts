import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatGridList } from '@angular/material/grid-list';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export interface CheckGridItem {
  id: string;
  checked: boolean;
  name: string;
}

@Component({
  selector: 'orl-check-grid',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxGridComponent)
    }
  ],
  template: `
    <mat-card>
      <mat-card-title>{{title}}</mat-card-title>
      <form [formGroup]="form">
        <mat-grid-list cols="3" rowHeight="20px">
          <mat-grid-tile *ngFor="let control of form.controls; let controlIndex = index;" [colspan]="1" [rowspan]="1">

            <mat-checkbox [formControlName]="controlIndex">{{dataProvider[controlIndex].name | titlecase}}</mat-checkbox>

          </mat-grid-tile>
        </mat-grid-list>
      </form>
      <div class="orl-button-row">
        <button mat-stroked-button color="primary" class="orl-button" type="button" (click)="clearAll($event)">Clear All</button>
        <button mat-stroked-button color="primary" class="orl-button" type="button" (click)="selectAll($event)">Select All</button>
      </div>
    </mat-card>
  `,

  styles: [`
    .orl-button-row button, {
      margin-top: 16px;
      margin-right: 8px;
    }
  `]
})
export class CheckboxGridComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input()
  title: string;

  @Input()
  dataProvider: Array<CheckGridItem>;

  form: FormArray;

  onChange: any;

  private unsubscribe = new Subject<void>();

  @ViewChild(MatGridList, { static: false })
  grid: MatGridList;

  constructor(
    private breakpoint: BreakpointObserver,
    private ref: ChangeDetectorRef) { }

  onTouched: () => void = () => { };

  ngAfterViewInit() {
    if (typeof this.grid !== 'undefined') {
      this.observeBreakpoint();
    }
  }

  observeBreakpoint() {
    this.breakpoint.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]).pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((state: BreakpointState) => {
      this.grid.cols = this.breakpointsColValue(
        Object.entries(state.breakpoints)
          .find((value: [string, boolean]) => value[1])
      );
      // this call on grid is more effective than `this.ref.markForCheck()`
      this.grid.ngAfterContentChecked();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  writeValue(value: any) {
    if (this.form === undefined) {
      this.form = value;
    }

    // subscribe to any changes in FormArray
    this.form.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.unsubscribe),
    ).subscribe((res: any) => {
      console.log('Checkbox - valueChanges(res)', res);
      if (this.onChange) {
        this.onChange(this.form);
        this.ref.markForCheck();
      }
    });
  }

  registerOnChange(fn: (v: any) => void) {
    this.onChange = fn;
  }

  setDisabledState(disabled: boolean) {
    disabled ? this.form.disable() : this.form.enable();
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  selectAll(event: MouseEvent) {
    if (this.form) {
      (this.form.controls as Array<FormControl>).forEach((control) => {
        control.setValue(true);
      });
    }
  }

  clearAll(event: MouseEvent) {
    if (this.form) {
      (this.form.controls as Array<FormControl>).forEach((control) => {
        control.setValue(false);
      });
    }
  }

  private breakpointsColValue(key: [string, boolean] | string | undefined): number {
    const breakpoint = (key && key instanceof Array) ? key[0] : undefined;

    switch (breakpoint) {
      case Breakpoints.HandsetPortrait: return 1;
      case Breakpoints.HandsetLandscape: return 2;
      case Breakpoints.Tablet: return 3;
      case Breakpoints.Web: return 3;
      default: return 3;
    }
  }
}
