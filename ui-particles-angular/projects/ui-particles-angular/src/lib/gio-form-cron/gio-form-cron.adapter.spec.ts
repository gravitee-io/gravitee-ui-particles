/*
 * Copyright (C) 2023 The Gravitee team (http://gravitee.io)
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
import { CronDisplayMode, getDefaultCronDisplay, parseCronExpression, toCronDescription, toCronExpression } from './gio-form-cron.adapter';

describe('parseCronExpression', () => {
  it('should return custom cron', () => {
    expect(parseCronExpression('15 10 8 3 *')).toEqual({
      mode: 'custom',
      customExpression: '15 10 8 3 *',
    });
  });

  it('should return secondly cron', () => {
    expect(parseCronExpression('*/6 * * * * *')).toEqual({
      mode: 'secondly',
      secondInterval: 6,
    });
  });

  it('should return minutely cron', () => {
    expect(parseCronExpression('0 */42 * * * *')).toEqual({
      mode: 'minutely',
      minuteInterval: 42,
    });
  });

  it('should return hourly cron', () => {
    expect(parseCronExpression('0 15 */4 * * *')).toEqual({
      mode: 'hourly',
      hourInterval: 4,
      minutes: 15,
    });
  });

  it('should return daily cron', () => {
    expect(parseCronExpression('0 30 12 */3 * *')).toEqual({
      mode: 'daily',
      dayInterval: 3,
      minutes: 30,
      hours: 12,
    });
  });

  it('should return weekly cron', () => {
    // TODO : make work with 0 15 10 * * FRI
    expect(parseCronExpression('0 15 10 * * 5')).toEqual({
      mode: 'weekly',
      dayOfWeek: 5,
      minutes: 15,
      hours: 10,
    });
  });

  it('should return monthly cron', () => {
    expect(parseCronExpression('0 15 10 8 * *')).toEqual({
      mode: 'monthly',
      dayOfMonth: 8,
      minutes: 15,
      hours: 10,
    });
  });

  it('should throw error on invalid cron', () => {
    expect(() => parseCronExpression('NotValidCron')).toThrowError('Invalid cron expression');
  });
});

describe('getDefaultCronDisplay', () => {
  it.each([
    ['secondly', '*/1 * * * * *'],
    ['minutely', '0 */1 * * * *'],
    ['hourly', '0 0 */1 * * *'],
    ['daily', '0 0 0 */1 * *'],
    ['weekly', '0 0 0 * * 0'],
    ['monthly', '0 0 0 1 * *'],
    ['custom', '* * * * * *'],
  ])('should return default cron for mode %s', (mode, expected) => {
    const dm = getDefaultCronDisplay(mode as CronDisplayMode);

    expect(toCronExpression(dm)).toEqual(expected);
  });
});

describe('toCronDescription', () => {
  it.each([['15 10 8 3 *', 'At 10:15 AM, on day 8 of the month, only in March']])('should return description for %s', (cron, expected) => {
    expect(toCronDescription(cron)).toEqual(expected);
  });
});

describe('toCronExpression', () => {
  it('should return custom cron', () => {
    expect(toCronExpression({ mode: 'custom', customExpression: '15 10 8 3 *' })).toEqual('15 10 8 3 *');
  });

  it('should return secondly cron', () => {
    expect(toCronExpression({ mode: 'secondly', secondInterval: 6 })).toEqual('*/6 * * * * *');
  });

  it('should return minutely cron', () => {
    expect(toCronExpression({ mode: 'minutely', minuteInterval: 42 })).toEqual('0 */42 * * * *');
  });

  it('should return hourly cron', () => {
    expect(toCronExpression({ mode: 'hourly', hourInterval: 4, minutes: 15 })).toEqual('0 15 */4 * * *');
  });

  it('should return daily cron', () => {
    expect(toCronExpression({ mode: 'daily', dayInterval: 3, minutes: 30, hours: 12 })).toEqual('0 30 12 */3 * *');
  });

  it('should return weekly cron', () => {
    expect(toCronExpression({ mode: 'weekly', dayOfWeek: 5, minutes: 15, hours: 10 })).toEqual('0 15 10 * * 5');
  });

  it('should return monthly cron', () => {
    expect(toCronExpression({ mode: 'monthly', dayOfMonth: 8, minutes: 15, hours: 10 })).toEqual('0 15 10 8 * *');
  });
});
