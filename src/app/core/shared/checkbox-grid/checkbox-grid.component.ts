import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
// tslint:disable-next-line: max-line-length
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatGridList } from '@angular/material/grid-list';
import { CheckGridItem } from '@app/core/containers/page-viewer/form-tab/form-tab.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
        <button mat-stroked-button color="primary" class="orl-button" (click)="clearAll()">Clear All</button>
        <button mat-stroked-button color="primary" class="orl-button" (click)="selectAll()">Select All</button>
      </div>
    </mat-card>
  `,

  styles: [`
    .mat-grid-tile .mat-figure {
      justify-content: start;
    }

    .orl-button-row button, {
      margin-top: 16px;
      margin-right: 8px;
    }
  `]
})
export class CheckboxGridComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input()
  title: string;

  @Input()
  dataProvider: Array<CheckGridItem>;

  form: FormArray;

  onChange: any;

  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatGridList, { static: false })
  grid: MatGridList;

  constructor(private breakpoint$: BreakpointObserver,
              private ref: ChangeDetectorRef) { }

  onTouched: () => void = () => { };

  ngOnInit() {
    this.breakpoint$.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe((state: BreakpointState) => {
        this.grid.cols = this.breakpointsColValue(
          Object.entries(state.breakpoints)
            .find((value: [string, boolean]) => value[1])
        );
        this.ref.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    //  throw new Error("Method not implemented.");
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  writeValue(value: any) {
    if (this.form === undefined) {
      this.form = value;
    }

    // subscribe to any changes in FormArray
    this.form.valueChanges.subscribe((res: any) => {
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

  selectAll() {
    if (this.form) {
      (this.form.controls as FormControl[]).forEach((control) => {
        control.setValue(true);
      });
    }
  }

  clearAll() {
    if (this.form) {
      (this.form.controls as FormControl[]).forEach((control) => {
        control.setValue(false);
      });
    }
  }

  private breakpointsColValue(key: [string, boolean] | string | undefined): number {
    const breakpoint = (key && key instanceof Array) ? key[0] : undefined;

    switch (breakpoint) {
      case Breakpoints.XSmall: return 1;
      case Breakpoints.Small: return 2;
      case Breakpoints.Medium: return 3;
      case Breakpoints.Large: return 4;
      case Breakpoints.XLarge: return 4;
      default: return this.grid.cols;
    }
  }
}
