import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseDetail } from './warehouse-detail';

describe('WarehouseDetail', () => {
  let component: WarehouseDetail;
  let fixture: ComponentFixture<WarehouseDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
