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
import { CronDisplayMode, getDefaultCronDisplay, parseCronExpression } from './gio-form-cron.adapter';

describe('parseCronExpression', () => {
  it('should return custom cron', () => {
    expect(parseCronExpression('15 10 8 3 *')).toEqual({
      mode: 'custom',
      cronExpression: '15 10 8 3 *',
      cronDescription: 'At 10:15 AM, on day 8 of the month, only in March',
    });
  });

  it('should return secondly cron', () => {
    expect(parseCronExpression('*/6 * * * * *')).toEqual({
      mode: 'second',
      secondInterval: 6,
      cronExpression: '*/6 * * * * *',
      cronDescription: 'Every 6 seconds',
    });
  });

  it('should return minutely cron', () => {
    expect(parseCronExpression('0 */42 * * * *')).toEqual({
      mode: 'minute',
      minuteInterval: 42,
      cronExpression: '0 */42 * * * *',
      cronDescription: 'Every 42 minutes',
    });
  });

  it('should return hourly cron', () => {
    expect(parseCronExpression('0 15 */4 * * *')).toEqual({
      mode: 'hour',
      hourInterval: 4,
      minutes: 15,
      cronExpression: '0 15 */4 * * *',
      cronDescription: 'At 15 minutes past the hour, every 4 hours',
    });
  });

  it('should return daily cron', () => {
    expect(parseCronExpression('0 30 12 */3 * *')).toEqual({
      mode: 'day',
      dayInterval: 3,
      minutes: 30,
      hours: 12,
      cronExpression: '0 30 12 */3 * *',
      cronDescription: 'At 12:30 PM, every 3 days',
    });
  });

  it('should return weekly cron', () => {
    // TODO : make work with 0 15 10 * * FRI
    expect(parseCronExpression('0 15 10 * * 5')).toEqual({
      mode: 'week',
      dayOfWeek: 5,
      minutes: 15,
      hours: 10,
      cronExpression: '0 15 10 * * 5',
      cronDescription: 'At 10:15 AM, only on Friday',
    });
  });

  it('should return monthly cron', () => {
    expect(parseCronExpression('0 15 10 8 * *')).toEqual({
      mode: 'month',
      dayOfMonth: 8,
      minutes: 15,
      hours: 10,
      cronExpression: '0 15 10 8 * *',
      cronDescription: 'At 10:15 AM, on day 8 of the month',
    });
  });

  it('should throw error on invalid cron', () => {
    expect(() => parseCronExpression('NotValidCron')).toThrowError('Invalid cron expression');
  });
});

describe('getDefaultCronDisplay', () => {
  it.each([
    ['second', '*/0 * * * * *'],
    ['minute', '0 */0 * * * *'],
    ['hour', '0 0 */0 * * *'],
    ['day', '0 0 0 */1 * *'],
    ['week', '0 0 0 * * 0'],
    ['month', '0 0 0 1 * *'],
    ['custom', '* * * * *'],
  ])('should return default cron for mode %s', (mode, expected) => {
    expect(getDefaultCronDisplay(mode as CronDisplayMode).cronExpression).toEqual(expected);
  });
});
