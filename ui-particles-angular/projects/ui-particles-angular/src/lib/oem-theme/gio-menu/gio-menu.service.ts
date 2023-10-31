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

// Keep the reduce state in local storage
const REDUCE_STATE_KEY = 'gio-reduce-state';
const getDefaultReduceState = () => (localStorage?.getItem(REDUCE_STATE_KEY) === 'true' ? true : false);

@Injectable({ providedIn: 'root' })
export class GioMenuService {
  private reducedSubject = new BehaviorSubject<boolean>(getDefaultReduceState());

  private overlaySubject = new BehaviorSubject<OverlayOptions>({ open: false });

  public reduced$ = this.reducedSubject.asObservable();

  public overlayObservable = this.overlaySubject.asObservable().pipe(
    distinctUntilChanged((prev, curr) => prev.open === curr.open),
    debounce(overlayOptions => timer(overlayOptions.open ? 150 : 500)),
  );

  public reduce(reduced: boolean): void {
    this.reducedSubject.next(reduced);
    localStorage?.setItem(REDUCE_STATE_KEY, reduced.toString());
  }

  public overlay(overlayOptions: OverlayOptions): void {
    this.overlaySubject.next(overlayOptions);
  }
}
