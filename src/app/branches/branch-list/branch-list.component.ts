
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BranchesService } from '../../services/branches.service';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss'],
})
export class BranchListComponent {
  constructor(
    private readonly branchesService: BranchesService,
    public readonly router: Router
  ) {}

  /** Lista de filiais vindo do serviço (signal) */
  get branches(): Branch[] {
    return this.branchesService.list();
  }

  /** Indica se está carregando */
  get loading(): boolean {
    return this.branchesService.loading();
  }

  /** Mensagem de erro, se houver */
  get error(): string | null {
    return this.branchesService.error();
  }

  /** True se terminou de carregar e há ao menos uma filial */
  get hasBranches(): boolean {
    return !this.loading && this.branches.length > 0;
  }

  edit(id: string): void {
    this.router.navigate(['/branches', id, 'edit']);
  }

  delete(id: string): void {
    if (!confirm('Deseja realmente excluir esta filial?')) {
      return;
    }
    this.branchesService.delete(id);
  }
}
