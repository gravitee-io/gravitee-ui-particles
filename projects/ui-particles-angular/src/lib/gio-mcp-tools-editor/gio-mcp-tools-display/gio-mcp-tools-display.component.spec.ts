import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GioMcpToolsDisplayComponent } from './gio-mcp-tools-display.component';

describe('GioMcpToolsDisplayComponent', () => {
  let component: GioMcpToolsDisplayComponent;
  let fixture: ComponentFixture<GioMcpToolsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GioMcpToolsDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GioMcpToolsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
