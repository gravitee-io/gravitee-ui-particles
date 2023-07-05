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

import { isFunction } from 'lodash';

import { Policy } from './Policy';

// 09/06/2023 - All API V4 available policies.
export const POLICIES_V4_UNREGISTERED_ICON: Policy[] = [
  {
    id: 'message-filtering',
    name: 'Message Filtering',
    description: 'Message Filtering Gravitee Policy',
    category: 'others',
    version: '1.1.1',
    proxy: [],
    message: ['MESSAGE_RESPONSE', 'MESSAGE_REQUEST'],
  },
  {
    id: 'json-xml',
    name: 'JSON to XML',
    description: 'Description of the JSON to XML Transformation Gravitee Policy',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAuNzEgMTEyLjgyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6Izg2YzNkMDt9LmNscy0ye2ZpbGw6I2ZmZjt9LmNscy0ze2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzFkMWQxYjtmb250LWZhbWlseTpNeXJpYWRQcm8tUmVndWxhciwgTXlyaWFkIFBybzt9LmNscy00e2xldHRlci1zcGFjaW5nOi0wLjAxZW07fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJBUEkiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUwLjM1LDEzLjM3YTQzLDQzLDAsMSwwLDQzLjA1LDQzQTQzLDQzLDAsMCwwLDUwLjM1LDEzLjM3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTUxLjUsNjQuOTJBNi41Myw2LjUzLDAsMSwxLDU4LDU4LjM5LDYuNTMsNi41MywwLDAsMSw1MS41LDY0LjkyWm0wLTExLjM0YTQuODEsNC44MSwwLDEsMCw0LjgxLDQuODFBNC44MSw0LjgxLDAsMCwwLDUxLjUsNTMuNThaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjMuOCw3Ny4wOWE0LjgzLDQuODMsMCwxLDEsMy42OS03LjkyLDQuNzQsNC43NCwwLDAsMSwxLjEzLDMuMDlBNC44Myw0LjgzLDAsMCwxLDYzLjgsNzcuMDlabTAtNy45M2EzLjExLDMuMTEsMCwxLDAsMi4zOCwxLjEyQTMuMSwzLjEsMCwwLDAsNjMuOCw2OS4xNloiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik01MS41LDQzLjY4YTQuODUsNC44NSwwLDAsMS00Ljc3LTQuMTQsNSw1LDAsMCwxLDAtLjY5LDQuODMsNC44MywwLDAsMSw5LjY1LDAsMy40NSwzLjQ1LDAsMCwxLS4wNy43NEE0LjgxLDQuODEsMCwwLDEsNTEuNSw0My42OFptMC03LjkzYTMuMSwzLjEsMCwwLDAtMy4xLDMuMSwzLjI1LDMuMjUsMCwwLDAsMCwuNDQsMy4xLDMuMSwwLDAsMCw2LjE0LDAsMi42NiwyLjY2LDAsMCwwLDAtLjQ1QTMuMTEsMy4xMSwwLDAsMCw1MS41LDM1Ljc1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTMzLjY0LDcwLjE1YTQuODMsNC44MywwLDAsMS0xLjM3LTkuNDYsNSw1LDAsMCwxLDEuMzctLjE5LDQuODIsNC44MiwwLDAsMSw0LjgyLDQuODIsNC44Nyw0Ljg3LDAsMCwxLTIuNzEsNC4zNUE0LjczLDQuNzMsMCwwLDEsMzMuNjQsNzAuMTVabTAtNy45M2EzLDMsMCwwLDAtLjg5LjEzLDMuMSwzLjEsMCwwLDAsLjg5LDYuMDhBMywzLDAsMCwwLDM1LDY4LjEyYTMuMTEsMy4xMSwwLDAsMC0xLjM1LTUuOVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zMi4xOCw1Ni4zNWgtLjEyYS44Ny44NywwLDAsMS0uNzMtMUEyMC40NywyMC40NywwLDAsMSw0Miw0MC4zM2EuODYuODYsMCwxLDEsLjgsMS41MkExOC43NywxOC43NywwLDAsMCwzMyw1NS42MS44Ni44NiwwLDAsMSwzMi4xOCw1Ni4zNVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik01MS41LDc4Ljc5YTIwLjE3LDIwLjE3LDAsMCwxLTEyLjI3LTQuMTEuODYuODYsMCwwLDEtLjE3LTEuMjEuODUuODUsMCwwLDEsMS4yLS4xNkExOC41MiwxOC41MiwwLDAsMCw1MS41LDc3LjA3LDE4LjIzLDE4LjIzLDAsMCwwLDU1LDc2LjczYS44Ny44NywwLDAsMSwuMzMsMS43QTIwLjg3LDIwLjg3LDAsMCwxLDUxLjUsNzguNzlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNzAsNjUuNDJhLjg0Ljg0LDAsMCwxLS4yNywwLC44Ni44NiwwLDAsMS0uNTQtMS4wOSwxOC43MSwxOC43MSwwLDAsMC04LjU1LTIyLjE3Ljg2Ljg2LDAsMSwxLC44NS0xLjUsMjAuNDIsMjAuNDIsMCwwLDEsOS4zMywyNC4yMUEuODcuODcsMCwwLDEsNzAsNjUuNDJaIi8+PC9nPjxnIGlkPSJIT1NUSU5HIj48dGV4dCBjbGFzcz0iY2xzLTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3LjkzIC00Ljk4KSI+WE1MIDx0c3BhbiBjbGFzcz0iY2xzLTQiIHg9IjI0LjcxIiB5PSIwIj50PC90c3Bhbj48dHNwYW4geD0iMjguNjEiIHk9IjAiPm8gSlNPTjwvdHNwYW4+PC90ZXh0PjwvZz48L3N2Zz4=',
    category: 'transformation',
    version: '2.1.4',
    proxy: ['REQUEST', 'RESPONSE'],
    message: ['MESSAGE_RESPONSE', 'MESSAGE_REQUEST'],
  },
  {
    id: 'avro-json',
    name: 'Avro JSON Transformation',
    description: 'Policy used to transform Avro to JSON',
    icon: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij48cGF0aCBkPSJNMTcwLjkxNjY3MTgsMzAzLjU3MTYyNDhoLTYuMzQzNDE0M2wzLjY1OTI4NjUtMTUuNDk2MzM3OUwxNzAuOTE2NjcxOCwzMDMuNTcxNjI0OHogTTIxOC44NDU1ODExLDIxMy41OTI4ODAybC0zMy45MTM1NTksMjMuNTE3MjExOWMtMzEuMTk2MDQ0OS0zMC44NDg4NjE3LTgxLjI2NzUzMjMtMy4xMDUzNDY3LTE0NS4yNzcwNjkxLTMxLjk1NDgwMzVDOTMuMzc1MjM2NSwyMTcuOTY2ODQyNywxNjUuMjA1MDE3MSwxOTAuNDQzNjQ5MywyMTguODQ1NTgxMSwyMTMuNTkyODgwMnogTTQxLjUwNzQxMiwyMTYuMjQ4NTA0NmMzMS4zNTk3NTI3LDExLjY5MzY5NTEsNjEuODQwMjc0OCwxNi4xMzY4NDA4LDk0LjIyNzMyNTQsMTQuNjM3MDg1YzMuNTMyOTU5LDEuNTc2MjAyNCw2LjMzODQyNDcsNS4wMjUxMTYsNy45NDYzMDQzLDguMzEwNzc1OEM4My4yODA4MDc1LDI0NS4xMzg1MTkzLDU2LjEwNzQ5ODIsMjI3LjAzOTMzNzIsNDEuNTA3NDEyLDIxNi4yNDg1MDQ2eiBNNTUuMDY1NzczLDIzNS4wMzQ3MTM3YzI4Ljc4NDI0ODQsMTEuMDQ3NTc2OSw1NC44ODU4MDMyLDE3LjU3MjQ3OTIsOTIuMDUzNjQyMywxMS4wNTU2OTQ2YzAsMCw1LjUwOTgxMTQsNC40MzA5OTk4LDUuNjYxNjk3NCw2LjczMzYyNzNDMTAyLjgyODg1NzQsMjYyLjEzMjMyNDIsODMuMzU2MDU2MiwyNTQuMDE2NjkzMSw1NS4wNjU3NzMsMjM1LjAzNDcxMzd6IE0xNTQuNTg0ODU0MSwyNjAuNDQyOTYyNmMtMjcuMDAxNTMzNSwxNC40NTA5Mjc3LTYyLjQ3NzgxMzcsMTAuNTAxMDA3MS03MC42MjIxMDA4LTAuMzQ2MjUyNEMxMTMuMjc0MzQ1NCwyNjUuODk4Mjg0OSwxMzIuNDMzMDEzOSwyNjQuODczMzUyMSwxNTQuNTg0ODU0MSwyNjAuNDQyOTYyNnogTTQ3Mi4zNDUwMzE3LDIwNS4xNTUyODg3Yy02NC4wMDk1MjE1LDI4Ljg0OTQ1NjgtMTE0LjA4MDk5MzcsMS4xMDU5NDE4LTE0NS4yNzcwNjkxLDMxLjk1NDgwMzVsLTMzLjkxMzU0MzctMjMuNTE3MjExOUMzNDYuNzk0OTgyOSwxOTAuNDQzNjQ5Myw0MTguNjI0NzU1OSwyMTcuOTY2ODQyNyw0NzIuMzQ1MDMxNywyMDUuMTU1Mjg4N3ogTTM2OC4zMTg5Njk3LDIzOS4xOTYzNjU0YzEuNjA3ODQ5MS0zLjI4NTY1OTgsNC40MTMzMzAxLTYuNzM0NTczNCw3Ljk0NjI4OTEtOC4zMTA3NzU4YzMyLjM4NzA1NDQsMS40OTk3NTU5LDYyLjg2NzU4NDItMi45NDMzODk5LDk0LjIyNzMyNTQtMTQuNjM3MDg1QzQ1NS44OTI0ODY2LDIyNy4wMzkzMzcyLDQyOC43MTkxNzcyLDI0NS4xMzg1MTkzLDM2OC4zMTg5Njk3LDIzOS4xOTYzNjU0eiBNMzU5LjIxODkwMjYsMjUyLjgyNDAzNTZjMC4xNTE4NTU1LTIuMzAyNjI3Niw1LjY2MTY4MjEtNi43MzM2MjczLDUuNjYxNjgyMS02LjczMzYyNzNjMzcuMTY3ODQ2Nyw2LjUxNjc4NDcsNjMuMjY5NDA5Mi0wLjAwODExNzcsOTIuMDUzNjQ5OS0xMS4wNTU2OTQ2QzQyOC42NDM5NTE0LDI1NC4wMTY2OTMxLDQwOS4xNzExNDI2LDI2Mi4xMzIzMjQyLDM1OS4yMTg5MDI2LDI1Mi44MjQwMzU2eiBNNDI4LjAzNzIzMTQsMjYwLjA5NjcxMDJjLTguMTQ0MjU2NiwxMC44NDcyNTk1LTQzLjYyMDU0NDQsMTQuNzk3MTgwMi03MC42MjIwNzAzLDAuMzQ2MjUyNEMzNzkuNTY2OTg2MSwyNjQuODczMzUyMSwzOTguNzI1NjQ3LDI2NS44OTgyODQ5LDQyOC4wMzcyMzE0LDI2MC4wOTY3MTAyeiBNMTQ3LjIwMDUzMSwzMTguNDk3MjgzOUg5OC41OTU4NjMzbDYwLjEwMzI5NDQtNDAuMjE5MDI0N0wxNDcuMjAwNTMxLDMxOC40OTcyODM5eiBNMTYwLjQxNzU1NjgsMzE4LjY2MDQwMDRsMS4xMjUwNDU4LTQuOTUzMzY5MWgxMS45OTE0MjQ2bDAuOTgxMjE2NCw0Ljk1MzM2OTFIMTYwLjQxNzU1Njh6IE0xODguMzEzODU4LDMxOC43NzAxMTExbC0xNC40NjAwMjItNTAuNTgyNzYzN2wxOS4xNjM4NjQxLTEzLjIzNTI5MDVsMTkuNDQ1MDUzMSw2My44MTgwNTQySDE4OC4zMTM4NTh6IE0yMDQuNjQ3ODI3MSwyNDcuMjI4NDg1MWwzMC40NDY1NDg1LTIwLjYyOTgzN2wtMTYuNDUyNjY3Miw2Ny43NjY3MDg0TDIwNC42NDc4MjcxLDI0Ny4yMjg0ODUxeiBNMjUzLjc1OTAxNzksMzE4LjQ0MTA3MDZoLTI4LjU1NDUxOTdsMjUuMTYzNDIxNi0xMDEuOTY5OTcwN2wzLjM5MTA5OC0xLjg2NDYwODhWMzE4LjQ0MTA3MDZ6IE0yNjUuOTcwNTUwNSwyMzEuMjY5MzYzNGMyNi4xNTI5NTQxLDI0Ljg1Nzk1NTksMjkuMDIxODgxMSwzNi4yNTI5NzU1LDAsMzcuNDExNTc1M1YyMzEuMjY5MzYzNHogTTI2Ni4xMzUwNzA4LDMxOC42NjA0MDA0bDAuMDQ1NzE1My0zMi44NTA0NjM5bDIyLjc2ODY0NjIsMzIuODUwNDYzOUgyNjYuMTM1MDcwOHogTTMwMy4zNTQ2MTQzLDMxOC42NjA0NjE0bC0yNS44ODU0OTgtMzguNTU0MTM4MmMyNC44ODgwOTItNS43ODE1ODU3LDI5LjAzMjE5Ni0yMi4yNjQ4NjIxLDguMDk4Mjk3MS00Ny40MjAxODEzYzE1LjQyODk4NTYsMTAuNzMwODA0NCwzMS4yNjAxMzE4LDIwLjYwMjM3MTIsNDYuNTA2MjI1NiwzMS41NzA4NDY2Yy0yMS40MjgyMjI3LDguMjUxNzctMjguMzY2MDg4OSwzOS40MDI0MzUzLTIuOTI0ODk2Miw1NC40MDM0NzI5SDMwMy4zNTQ2MTQzeiBNMzI3LjU4Mzg2MjMsMjk5LjgyNDY0NmMtOS42NDE4MTUyLTE4Ljc4MDI0MjksMTYuNTM3MjkyNS0zNy4yMzYyNjcxLDIyLjQ3ODAyNzMtMTAuMzk1MDgwNkMzNTIuMDAyNTk0LDMwNS44NzY5MjI2LDMzNS41MjY3NjM5LDMxNS4xODQxNzM2LDMyNy41ODM4NjIzLDI5OS44MjQ2NDZ6IE00MTMuMjAzNjQzOCwzMTguMzg2MjMwNWgtNjcuNjM4NzMyOWMxMy4xMjM4NDAzLTYuMDkzNTk3NCwxOS45MjA3NzY0LTIwLjc5NjE3MzEsMTYuMDMyMTY1NS0zNC43MzM0MjlMNDEzLjIwMzY0MzgsMzE4LjM4NjIzMDV6IE0yMjguODQyMzYxNSwyMDcuNDAzODU0NGMtODIuMjkwMTE1NC0zOC4wNzIwNjczLTE3MC45NzQ3MTYyLDI0LjgzMTgzMjktMjI4LjgxMzU5ODYtMzEuMjg0NzljLTEuMDczMDQ5NywyMC41NTQ5NjIyLDI4LjE1MzU2NDUsMzkuOTczMjIwOCw0MC44NjkyNDc0LDU4LjI4NTQxNTZjNy4yNTAyNDAzLDEzLjEwNTU0NSwyMS43OTM3MzkzLDI1LjE5NTA5ODksMzQuNjYwMzI3OSwzMS4xMzIxMTA2YzguMTc5NjQ5NCwxNC4zNjc5NTA0LDE3LjczMDE4NjUsMTMuMDAwNzAxOSw0NS44NDgxMTQsMTMuNjc0MDExMmwtODMuMTc3MzY4Miw1Ni42NzAzMTg2aDQzNS44ODU5MjUzbC04My41MjE0ODQ0LTU2LjY3MDMxODZjMjguMTE3OTUwNC0wLjY3MzMwOTMsMzcuNjY4NDg3NSwwLjY5MzkzOTIsNDUuODQ4MTE0LTEzLjY3NDAxMTJjMTIuODY2NjA3Ny01LjkzNzAxMTcsMjcuNDEwMDk1Mi0xOC4wMjY1NjU2LDM0LjY2MDMzOTQtMzEuMTMyMTEwNmMxMi43MTU2Njc3LTE4LjMxMjE5NDgsNDEuOTQyMzIxOC0zNy43MzA0NTM1LDQwLjg2OTIzMjItNTguMjg1NDE1NmMtNTcuODM4ODY3Miw1Ni4xMTY2MjI5LTE0Ni40OTc2NTAxLTYuNzg3Mjc3Mi0yMjguNzg3NzgwOCwzMS4yODQ3OWwtMjcuMTc1OTMzOC0xOC4wNzk2NTA5TDIyOC44NDIzNjE1LDIwNy40MDM4NTQ0eiIvPjwvc3ZnPg==',
    category: 'transformation',
    version: '1.2.0-alpha.2',
    proxy: ['REQUEST', 'RESPONSE'],
    message: ['MESSAGE_RESPONSE', 'MESSAGE_REQUEST'],
  },
  {
    id: 'jwt',
    name: 'JSON Web Tokens',
    description: 'Description of the JWT Gravitee Policy',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAuNzEgMTEyLjgyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6Izg2YzNkMDt9LmNscy0ye2ZpbGw6I2ZmZjt9LmNscy0ze2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzFkMWQxYjtmb250LWZhbWlseTpNeXJpYWRQcm8tUmVndWxhciwgTXlyaWFkIFBybzt9LmNscy00e2xldHRlci1zcGFjaW5nOjAuMDNlbTt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9IkFQSSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTAuMzUsMTMuMzdhNDMsNDMsMCwxLDAsNDMuMDUsNDNBNDMsNDMsMCwwLDAsNTAuMzUsMTMuMzdaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNDEuNzksNjEuNjdhMTMuODIsMTMuODIsMCwxLDEsMTIuNTctOCwuODcuODcsMCwwLDEtMS4xNS40Mi44Ni44NiwwLDAsMS0uNDItMS4xNCwxMi4xMiwxMi4xMiwwLDEsMC0yLjQ0LDMuNDkuODYuODYsMCwxLDEsMS4yMiwxLjIyQTEzLjgsMTMuOCwwLDAsMSw0MS43OSw2MS42N1oiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik02OC4zMSw3OC44YTQuNCw0LjQsMCwwLDEtMy4xNC0xLjNMNTUuNiw2Ny45M2EuODYuODYsMCwxLDEsMS4yMi0xLjIybDkuNTcsOS41N2EyLjc3LDIuNzcsMCwwLDAsMy44NCwwLDIuNzIsMi43MiwwLDAsMCwwLTMuODNsLTkuNTctOS41OGEyLjc5LDIuNzksMCwwLDAtMy44NCwwLC44OC44OCwwLDAsMS0xLjIyLDBsLTUuMjUtNS4yNGEuODguODgsMCwwLDEsMC0xLjIyLjg2Ljg2LDAsMCwxLDEuMjIsMGw0LjcsNC43YTQuNDMsNC40MywwLDAsMSw1LjYuNTVsOS41OCw5LjU3YTQuNDQsNC40NCwwLDAsMS0zLjE0LDcuNTdaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNDYuMzYsNTMuMjdhLjg1Ljg1LDAsMCwxLS42MS0uMjVsLTkuMTQtOS4xM2EuODguODgsMCwwLDEsMC0xLjIyLjg2Ljg2LDAsMCwxLDEuMjIsMEw0Nyw1MS44QS44OC44OCwwLDAsMSw0Nyw1MywuODUuODUsMCwwLDEsNDYuMzYsNTMuMjdaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzcuMjIsNTMuMjdhLjg1Ljg1LDAsMCwxLS42MS0uMjUuODguODgsMCwwLDEsMC0xLjIybDkuMTQtOS4xM2EuODYuODYsMCwwLDEsMS4yMiwwLC44OC44OCwwLDAsMSwwLDEuMjJMMzcuODMsNTNBLjg1Ljg1LDAsMCwxLDM3LjIyLDUzLjI3WiIvPjwvZz48ZyBpZD0iSE9TVElORyI+PHRleHQgY2xhc3M9ImNscy0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNy45MyAtNC45OCkiPko8dHNwYW4gY2xhc3M9ImNscy00IiB4PSI0LjQ0IiB5PSIwIj5XPC90c3Bhbj48dHNwYW4geD0iMTQuOTkiIHk9IjAiPlQ8L3RzcGFuPjwvdGV4dD48L2c+PC9zdmc+',
    category: 'security',
    version: '3.2.0',
    proxy: ['REQUEST'],
    message: ['REQUEST'],
  },
  {
    id: 'key-less',
    name: 'Keyless',
    description: 'Description of the Keyless Security Gravitee Policy',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAuNzEgMTEyLjgyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6Izg2YzNkMDt9LmNscy0ye2ZpbGw6I2ZmZjt9LmNscy0ze2ZpbGw6bm9uZTtzdHJva2U6I2ZmZjtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6MnB4O308L3N0eWxlPjwvZGVmcz48ZyBpZD0iQVBJIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01MC4zNSwxNC4yNGE0Myw0MywwLDEsMCw0My4wNSw0M0E0Myw0MywwLDAsMCw1MC4zNSwxNC4yNFoiLz48L2c+PGcgaWQ9IkhPU1RJTkciPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTU3LjU2LDg4LjYzSDQzLjE1YTIuOSwyLjksMCwwLDEtMi45LTIuOVY3Ni42MmEyLjg5LDIuODksMCwwLDEsMi45LTIuODlINTcuNTZhMi44OSwyLjg5LDAsMCwxLDIuOSwyLjg5djkuMTFBMi45LDIuOSwwLDAsMSw1Ny41Niw4OC42M1pNNDMuMTUsNzYuMTRhLjQ4LjQ4LDAsMCwwLS40OS40OHY5LjExYS40OS40OSwwLDAsMCwuNDkuNDlINTcuNTZhLjQ5LjQ5LDAsMCwwLC40OS0uNDlWNzYuNjJhLjQ4LjQ4LDAsMCwwLS40OS0uNDhaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTAuMzUsNjMuNjJBNy41OCw3LjU4LDAsMCwwLDQyLjg5LDcwaDIuNDdhNS4xNSw1LjE1LDAsMCwxLDEwLjE1LDEuMjN2My43NGExLjIxLDEuMjEsMCwxLDAsMi40MSwwVjcxLjE5QTcuNTgsNy41OCwwLDAsMCw1MC4zNSw2My42MloiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik0yNi4xNiw0Ny40M2EyNS4yMiwyNS4yMiwwLDAsMSw0OC4zOS0uMzEiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik0zMi4xMiw1Mi44YTE5LDE5LDAsMCwxLDM2LjQ3LS4yMyIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTM5LjM0LDU2LjY1YTExLDExLDAsMCwxLDIxLjE3LS4xNCIvPjwvZz48L3N2Zz4=',
    category: 'security',
    version: '2.2.0',
    proxy: ['REQUEST'],
    message: ['REQUEST'],
  },
  {
    id: 'api-key',
    name: 'Api Key',
    description: 'Description of the ApiKey Gravitee Policy',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAuNzEgMTEyLjgyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6Izg2YzNkMDt9LmNscy0ye2ZpbGw6I2ZmZjt9LmNscy0ze2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzFkMWQxYjtmb250LWZhbWlseTpNeXJpYWRQcm8tUmVndWxhciwgTXlyaWFkIFBybzt9LmNscy00e2xldHRlci1zcGFjaW5nOjBlbTt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9IkFQSSI+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTAuMzUsMTMuMzdhNDMsNDMsMCwxLDAsNDMuMDUsNDNBNDMsNDMsMCwwLDAsNTAuMzUsMTMuMzdaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjcuMzMsNzguNjVIMzkuNzhBMi42MSwyLjYxLDAsMCwxLDM3LjE3LDc2VjcxLjg4YS44NC44NCwwLDAsMSwuMzYtLjcsNy4wNiw3LjA2LDAsMCwwLDItMi4yMS44NS44NSwwLDAsMSwuNzUtLjQzSDQyLjZMNDUsNjYuNzlhLjg2Ljg2LDAsMCwxLDEtLjA1bDIuNzIsMS42NCwyLjUzLTEuNjJhLjg2Ljg2LDAsMCwxLDEsMGwuNDkuMzhWNjIuNDZINDAuMjhhLjg2Ljg2LDAsMCwxLS43NS0uNDQsNi43Niw2Ljc2LDAsMCwwLTItMi4xOS44OC44OCwwLDAsMS0uMzYtLjcxVjU1YTIuNjIsMi42MiwwLDAsMSwyLjYxLTIuNjJINjcuMzNBMi42MywyLjYzLDAsMCwxLDcwLDU1Vjc2QTIuNjIsMi42MiwwLDAsMSw2Ny4zMyw3OC42NVpNMzguOSw3Mi4zMlY3NmEuODkuODksMCwwLDAsLjg4Ljg4SDY3LjMzYS44Ny44NywwLDAsMCwuODgtLjg4VjU1YS44OC44OCwwLDAsMC0uODgtLjg4SDM5Ljc4YS44OS44OSwwLDAsMC0uODguODh2My43MmE4LjYyLDguNjIsMCwwLDEsMS44NywySDUzLjU1YS44Ny44NywwLDAsMSwuODcuODdWNjlhLjg3Ljg3LDAsMCwxLS40OS43OC44Ni44NiwwLDAsMS0uOTEtLjFsLTEuNDEtMS4xMS0yLjQ2LDEuNTlhLjg3Ljg3LDAsMCwxLS45MiwwbC0yLjY5LTEuNjJMNDMuNCw3MC4xMWEuOTQuOTQsMCwwLDEtLjUyLjE2SDQwLjc3QTguNjksOC42OSwwLDAsMSwzOC45LDcyLjMyWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTY1Ljg0LDU0LjA4SDYxLjQ3YS44Ny44NywwLDAsMS0uODctLjg3di01LjlhNyw3LDAsMCwwLTE0LjA4LDB2NS45YS44Ny44NywwLDAsMS0uODcuODdINDEuMjhhLjg3Ljg3LDAsMCwxLS44Ny0uODd2LTUuOWExMy4xNSwxMy4xNSwwLDEsMSwyNi4zLDB2NS45QS44Ny44NywwLDAsMSw2NS44NCw1NC4wOFptLTMuNS0xLjc0SDY1di01YTExLjQxLDExLjQxLDAsMSwwLTIyLjgyLDB2NWgyLjYzdi01YTguNzgsOC43OCwwLDAsMSwxNy41NiwwWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTMxLjcxLDY5YTMuNTEsMy41MSwwLDEsMSwzLjUxLTMuNTFBMy41MSwzLjUxLDAsMCwxLDMxLjcxLDY5Wm0wLTUuMjlhMS43OCwxLjc4LDAsMSwwLDEuNzcsMS43OEExLjc4LDEuNzgsMCwwLDAsMzEuNzEsNjMuNzJaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzMuNDgsNzQuMjJhOC43Miw4LjcyLDAsMSwxLDUuMDYtMTUuODEsOC41OSw4LjU5LDAsMCwxLDIuMjMsMi4zMUg1My41NWEuODcuODcsMCwwLDEsLjg3Ljg3VjY5YS44Ny44NywwLDAsMS0uNDkuNzguODYuODYsMCwwLDEtLjkxLS4xbC0xLjQxLTEuMTEtMi40NiwxLjU5YS44Ny44NywwLDAsMS0uOTIsMGwtMi42OS0xLjYyTDQzLjQsNzAuMTFhLjk0Ljk0LDAsMCwxLS41Mi4xNkg0MC43N2E4Ljc1LDguNzUsMCwwLDEtNy4yOSw0Wm0wLTE1LjY5YTcsNywwLDEsMCw0LjA1LDEyLjY1LDcuMDYsNy4wNiwwLDAsMCwyLTIuMjEuODUuODUsMCwwLDEsLjc1LS40M0g0Mi42TDQ1LDY2Ljc5YS44Ni44NiwwLDAsMSwxLS4wNWwyLjcyLDEuNjQsMi41My0xLjYyYS44Ni44NiwwLDAsMSwxLDBsLjQ5LjM4VjYyLjQ2SDQwLjI4YS44Ni44NiwwLDAsMS0uNzUtLjQ0LDYuNzYsNi43NiwwLDAsMC0yLTIuMTlBNi45Myw2LjkzLDAsMCwwLDMzLjQ4LDU4LjUzWk0zMS43MSw2OWEzLjUxLDMuNTEsMCwxLDEsMy41MS0zLjUxQTMuNTEsMy41MSwwLDAsMSwzMS43MSw2OVptMC01LjI5YTEuNzgsMS43OCwwLDEsMCwxLjc3LDEuNzhBMS43OCwxLjc4LDAsMCwwLDMxLjcxLDYzLjcyWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTMxLjcxLDY5YTMuNTEsMy41MSwwLDEsMSwzLjUxLTMuNTFBMy41MSwzLjUxLDAsMCwxLDMxLjcxLDY5Wm0wLTUuMjlhMS43OCwxLjc4LDAsMSwwLDEuNzcsMS43OEExLjc4LDEuNzgsMCwwLDAsMzEuNzEsNjMuNzJaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTMuNTYsNzMuNjlhLjg3Ljg3LDAsMCwxLS44Ny0uODdWNjlhLjg3Ljg3LDAsMCwxLDEuNzQsMHYzLjg1QS44Ny44NywwLDAsMSw1My41Niw3My42OVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik01My41Niw2Mi4zN2EuODcuODcsMCwwLDEtLjg3LS44N1Y1Ny42NWEuODcuODcsMCwwLDEsMS43NCwwVjYxLjVBLjg3Ljg3LDAsMCwxLDUzLjU2LDYyLjM3WiIvPjwvZz48ZyBpZD0iSE9TVElORyI+PHRleHQgY2xhc3M9ImNscy0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNy45MyAtNC45OCkiPjx0c3BhbiBjbGFzcz0iY2xzLTQiPkE8L3RzcGFuPjx0c3BhbiB4PSI3LjMxIiB5PSIwIj5waSBLZXk8L3RzcGFuPjwvdGV4dD48L2c+PC9zdmc+',
    category: 'security',
    version: '3.2.1',
    proxy: ['REQUEST'],
    message: ['REQUEST'],
  },
  {
    id: 'oauth2',
    name: 'OAuth2',
    description: 'Description of the OAuth2 Gravitee Policy',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAuNzEgMTEyLjgyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6Izg2YzNkMDt9LmNscy0ye2ZpbGw6I2ZmZjt9LmNscy0ze2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzFkMWQxYjtmb250LWZhbWlseTpNeXJpYWRQcm8tUmVndWxhciwgTXlyaWFkIFBybzt9LmNscy00e2xldHRlci1zcGFjaW5nOi0wLjAxZW07fS5jbHMtNXtsZXR0ZXItc3BhY2luZzowLjAxZW07fS5jbHMtNntsZXR0ZXItc3BhY2luZzowZW07fS5jbHMtN3tsZXR0ZXItc3BhY2luZzotMC4wMWVtO30uY2xzLTh7bGV0dGVyLXNwYWNpbmc6MC4wMWVtO30uY2xzLTl7bGV0dGVyLXNwYWNpbmc6LTAuMDFlbTt9LmNscy0xMHtsZXR0ZXItc3BhY2luZzotMC4wMWVtO30uY2xzLTExe2xldHRlci1zcGFjaW5nOi0wLjAxZW07fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJBUEkiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUwLjM1LDEzLjM3YTQzLDQzLDAsMSwwLDQzLjA1LDQzQTQzLDQzLDAsMCwwLDUwLjM1LDEzLjM3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTUwLjE5LDMzLjc1YzUuOCwwLDYuNTUuNTMsOC4zNiw2UTYzLjg5LDU1Ljg4LDY5LjIxLDcyYy45MywyLjgxLjA3LDUuMjUtMi4wOCw2LjM4LTIuODgsMS41MS01Ljg3LjMxLTcuMDgtMi45NC0uNzktMi4xMi0xLjMxLTQuMzUtMi4yMy02LjQxYTMuMjksMy4yOSwwLDAsMC0yLjI0LTEuNzcsOTIuMyw5Mi4zLDAsMCwwLTEwLjUyLDAsMy4yNywzLjI3LDAsMCwwLTIuMTksMS44Yy0uODUsMi0xLjMyLDQuMTMtMiw2LjE4LTEuMDYsMy0zLjQ3LDQuMzItNi4xNywzLjQ5LTIuODctLjg4LTQuMTktMy4zNy0zLjIyLTYuNXE1LTE2LjExLDEwLjEyLTMyLjE3QzQzLjQsMzQuMjcsNDQuMTIsMzMuNzUsNTAuMTksMzMuNzVaIi8+PC9nPjxnIGlkPSJIT1NUSU5HIj48dGV4dCBjbGFzcz0iY2xzLTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkyLjQ1IC00Ljk4KSI+T3BlbklEIDx0c3BhbiBjbGFzcz0iY2xzLTQiIHg9IjQxLjE3IiB5PSIwIj5DPC90c3Bhbj48dHNwYW4geD0iNDgiIHk9IjAiPm9ubmU8L3RzcGFuPjx0c3BhbiBjbGFzcz0iY2xzLTUiIHg9IjczLjkyIiB5PSIwIj5jPC90c3Bhbj48dHNwYW4gY2xhc3M9ImNscy02IiB4PSI3OS40NSIgeT0iMCI+dCAtIDwvdHNwYW4+PHRzcGFuIGNsYXNzPSJjbHMtNyIgeD0iOTIuMTkiIHk9IjAiPlU8L3RzcGFuPjx0c3BhbiB4PSI5OS44OSIgeT0iMCI+c2VyPC90c3Bhbj48dHNwYW4gY2xhc3M9ImNscy04IiB4PSIxMTQuNTciIHk9IjAiPkk8L3RzcGFuPjx0c3BhbiB4PSIxMTcuNTYiIHk9IjAiPm48L3RzcGFuPjx0c3BhbiBjbGFzcz0iY2xzLTkiIHg9IjEyNC4yMiIgeT0iMCI+ZjwvdHNwYW4+PHRzcGFuIHg9IjEyNy41NyIgeT0iMCI+bzwvdHNwYW4+PC90ZXh0Pjx0ZXh0IGNsYXNzPSJjbHMtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcuOTMgLTQuOTgpIj48dHNwYW4gY2xhc3M9ImNscy0xMCI+TzwvdHNwYW4+PHRzcGFuIGNsYXNzPSJjbHMtMTEiIHg9IjguMSIgeT0iMCI+QTwvdHNwYW4+PHRzcGFuIHg9IjE1LjMiIHk9IjAiPnV0aDI8L3RzcGFuPjwvdGV4dD48L2c+PC9zdmc+',
    category: 'security',
    version: '2.2.0',
    proxy: ['REQUEST'],
    message: ['REQUEST'],
  },
  {
    id: 'json-to-json',
    name: 'JSON to JSON Transformation',
    description: 'Description of the JSON to JSON Transformation Gravitee Policy',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAuNzEgMTEyLjgyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6Izg2YzNkMDt9LmNscy0ye2ZpbGw6I2ZmZjt9LmNscy0ze2ZvbnQtc2l6ZToxMnB4O2ZpbGw6IzFkMWQxYjtmb250LWZhbWlseTpNeXJpYWRQcm8tUmVndWxhciwgTXlyaWFkIFBybzt9LmNscy00e2xldHRlci1zcGFjaW5nOi0wLjAxZW07fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJBUEkiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTUwLjM1LDEzLjM3YTQzLDQzLDAsMSwwLDQzLjA1LDQzQTQzLDQzLDAsMCwwLDUwLjM1LDEzLjM3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTYzLjgsNzcuMDlhNC44Myw0LjgzLDAsMSwxLDMuNjktNy45Miw0Ljc0LDQuNzQsMCwwLDEsMS4xMywzLjA5QTQuODMsNC44MywwLDAsMSw2My44LDc3LjA5Wm0wLTcuOTNhMy4xMSwzLjExLDAsMSwwLDIuMzgsMS4xMkEzLjEsMy4xLDAsMCwwLDYzLjgsNjkuMTZaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTEuNSw0My42OGE0Ljg1LDQuODUsMCwwLDEtNC43Ny00LjE0LDUsNSwwLDAsMSwwLS42OSw0LjgzLDQuODMsMCwwLDEsOS42NSwwLDMuNDUsMy40NSwwLDAsMS0uMDcuNzRBNC44MSw0LjgxLDAsMCwxLDUxLjUsNDMuNjhabTAtNy45M2EzLjEsMy4xLDAsMCwwLTMuMSwzLjEsMy4yNSwzLjI1LDAsMCwwLDAsLjQ0LDMuMSwzLjEsMCwwLDAsNi4xNCwwLDIuNjYsMi42NiwwLDAsMCwwLS40NUEzLjExLDMuMTEsMCwwLDAsNTEuNSwzNS43NVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zMy42NCw3MC4xNWE0LjgzLDQuODMsMCwwLDEtMS4zNy05LjQ2LDUsNSwwLDAsMSwxLjM3LS4xOSw0LjgyLDQuODIsMCwwLDEsNC44Miw0LjgyLDQuODcsNC44NywwLDAsMS0yLjcxLDQuMzVBNC43Myw0LjczLDAsMCwxLDMzLjY0LDcwLjE1Wm0wLTcuOTNhMywzLDAsMCwwLS44OS4xMywzLjEsMy4xLDAsMCwwLC44OSw2LjA4QTMsMywwLDAsMCwzNSw2OC4xMmEzLjExLDMuMTEsMCwwLDAtMS4zNS01LjlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzIuMTgsNTYuMzVoLS4xMmEuODcuODcsMCwwLDEtLjczLTFBMjAuNDcsMjAuNDcsMCwwLDEsNDIsNDAuMzNhLjg2Ljg2LDAsMSwxLC44LDEuNTJBMTguNzcsMTguNzcsMCwwLDAsMzMsNTUuNjEuODYuODYsMCwwLDEsMzIuMTgsNTYuMzVaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTEuNSw3OC43OWEyMC4xNywyMC4xNywwLDAsMS0xMi4yNy00LjExLjg2Ljg2LDAsMCwxLS4xNy0xLjIxLjg1Ljg1LDAsMCwxLDEuMi0uMTZBMTguNTIsMTguNTIsMCwwLDAsNTEuNSw3Ny4wNywxOC4yMywxOC4yMywwLDAsMCw1NSw3Ni43M2EuODcuODcsMCwwLDEsLjMzLDEuN0EyMC44NywyMC44NywwLDAsMSw1MS41LDc4Ljc5WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTcwLDY1LjQyYS44NC44NCwwLDAsMS0uMjcsMCwuODYuODYsMCwwLDEtLjU0LTEuMDksMTguNzEsMTguNzEsMCwwLDAtOC41NS0yMi4xNy44Ni44NiwwLDEsMSwuODUtMS41LDIwLjQyLDIwLjQyLDAsMCwxLDkuMzMsMjQuMjFBLjg3Ljg3LDAsMCwxLDcwLDY1LjQyWiIvPjwvZz48ZyBpZD0iSE9TVElORyI+PHRleHQgY2xhc3M9ImNscy0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNy45MyAtNC45OCkiPkpTT04gPHRzcGFuIGNsYXNzPSJjbHMtNCIgeD0iMjkuMDYiIHk9IjAiPnQ8L3RzcGFuPjx0c3BhbiB4PSIzMi45NiIgeT0iMCI+byBKU09OPC90c3Bhbj48L3RleHQ+PC9nPjwvc3ZnPg==',
    category: 'transformation',
    version: '2.1.0',
    proxy: ['REQUEST', 'RESPONSE'],
    message: ['MESSAGE_RESPONSE', 'MESSAGE_REQUEST'],
  },
];

