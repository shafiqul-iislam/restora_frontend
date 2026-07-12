const BASE_URL = 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('restora_token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// ─── Auth ───────────────────────────────────────────────
export async function loginUser(credentials) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
}

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function logoutUser() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getProfile() {
  const res = await fetch(`${BASE_URL}/me`, { headers: authHeaders() });
  return handleResponse(res);
}

// ─── Restaurants ─────────────────────────────────────────
export async function getRestaurants(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/restaurants${query ? '?' + query : ''}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getRestaurant(id) {
  const res = await fetch(`${BASE_URL}/restaurants/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getFeaturedRestaurants() {
  const res = await fetch(`${BASE_URL}/restaurants?featured=1`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ─── Menu ─────────────────────────────────────────────────
export async function getMenuItems(restaurantId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(
    `${BASE_URL}/restaurants/${restaurantId}/menu-items${query ? '?' + query : ''}`,
    { headers: authHeaders() }
  );
  return handleResponse(res);
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`, { headers: authHeaders() });
  return handleResponse(res);
}

// ─── Orders ───────────────────────────────────────────────
export async function placeOrder(orderData) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(orderData),
  });
  return handleResponse(res);
}

export async function getOrders() {
  const res = await fetch(`${BASE_URL}/orders`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function getOrder(id) {
  const res = await fetch(`${BASE_URL}/orders/${id}`, { headers: authHeaders() });
  return handleResponse(res);
}

// ─── Admin: Users ──────────────────────────────────────────
export async function adminGetUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/admin/users${query ? '?' + query : ''}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function adminGetUser(id) {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function adminCreateUser(data) {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function adminUpdateUser(id, data) {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// -- Admin Restaurants --
export async function getAdminRestaurants(page = 1, search = '', status = '') {
  const params = new URLSearchParams({ page });
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  const res = await fetch(`${BASE_URL}/admin/restaurants?${params.toString()}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function getAdminRestaurant(id) {
  const res = await fetch(`${BASE_URL}/admin/restaurants/${id}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function adminCreateRestaurant(data) {
  const res = await fetch(`${BASE_URL}/admin/restaurants`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function adminUpdateRestaurant(id, data) {
  const res = await fetch(`${BASE_URL}/admin/restaurants/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function adminDeleteRestaurant(id) {
  const res = await fetch(`${BASE_URL}/admin/restaurants/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// -- Admin Orders --
export async function getAdminOrders(page = 1, search = '', status = '') {
  const params = new URLSearchParams({ page });
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  const res = await fetch(`${BASE_URL}/admin/orders?${params.toString()}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function adminUpdateOrderStatus(id, status) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function adminDeleteOrder(id) {
  const res = await fetch(`${BASE_URL}/admin/orders/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ─── Admin Routes ──────────────────────────────────────────
export async function getAdminDashboard() {
  const res = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function adminDeleteUser(id) {
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ─── Owner Routes ──────────────────────────────────────────
export async function getOwnerDashboard() {
  const res = await fetch(`${BASE_URL}/owner/dashboard`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function getOwnerOrders(page = 1, search = '', status = '') {
  const params = new URLSearchParams({ page });
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  const res = await fetch(`${BASE_URL}/owner/orders?${params.toString()}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function ownerUpdateOrderStatus(id, status) {
  const res = await fetch(`${BASE_URL}/owner/orders/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function getOwnerFoods(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/owner/foods${query ? '?' + query : ''}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function getOwnerFood(id) {
  const res = await fetch(`${BASE_URL}/owner/foods/${id}`, { headers: authHeaders() });
  return handleResponse(res);
}

export async function createOwnerFood(data) {
  const res = await fetch(`${BASE_URL}/owner/foods`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateOwnerFood(id, data) {
  const res = await fetch(`${BASE_URL}/owner/foods/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteOwnerFood(id) {
  const res = await fetch(`${BASE_URL}/owner/foods/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getOwnerCustomers(page = 1, search = '') {
  const params = new URLSearchParams({ page });
  if (search) params.append('search', search);
  const res = await fetch(`${BASE_URL}/owner/customers?${params.toString()}`, { headers: authHeaders() });
  return handleResponse(res);
}
