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
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { GioPendoModule, GioPendoService } from '../public-api';

@Component({
  template: ``,
  standalone: false,
})
class TestComponent {}

describe('GioPendoModule', () => {
  let gioPendoService: GioPendoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [GioPendoModule.forRoot({ enabled: true, apiKey: 'myKey' })],
    });

    gioPendoService = TestBed.inject(GioPendoService);
  });

  it('should add Pendo head script ', async () => {
    expect(document.head.innerHTML).toContain('/myKey/pendo.js');
  });

  describe('when pendo is loaded', () => {
    beforeEach(() => {
      window.pendo = {
        initialize: jest.fn(),
        track: jest.fn(),
      };
    });

    afterEach(() => {
      window.pendo = undefined;
    });

    it('should initialize pendo', () => {
      gioPendoService.initialize({ id: 'myId' }, { id: 'myAccountId' });
      expect(window.pendo.initialize).toHaveBeenCalledWith({
        visitor: { id: 'myId' },
        account: { id: 'myAccountId' },
      });
    });

    it('should send track event', () => {
      gioPendoService.track('myEvent', { myProperty: 'myValue' });
      expect(window.pendo.track).toHaveBeenCalledWith('myEvent', { myProperty: 'myValue' });
    });
  });
});
