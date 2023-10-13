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
import { AfterContentInit, Component, ContentChild, Input, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gio-form-slide-toggle',
  templateUrl: './gio-form-slide-toggle.component.html',
  styleUrls: ['./gio-form-slide-toggle.component.scss'],
})
export class GioFormSlideToggleComponent implements AfterContentInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  @Input()
  public appearance: 'standard' | 'fill' | 'outline' = 'outline';

  @ContentChild(MatSlideToggle, {
    static: false,
  })
  public innerMatSlideToggle: MatSlideToggle | null = null;

  @ContentChild(NgControl, {
    static: false,
  })
  public innerFormControlName: NgControl | null = null;

  public disabled = false;

  public ngAfterContentInit(): void {
    let isDisabled$: Observable<boolean> | undefined = undefined;

    // Check if disabled is delegated to inner FormControlName
    if (this.innerFormControlName) {
      isDisabled$ = this.innerFormControlName.statusChanges?.pipe(
        map(() => !!this.innerFormControlName?.disabled),
        startWith(!!this.innerFormControlName.disabled),
      );
    }
    // If not, check state of inner MatSlideToggle
    else if (this.innerMatSlideToggle) {
      isDisabled$ = this.innerMatSlideToggle.change.pipe(
        map(event => event.source.disabled),
        startWith(this.innerMatSlideToggle.disabled),
      );
    }

    if (isDisabled$) {
      isDisabled$.pipe(takeUntil(this.unsubscribe$)).subscribe(disabled => {
        this.disabled = disabled;
      });
    }
  }

  public ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
