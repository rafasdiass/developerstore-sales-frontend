// src/app/branches/branch-form/branch-form.component.ts

import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchesService } from '../../services/branches.service';
import { CreateBranchCommand } from '../../models/branch.model';


@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss'],
})
export class BranchFormComponent {
  readonly name = signal<string>('');
  readonly creating = signal<boolean>(false);

  readonly canSubmit = computed(
    () => this.name().trim().length > 0 && !this.creating()
  );

  constructor(private branchesService: BranchesService) {
    effect(() => {
      if (this.creating() && !this.branchesService.loading()) {
        if (!this.branchesService.error()) {
          this.name.set('');
        }
        this.creating.set(false);
      }
    });
  }

  onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.creating.set(true);
    const cmd: CreateBranchCommand = { name: this.name().trim() };
    this.branchesService.create(cmd);
  }

  get error(): string | null {
    return this.branchesService.error();
  }

  get loading(): boolean {
    return this.branchesService.loading();
  }
}
