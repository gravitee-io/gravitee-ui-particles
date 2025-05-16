import { TestBed } from '@angular/core/testing';

import { GioMcpToolsEditorService } from './gio-mcp-tools-editor.service';

describe('GioMcpToolsEditorService', () => {
  let service: GioMcpToolsEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GioMcpToolsEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
