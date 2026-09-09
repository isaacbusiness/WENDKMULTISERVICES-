// WENDK SHOP - MVP e-commerce
// Remplacez WHATSAPP_NUMBER par votre numéro au format international sans le +.
// Exemple Burkina Faso : 22670000000
const WHATSAPP_NUMBER = "22670000000";

const categories = [
  {name:"iPhone", icon:"🍎"},
  {name:"Samsung", icon:"📱"},
  {name:"Tecno", icon:"🔥"},
  {name:"Google Pixel", icon:"🔵"},
  {name:"Xiaomi", icon:"🟠"},
  {name:"Huawei", icon:"🔷"},
  {name:"Accessoires", icon:"🎧"},
  {name:"Montres", icon:"⌚"},
  {name:"Tablettes", icon:"💻"},
  {name:"TV", icon:"📺"}
];

// Prix et stocks ci-dessous sont des DONNÉES DE DÉMONSTRATION.
const products = [
  {id:1,name:"iPhone 13",brand:"Apple",category:"iPhone",price:250000,oldPrice:0,stock:4,icon:"📱",featured:true,newest:true,desc:"Smartphone Apple de démonstration. Remplacez les informations par votre stock réel.",specs:{Stockage:"128 Go",RAM:"4 Go",État:"Neuf"}},
  {id:2,name:"iPhone 15",brand:"Apple",category:"iPhone",price:399000,oldPrice:425000,stock:3,icon:"📱",featured:true,newest:true,desc:"Produit de démonstration pour votre catalogue.",specs:{Stockage:"128 Go",RAM:"6 Go",État:"Neuf"}},
  {id:3,name:"Samsung Galaxy A15",brand:"Samsung",category:"Samsung",price:95000,oldPrice:105000,stock:8,icon:"📱",featured:true,newest:false,desc:"Produit de démonstration. Vérifiez le prix et la disponibilité avant publication.",specs:{Stockage:"128 Go",RAM:"4 Go",État:"Neuf"}},
  {id:4,name:"Samsung Galaxy S23",brand:"Samsung",category:"Samsung",price:275000,oldPrice:0,stock:3,icon:"📱",featured:true,newest:true,desc:"Produit de démonstration.",specs:{Stockage:"256 Go",RAM:"8 Go",État:"Neuf"}},
  {id:5,name:"Google Pixel 7",brand:"Google",category:"Google Pixel",price:185000,oldPrice:0,stock:5,icon:"📱",featured:true,newest:false,desc:"Produit de démonstration.",specs:{Stockage:"128 Go",RAM:"8 Go",État:"Neuf"}},
  {id:6,name:"Tecno Camon",brand:"Tecno",category:"Tecno",price:105000,oldPrice:115000,stock:7,icon:"📱",featured:true,newest:true,desc:"Produit de démonstration.",specs:{Stockage:"256 Go",RAM:"8 Go",État:"Neuf"}},
  {id:7,name:"Redmi Note",brand:"Xiaomi",category:"Xiaomi",price:90000,oldPrice:0,stock:10,icon:"📱",featured:false,newest:false,desc:"Produit de démonstration.",specs:{Stockage:"128 Go",RAM:"6 Go",État:"Neuf"}},
  {id:8,name:"AirPods",brand:"Apple",category:"Accessoires",price:45000,oldPrice:50000,stock:12,icon:"🎧",featured:true,newest:true,desc:"Accessoire de démonstration.",specs:{Type:"Écouteurs",État:"Neuf"}},
  {id:9,name:"Power Bank 20 000 mAh",brand:"WENDK",category:"Accessoires",price:15000,oldPrice:0,stock:15,icon:"🔋",featured:false,newest:true,desc:"Accessoire de démonstration.",specs:{Capacité:"20 000 mAh",État:"Neuf"}},
  {id:10,name:"Smart Watch",brand:"WENDK",category:"Montres",price:25000,oldPrice:30000,stock:6,icon:"⌚",featured:false,newest:true,desc:"Produit de démonstration.",specs:{Écran:"Tactile",État:"Neuf"}}
];

let cart = JSON.parse(localStorage.getItem("wendk_cart") || "[]");
let currentProducts = [...products];

