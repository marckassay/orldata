import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'DemoNumber6';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.router.navigate(['/permit']);
  }
}
