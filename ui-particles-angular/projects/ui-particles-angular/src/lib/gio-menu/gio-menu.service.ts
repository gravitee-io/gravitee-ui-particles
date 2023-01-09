/*
 * Copyright (C) 2022 The Gravitee team (http://gravitee.io)
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
import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { debounce, distinctUntilChanged } from 'rxjs/operators';

export interface OverlayOptions {
  top?: number;
  parent?: HTMLElement;
  open: boolean;
  focus?: boolean;
}

@Injectable({ providedIn: 'root' })
export class GioMenuService {
  private reduceSource = new BehaviorSubject<boolean>(false);
  private overlaySource = new BehaviorSubject<OverlayOptions>({ open: false });
  public reduce = this.reduceSource.asObservable();
  public overlayObservable = this.overlaySource.asObservable().pipe(
    distinctUntilChanged((prev, curr) => prev.open === curr.open),
    debounce(overlayOptions => timer(overlayOptions.open ? 150 : 500)),
  );

  public reduced(reduced: boolean): void {
    this.reduceSource.next(reduced);
  }

  public overlay(overlayOptions: OverlayOptions): void {
    this.overlaySource.next(overlayOptions);
  }
}
