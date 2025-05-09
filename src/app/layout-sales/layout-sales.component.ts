import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout-sales',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout-sales.component.html',
  styleUrls: ['./layout-sales.component.scss'],
})
export class LayoutSalesComponent {}
