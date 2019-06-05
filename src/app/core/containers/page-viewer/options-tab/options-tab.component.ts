import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'orl-options-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'options-tab.html',
  encapsulation: ViewEncapsulation.None
})
export class OptionsTabComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
}
