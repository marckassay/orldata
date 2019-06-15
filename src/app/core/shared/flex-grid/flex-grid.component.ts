import { FocusMonitor } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
// tslint:disable-next-line: max-line-length
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatGridList } from '@angular/material/grid-list';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'orl-flex-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MatFormFieldControl, useExisting: FlexGridComponent }],
  encapsulation: ViewEncapsulation.None,
  template: `
    <mat-grid-list cols="3" rowHeight="20px">
      <mat-grid-tile *ngFor="let item of data" [colspan]="1" [rowspan]="1">
          <mat-checkbox formControlName="{{item.name}}" >{{item.application_type}}</mat-checkbox>
      </mat-grid-tile>
    </mat-grid-list>
  `,

  styles: [`
    .mat-grid-tile .mat-figure {
      justify-content: start;
    }
  `]
})
export class FlexGridComponent<T> implements OnInit, AfterViewInit, OnDestroy, MatFormFieldControl<T> {

  constructor(private breakpoint$: BreakpointObserver,
              private ref: ChangeDetectorRef, private fm: FocusMonitor, private elRef: ElementRef<HTMLElement>) { }

  set value(d: T | null) {
    this._value = d;
    this.stateChanges.next();
  }


  static nextId = 0;
// tslint:disable-next-line: variable-name
  _value: T | null;

  stateChanges = new Subject<void>();

  @HostBinding() id = `orl-checkbox-${FlexGridComponent.nextId++}`;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
// tslint:disable-next-line: variable-name
  private _placeholder: string;

  ngControl: NgControl | null = null;

  focused = false;


  get empty() {
   // let n = this.parts.value;
    return false;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }
  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = req;
    this.stateChanges.next();
  }
// tslint:disable-next-line: variable-name
  private _required = false;
  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {

    this.stateChanges.next();
  }
// tslint:disable-next-line: variable-name
  private _disabled = false;
  errorState = false;
  controlType = 'example-tel-input';
  autofilled?: boolean | undefined;

  @ViewChild(MatGridList, { static: false })
  grid: MatGridList;

  @Input()
  data: Array<T>;

// tslint:disable-next-line: no-input-rename
  @Input('formControlName')
  name: string;

  private unsubscribe$ = new Subject<void>();

  setDescribedByIds(ids: string[]): void {
    throw new Error('Method not implemented.');
  }
  onContainerClick(event: MouseEvent): void {
   // throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.fm.monitor(this.elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

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

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
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