function formatPrice(value){ return new Intl.NumberFormat("fr-FR").format(value) + " FCFA"; }
function saveCart(){ localStorage.setItem("wendk_cart", JSON.stringify(cart)); updateCartUI(); }
function updateCartUI(){
  const count = cart.reduce((sum,item)=>sum+item.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("cartCountMobile").textContent=count;
}
function showToast(message){
  const t=document.getElementById("toast"); t.textContent=message; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}
function renderCategories(){
  document.getElementById("categoryGrid").innerHTML=categories.map(c=>`
    <div class="category" onclick="filterCategory('${c.name}')">
      <div class="icon">${c.icon}</div><strong>${c.name}</strong>
    </div>`).join("");
}
function renderProducts(list=currentProducts){
  const grid=document.getElementById("productGrid");
  document.getElementById("emptyState").classList.toggle("hidden",list.length>0);
  grid.innerHTML=list.map(p=>`
    <article class="product-card">
      ${p.oldPrice ? '<span class="badge">PROMO</span>' : ''}
      <div class="product-image" onclick="openProduct(${p.id})">${p.icon}</div>
      <div class="product-info">
        <span class="brand">${p.brand}</span>
        <h3>${p.name}</h3>
        <div><span class="price">${formatPrice(p.price)}</span>${p.oldPrice?`<span class="old-price">${formatPrice(p.oldPrice)}</span>`:""}</div>
        <div class="stock">${p.stock>0 ? "✓ En stock" : "Rupture de stock"}</div>
        <div class="product-actions">
          <button class="details" onclick="openProduct(${p.id})">Détails</button>
          <button class="add" ${p.stock<=0?"disabled":""} onclick="addToCart(${p.id})">Ajouter</button>
        </div>
      </div>
    </article>`).join("");
}
function filterCategory(category){
  currentProducts = category==="Tous" ? [...products] : products.filter(p=>p.category===category);
  renderProducts(currentProducts);
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
}
function searchProducts(){
  const q=document.getElementById("searchInput").value.trim().toLowerCase();
  currentProducts=products.filter(p=>
    [p.name,p.brand,p.category,p.desc].some(x=>x.toLowerCase().includes(q))
  );
  renderProducts(currentProducts);
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
}
document.getElementById("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")searchProducts()});
function sortProducts(){
  const value=document.getElementById("sortSelect").value;
  currentProducts=[...currentProducts];
  if(value==="priceAsc") currentProducts.sort((a,b)=>a.price-b.price);
  if(value==="priceDesc") currentProducts.sort((a,b)=>b.price-a.price);
  if(value==="newest") currentProducts.sort((a,b)=>Number(b.newest)-Number(a.newest));
  if(value==="featured") currentProducts.sort((a,b)=>Number(b.featured)-Number(a.featured));
  renderProducts(currentProducts);
}
function addToCart(id){
  const p=products.find(x=>x.id===id); if(!p || p.stock<=0)return;
  const existing=cart.find(x=>x.id===id);
  if(existing){ if(existing.qty<p.stock) existing.qty++; else return showToast("Stock maximum atteint."); }
  else cart.push({id:p.id,qty:1});
  saveCart(); showToast(`${p.name} ajouté au panier ✓`);
}
function changeQty(id,delta){
  const item=cart.find(x=>x.id===id), p=products.find(x=>x.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty>p.stock)item.qty=p.stock;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart(); renderCart();
}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart()}
function clearCart(){cart=[];saveCart();renderCart();showToast("Panier vidé.");}
function cartTotal(){return cart.reduce((sum,item)=>{const p=products.find(x=>x.id===item.id);return sum+(p?p.price*item.qty:0)},0)}
function renderCart(){
  const el=document.getElementById("cartItems");
  if(!cart.length){el.innerHTML='<div class="empty">Votre panier est vide 🛒</div>';document.getElementById("cartTotal").textContent="0 FCFA";return;}
  el.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-row"><div class="cart-thumb">${p.icon}</div><div><h4>${p.name}</h4><p>${formatPrice(p.price)}</p><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div><div><b>${formatPrice(p.price*item.qty)}</b><br><button class="remove" onclick="removeFromCart(${p.id})">Supprimer</button></div></div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=formatPrice(cartTotal());
}
function openCart(){document.getElementById("cartOverlay").classList.remove("hidden");renderCart();}
function closeCart(e){if(!e || e.target.id==="cartOverlay")document.getElementById("cartOverlay").classList.add("hidden")}
function openProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  document.getElementById("modalContent").innerHTML=`
    <div class="modal-product">
      <div class="modal-img">${p.icon}</div>
      <div>
        <span class="brand">${p.brand} · ${p.category}</span>
        <h2>${p.name}</h2>
        <div><span class="price">${formatPrice(p.price)}</span>${p.oldPrice?` <span class="old-price">${formatPrice(p.oldPrice)}</span>`:""}</div>
        <p class="modal-desc">${p.desc}</p>
        <div class="specs">${Object.entries(p.specs).map(([k,v])=>`<div><b>${k}</b><br>${v}</div>`).join("")}</div>
        <p class="stock">${p.stock>0?"✓ Disponible":"Rupture de stock"}</p>
        <div class="hero-actions">
          <button class="btn primary" onclick="addToCart(${p.id});closeProduct()">🛒 Ajouter au panier</button>
          <button class="btn secondary" onclick="productWhatsApp(${p.id})">💬 WhatsApp</button>
        </div>
      </div>
    </div>`;
  document.getElementById("productModal").classList.remove("hidden");
}
function closeProduct(e){if(!e || e.target.id==="productModal")document.getElementById("productModal").classList.add("hidden")}
function whatsappUrl(text){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`}
function contactWhatsApp(){
  window.open(whatsappUrl("Bonjour WENDK SHOP 👋\nJe souhaite avoir des informations sur vos produits."),"_blank");
}
function productWhatsApp(id){
  const p=products.find(x=>x.id===id);
  window.open(whatsappUrl(`Bonjour WENDK SHOP 👋\nJe suis intéressé(e) par :\n\nProduit : ${p.name}\nPrix affiché : ${formatPrice(p.price)}\n\nPouvez-vous me confirmer la disponibilité ?`),"_blank");
}
function checkoutWhatsApp(){
  if(!cart.length)return showToast("Votre panier est vide.");
  let text="Bonjour WENDK SHOP 👋\n\nJe souhaite passer une commande :\n\n";
  cart.forEach(item=>{const p=products.find(x=>x.id===item.id);text+=`• ${p.name} x${item.qty} — ${formatPrice(p.price*item.qty)}\n`;});
  text+=`\nTotal produits : ${formatPrice(cartTotal())}\n\nNom :\nTéléphone :\nVille :\nQuartier :\nAdresse :\nMode de livraison :\nMode de paiement :`;
  window.open(whatsappUrl(text),"_blank");
}
function showHome(){window.scrollTo({top:0,behavior:"smooth"})}
document.getElementById("year").textContent=new Date().getFullYear();
renderCategories();renderProducts();updateCartUI();
