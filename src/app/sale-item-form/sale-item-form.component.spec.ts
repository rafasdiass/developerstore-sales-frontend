import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItemFormComponent } from './sale-item-form.component';

describe('SaleItemFormComponent', () => {
  let component: SaleItemFormComponent;
  let fixture: ComponentFixture<SaleItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleItemFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