export function fakeTestPolicy(modifier?: Partial<Policy> | ((base: Policy) => Policy)): Policy {
  const base: Policy = {
    id: 'test-policy',
    name: 'Policy to test UI',
    icon: 'gio:gift',
    proxy: ['REQUEST', 'RESPONSE'],
    message: ['REQUEST', 'RESPONSE', 'MESSAGE_RESPONSE', 'MESSAGE_REQUEST'],
  };

  if (isFunction(modifier)) {
    return modifier(base);
  }

  return {
    ...base,
    ...modifier,
  };
}

export function fakeAllPolicies(): Policy[] {
  return [
    fakeTestPolicy(),
    fakeTestPolicy({
      id: 'test-policy-empty',
      name: 'Test policy - Witout icon, configuration and documentation',
      icon: undefined,
    }),
    fakeTestPolicy({
      name: 'Test policy - With very long name to test overflow. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      description:
        'Test policy description - With very long name to test overflow. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis sem at nibh elementum imperdiet.',
    }),
    fakeTestPolicy({
      name: 'No license policy',
      deployed: false,
      description: 'No license policy should display a lock icon and a clear CTA.',
    }),
    fakeTestPolicy({
      id: 'transformation-policy',
      name: 'transformation policy',
      category: 'transformation',
      proxy: ['REQUEST'],
    }),
    ...POLICIES_V4_UNREGISTERED_ICON.map(policy => ({
      ...policy,
      // Replace all icons with the policy id. Icons are registred in the IconRegistry before.
      ...(policy.icon ? { icon: `gio-literal:${policy.id}` } : {}),
    })),
  ];
}
