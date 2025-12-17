let products = [];
let products2 = [];
let products3 = [];
let products4 = [];
async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        products = await res.json();
        console.log('Loaded products:', products.length);
        if (document.getElementById('productList')) displayItems();
    } catch (err) { console.error('Failed to load products:', err); }

    try {
        const res2 = await fetch('/api/products2');
        products2 = await res2.json();
        console.log('Loaded products2:', products2.length);
        if (document.getElementById('productList2')) displayItems();
    } catch (err) { console.error('Failed to load products2:', err); }

    try {
        const res3 = await fetch('/api/products3');
        products3 = await res3.json();
        console.log('Loaded products3:', products3.length);
        if (document.getElementById('productList3')) displayItems();
    } catch (err) { console.error('Failed to load products3:', err); }

    try {
        const res4 = await fetch('/api/products4');
        products4 = await res4.json();
        console.log('Loaded products4:', products4.length);
        if (document.getElementById('productList4')) displayItems();
    } catch (err) { console.error('Failed to load products4:', err); }
}
loadProducts();
function displayItems() {
    const createItemElement = (item) => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
            <img src="${item.img}">
            <h3>${item.name}</h3>
            <p>Rp ${item.price.toLocaleString()}</p>
        `;
        div.addEventListener("click", () => showProductDetail(item));
        return div;
    };

    const list1 = document.getElementById("productList");
    if (list1) {
        list1.innerHTML = "";
        products.forEach(item => list1.appendChild(createItemElement(item)));
    }

    const list2 = document.getElementById("productList2");
    if (list2) {
        list2.innerHTML = "";
        products2.forEach(item => list2.appendChild(createItemElement(item)));
    }

    const list3 = document.getElementById("productList3");
    if (list3) {
        list3.innerHTML = "";
        products3.forEach(item => list3.appendChild(createItemElement(item)));
    }

    const list4 = document.getElementById("productList4");
    if (list4) {
        list4.innerHTML = "";
        products4.forEach(item => list4.appendChild(createItemElement(item)));
    }
}
function getInputs() {
    const name = document.getElementById("nameInput").value.trim();
    const priceRaw = document.getElementById("priceInput").value;
    const img = document.getElementById("imgInput").value.trim();
    const desc = document.getElementById("descInput").value.trim();
    const price = Number(priceRaw);

    if (!name || !img || !priceRaw) {
        alert("Fill all fields!");
        throw new Error('Validation: empty fields');
    }
    if (!Number.isFinite(price) || price <= 0) {
        alert("Price must be a positive number");
        throw new Error('Validation: invalid price');
    }
    return { name, price, img, desc };
}
async function addItem(target) {
    try {
        const newItem = getInputs();
        console.log('Adding to target', target, newItem);

        switch (target) {
            case 1: products.push(newItem); await saveProducts(1, products); break;
            case 2: products2.push(newItem); await saveProducts(2, products2); break;
            case 3: products3.push(newItem); await saveProducts(3, products3); break;
            case 4: products4.push(newItem); await saveProducts(4, products4); break;
            default: alert('Invalid category'); return;
        }
        alert("Item added! Reloading...");
        await loadProducts();
    } catch (err) {
        console.error('addItem error:', err);
    }
}
async function removeItem(target) {
    const nameToRemove = document.getElementById("removeInput").value.trim();
    if (!nameToRemove) return alert("Enter product name!");

    console.log('Removing from target', target, nameToRemove);

    switch (target) {
        case 1:
            products = products.filter(p => p.name.toLowerCase() !== nameToRemove.toLowerCase());
            await saveProducts(1, products);
            break;
        case 2:
            products2 = products2.filter(p => p.name.toLowerCase() !== nameToRemove.toLowerCase());
            await saveProducts(2, products2);
            break;
        case 3:
            products3 = products3.filter(p => p.name.toLowerCase() !== nameToRemove.toLowerCase());
            await saveProducts(3, products3);
            break;
        case 4:
            products4 = products4.filter(p => p.name.toLowerCase() !== nameToRemove.toLowerCase());
            await saveProducts(4, products4);
            break;
        default:
            alert('Invalid category'); return;
    }

    alert("Item removed! Reloading...");
    await loadProducts();
}
async function saveProducts(target, data) {
    try {
        const res = await fetch(`/api/save${target}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Save failed (${res.status}): ${txt}`);
        }
        console.log(`Saved target ${target} count=${data.length}`);
    } catch (err) {
        console.error('Failed to save:', err);
        alert('Failed to save. See console for details.');
    }
}
function showProductDetail(item) {
    const modal = document.getElementById("productModal");
    document.getElementById("modalImg").src = item.img;
    document.getElementById("modalName").textContent = item.name;
    document.getElementById("modalPrice").textContent = "Rp " + item.price.toLocaleString();
    document.getElementById("modalDesc").textContent = item.desc && item.desc.trim() !== "" 
        ? item.desc 
        : "Tidak ada deskripsi.";
    modal.style.display = "block";

    const addBtn = document.getElementById("addToCartBtn");
    addBtn.onclick = () => {
        addToCart(item);
        modal.style.display = "none";
    };
}
window.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.getElementById("closeModal");
    const modal = document.getElementById("productModal");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            searchProducts(searchInput.value.trim());
        });
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                searchProducts(searchInput.value.trim());
            }
        });
    }

});

function searchProducts(query) {
    query = query.toLowerCase();
    const allProducts = [...products, ...products2, ...products3, ...products4];

    const results = allProducts.filter(p =>
        p.name.toLowerCase().includes(query)
    );

    const container = document.getElementById("productList");
    const container2 = document.getElementById("productList2");
    const container3 = document.getElementById("productList3");
    const container4 = document.getElementById("productList4");

    if (container) container.innerHTML = "";
    if (container2) container2.innerHTML = "";
    if (container3) container3.innerHTML = "";
    if (container4) container4.innerHTML = "";

    if (results.length === 0) {
        if (container) container.innerHTML = "<p>Tidak ada produk ditemukan.</p>";
        return;
    }

    results.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
            <img src="${item.img}">
            <h3>${item.name}</h3>
            <p>Rp ${item.price.toLocaleString()}</p>
        `;
        div.addEventListener("click", () => showProductDetail(item));
        if (container) container.appendChild(div);
    });
}
