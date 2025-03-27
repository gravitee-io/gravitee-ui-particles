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
import { ElementNode, parse } from 'svg-parser';

import fs from 'fs';

const icons = [
  '4x4-cell',
  'Key-alt-remove',
  'accessibility',
  'activity',
  'add-database-script',
  'alarm',
  'alert-circle',
  'align-center',
  'align-justify',
  'align-left',
  'align-right',
  'archive',
  'arrow-down',
  'arrow-down-left',
  'arrow-down-right',
  'arrow-left',
  'arrow-right',
  'arrow-separate-vertical',
  'arrow-up',
  'arrow-up-left',
  'arrow-up-right',
  'at-sign',
  'attachment',
  'award',
  'bar-chart',
  'bar-chart-2',
  'bell',
  'bell-off',
  'bluetooth',
  'bold',
  'book',
  'book-open',
  'bookmark',
  'box',
  'briefcase',
  'building',
  'calendar',
  'camera',
  'cancel',
  'chat-bubble',
  'chat-bubble-check',
  'chat-bubble-empty',
  'chat-bubble-error',
  'chat-bubble-question',
  'chat-bubble-warning',
  'chat-lines',
  'check',
  'check-circle',
  'check-circled-outline',
  'check-square',
  'chevrons-down',
  'chevrons-left',
  'chevrons-right',
  'chevrons-up',
  'chrome',
  'circle',
  'circle-filled',
  'clipboard',
  'clock-outline',
  'cloud-consumers',
  'cloud-published',
  'cloud-server',
  'cloud-settings',
  'cloud-unpublished',
  'code',
  'code-brackets',
  'collapse',
  'color-picker',
  'columns',
  'compare',
  'connection',
  'copy',
  'cpu',
  'credit-card',
  'crop',
  'cursor-pointer',
  'dashboard-dots',
  'data-transfer-both',
  'data-transfer-check',
  'data-transfer-down',
  'data-transfer-up',
  'data-transfer-warning',
  'database-backup',
  'database-export',
  'database-monitor',
  'database-restore',
  'database-rounded',
  'database-script',
  'database-settings',
  'database-star',
  'database-stats',
  'db',
  'db-check',
  'db-error',
  'db-search',
  'db-warning',
  'delete',
  'divide-square',
  'dollar-sign',
  'down-circle',
  'download',
  'download-cloud',
  'drag-indicator',
  'droplet',
  'edit-pencil',
  'endpoints',
  'entrypoints',
  'empty-page',
  'expande',
  'external-link',
  'eye-empty',
  'eye-off',
  'file-minus',
  'file-plus',
  'filter',
  'fingerprint',
  'flag',
  'folder',
  'folder-minus',
  'folder-move',
  'folder-plus',
  'gateway-cloud',
  'gateway-self-hosted',
  'gift',
  'git-branch',
  'git-commit',
  'git-merge',
  'git-pull-request',
  'github',
  'gitlab',
  'graphql',
  'gravitee',
  'grpc',
  'hand',
  'hard-drive',
  'hash',
  'heart',
  'hexagon',
  'home',
  'http-get',
  'http-post',
  'if',
  'image',
  'info',
  'integer',
  'italic',
  'kafka',
  'key',
  'key-alt-minus',
  'key-alt-plus',
  'kubernetes',
  'label-outline',
  'language',
  'laptop',
  'layers',
  'layout',
  'left-circle',
  'life-buoy',
  'link',
  'list',
  'list-check',
  'loader',
  'lock',
  'lock-circle',
  'lock-key',
  'log-denied',
  'login',
  'logout',
  'magic-wand',
  'mail',
  'mail-opened',
  'maximize',
  'maximize-2',
  'mcp',
  'megaphone',
  'menu',
  'message',
  'message-text',
  'minimize',
  'minimize-2',
  'minus',
  'minus-circle',
  'monitor',
  'moon',
  'more-horizontal',
  'more-vertical',
  'move',
  'mqtt',
  'multi-bubble',
  'multi-window',
  'nav-arrow-down',
  'nav-arrow-left',
  'nav-arrow-right',
  'nav-arrow-up',
  'network',
  'network-alt',
  'network-left',
  'network-right',
  'no-credit-card',
  'no-edit-pencil',
  'no-lock',
  'number',
  'octagon',
  'off-rounded',
  'on-rounded',
  'open-id',
  'open-api',
  'open-vpn',
  'page',
  'palette',
  'pause-circle',
  'percent',
  'pie-chart',
  'play-circle',
  'plus',
  'plus-circle',
  'plus-square',
  'power',
  'printer',
  'product-am',
  'product-apim',
  'product-cockpit',
  'product-cloud',
  'product-portal',
  'prohibition',
  'puzzle',
  'question-mark-circle',
  'refresh-ccw',
  'refresh-cw',
  'remove-database-script',
  'report-columns',
  'right-circle',
  'rocket',
  'rotate-ccw',
  'rotate-cw',
  'search',
  'send',
  'server',
  'server-connection',
  'settings',
  'settings-profiles',
  'share',
  'share-2',
  'shield',
  'shield-add',
  'shield-alert',
  'shield-broken',
  'shield-check',
  'shield-cross',
  'shield-download',
  'shield-minus',
  'shield-off',
  'shield-question',
  'shield-star',
  'shield-upload',
  'shopping-bag',
  'shopping-cart',
  'sidebar',
  'sliders',
  'smartphone-device',
  'square',
  'sse',
  'star-dashed',
  'star-half-dashed',
  'star-outline',
  'stat-down',
  'stat-up',
  'stop-circle',
  'sun',
  'switch-off-outline',
  'switch-on-outline',
  'table-rows',
  'tablet-device',
  'target',
  'terminal',
  'text',
  'thumbs-down',
  'thumbs-up',
  'top-bar',
  'trash',
  'trending-down',
  'trending-up',
  'triangle',
  'underline',
  'unlock',
  'up-circle',
  'upload',
  'upload-cloud',
  'user',
  'user-blocked',
  'user-check',
  'user-circle-alt',
  'user-minus',
  'user-plus',
  'user-service',
  'user-x',
  'users',
  'verified',
  'voicemail',
  'web-window',
  'webhook',
  'websocket',
  'wifi',
  'wristwatch',
  'x-circle',
  'x-square',
  'zap',
  'zap-off',
  'universe',
];

const data = fs.readFileSync(`${__dirname}/../../../assets/gio-icons.svg`, { encoding: 'utf8', flag: 'r' });

describe('Icons', () => {
  it('check icons length', () => {
    const parsed = parse(data);
    const element = parsed.children[0] as ElementNode;
    const all = (element.children as Array<ElementNode>).map(child => child.properties?.id);
    expect(all.sort()).toStrictEqual(icons.sort());
  });
});
