# API Testing with Playwright

A TypeScript-based API testing framework using [Playwright](https://playwright.dev/) for testing REST APIs.

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Configure environment variables

This project uses a `.env` file to store sensitive credentials that are **never committed to source control**.

Create a `.env` file in the project root by copying the example below:

```dotenv
DL_USERNAME=your_username
DL_PASSWORD=your_password
```

> ⚠️ **Important:** The `.env` file must **not** be committed to the repository. Make sure `.env` is listed in your `.gitignore`.

---

## 🧪 Running Tests

```bash
npm test
```

To run a specific test file:

```bash
npx playwright test tests/delivery/auth.spec.ts
```

To open the HTML report after a run:

```bash
npx playwright show-report
```

---

## 🔧 Other Scripts

| Script | Description |
|---|---|
| `npm test` | Run all Playwright tests |
| `npm run lint` | Lint test files with ESLint |
| `npm run prettier:check` | Check formatting with Prettier |
| `npm run prettier:format` | Auto-format test files with Prettier |

---

## 🔒 CI / Secrets Configuration

When running tests in a CI environment, **do not** store credentials in a `.env` file. Instead, configure the environment variables as **CI secrets/environment variables**.

### GitHub Actions

The workflow file is already provided at `.github/workflows/playwright.yml`.

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret** and add each variable:
   - `DL_USERNAME`
   - `DL_PASSWORD`
3. The workflow will automatically pick them up:

```yaml
- name: Run tests
  env:
    DL_USERNAME: ${{ secrets.DL_USERNAME }}
    DL_PASSWORD: ${{ secrets.DL_PASSWORD }}
  run: npm test
```

---

## 📁 Project Structure

```
.
├── dto/                  # Data Transfer Objects (request/response models)
├── helpers/              # Reusable API helper functions
├── tests/
│   ├── delivery/         # Authenticated API tests
│   └── example-no-auth/  # Unauthenticated / simple API tests
├── .env                  # Local environment variables (⚠️ not committed)
├── playwright.config.ts  # Playwright configuration
└── package.json
```

## Checklist Homework 10

```
| # | Scenario | Test Data |
|---|---|---|
| | Get order SUCCESS |	orderId = { 1 .. 10 } |
| | Get order FAILURE incorrect ID|	orderId = 99|
| | Get order FAILURE negative ID|	orderId = -1 |
| | Get order FAILURE empty ID|	orderId = ""|
| | Get order FAILURE non-numeric ID|	orderId = "n" |
| | Put - order with negative id |	orderId = -1|
| | Put - order with non-numeric id |	orderId = n|
| | Put - order with incorrect id |	orderId = 99 |
| | Put - order with correct id |	orderId = { 1 .. 10} |
| | Put - Unauthorized user API-key is empty |	 |
| | Put - Unauthorized user incorrect API-key |	 12345 |
| | Put - Request body with typos |	customer name with number instead of string |
| | Put - Request body is empty |	|
| | Delete - order with negative id |	orderId = -1 |
| | Delete - order with non-numeric id |	orderId = n |
| | Delete - order with incorrect id |	orderId = 99 |
| | Delete - order with correct id |	orderId = { 1 .. 10 } |
| | Delete - Unauthorized user API-key is empty |	 |
| | Delete - Unauthorized user incorrect API-key |	 12345 |
| | Delete - Delete recently deleted order  |orderId = { 1 ..10} |
| | POST - Create new order  | body is correct |
| | POST - Create new order with lost field | status is lost |
| | POST - Create new order with incorrect field | courier ID is incorrect|
| | Get order info and current time -Positive  | orderId = { 1 .. 10 } |
| | Get order info and current time -Negative  | orderId = -1 |
| | Get order info and current time -Invalid header  | typo in the header|
| | Get order payment status -Positive  | orderId = { 1 .. 10 } |
| | Get order payment status -Negative  | orderId = 91 |
| | Get order payment status -Invalid header  | typo in the header|
| | Get all orders - Positive  |  |
| | Get all orders - 429 error  | |
| | Get API key with username and password - Positive  |  |
| | get API key with correct user invalid creds  | |