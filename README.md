# Mini Next.js with Pages Router

A minimalistic Next.js-based React framework implementation using the classic **Pages Router** architecture combined with a raw Node.js backend. Designed for extreme lightness and simplicity, this project provides core Next.js functionality with minimal dependencies.

---

## Features

- Uses the Next.js **Pages Router** system with file-based routes.
- Supports **nested routes**.
- Lightweight raw Node.js server implementation.
- Supports **hydration** of React components on the client side (reactivates server-rendered components).
- Minimal dependencies for fast startup and low resource footprint.
- Simple routing without support for **dynamic routes** yet.

---

## Limitations

- No dynamic routes such as `[id].js` or catch-all routes.
- Intended as a lightweight base for experimentation, not a full Next.js replacement.
- **Learning project only**; not intended for production due to current inefficiencies.

---

## Installation

```bash
git clone https://github.com/Its-Abhinav-Jangid/mini-next-js.git
cd mini-next-js
npm install
npm run dev
```

---

## Usage

1. Add your React components as `[route-name]/page.jsx` files in the `pages/` directory.
   Example: `pages/about/page.jsx` maps to `/about`.
2. Each folder corresponds to a route matching the folder name.
3. Nested routes are supported. Example folder structure:

```
pages/
  about/
    page.jsx       → /about
  blog/
    post/
      page.jsx     → /blog/post
```

4. Server uses Node.js to serve pages and hydrate React components on the client.

---

## Future Improvements

- Add **dynamic route support** (`[id].js`, catch-all routes, etc.).
- Expand testing examples for pages and server.
- Improve performance and resource efficiency.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## License

MIT License
