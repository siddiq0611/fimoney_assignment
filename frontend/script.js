const API_BASE = 'http://localhost:8080';
        let authToken = '';

        function showStatus(message, type = 'success', containerId = 'authStatus') {
            const container = document.getElementById(containerId);
            container.innerHTML = `<div class="status ${type}">${message}</div>`;
            setTimeout(() => container.innerHTML = '', 5000);
        }

        async function register() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showStatus('Please enter both username and password', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/register`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({username, password})
                });

                if (response.ok) {
                    showStatus('Registration successful! You can now login.', 'success');
                } else if (response.status === 409) {
                    showStatus('User already exists. Try logging in instead.', 'error');
                } else {
                    showStatus('Registration failed', 'error');
                }
            } catch (error) {
                showStatus('Connection error. Make sure the server is running.', 'error');
            }
        }

        async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showStatus('Please enter both username and password', 'error');
                return;
            }

            try {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);

                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    authToken = data.access_token;
                    showStatus('Login successful!', 'success');
                    document.getElementById('productSection').classList.remove('hidden');
                    loadProducts();
                } else {
                    showStatus('Invalid credentials', 'error');
                }
            } catch (error) {
                showStatus('Connection error. Make sure the server is running.', 'error');
            }
        }

        async function addProduct() {
            if (!authToken) {
                showStatus('Please login first', 'error', 'productStatus');
                return;
            }

            const product = {
                name: document.getElementById('productName').value,
                type: document.getElementById('productType').value,
                sku: document.getElementById('productSku').value,
                image_url: document.getElementById('productImage').value || 'https://via.placeholder.com/150',
                description: document.getElementById('productDesc').value,
                quantity: parseInt(document.getElementById('productQty').value) || 0,
                price: parseFloat(document.getElementById('productPrice').value) || 0
            };

            if (!product.name || !product.type || !product.sku) {
                showStatus('Please fill in all required fields (Name, Type, SKU)', 'error', 'productStatus');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(product)
                });

                if (response.ok) {
                    showStatus('Product added successfully!', 'success', 'productStatus');
                    document.getElementById('addProductForm').querySelectorAll('input, textarea').forEach(input => input.value = '');
                    loadProducts();
                } else {
                    showStatus('Failed to add product', 'error', 'productStatus');
                }
            } catch (error) {
                showStatus('Connection error', 'error', 'productStatus');
            }
        }

        async function loadProducts() {
            if (!authToken) return;

            try {
                const response = await fetch(`${API_BASE}/products`, {
                    headers: {'Authorization': `Bearer ${authToken}`}
                });

                if (response.ok) {
                    const products = await response.json();
                    displayProducts(products);
                    updateStats(products);
                } else {
                    showStatus('Failed to load products', 'error', 'productStatus');
                }
            } catch (error) {
                showStatus('Connection error', 'error', 'productStatus');
            }
        }

        function displayProducts(products) {
            const container = document.getElementById('productsContainer');
            
            if (products.length === 0) {
                container.innerHTML = '<div style="text-align: center; color: #666; font-size: 1.2rem; padding: 40px;">No products found. Add your first product above! 📦</div>';
                return;
            }

            container.innerHTML = products.map(product => `
                <div class="product-card">
                    <div class="product-name">${product.name}</div>
                    <div class="product-details">
                        <strong>Type:</strong> ${product.type}<br>
                        <strong>SKU:</strong> ${product.sku}<br>
                        <strong>Price:</strong> $${product.price}<br>
                        <strong>Quantity:</strong> <span style="color: ${product.quantity < 5 ? '#e74c3c' : '#27ae60'}; font-weight: bold;">${product.quantity}</span><br>
                        <strong>Description:</strong> ${product.description || 'No description'}
                    </div>
                    <div class="quantity-update">
                        <input type="number" id="qty-${product.id}" value="${product.quantity}" min="0">
                        <button onclick="updateQuantity('${product.id}')">Update Qty</button>
                    </div>
                </div>
            `).join('');
        }

        async function updateQuantity(productId) {
            const newQuantity = parseInt(document.getElementById(`qty-${productId}`).value);
            
            if (isNaN(newQuantity) || newQuantity < 0) {
                showStatus('Please enter a valid quantity', 'error', 'productStatus');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/products/${productId}/quantity`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({quantity: newQuantity})
                });

                if (response.ok) {
                    showStatus('Quantity updated successfully!', 'success', 'productStatus');
                    loadProducts();
                } else {
                    showStatus('Failed to update quantity', 'error', 'productStatus');
                }
            } catch (error) {
                showStatus('Connection error', 'error', 'productStatus');
            }
        }

        function updateStats(products) {
            document.getElementById('totalProducts').textContent = products.length;
            
            const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
            
            const lowStock = products.filter(p => p.quantity < 5).length;
            document.getElementById('lowStock').textContent = lowStock;
        }

        document.addEventListener('DOMContentLoaded', function() {
            console.log('Inventory Management Frontend Loaded');
            console.log('Make sure your FastAPI server is running on http://localhost:8080');
        });