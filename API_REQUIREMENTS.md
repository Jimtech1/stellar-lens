# API Requirements

Base URL: `/` (e.g. http://localhost:3000)

## 1. Authentication (`/auth`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/auth/wallet/challenge?publicKey=...` | Get a challenge nonce. |
| POST | `/auth/wallet/login` | Login with signed challenge. |
| POST | `/auth/refresh` | Refresh access token. |
| POST | `/auth/logout` | Logout (invalidate session). |

## 2. User Settings (`/user`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/user/settings` | Get user preferences. |
| POST | `/user/settings` | Update user preferences. |

## 3. Wallet (`/wallet`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/wallet/list` | List linked wallets. |
| POST | `/wallet/link` | Link a new wallet. |
| POST | `/wallet/watch` | Add a watch-only wallet. |
| POST | `/wallet/withdraw` | Build withdrawal transaction XDR. |
| DELETE | `/wallet/:address` | Remove a wallet by address. |

## 4. Portfolio (`/portfolio`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/portfolio` | Full portfolio object (legacy). |
| GET | `/portfolio/summary` | Summary stats (total value, etc). |
| GET | `/portfolio/assets` | Flattened list of assets. |
| GET | `/portfolio/positions` | DeFi positions list. |
| GET | `/portfolio/history?period=1D` | Portfolio history (supports 1D, 1W, etc). |
| GET | `/portfolio/pnl` | Profit and Loss analysis. |
| GET | `/oracle/prices?symbols=...` | Live price feeds (Oracle). |

## 5. Indexer (`/transactions`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | Transaction history list. |
| GET | `/transactions/:txHash` | Transaction details. |

## 6. DeFi (`/defi`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/defi/yields` | Yield opportunities. |
| GET | `/defi/protocols` | List protocols status. |
| GET | `/defi/bridge/quote` | Get bridge quote. |
| GET | `/defi/swap/quote` | Get swap quote. |
| POST | `/defi/invest` | Build invest transaction XDR. |
| POST | `/defi/swap/build-tx` | Build swap transaction XDR. |
| POST | `/defi/bridge/build-tx` | Build bridge transaction XDR. |

## 7. RPC (`/rpc`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/rpc/broadcast` | Broadcast signed transaction. |
| GET | `/rpc/gas-price` | Get gas prices.
