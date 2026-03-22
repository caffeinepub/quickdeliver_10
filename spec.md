# Specification

## Summary
**Goal:** Build an online shopping and delivery app with authenticated ordering, a product storefront, cart/checkout, and order tracking.

**Planned changes:**
- Add Internet Identity sign-in/out and an authenticated session; require sign-in to place orders.
- Implement a backend product catalog with default products (id, name, description, price, category, optional image URL, availability) and query methods to list products and fetch by id.
- Build storefront pages to browse products, search by name, filter by category, and view product details.
- Implement a client-side cart with add/remove/update quantity, session persistence, and order summary (subtotal, item count).
- Implement backend order creation and storage tied to the authenticated user principal; store line-item snapshots, delivery address, phone, timestamp, and status in stable storage.
- Build checkout UI with address/phone validation, order placement, confirmation screen, cart clearing on success, and error handling on failure.
- Add delivery tracking statuses (Placed, Preparing, Out for delivery, Delivered, Cancelled) with order list and order detail timeline UI; add backend methods to fetch user orders and fetch a single order by id.
- Add backend admin-only status update capability restricted to a configured list of principals.
- Add core navigation and routes: Storefront, Cart, Checkout, My Orders, Order Detail, with English empty/error/unauthorized states.
- Apply a cohesive modern grocery/retail delivery visual theme across the app.
- Add and reference static generated assets (logo in header; hero illustration on storefront) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can sign in, browse and search products, add items to a cart, checkout with delivery details, place orders, and view order history with delivery-status tracking; admins can simulate delivery progress by updating order statuses.
