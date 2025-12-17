async function loadOrders() {
    try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error("Gagal ambil riwayat transaksi");
        const orders = await res.json();

        const container = document.getElementById("historyContainer");
        container.innerHTML = "";

        if (orders.length === 0) {
            container.innerHTML = "<p>Tidak ada transaksi.</p>";
            return;
        }

        orders.forEach(order => {
            const div = document.createElement("div");
            div.classList.add("order-item");
            div.innerHTML = `
                <h3>Order ${order.id}</h3>
                <p>Tanggal: ${order.date}</p>
                <p>Total: Rp ${order.total.toLocaleString()}</p>
                <button onclick="showOrderDetail('${order.id}')">Lihat Detail</button>
            `;
            container.appendChild(div);
        });

        window.ordersData = orders;
    } catch (err) {
        console.error(err);
        document.getElementById("historyContainer").innerHTML = "<p>Error memuat riwayat transaksi.</p>";
    }
}

function showOrderDetail(orderId) {
    const order = window.ordersData.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById("orderTitle").textContent = `Order ${order.id}`;
    document.getElementById("orderDate").textContent = `Tanggal: ${order.date}`;
    document.getElementById("orderTotal").textContent = `Total: Rp ${order.total.toLocaleString()}`;

    const itemsList = document.getElementById("orderItems");
    itemsList.innerHTML = order.items.map(item => `
        <li>${item.name} - Rp ${item.price.toLocaleString()} x ${item.qty}</li>
    `).join("");

    const addressEl = document.createElement("p");
    addressEl.textContent = `Alamat: ${order.address || "-"}`;
    itemsList.appendChild(addressEl);

    const modal = document.getElementById("orderModal");
    modal.style.display = "block";
}

window.addEventListener("DOMContentLoaded", () => {
    loadOrders();

    const modal = document.getElementById("orderModal");
    const closeBtn = document.getElementById("closeOrderModal");

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

const nav = document.querySelector("nav");
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const navHeight = nav.offsetHeight;

        window.scrollTo({
            top: targetSection.offsetTop - navHeight,
            behavior: 'smooth'
        });
    });
});