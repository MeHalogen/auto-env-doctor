# auto-env-doctor

![Terminal Demo](./demo.gif)

> **Environment Variable Auditing Tool:** A zero-dependency static analysis tool that scans your codebase for `process.env` references and automatically synchronizes them with your `.env.example` file.

---

## ⚡ Features
- **Zero Runtime Dependencies**: Lightweight and fast.
- **Recursive Source Code Scanning**: Detects environment variables across TypeScript, JavaScript, JSX, and TSX files.
- **Auto-Sync**: Automatically appends any missing environment variables directly to `.env.example` as empty placeholders.
- **Integrity Alerts**: Exit with code 1 in CI if the workspace has unregistered environment variables.

---

## 📦 Installation

```bash
npm install auto-env-doctor
```

---

## 🚀 Usage

### 1. CLI Usage
Audit environment variables in the current workspace:

```bash
npx auto-env-doctor

# Synchronize missing variables to .env.example
npx auto-env-doctor --sync

# Scan a different directory or specify example file
npx auto-env-doctor --dir ./src --example ./config/.env.example
```

### 2. Programmatic API

```javascript
import { doctorEnv } from 'auto-env-doctor';

const result = await doctorEnv({
  dir: process.cwd(),
  sync: true // automatically append missing variables to .env.example
});

console.log("Referenced:", result.referenced);
console.log("Missing from .env.example:", result.missing);
```

---

## 📄 License
MIT License.
