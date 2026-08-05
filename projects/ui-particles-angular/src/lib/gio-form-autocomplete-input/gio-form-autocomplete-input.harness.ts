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

import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatInputHarness } from '@angular/material/input/testing';

export type GioFormAutocompleteInputHarnessFilters = BaseHarnessFilters;

export class GioFormAutocompleteInputHarness extends ComponentHarness {
  public static hostSelector = 'gio-form-autocomplete-input';

  public static with(options: GioFormAutocompleteInputHarnessFilters = {}): HarnessPredicate<GioFormAutocompleteInputHarness> {
    return new HarnessPredicate(GioFormAutocompleteInputHarness, options);
  }

  // public static with(options: GioFormAutocompleteInputHarnessFilters = {}): HarnessPredicate<GioFormAutocompleteInputHarness> {
  //     return new HarnessPredicate(GioFormAutocompleteInputHarness, options);
  // }
  private getInput = this.locatorFor(MatInputHarness);
  private getAutocomplete = this.locatorForOptional(MatAutocompleteHarness);

  /**
   * Gets the current value of the input
   */
  public async getValue(): Promise<string> {
    const input = await this.getInput();

    try {
      const host = await input.host();
      const value = await host.getProperty<string>('value');
      if (value !== null && value !== undefined) {
        return value;
      }
    } catch (e) {
      // Ignore and try next approach
    }

    try {
      return await input.getValue();
    } catch (e) {
      return '';
    }
  }

  public async setValue(value: string): Promise<void> {
    const input = await this.getInput();

    await input.focus();

    await input.setValue('');

    await input.setValue(value);

    try {
      const host = await input.host();
      await host.dispatchEvent('input', { bubbles: true });
      await host.dispatchEvent('change', { bubbles: true });
    } catch {
      // Ignore if dispatch fails
    }
  }

  /**
   * Types text into the input (triggers input events)
   */
  public async type(text: string): Promise<void> {
    const input = await this.getInput();

    await input.focus();
    await input.setValue('');
    await input.setValue(text);

    try {
      const host = await input.host();
      await host.dispatchEvent('input');
      await host.dispatchEvent('change');
    } catch {
      // Ignore
    }
  }

  /**
   * Focuses the input
   */
  public async focus(): Promise<void> {
    const input = await this.getInput();
    await input.focus();
  }

  /**
   * Blurs the input
   */
  public async blur(): Promise<void> {
    const input = await this.getInput();
    await input.blur();
  }

  /**
   * Checks if the input is focused
   */
  public async isFocused(): Promise<boolean> {
    const input = await this.getInput();
    return input.isFocused();
  }

  /**
   * Checks if the input is disabled
   */
  public async isDisabled(): Promise<boolean> {
    const input = await this.getInput();
    return input.isDisabled();
  }

  /**
   * Gets the placeholder of the input
   */
  public async getPlaceholder(): Promise<string> {
    const input = await this.getInput();
    return input.getPlaceholder();
  }

  /**
   * Opens the autocomplete panel
   */
  public async openAutocomplete(): Promise<void> {
    await this.focus();
  }

  /**
   * Checks if the autocomplete panel is open
   */
  public async isAutocompleteOpen(): Promise<boolean> {
    const autocomplete = await this.getAutocomplete();
    return autocomplete ? autocomplete.isOpen() : false;
  }

  /**
   * Gets all autocomplete options
   */
  public async getAutocompleteOptions(): Promise<string[]> {
    const autocomplete = await this.getAutocomplete();
    if (!autocomplete) {
      return [];
    }
    const options = await autocomplete.getOptions();
    return Promise.all(options.map(option => option.getText()));
  }

  /**
   * Selects an autocomplete option by text
   */
  public async selectOption(text: string): Promise<void> {
    const autocomplete = await this.getAutocomplete();
    if (!autocomplete) {
      throw Error('Autocomplete panel is not available');
    }
    await autocomplete.selectOption({ text });
  }

  /**
   * Checks if the input is in an error state
   */
  public async hasError(): Promise<boolean> {
    const host = await this.host();
    const classes = await host.getAttribute('class');
    return classes?.includes('ng-invalid') ?? false;
  }

  /**
   * Gets the aria-label of the input
   */
  public async getAriaLabel(): Promise<string | null> {
    const input = await this.getInput();
    const inputElement = await input.host();
    return inputElement.getAttribute('aria-label');
  }

  /**
   * Types text into the input (triggers input events)
   */

  /**
   * Clears the input value
   */
  public async clear(): Promise<void> {
    const input = await this.getInput();
    await input.setValue('');
  }
  public async getMatAutocompleteHarness(): Promise<MatAutocompleteHarness | null> {
    return this.getAutocomplete();
  }
}
