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
import Cronstrue from 'cronstrue/i18n';
import { isEmpty } from 'lodash';

export interface CronDisplay {
  mode: CronDisplayMode;

  secondInterval?: number;
  minuteInterval?: number;
  hourInterval?: number;
  dayInterval?: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
  customExpression?: string;

  hours?: number;
  minutes?: number;
}
export const CRON_DISPLAY_MODES = ['secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly', 'custom'] as const;
export type CronDisplayMode = (typeof CRON_DISPLAY_MODES)[number];

const DISPLAY_MODE_LIST: {
  mode: CronDisplayMode;
  default: string;
  regex: RegExp;
}[] = [
  {
    mode: 'secondly',
    default: '*/1 * * * * *',
    regex: /^(\*\/\d+\s)(\*\s){4}\*/,
  },
  {
    mode: 'minutely',
    default: '0 */1 * * * *',
    regex: /^0\s\*\/\d+\s(\*\s){3}\*$/,
  },
  {
    mode: 'hourly',
    default: '0 0 */1 * * *',
    regex: /^0\s\d+\s\*\/\d+\s(\*\s){2}\*$/,
  },
  {
    mode: 'daily',
    default: '0 0 0 */1 * *',
    regex: /^0\s\d+\s\d+\s\*\/\d+\s\*\s\*$/,
  },
  {
    mode: 'weekly',
    default: '0 0 0 * * 0',
    regex: /^(\d{1,2}\s){2,3}(\*\s){2}\d{1,2}$/,
  },
  {
    mode: 'monthly',
    default: '0 0 0 1 * *',
    regex: /^(\d+\s){3,4}\*\s\*$/,
  },
  {
    mode: 'custom',
    default: '* * * * * *',
    regex: /^.*$/,
  },
];

export const getDefaultCronDisplay = (mode: CronDisplayMode): CronDisplay => {
  const modeFound = DISPLAY_MODE_LIST.find(mf => mf.mode === mode);
  if (!modeFound) {
    throw new Error('Invalid cron mode.');
  }

  return parseCronExpression(modeFound.default);
};

export const parseCronExpression = (cronExpression: string): CronDisplay => {
  if (!cronIsValid(cronExpression)) {
    throw new Error('Invalid cron expression.');
  }

  const parts = cronExpression.split(' ');

  // Normalize cron so that second segment is included.
  if (cronExpression && cronExpression.split(' ').length === 6) {
    parts.push('');
  }

  const hourInterval = getHourInterval(parts);
  const minuteInterval = getMinuteInterval(parts);
  const secondInterval = getSecondInterval(parts);
  const dayInterval = getDayInterval(parts);
  const dayOfWeek = getDayOfWeek(parts);
  const dayOfMonth = getDayOfMonth(parts);

  const hours = getHours(parts);
  const minutes = getMinutes(parts);

  const displayMode = getDisplayMode(cronExpression);

  switch (displayMode.mode) {
    case 'secondly':
      return {
        mode: 'secondly',
        secondInterval,
      };
    case 'minutely':
      return {
        mode: 'minutely',
        minuteInterval,
      };
    case 'hourly':
      return {
        mode: 'hourly',
        hourInterval,
        minutes,
      };
    case 'daily':
      return {
        mode: 'daily',
        dayInterval,
        hours,
        minutes,
      };
    case 'weekly':
      return {
        mode: 'weekly',
        dayOfWeek,
        hours,
        minutes,
      };
    case 'monthly':
      return {
        mode: 'monthly',
        dayOfMonth,
        hours,
        minutes,
      };
    case 'custom':
      return {
        mode: 'custom',
        customExpression: cronExpression,
      };
  }
};

export const toCronExpression = (cronDisplay: Omit<CronDisplay, 'cronDescription'>): string => {
  switch (cronDisplay.mode) {
    case 'secondly':
      return `*/${cronDisplay.secondInterval} * * * * *`;
    case 'minutely':
      return `0 */${cronDisplay.minuteInterval} * * * *`;
    case 'hourly':
      return `0 ${cronDisplay.minutes} */${cronDisplay.hourInterval} * * *`;
    case 'daily':
      return `0 ${cronDisplay.minutes} ${cronDisplay.hours} */${cronDisplay.dayInterval} * *`;
    case 'weekly':
      return `0 ${cronDisplay.minutes} ${cronDisplay.hours} * * ${cronDisplay.dayOfWeek}`;
    case 'monthly':
      return `0 ${cronDisplay.minutes} ${cronDisplay.hours} ${cronDisplay.dayOfMonth} * *`;
    case 'custom':
      return `${cronDisplay.customExpression}`;
  }
};

export const toCronDescription = (cronExpression: string): string => {
  if (!isEmpty(cronExpression)) {
    return Cronstrue.toString(cronExpression);
  }

  return '';
};

const cronIsValid = (cronExpression: string): boolean => {
  const parts = cronExpression.split(' ');

  if (parts.length < 5 || parts.length > 6) {
    return false;
  }

  return true;
};

const getDisplayMode = (
  cronExpression: string,
): {
  mode: CronDisplayMode;
  default: string;
} => {
  const modeFound = DISPLAY_MODE_LIST.find(mf => {
    const regex = mf.regex;
    return regex.test(cronExpression);
  });

  if (!modeFound) {
    throw new Error('Invalid cron expression.');
  }

  return {
    mode: modeFound.mode,
    default: modeFound.default,
  };
};

const getSecondInterval = (expressionParts: string[]): number | undefined => {
  const v = getSegment(expressionParts[0])[0][1];
  return typeof v === 'number' ? v : undefined;
};

const getMinuteInterval = (expressionParts: string[]): number | undefined => {
  const v = getSegment(expressionParts[1])[0][1];
  return typeof v === 'number' ? v : undefined;
};

const getHourInterval = (expressionParts: string[]): number | undefined => {
  const v = getSegment(expressionParts[2])[0][1];
  return typeof v === 'number' ? v : undefined;
};

const getDayInterval = (expressionParts: string[]): number | undefined => {
  const v = getSegment(expressionParts[3])[0][1];
  return typeof v === 'number' ? v : undefined;
};

const getDayOfWeek = (expressionParts: string[]): number | undefined => {
  const v = getSegment(expressionParts[5])[0][0];
  return typeof v === 'number' ? v : undefined;
};

const getDayOfMonth = (expressionParts: string[]): number | undefined => {
  const v = getSegment(expressionParts[3])[0][0];
  return typeof v === 'number' ? v : undefined;
};

const getMinutes = (expressionParts: string[]): number | undefined => {
  const v = getSegment(expressionParts[1])[0][0];
  return typeof v === 'number' ? v : undefined;
};

const getHours = (expressionParts: string[]): number | undefined => {
  const v = getSegment(expressionParts[2])[0][0];
  return typeof v === 'number' ? v : undefined;
};

const getSegment = (value: string): Array<Array<string | number>> => {
  if (value === undefined) {
    value = '*';
  }
  return value.split(',').map(s => {
    if (s === undefined) {
      s = '*';
    }
    return s.split('/').map(p => {
      const v = parseInt(p, 10);
      return isNaN(v) ? p : v;
    });
  });
};
