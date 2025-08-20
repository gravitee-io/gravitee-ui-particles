/*
 * Copyright (C) 2025 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, ElementRef, inject, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'gio-popover',
  templateUrl: './gio-popover.component.html',
  styleUrl: './gio-popover.component.scss',
  standalone: false,
})
export class GioPopoverComponent {
  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private viewContainerRef = inject(ViewContainerRef);

  private overlayRef: OverlayRef | null = null;

  @Input()
  public trigger: ElementRef | null = null;

  @Input()
  public closeOnBackdropClick: boolean = true;

  @ViewChild('popoverContent')
  public popoverContent!: TemplateRef<never>;

  public open(): void {
    if (!this.trigger) return;

    if (this.overlayRef) {
      this.close();
    }

    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(this.trigger).withPositions([
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      },
    ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: this.closeOnBackdropClick,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const portal = new TemplatePortal(this.popoverContent, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  public close(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
