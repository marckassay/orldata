import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {

}


@NgModule({
  exports: [FooterComponent],
  declarations: [FooterComponent],
})
export class FooterModule { }
