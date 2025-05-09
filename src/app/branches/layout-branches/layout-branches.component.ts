import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-branches',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout-branches.component.html',
  styleUrls: ['./layout-branches.component.scss'],
})
export class LayoutBranchesComponent {}
