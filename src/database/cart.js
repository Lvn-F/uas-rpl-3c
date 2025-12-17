async function getCart() {
    try {
        const res = await fetch('/api/cart');
        if (!res.ok) throw new Error("Gagal ambil cart dari server");
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function saveCart(cart) {
    try {
        const res = await fetch('/api/saveCart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart)
        });
        if (!res.ok) throw new Error("Gagal simpan cart ke server");
        console.log("Cart tersimpan di server");
    } catch (err) {
        console.error(err);
    }
}

async function renderCart() {
    const cart = await getCart();
    const container = document.getElementById("cartContainer");
    const totalEl = document.getElementById("cartTotal");

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Keranjang kosong.</p>";
        totalEl.textContent = "Rp 0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <div class="item-info">
                <img src="${item.img}" alt="${item.name}" width="80">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Rp ${item.price.toLocaleString()}</p>
                    <div class="quantity">

                        <div class="qty-controls">
                            <button onclick="decreaseQty(${index})">−</button>
                            ${item.qty}
                            <button onclick="increaseQty(${index})">+</button>
                        </div>
                    </div>
                </div>
            </div>
            <button onclick="removeFromCart(${index})" class="remove-btn">Hapus</button>
        `;
        container.appendChild(div);
        total += item.price * item.qty;
    });

    totalEl.textContent = "Rp " + total.toLocaleString();
}

async function increaseQty(index) {
    const cart = await getCart();
    cart[index].qty += 1;
    await saveCart(cart);
    renderCart();
}


async function decreaseQty(index) {
    const cart = await getCart();
    if (cart[index].qty > 1) {
        cart[index].qty -= 1;
    } else {
        cart.splice(index, 1);
    }
    await saveCart(cart);
    renderCart();
}

async function addToCart(item) {
    const cart = await getCart();
    const existing = cart.find(p => p.name === item.name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    await saveCart(cart);
    alert("Item ditambahkan ke keranjang!");
}

async function removeFromCart(index) {
    const cart = await getCart();
    cart.splice(index, 1);
    await saveCart(cart);
    renderCart();
}

document.getElementById("checkoutBtn").addEventListener("click", async () => {
    const cart = await getCart();
    if (cart.length === 0) {
        alert("Keranjang kosong!");
        return;
    }

    const address = document.getElementById("addressInput").value.trim();
    if (!address) {
        alert("Alamat pengiriman wajib diisi!");
        return;
    }

    const confirmCheckout = confirm("Apakah Anda yakin ingin checkout?");
    if (!confirmCheckout) return;

let orders = [];
try {
    const res = await fetch('/api/orders');
    if (res.ok) orders = await res.json();
} catch (err) {
    console.error("Gagal ambil orders:", err);
}


const nextNumber = orders.length + 1;
const orderId = "#tr" + String(nextNumber).padStart(4, "0");

const newOrder = {
    id: orderId,
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    date: new Date().toLocaleString(),
    address: address
};
orders.push(newOrder);

try {
    await fetch('/api/saveOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orders)
    });
    alert("Checkout berhasil! Order tersimpan.");
} catch (err) {
    console.error("Gagal simpan order:", err);
}
    await saveCart([]);
    renderCart();
});

window.addEventListener("DOMContentLoaded", () => {
    renderCart();
});