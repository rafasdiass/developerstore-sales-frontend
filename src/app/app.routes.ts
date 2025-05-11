
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sales',
    loadComponent: () =>
      import('./layout-sales/layout-sales.component').then(
        (m) => m.LayoutSalesComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./sales-list/sales-list.component').then(
            (c) => c.SalesListComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./sale-form/sale-form.component').then(
            (c) => c.SaleFormComponent
          ),
      },
      {
        path: ':id/edit', 
        loadComponent: () =>
          import('./sale-form/sale-form.component').then(
            (c) => c.SaleFormComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./sale-detail/sale-detail.component').then(
            (c) => c.SaleDetailComponent
          ),
      },
    ],
  },
  {
    path: 'branches',
    loadComponent: () =>
      import('./branches/layout-branches/layout-branches.component').then(
        (m) => m.LayoutBranchesComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./branches/branch-list/branch-list.component').then(
            (c) => c.BranchListComponent
          ),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./branches/branch-form/branch-form.component').then(
            (c) => c.BranchFormComponent
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./branches/branch-form/branch-form.component').then(
            (c) => c.BranchFormComponent
          ),
      },
    ],
  },
  { path: '', redirectTo: 'sales', pathMatch: 'full' },
  { path: '**', redirectTo: 'sales' },
];

