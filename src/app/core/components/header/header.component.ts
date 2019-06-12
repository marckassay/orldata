import { Component, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  @ViewChild(MatProgressBar, {static: true})
  progressBar: MatProgressBar;
}
