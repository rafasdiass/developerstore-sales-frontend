import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutBranchesComponent } from './layout-branches.component';

describe('LayoutBranchesComponent', () => {
  let component: LayoutBranchesComponent;
  let fixture: ComponentFixture<LayoutBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutBranchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
