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

### 參考檔案

[對弈規則對照表](https://docs.google.com/spreadsheets/d/1DJf0i_epSYATxJ6K4ce6gE_tHNUq93iI/edit?usp=sharing&ouid=106936800859393192316&rtpof=true&sd=true)<br>

### 下棋參數

計地方式：數子法<br>
獲勝子數<br>
9 路: 44<br>
13 路: 88<br>
19 路: 185<br>

# 簽名驗證

> 簽名驗證

```javascript
const SECRET_TOKEN = 'USER SECRET TOKEN';

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
const data = {a: '123', b: '456'};
const dataString = JSON.stringify(data);
const signature = generateSignature(dataString);
const response = await axios({
  method: 'post',
  url,
  data,
  headers: {
    'GOER-PLATFORM': 'SENSEROBOT',
    'GOER-SIGNATURE': signature,
  },
});
```

```javascript
// 如果是 GET 方法
const dataString = 'a=123&b=456';
const signature = generateSignature(dataString);
const response = await axios({
  method: 'get',
  url,
  headers: {
    'GOER-PLATFORM': 'SENSEROBOT',
    'GOER-SIGNATURE': signature,
  },
});
```

透過 Request Payload 與 Secret Token 計算 HMAC-SHA256，可參考右側範例。<br>
<br>
後續發送 Request，請在 headers 代入 `GOER-PLATFORM` 和 `GOER-SIGNATURE`。<br>
`GOER-PLATFORM` 固定代入常數 `SENSEROBOT`。<br>
`GOER-SIGNATURE` 代入簽名。<br>

<aside class="notice">
GET 和 POST 產生 dataString 的方法不同，請留意。
</aside>

# 帳號權限相關

## 掃碼綁定帳號

> Response:

```json
{
  "secretToken": "USER SECRET TOKEN"
}
```

掃碼綁定帳號，並取得使用者秘密金鑰，用來後續簽名

### HTTP Request

`[POST] /user/bind`

### Body Parameters

| Parameter    | Type   | Required | Default | Description          |
| ------------ | ------ | -------- | ------- | -------------------- |
| bindingToken | String | True     |         | 掃碼得到的綁定 token |

<aside class="notice">
綁定帳號後，response 會回傳 secretToken。<br>後續發送 API 請用 secretToken 和 payload 計算出簽名，<br>
並將簽名 signature 夾帶於所有 request 之中。<br>
</aside>

# 選單資訊相關

## 天梯對局－取得關卡列表

> Response:

```json
[
  {"level": 1, "boardSize": 9},
  {"level": 2, "boardSize": 9},
  {"level": 3, "boardSize": 9, "label": "G19"},
  {"level": 4, "boardSize": 9},
  {"level": 5, "boardSize": 9},
  {"level": 6, "boardSize": 9, "label": "G18"},
  {"level": 7, "boardSize": 9}
]
```

取得天梯闖關對局的關卡列表資訊。

### HTTP Request

`[GET] /ladder/game`

## 天梯對局－取得單一關卡資訊

> Response:

```json
{
  "level": 3,
  "boardSize": 9,
  "label": "G19"
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

## 課程下棋闖關－取得關卡列表

> Response:

```json
[
  {
    "aiId": "1",
    "name": "Bubu",
    "boarsSize": 9
  },
  {
    "aiId": "2",
    "name": "Tommy",
    "boarsSize": 9
  },
  {
    "aiId": "3",
    "name": "Sara",
    "boarsSize": 9
  }
]
```

取得課程下棋闖關的關卡列表資訊。

### HTTP Request

`[GET] /course/game`

## 課程下棋闖關－取得單一關卡資訊

> Response:

```json
{
  "aiId": 1,
  "name": "Bubu",
  "boardSize": 9
}
```

取得課程下棋闖關的單一關卡資訊。

### HTTP Request

`[GET] /course/game/{aiId}`

### Path Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| aiId      | String | True     |         | Ai ID       |

# 下棋相關

## 天梯對局－落子

> Response:

```json
{
  "sgf": "(;KM[6.5]SZ[19];B[pd];W[dp];B[pp];W[dc];B[de])",
  "move": "de",
  "isWin": null
}
```

天梯闖關對局的落子 API，傳入關卡數後會自動代入相關對弈設定

### HTTP Request

`[POST] /ladder/game/move`

### Body Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| sgf       | String | True     |         | 棋譜 SGF    |
| level     | Number | True     |         | 關卡數      |

## 課程下棋闖關－落子

> Response:

```json
{
  "sgf": "(;KM[6.5]SZ[19];B[pd];W[dp];B[pp];W[dc];B[de])",
  "move": "de",
  "isWin": null
}
```

課程下棋闖關的落子 API，傳入 aiId 後會自動代入相關對弈設定

### HTTP Request

`[POST] /course/game/move`

### Body Parameters

| Parameter | Type   | Required | Default | Description |
| --------- | ------ | -------- | ------- | ----------- |
| sgf       | String | True     |         | 棋譜 SGF    |
| aiId      | Number | True     |         | Ai ID       |

## 天梯對局－更新對局記錄

> Response:

```json
{
  "isSuccess": true
}
```

### HTTP Request

`[POST] /ladder/game/record`

### Body Parameters

| Parameter | Type   | Required | Default | Description             |
| --------- | ------ | -------- | ------- | ----------------------- |
| sgf       | String | True     |         | 棋譜 SGF                |
| level     | Number | True     |         | 天梯關卡數              |
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

`[POST] /course/game/record`

### Body Parameters

| Parameter | Type   | Required | Default | Description             |
| --------- | ------ | -------- | ------- | ----------------------- |
| sgf       | String | True     |         | 棋譜 SGF                |
| aiId      | Number | True     |         | Ai ID                   |
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
> X 代表黑子
> x 代表黑棋的領地
> b 代表白死子
> O 代表白子
> o 代表白棋的領地
> w 代表白死子

```json
{
  "isOver": false,
  "result": "B+5.5",
  "influence": ["xxxwwXOOOxxxxwXXOoxxxxXXOoOxxxxXOOOoxxxxxXOOOxXxXXXXOoxxXxXXOOOxxxXxXXOOxxxXxXOOO"]
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
