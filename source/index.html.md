---
title: Goer x SenseRobot API Document

language_tabs:
  - javascript

# toc_footers:
#   - <a href='#'>Hello world</a>

includes:
  - errors

search: true

code_clipboard: true

meta:
  - name: Goer x SenseRobot
    content: Documentation for Goer x SenseRobot API
---

# Goer x SenseRobot

### URL

測試機 API Base Url：`https://api.goer.live/senserobot`<br>
正式機 API Base Url：`https://api.heijiajia.com.tw/senserobot`<br>

### 測試機 QR Code

`https://drive.google.com/file/d/1UwWDr_z67pcM4boJwDAjHnhPqAMK0_Vr/view?usp=sharing`

### 參考檔案

[對弈規則對照表](https://docs.google.com/spreadsheets/d/1DJf0i_epSYATxJ6K4ce6gE_tHNUq93iI/edit?usp=sharing&ouid=106936800859393192316&rtpof=true&sd=true)<br>

### 下棋參數

計地方式：數子法<br>
獲勝子數<br>
9 路: 44<br>
13 路: 88<br>
19 路: 185<br>

<aside class="notice">
api 所有的 sgf 請包含 SZ、KM 這兩個 header<br>
</aside>

# 簽名驗證

> 簽名驗證

```javascript
const BINDING_TOKEN = '18bab88e-f748-4c2f-90ef-4101dea365a4';
const SECRET_TOKEN = '897c1608-15a1-4f28-81db-c3cce51eddc6';

function generateSignature(dataString) {
  const keyByte = Buffer.from(SECRET_TOKEN, 'utf8');
  const messageBytes = Buffer.from(dataString, 'utf8');
  const hmac = crypto.createHmac('sha256', keyByte);
  hmac.update(messageBytes);
  const hmacString = hmac.digest('hex');
  const signature = Buffer.from(hmacString.replace(/-/g, '').toLowerCase(), 'utf8').toString('base64');

  return signature;
}
```

```javascript
// 如果是 POST 方法
const url = 'https://api.goer.live/senserobot/ladder/game/move';
const data = {
  sgf: '(;KM[6.5]SZ[19];B[pd];W[dp];B[pp];W[dc];B[de];W[ce];B[cf];W[cd];B[df];W[fc];B[cn])',
  level: 100,
};
// data 內請勿包含 value 為 undefined 的欄位
const dataString = JSON.stringify(data);
const signature = generateSignature(dataString);
// NmUxNzgyZmRmMDFmNzYwZjBkYjBhNTExZTM0NWE2NGZjMDc4OTZkNjYxYjQ5MDZkMWMxNGVjYjE0ZmQwZmFmNw==

const response = await axios({
  method: 'post',
  url,
  data,
  headers: {
    'GOER-PLATFORM': 'SENSEROBOT',
    'GOER-TOKEN': BINDING_TOKEN,
    'GOER-SIGNATURE': signature,
  },
});
```

```javascript
// 如果是 GET 方法
const url = 'https://api.goer.live/senserobot/ladder/game/1';
const dataString = '/ladder/game/1';
const signature = generateSignature(dataString);
// NDliNjZiMzI5ZmU0NDQwMTdhMWJkZWFkOWUyNTIyMzU0YWZiMmI2Y2RkZmI3ZWUzMmFlMzc4N2E0MTk1Y2QwNA==

const response = await axios({
  method: 'get',
  url,
  headers: {
    'GOER-PLATFORM': 'SENSEROBOT',
    'GOER-TOKEN': BINDING_TOKEN,
    'GOER-SIGNATURE': signature,
  },
});
```

```javascript
// 如果是 GET 方法，而且有 query string parameters
const url = 'https://api.goer.live/senserobot/ladder/game?end=120&start=150';
const queryStringParameters = {
  start: 150,
  end: 120,
};
const queryStringParametersStrs = Object.keys(queryStringParameters)
  .sort()
  .reduce((acc, key) => {
    acc.push(`${key}=${queryStringParameters[key]}`);
    return acc;
  }, []);
// 請先針對 queryStringParameters 做字元排序
let dataString = '/ladder/game';
if (queryStringParametersStrs.length > 0) {
  dataString = `${dataString}?${queryStringParametersStrs.join('&')}`;
  // /ladder/game?end=120&start=150
}
const signature = generateSignature(dataString);
// YjAzY2YzOGUzMTMyOWJiNGI3MDZlMzgyZTZjYzUyODk0MWNiMjZhNTVkOGYzYWYyNjA3MDNmZTMyZjY5MWJiZQ==

const response = await axios({
  method: 'get',
  url,
  headers: {
    'GOER-PLATFORM': 'SENSEROBOT',
    'GOER-TOKEN': BINDING_TOKEN,
    'GOER-SIGNATURE': signature,
  },
});
```

透過 Request Payload 與 Secret Token 計算 HMAC-SHA256，可參考右側範例。<br>
<br>
後續發送 Request，請在 headers 代入 `GOER-PLATFORM`、`GOER-TOKEN` 和 `GOER-SIGNATURE`。<br>
`GOER-PLATFORM` 固定代入常數 `SENSEROBOT`。<br>
`GOER-TOKEN` 代入掃碼取得的 Binding Token。<br>
`GOER-SIGNATURE` 代入簽名。<br>

<aside class="notice">
GET 和 POST 產生 dataString 的方法不同，請留意。
</aside>

<aside class="notice">
可搭配下方的「掃碼綁定帳號」api 文檔一起閱讀。
</aside>

# 帳號權限相關

## 掃碼綁定帳號

> Response:

```json
{
  "secretToken": "USER SECRET TOKEN"
}
```

圍棋機器人掃描 QR Code 後，會取得 Binding Token。<br>
以 Binding Token 呼叫此綁定帳號的 API 後，會取得 Secret Token。<br>
請將 Binding Token 和 Secret Token 儲存起來。<br>
Binding Token 請於每次 API 呼叫時，置入 Headers 的 `GOER-TOKEN`。<br>
Secret Token 用來簽署簽名，並將產生的簽名置入 Headers 的 `GOER-SIGNATURE`。<br>

### HTTP Request

`[POST] /user/bind`

### Body Parameters

| Parameter    | Type   | Required | Default | Description          |
| ------------ | ------ | -------- | ------- | -------------------- |
| bindingToken | String | True     |         | 掃碼得到的綁定 token |
| id           | String | False    |         | 裝置 id              |

<aside class="notice">
可搭配上方的「簽名驗證」文檔一起閱讀。
</aside>

# 選單資訊相關

## 天梯對局－取得關卡列表

> Response:

```json
[
  {"level": 1, "boardSize": 9, "isPassed": true},
  {"level": 2, "boardSize": 9, "isPassed": true},
  {"level": 3, "boardSize": 9, "isPassed": true, "label": "G19"}, // 有標註 label 的代表星星關卡
  {"level": 4, "boardSize": 9, "isPassed": true},
  {"level": 5, "boardSize": 9, "isPassed": true},
  {"level": 6, "boardSize": 9, "isPassed": true, "label": "G18"},
  {"level": 7, "boardSize": 9, "isPassed": false}
]
```

取得天梯闖關對局的關卡列表資訊。

### HTTP Request

`[GET] /ladder/game`

### Query String Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| range     | Number | False    |         | 關卡數      |
| start     | Number | False    |         | 開始關卡    |
| end       | Number | False    |         | 關卡數      |

<aside class="notice">
range、start、end 都是可選參數。<br>
假設使用者目前通關至第 100 關，range 傳入 20，則會回傳第 80~120 關的資訊。<br>
start 和 end 則用來控制關卡回傳範圍。start 傳入 100、end 傳入 120，則回傳第 100~120 關的資訊。<br>
</aside>

<aside class="notice">
有標註 label 的代表星星關卡。<br>
</aside>

<aside class="notice">
使用者依序闖關，不允許跳關。<br>
</aside>

## 天梯對局－取得單一關卡資訊

> Response:

```json
{
  "level": 3,
  "boardSize": 9,
  "label": "G19",
  "komi": 5.5,
  "isPassed": true
}
```

取得天梯闖關對局的單一關卡資訊。

### HTTP Request

`[GET] /ladder/game/{level}`

### Path Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| level     | Number | True     |         | 關卡數      |

## 課程下棋闖關－取得課程列表

> Response:

```json
[
  {
    "id": "kidbasic",
    "name": "兒童基礎課"
  },
  {
    "id": "30k-10k-v2",
    "name": "基礎課"
  },
  {
    "id": "intermediate",
    "name": "進階課"
  },
  {
    "id": "advanced",
    "name": "高階課"
  },
  {
    "id": "master",
    "name": "大師課"
  }
]
```

取得使用者已購買的課程列表。只列出正式課程。

### HTTP Request

`[GET] /course`

<aside class="notice">
未購買的課程不列出。<br>
若回傳空 array，表示使用者並未購買任何正式課程。<br>
</aside>

## 課程下棋闖關－取得關卡列表

> Response:

```json
[
  {
    "aiId": 1,
    "name": "Bubu",
    "boarsSize": 9,
    "isPassed": true
  },
  {
    "aiId": 2,
    "name": "Tommy",
    "boarsSize": 9,
    "isPassed": true
  },
  {
    "aiId": 3,
    "name": "Sara",
    "boarsSize": 9,
    "isPassed": false
  }
]
```

取得課程下棋闖關的關卡列表資訊。

### HTTP Request

`[GET] /course/{courseId}/game`

## 課程下棋闖關－取得單一關卡資訊

> Response:

```json
{
  "aiId": 1,
  "name": "Bubu",
  "boardSize": 9,
  "komi": 5.5,
  "isPassed": true
}
```

取得課程下棋闖關的單一關卡資訊。

### HTTP Request

`[GET] /course/{courseId}/game/{aiId}`

### Path Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| courseId  | String | True     |         | 課程 ID     |
| aiId      | Number | True     |         | Ai ID       |

# 下棋相關

## 天梯對局－落子

> Response:

```json
{
  "sgf": "(;KM[7.5]SZ[19];B[pd];W[dp];B[pp];W[dc];B[de])",
  "move": "de"
}
```

天梯闖關對局的落子 API，傳入關卡數後會自動代入相關對弈設定。

### HTTP Request

`[POST] /ladder/game/{level}/move`

### Path Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| level     | Number | True     |         | 關卡數      |

### Body Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| sgf       | String | True     |         | 棋譜 SGF    |

<aside class="notice">
Ai 虛手時，response 的 move 回傳 pass。<br>
Ai 投子時，response 的 move 回傳 resign。<br>
</aside>

## 課程下棋闖關－落子

> Response:

```json
{
  "sgf": "(;KM[7.5]SZ[19];B[pd];W[dp];B[pp];W[dc];B[de])",
  "move": "de"
}
```

課程下棋闖關的落子 API，傳入 aiId 後會自動代入相關對弈設定

### HTTP Request

`[POST] /course/{courseId}/game/{aiId}/move`

### Path Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| courseId  | String | True     |         | 課程 ID     |
| aiId      | Number | True     |         | Ai ID       |

### Body Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| sgf       | String | True     |         | 棋譜 SGF    |

<aside class="notice">
Ai 虛手時，response 的 move 回傳 pass。<br>
Ai 投子時，response 的 move 回傳 resign。<br>
</aside>

## 天梯對局－更新對局記錄

> Response:

```json
{
  "isSuccess": true
}
```

### HTTP Request

`[POST] /ladder/game/{level}/record`

### Path Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| level     | Number | True     |         | 關卡數      |

### Body Parameters

| Parameter | Type   | Required | Default | Description             |
| --------- | ------ | -------- | ------- | ----------------------- |
| sgf       | String | True     |         | 棋譜 SGF                |
| color     | String | True     |         | 使用者顏色(BLACK/WHITE) |
| result    | String | True     |         | 對局結果                |

<aside class="notice">
result的各種表達方式<br>
黑中盤勝: B+R<br>
白中盤勝: W+T<br>
黑超時勝: B+T<br>
白超時勝: W+T<br>
黑5.5目勝: B+5.5<br>
白5.5目勝: W+5.5<br>
和局: Draw<br>
</aside>

## 課程下棋闖關－更新對局記錄

> Response:

```json
{
  "isSuccess": true
}
```

### HTTP Request

`[POST] /course/{courseId}/game/{aiId}/record`

### Path Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| courseId  | String | True     |         | 課程 ID     |
| aiId      | Number | True     |         | Ai ID       |

### Body Parameters

| Parameter | Type   | Required | Default | Description             |
| --------- | ------ | -------- | ------- | ----------------------- |
| sgf       | String | True     |         | 棋譜 SGF                |
| color     | String | True     |         | 使用者顏色(BLACK/WHITE) |
| result    | String | True     |         | 對局結果                |

<aside class="notice">
result的各種表達方式<br>
黑中盤勝: B+R<br>
白中盤勝: W+T<br>
黑超時勝: B+T<br>
白超時勝: W+T<br>
黑5.5目勝: B+5.5<br>
白5.5目勝: W+5.5<br>
和局： Draw<br>
</aside>

## 算輸贏/形勢分析

> Response:

> influence 為字串，代表棋盤上每一個點的狀態。<br>
> 9 路棋盤，influence 長度為 81。<br>
> 13 路棋盤，influence 長度為 169。<br>
> 19 路棋盤，influence 長度為 361。<br>
> X 代表黑子<br>
> x 代表黑棋的領地<br>
> b 代表白死子<br>
> O 代表白子<br>
> o 代表白棋的領地<br>
> w 代表白死子<br>
> . 代表不屬於任何一方的領地<br>

```json
{
  "isOver": false,
  "result": "B+25.5",
  "influence": ["xxxwwXOOOxxxxwXXOoxxxxXXOoOxxxxXOOOoxxxxxXOOOxXxXXXXOoxxXxXXOOOxxxXxXXOOxxxXxXOOO"],
  "blackScore": 56, // 黑子數（黑領地+黑子數+白死子）
  "whiteScore": 25 // 白子數（白領地+白子數+黑死子）
}
```

算輸贏與形勢分析共用的 API。<br>
作為形勢分析用途時，請忽略 response 中的 isOver 與 result 參數。<br>

### HTTP Request

`[POST] /game/judge`

### Body Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| sgf       | String | True     |         | 棋譜 SGF    |

<aside class="notice">
result的各種表達方式<br>
黑中盤勝: B+R<br>
白中盤勝: W+T<br>
黑超時勝: B+T<br>
白超時勝: W+T<br>
黑5.5目勝: B+5.5<br>
白5.5目勝: W+5.5<br>
和局： Draw<br>
</aside>
