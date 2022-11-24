/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
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
import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, ViewChild } from '@angular/core';
import { toSvg } from 'jdenticon';

@Component({
  selector: 'gio-avatar',
  templateUrl: './gio-avatar.component.html',
  styleUrls: ['./gio-avatar.component.scss'],
})
export class GioAvatarComponent implements AfterViewInit, OnChanges {
  public imgSrc: string | null = null;
  public defaultSize: number;
  public finalSize!: number;

  @Input()
  public set src(src: string | null) {
    this.imgSrc = src || null;
  }
  @Input()
  public name = '';
  @Input()
  public size!: number;
  @Input()
  public roundedBorder = false;

  @ViewChild('avatarContainer') public avatarContainerEleRef!: ElementRef;

  @HostBinding('style.width.px') public width = this.size;
  @HostBinding('style.height.px') public height = this.size;

  constructor(private hostEl: ElementRef) {
    this.defaultSize = Math.min(Number(this.hostEl.nativeElement.offsetWidth), Number(this.hostEl.nativeElement.offsetHeight)) || 110;
  }

  public ngOnChanges(): void {
    this.finalSize = this.size || this.defaultSize;
  }

  public ngAfterViewInit(): void {
    if (this.imgSrc != null) {
      return;
    }
    if (this.avatarContainerEleRef) {
      this.avatarContainerEleRef.nativeElement.innerHTML = toSvg(this.name, this.finalSize, { backColor: '#FFF', padding: 0 });
    }
  }

  public onImgError(): void {
    this.imgSrc = null;
    this.ngAfterViewInit();
  }
}
