import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UiParticlesAngularComponent } from "./ui-particles-angular.component";

describe("UiParticlesAngularComponent", () => {
  let component: UiParticlesAngularComponent;
  let fixture: ComponentFixture<UiParticlesAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiParticlesAngularComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiParticlesAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
