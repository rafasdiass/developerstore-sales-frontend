import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-sales',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './layout-sales.component.html',
  styleUrls: ['./layout-sales.component.scss'],
})
export class LayoutSalesComponent {
  constructor(private router: Router) {}

  navigateToNewSale(): void {
    this.router.navigate(['sales', 'new']);
  }
}
