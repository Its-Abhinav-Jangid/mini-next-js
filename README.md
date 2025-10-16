# Mini Next.js with Pages Router

A minimalistic Next.js-based React framework implementation using the classic **Pages Router** architecture combined with a raw Node.js backend. Designed for extreme lightness and simplicity, this project aims to provide core Next.js functionality with minimal dependencies.

---

## Features

- Uses the Next.js **Pages Router** system with static file-based routes.
- Lightweight raw Node.js server implementation.
- Supports **hydration** of React components on the client side.
- Minimal dependencies for fast startup and low resource footprint.
- Simple routing without support for **dynamic** or **nested routes** yet.
- No support for React hooks or advanced React features at this time.

---

## Limitations

- No dynamic routes such as `[id].js` or catch-all routes.
- No nested folder-based routing; routes must live directly under `pages/`.
- Hydration is supported, but React hooks (e.g., `useState`, `useEffect`) are not yet implemented.
- Intended as a lightweight base for experimentation, not a full Next.js replacement.
- **This is a learning project only and is not intended for production use as it is currently inefficient.**

---

## Installation

```bash
git clone https://github.com/yourusername/mini-nextjs.git
cd mini-nextjs
npm install
npm run dev
```

---

## Usage

1. Add your React components as `.jsx` files in the `pages/` directory.
2. Each file corresponds to a route matching the filename.
3. Server uses Node.js to serve pages and hydrate React components on the client.
4. Use standard React components without hooks for now.

---

## Future Improvements

- Add dynamic route support.
- Implement nested routing capabilities.
- Enable React hooks and more advanced React features.
- Optimize hydration and server rendering performance.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## License

MIT License

---
