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

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';

import { GioFormSelectionInlineCardHarness } from './gio-form-selection-inline-card.harness';

export type GioFormSelectionInlineHarnessFilters = BaseHarnessFilters;

export class GioFormSelectionInlineHarness extends ComponentHarness {
  public static hostSelector = 'gio-form-selection-inline';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a `GioFormSelectionInlineHarness` that meets
   * certain criteria.
   *
   * @param options Options for filtering which input instances are considered a match.
   * @return a `HarnessPredicate` configured with the given options.
   */
  public static with(options: GioFormSelectionInlineHarnessFilters = {}): HarnessPredicate<GioFormSelectionInlineHarness> {
    return new HarnessPredicate(GioFormSelectionInlineHarness, options);
  }

  protected getCards = this.locatorForAll(GioFormSelectionInlineCardHarness);

  protected getCardByValue = (value: string) => this.locatorFor(`gio-form-selection-inline-card[ng-reflect-value="${value}"]`)();

  public async getSelectedValue(): Promise<string | undefined> {
    const cards = await this.getCards();

    const cardsAttr = await parallel(() => cards.map(async row => ({ class: await row.isSelected(), value: await row.getValue() })));

    return cardsAttr.find(card => card.class)?.value ?? undefined;
  }

  public async getUnselectedValues(): Promise<(string | undefined)[]> {
    const cards = await this.getCards();

    const cardsAttr = await parallel(() => cards.map(async row => ({ class: await row.isSelected(), value: await row.getValue() })));

    return cardsAttr.filter(card => !card.class).map(card => card.value ?? undefined);
  }

  public async getSelectionCards(): Promise<
    {
      text: string;
      value: string | undefined;
      selected: boolean;
      disabled: boolean;
    }[]
  > {
    const cards = await this.getCards();

    const cardsAttr = await parallel(() =>
      cards.map(async card => ({
        text: await card.getContentText(),
        selected: await card.isSelected(),
        value: (await card.getValue()) ?? undefined,
        disabled: await card.isDisabled(),
      })),
    );

    return cardsAttr.map(card => ({ text: card.text, selected: card.selected, value: card.value, disabled: card.disabled }));
  }

  public async select(value: string): Promise<void> {
    const card = await this.getCardByValue(value);

    await card.click();
  }

  public async isDisabled(): Promise<boolean> {
    const cards = await this.getCards();

    const cardsAttr = await parallel(() => cards.map(async card => ({ hasClass: await card.isDisabled() })));

    return cardsAttr.every(card => card.hasClass);
  }
}
