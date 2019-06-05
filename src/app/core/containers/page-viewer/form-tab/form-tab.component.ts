import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'orl-form-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'form-tab.html',
  encapsulation: ViewEncapsulation.None
})
export class FormTabComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
}
