import { Injectable } from '@angular/core';

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class GioMcpToolsEditorService {

  constructor() { }
}
