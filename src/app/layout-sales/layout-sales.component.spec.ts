import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSalesComponent } from './layout-sales.component';

describe('LayoutSalesComponent', () => {
  let component: LayoutSalesComponent;
  let fixture: ComponentFixture<LayoutSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
