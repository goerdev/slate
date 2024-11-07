# Errors

| Error Code | Meaning                                        |
| ---------- | ---------------------------------------------- |
| 400        | Bad Request -- payload 有誤                    |
| 401        | Unauthorized -- request 未夾帶簽名             |
| 403        | Forbidden -- 簽名有誤、無權限操作              |
| 429        | Too Many Requests -- requests 同時併發數量過多 |
| 500        | Internal Server Error -- 系統錯誤              |
| 503        | Service Unavailable -- 系統停機                |
