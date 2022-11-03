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
import { BehaviorSubject } from 'rxjs';

interface MouseOverItem {
  enter: boolean;
  top: number;
}

@Injectable()
export class GioMenuService {
  private reduceSource = new BehaviorSubject<boolean>(false);
  private mouseOverSource = new BehaviorSubject<MouseOverItem>({ enter: false, top: 0 });
  public reduce = this.reduceSource.asObservable();
  public mouseOver = this.mouseOverSource.asObservable();

  public reduced(reduced: boolean): void {
    this.reduceSource.next(reduced);
  }

  public mouseOverItem(overlay: MouseOverItem): void {
    this.mouseOverSource.next(overlay);
  }
}
