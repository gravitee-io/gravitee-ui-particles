import {Component, input, InputSignal} from '@angular/core';
import {MCPTool} from "../gio-mcp-tools-editor.service";
import {MatExpansionModule} from "@angular/material/expansion";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'gio-mcp-tools-display',
  imports: [MatExpansionModule, JsonPipe],
  templateUrl: './gio-mcp-tools-display.component.html',
  styleUrl: './gio-mcp-tools-display.component.scss'
})
export class GioMcpToolsDisplayComponent {
  public mcpTools: InputSignal<MCPTool[]> = input<MCPTool[]>([]);

}
