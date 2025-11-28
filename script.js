// 背景アニメーション
const canvas=document.getElementById('bgCanvas');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let dots=[];
for(let i=0;i<50;i++){
  dots.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*5+2,dx:(Math.random()-0.5)/2,dy:(Math.random()-0.5)/2});
}
function animate(){
  ctx.fillStyle='yellow';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let d of dots){
    ctx.beginPath();
    ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
    ctx.fillStyle='rgba(255,200,0,0.6)';
    ctx.fill();
    d.x+=d.dx; d.y+=d.dy;
    if(d.x<0||d.x>canvas.width)d.dx*=-1;
    if(d.y<0||d.y>canvas.height)d.dy*=-1;
  }
  requestAnimationFrame(animate);
}
animate();
window.addEventListener('resize',()=>{canvas.width=window.innerWidth; canvas.height=window.innerHeight;});

// DOM Elements
const shopBtn=document.getElementById('shopBtn');
const cartBtn=document.getElementById('cartBtn');
const shopSection=document.getElementById('shopSection');
const detailSection=document.getElementById('detailSection');
const cartSection=document.getElementById('cartSection');
const detailContent=document.getElementById('detailContent');
const addCartBtn=document.getElementById('addCartBtn');
const buyNowBtn=document.getElementById('buyNowBtn');
const cartItemsEl=document.getElementById('cartItems');
const cartTotalEl=document.getElementById('cartTotal');
const checkoutBtn=document.getElementById('checkoutBtn');
const purchaseModal=document.getElementById('purchaseModal');
const purchaseItems=document.getElementById('purchaseItems');
const purchaseTotal=document.getElementById('purchaseTotal');
const closeBtn=purchaseModal.querySelector('.closeBtn');
const confirmPurchaseBtn=document.getElementById('confirmPurchaseBtn');
const errorMsg=document.getElementById('errorMsg');
const paypayLinkInput=document.getElementById('paypayLink');
const completeModal=document.getElementById('completeModal');

let cart=[];
let currentProduct=null;

// 初期化
window.onload=()=>{
  completeModal.classList.add('hidden');
  purchaseModal.classList.add('hidden');
  shopSection.classList.remove('hidden');
  detailSection.classList.add('hidden');
  cartSection.classList.add('hidden');
};

// セクション切り替え
function showSection(section){
  shopSection.classList.add('hidden');
  detailSection.classList.add('hidden');
  cartSection.classList.add('hidden');
  section.classList.remove('hidden');
}

// ページ切替
shopBtn.onclick=()=>{ showSection(shopSection); }
cartBtn.onclick=()=>{ showSection(cartSection); renderCart(); }

// 商品詳細
document.querySelectorAll('.detailBtn').forEach(btn=>{
  btn.onclick=e=>{
    const parent=e.target.parentElement;
    currentProduct={name:parent.dataset.name,price:parseInt(parent.dataset.price)};
    detailContent.innerHTML=generateDetailHTML(currentProduct.name);
    showSection(detailSection);
  }
});

function generateDetailHTML(name){
  if(name==="サイトの作り方（PC）"){
    return `<h2>📌 商品名：サイトの作り方（PC）｜完全初心者向けマニュアル</h2>
    <p>💻「サイト作りってむずかしそう…」と思ってる人でも大丈夫。</p>
    <h3>🔰 こんな人におすすめ</h3>
    <ul><li>サイトを作ってみたいけど何から始めればいいかわからない</li><li>お金をかけずにサイトを公開したい</li><li>趣味/ゲーム/作品紹介/ビジネス用など自由にサイトを作りたい</li><li>HTMLとかよくわかんない…ってレベルでもOKな内容がほしい</li></ul>
    <h3>✨ このマニュアルでできるようになること</h3>
    <ul><li>サイトの作成手順が1から10まで全部わかる</li><li>完全無料で自分のサイトをネットに公開できる</li><li>PCさえあれば専門知識ゼロでOK</li><li>難しい専門用語なし、超初心者モードの解説</li><li>デザインが綺麗に見えるコツもこっそり紹介</li></ul>`;
  }else if(name==="Discord Bot作り方（PC）"){
    return `<h2>🚀 Discord Bot作り方（PC）</h2>
    <p>【PC完結】知識ゼロから始める！オリジナルDiscord Bot作成講座 🤖🌟</p>
    <ul><li>環境構築：Bot作成に必要なツールの準備（全て無料）</li><li>基本設定：Discord Developer Portalでのアプリ＆Bot作成</li><li>コード解説：Botの基本コードの理解と書き方</li><li>実践導入：作成したBotをあなたのサーバーへ確実に導入</li><li>応用への一歩：Botを動かし続けるためのヒントと応用機能導入</li></ul>`;
  }
}

// カート追加
addCartBtn.onclick=()=>{
  if(currentProduct){ cart.push({...currentProduct}); alert('カートに追加しました！'); }
}

// 今すぐ購入
buyNowBtn.onclick=()=>{
  if(currentProduct){ openPurchaseModal([currentProduct]); }
}

// カート表示
function renderCart(){
  cartItemsEl.innerHTML='';
  let total=0;
  cart.forEach((item,i)=>{
    total+=item.price;
    let div=document.createElement('div');
    div.innerHTML=`${item.name} - ${item.price}Pay <button onclick="removeCart(${i})">削除</button>`;
    cartItemsEl.appendChild(div);
  });
  cartTotalEl.textContent=total;
}

// カート削除
window.removeCart=i=>{
  cart.splice(i,1);
  renderCart();
}

// まとめて購入
checkoutBtn.onclick=()=>{
  if(cart.length>0){ openPurchaseModal([...cart]); }
}

// 購入モーダル
function openPurchaseModal(items){
  purchaseItems.innerHTML='';
  let total=0;
  items.forEach(it=>{
    total+=it.price;
    let div=document.createElement('div');
    div.textContent=`${it.name} - ${it.price}Pay`;
    purchaseItems.appendChild(div);
  });
  purchaseTotal.textContent=total;
  purchaseModal.dataset.total=total;
  purchaseModal.classList.remove('hidden');
}

// 閉じる
closeBtn.onclick=()=>{ purchaseModal.classList.add('hidden'); errorMsg.textContent=''; paypayLinkInput.value=''; }

// PayPayリンクチェック
confirmPurchaseBtn.onclick=()=>{
  let link=paypayLinkInput.value.trim();
  let total=parseInt(purchaseModal.dataset.total);
  if(!link.includes('?amount=')){
    errorMsg.textContent="Error Code104:[金額を入力して生成されたリンクを使用してください]";
    setTimeout(()=>{errorMsg.textContent='';},5000);
    return;
  }
  let amount=parseInt(link.split('?amount=')[1]);
  if(amount<total){
    errorMsg.textContent=`Error Code102:[金額が不足しています。${total-amount}円分の受け取りリンクをもう一度貼ってください。]`;
    setTimeout(()=>{errorMsg.textContent='';},5000);
    return;
  }
  if(amount>total){ alert(`余り ${amount-total}円。チップとして送るUIをここで出せます`); }
  purchaseModal.classList.add('hidden');
  paypayLinkInput.value='';
  completeModal.classList.remove('hidden');
  setTimeout(()=>{
    completeModal.classList.add('hidden');
    cart=[];
    renderCart();
    showSection(shopSection);
  },4000);
}
