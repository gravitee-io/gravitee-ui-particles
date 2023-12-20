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
import { Meta, moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/dist/ts3.9/client/preview/types-7-0';
import { action } from '@storybook/addon-actions';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UntypedFormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { GioFormCronComponent } from './gio-form-cron.component';
import { GioFormCronModule } from './gio-form-cron.module';

const DefaultRender: Meta['render'] = p => {
  const control = new UntypedFormControl({ value: p.initialValue ?? '', disabled: p.disabled }, p.required ? Validators.required : null);

  control.valueChanges.subscribe(v => {
    console.info('Value changed', v);
    action('Value changed')({ value: v });
  });

  return {
    template: `
      <gio-form-cron [formControl]="control">
      <gio-form-cron-label>Schedule</gio-form-cron-label>
      <gio-form-cron-hint>Custom hint</gio-form-cron-hint>
      </gio-form-cron>
      <br>
      --------------------
      <br>
      Output: {{control.value}} | Touched: {{ control.touched | json}} | Error: {{ control.errors | json}}
    `,
    props: {
      control,
    },
  };
};

export default {
  title: 'Components / Form Cron',
  component: GioFormCronComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, GioFormCronModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
    }),
  ],
  argTypes: {
    disabled: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
    initialValue: {
      control: { type: 'text' },
    },
    required: {
      defaultValue: false,
      control: { type: 'boolean' },
    },
  },
  render: DefaultRender,
} as Meta;

export const Default: Story = {
  args: {},
};

export const WithInitialSecondlyValue: Story = {
  args: {
    initialValue: '*/6 * * * * *',
  },
};

export const WithInitialMinutelyValue: Story = {
  args: {
    initialValue: '0 */6 * * * *',
  },
};

export const WithInitialHourlyValue: Story = {
  args: {
    initialValue: '0 0 */6 * * *',
  },
};

export const WithInitialDailyValue: Story = {
  args: {
    initialValue: '0 0 0 */6 * *',
  },
};

export const WithInitialWeeklyValue: Story = {
  args: {
    initialValue: '0 0 0 * * 5',
  },
};

export const WithInitialMonthlyValue: Story = {
  args: {
    initialValue: '0 15 10 8 * *',
  },
};

export const WithInitialCustomValue: Story = {
  args: {
    initialValue: '0 0 0 LW * *',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledWithInitialValue: Story = {
  args: {
    initialValue: '0 0 0 LW * *',
    disabled: true,
  },
};

export const SmallWidth: Story = {
  render: (p, c) => {
    const parentRender = DefaultRender(p, c);
    return {
      ...parentRender,
      template: `<div style="width: 300px">${parentRender.template}</div>`,
    };
  },
  args: {
    initialValue: '0 0 0 LW * *',
  },
};

export const Required: Story = {
  args: {
    required: true,
    initialValue: '0 0 0 LW * *',
  },
  play: () => {
    const formCron = document.querySelector<HTMLButtonElement>('[aria-label="Clear"]');
    if (formCron) {
      formCron.click();
      formCron.focus();
    }
  },
};

export const WithErrorInValue: Story = {
  args: {
    required: false,
    initialValue: '0 0 0 LW * *',
  },
  play: () => {
    const formCron = document.querySelector<HTMLInputElement>('[formControlName="customExpression"]');
    if (formCron) {
      formCron.focus();
      formCron.value = 'Bad value 🦊';
      formCron.dispatchEvent(new Event('input'));
    }
  },
};
