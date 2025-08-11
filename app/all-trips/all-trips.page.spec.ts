import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllTripsPage } from './all-trips.page';

describe('AllTripsPage', () => {
  let component: AllTripsPage;
  let fixture: ComponentFixture<AllTripsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
