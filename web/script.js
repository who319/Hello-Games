// Apple 风格页面切换平滑过渡
document.querySelectorAll('.main-nav a').forEach(link=>{
  link.addEventListener('click',function(e){
    const href = link.getAttribute('href');
    if(href && !href.startsWith('#') && !link.hasAttribute('target')){
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(()=>{window.location.href=href;},260);
    }
  });
});
document.addEventListener('DOMContentLoaded',()=>{
  document.body.classList.add('page-enter');
  setTimeout(()=>{
    document.body.classList.remove('page-enter');
  },320);
});
// Apple 风格 Parallax 视差滚动
function appleParallaxScroll() {
  document.querySelectorAll('[data-parallax]').forEach(el=>{
    const rect = el.getBoundingClientRect();
    const winH = window.innerHeight;
    if(rect.top < winH && rect.bottom > 0){
      const percent = (rect.top+rect.height/2-winH/2)/winH;
      el.style.transform = `translateY(${percent*32}px)`;
    }else{
      el.style.transform = '';
    }
  });
}
window.addEventListener('scroll', appleParallaxScroll);
window.addEventListener('resize', appleParallaxScroll);
document.addEventListener('DOMContentLoaded', appleParallaxScroll);
// Apple 风格分区滚动 reveal-scale 动画
function appleRevealScale() {
  const reveals = document.querySelectorAll('.reveal-scale');
  const winH = window.innerHeight;
  for(const el of reveals){
    const rect = el.getBoundingClientRect();
    if(rect.top < winH-60){
      el.classList.add('show');
    }else{
      el.classList.remove('show');
    }
  }
}
window.addEventListener('scroll', appleRevealScale);
window.addEventListener('resize', appleRevealScale);
document.addEventListener('DOMContentLoaded', appleRevealScale);
// 简单交互：移动端导航与主题切换
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
const themeToggle = document.getElementById('theme-toggle');

navToggle && navToggle.addEventListener('click', ()=>{
  mainNav.classList.toggle('show');
});

// Apple 风格大图轮播
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
let carouselIndex = 0;
let carouselTimer = null;
function showCarousel(idx) {
  carouselSlides.forEach((slide,i)=>{
    slide.classList.toggle('active',i===idx);
  });
  carouselIndex = idx;
}
function nextCarousel() {
  let idx = (carouselIndex+1)%carouselSlides.length;
  showCarousel(idx);
}
function prevCarousel() {
  let idx = (carouselIndex-1+carouselSlides.length)%carouselSlides.length;
  showCarousel(idx);
}
function startCarouselAuto() {
  if(carouselTimer) clearInterval(carouselTimer);
  carouselTimer = setInterval(nextCarousel,4000);
}
if(carouselTrack && carouselSlides.length) {
  showCarousel(0);
  startCarouselAuto();
  nextBtn && nextBtn.addEventListener('click',()=>{nextCarousel();startCarouselAuto();});
  prevBtn && prevBtn.addEventListener('click',()=>{prevCarousel();startCarouselAuto();});
  // 支持左右滑动
  let startX = null;
  carouselTrack.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;});
  carouselTrack.addEventListener('touchend',e=>{
    if(startX!==null){
      let dx = e.changedTouches[0].clientX-startX;
      if(dx>40) prevCarousel();
      else if(dx<-40) nextCarousel();
      startCarouselAuto();
      startX=null;
    }
  });
}

// 苹果风格导航栏滚动隐藏/渐变/阴影
const siteHeader = document.querySelector('.site-header');
let lastScrollY = window.scrollY;
let ticking = false;
function onScrollAppleHeader() {
  const currentY = window.scrollY;
  if (!siteHeader) return;
  // 渐变与阴影
  if (currentY > 12) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
  // 自动隐藏
  if (currentY > 80 && currentY > lastScrollY) {
    siteHeader.classList.add('hidden');
  } else {
    siteHeader.classList.remove('hidden');
  }
  lastScrollY = currentY;
  ticking = false;
}
window.addEventListener('scroll', ()=>{
  if (!ticking) {
    window.requestAnimationFrame(onScrollAppleHeader);
    ticking = true;
  }
});

// 读取并应用主题
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
}

const saved = localStorage.getItem('site-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(saved);

themeToggle && themeToggle.addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('site-theme', next);
});

// --------------------
// 游戏资讯（客户端静态加载 + 搜索）
// --------------------
const NEWS_URL = './data/news.json';
let NEWS = [];

async function loadNews(){
  try{
    const res = await fetch(NEWS_URL);
    NEWS = await res.json();
    renderNews(NEWS);
  }catch(e){
    console.error('加载新闻失败', e);
    const listEl = document.getElementById('news-list');
    if(listEl) listEl.innerHTML = '<div style="color:var(--muted)">无法加载新闻数据。</div>';
  }
}

function renderNews(items){
  const listEl = document.getElementById('news-list');
  const emptyEl = document.getElementById('news-empty');
  if(!listEl) return;
  listEl.innerHTML = '';
  if(!items || items.length === 0){
    emptyEl && (emptyEl.style.display = 'block');
    return;
  }
  emptyEl && (emptyEl.style.display = 'none');
  for(const it of items){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="news-meta">${it.date} · ${it.source || '站内'}</div>
      <h3>${it.title}</h3>
      <p style="color:var(--muted);flex:1">${it.excerpt || ''}</p>
      <div style="margin-top:0.5rem">
        ${(it.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}
      </div>
      <p style="margin-top:0.6rem"><a href="#" class="link" data-id="${it.id}">阅读全文</a></p>
    `;
    listEl.appendChild(card);
  }

  // attach readers
  listEl.querySelectorAll('a[data-id]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = a.getAttribute('data-id');
      const art = NEWS.find(x=>String(x.id)===String(id));
      if(art) openArticleModal(art);
    });
  });
}

function openArticleModal(article){
  const modal = document.createElement('div');
  modal.className = 'article-modal';
  modal.innerHTML = `
    <div class="article-panel">
      <button class="close" aria-label="关闭">✕</button>
      <div class="news-meta">${article.date} · ${article.source || '站内'}</div>
      <h3>${article.title}</h3>
      <div style="color:var(--muted);margin-bottom:0.6rem">${(article.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="article-body">${article.content || article.excerpt || ''}</div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('.close').addEventListener('click', ()=> modal.remove());
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.remove(); });
}

// 搜索
const searchInput = document.getElementById('news-search');
if(searchInput){
  searchInput.addEventListener('input', ()=>{
    const q = searchInput.value.trim().toLowerCase();
    if(!q){ renderNews(NEWS); return; }
    const filtered = NEWS.filter(it=>{
      const inTitle = (it.title||'').toLowerCase().includes(q);
      const inExcerpt = (it.excerpt||'').toLowerCase().includes(q);
      const inTags = (it.tags||[]).some(t=>t.toLowerCase().includes(q));
      return inTitle || inExcerpt || inTags;
    });
    renderNews(filtered);
  });
}

// 初始化加载新闻（如果页面包含新闻区）
if(document.getElementById('news-list')){
  loadNews();
}

// 公开获取新闻数据的函数，便于专题页复用
async function fetchNewsData(){
  if(NEWS && NEWS.length) return NEWS;
  try{
    const res = await fetch(NEWS_URL);
    NEWS = await res.json();
    return NEWS;
  }catch(e){
    console.error('fetchNewsData error', e);
    return [];
  }
}

// 在指定容器渲染按标签/关键字筛选的文章（专题页使用）
async function renderTopic(filter, containerId){
  const items = await fetchNewsData();
  const q = (filter || '').toLowerCase();
  const filtered = items.filter(it=>{
    const inTags = (it.tags||[]).some(t=>t.toLowerCase().includes(q));
    const inTitle = (it.title||'').toLowerCase().includes(q);
    const inExcerpt = (it.excerpt||'').toLowerCase().includes(q);
    return inTags || inTitle || inExcerpt;
  });
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  if(filtered.length === 0){
    container.innerHTML = '<div style="color:var(--muted)">暂无相关文章。</div>';
    return;
  }
  for(const it of filtered){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="news-meta">${it.date} · ${it.source || '站内'}</div>
      <h3>${it.title}</h3>
      <p style="color:var(--muted);flex:1">${it.excerpt || ''}</p>
      <div style="margin-top:0.5rem">${(it.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <p style="margin-top:0.6rem"><a href="#" class="link" data-id="${it.id}">阅读全文</a></p>
    `;
    container.appendChild(card);
  }
  container.querySelectorAll('a[data-id]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = a.getAttribute('data-id');
      const art = NEWS.find(x=>String(x.id)===String(id));
      if(art) openArticleModal(art);
    });
  });
}

// 页面切换：拦截内部链接，做淡出动画再跳转
(function(){
  const DURATION = 300; // ms, should match CSS var(--transition-medium)
  function isInternalLink(a){
    return a && a.hostname === window.location.hostname && a.pathname !== window.location.pathname;
  }
  document.addEventListener('click', function(e){
    const a = e.target.closest && e.target.closest('a');
    if(!a) return;
    // only intercept same-origin navigation within site
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
    // relative/internal link
    e.preventDefault();
    document.documentElement.classList.add('page-exit');
    setTimeout(()=>{
      window.location = href;
    }, DURATION);
  }, true);
  // on load, play enter animation
  window.addEventListener('DOMContentLoaded', ()=>{
    document.documentElement.classList.add('page-enter');
    setTimeout(()=> document.documentElement.classList.remove('page-enter'), DURATION);
  });
})();

// 按钮涟漪效果（事件委托）
(function(){
  document.addEventListener('click', function(e){
    const btn = e.target.closest && e.target.closest('.btn');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height)*1.5;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    setTimeout(()=> ripple.remove(), 600);
  }, true);
})();

// 键盘按键视觉反馈（Space / Enter on buttons)
document.addEventListener('keydown', (e)=>{
  if(e.key === ' ' || e.key === 'Enter'){
    const active = document.activeElement;
    if(active && active.classList && active.classList.contains('btn')){
      active.classList.add('active');
    }
  }
});
document.addEventListener('keyup', (e)=>{
  if(e.key === ' ' || e.key === 'Enter'){
    const active = document.activeElement;
    if(active && active.classList && active.classList.contains('btn')){
      active.classList.remove('active');
    }
  }
});

// --------------------
// 专题面板（点击导航中的 topics.html 链接显示面板）
// --------------------
const TOPICS = [
  {id:'gta6', title:'GTA6', img:'assets/gta6.jpg', excerpt:'Rockstar 最新大作专题', url:'gta6.html'},
  {id:'eldenring', title:'Elden Ring', img:'assets/eldenring.jpg', excerpt:'艾尔登法环 DLC 与攻略', url:'eldenring.html'},
  {id:'cyberpunk', title:'Cyberpunk 2077', img:'assets/cyberpunk.jpg', excerpt:'性能更新与剧情扩展', url:'cyberpunk.html'},
  {id:'fortnite', title:'Fortnite', img:'assets/fortnite.jpg', excerpt:'赛季更新与联动活动', url:'fortnite.html'},
  {id:'valorant', title:'Valorant', img:'assets/valorant.jpg', excerpt:'补丁说明与赛事集锦', url:'valorant.html'},
  // 已移除暗影传说与时光裂缝专题
  // 如果需要恢复专题，请在此添加相应条目
];

function createTopicsPanel(){
  if(document.getElementById('topics-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'topics-panel';
  panel.className = 'topics-panel';
  panel.innerHTML = `
    <button class="close-topics" aria-label="关闭专题">✕</button>
    <div class="container">
      <h3>专题</h3>
      <div class="topics-grid"></div>
    </div>
  `;
  document.body.appendChild(panel);
  const grid = panel.querySelector('.topics-grid');
  for(const t of TOPICS){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <a href="${t.url}" data-url="${t.url}">
        <img src="${t.img}" alt="${t.title}">
        <h3>${t.title}</h3>
        <p>${t.excerpt}</p>
      </a>
    `;
    grid.appendChild(card);
  }
  // close
  panel.querySelector('.close-topics').addEventListener('click', ()=> toggleTopicsPanel(false));
  panel.addEventListener('click', (e)=>{ if(e.target === panel) toggleTopicsPanel(false); });

  // intercept clicks on topic links to run page-exit animation
  panel.querySelectorAll('a[data-url]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const href = a.getAttribute('data-url');
      document.documentElement.classList.add('page-exit');
      setTimeout(()=> window.location = href, 300);
    });
  });
}

function toggleTopicsPanel(show){
  createTopicsPanel();
  const panel = document.getElementById('topics-panel');
  if(!panel) return;
  if(typeof show === 'boolean' ? show : !panel.classList.contains('show')){
    panel.classList.add('show');
  }else{
    panel.classList.remove('show');
  }
}

// Attach to any nav link that points to topics.html
document.addEventListener('click', (e)=>{
  const a = e.target.closest && e.target.closest('a');
  if(!a) return;
  const href = a.getAttribute('href');
  if(!href) return;
  const isTopics = href.endsWith('topics.html') || href === 'topics.html' || href === './topics.html';
  if(isTopics){
    e.preventDefault();
    toggleTopicsPanel(true);
  }
}, true);

// --------------------
// Reveal on scroll（淡入显示）
// --------------------
(function(){
  const elems = document.querySelectorAll('.reveal');
  if(!elems || elems.length === 0) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('show');
        obs.unobserve(en.target);
      }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  elems.forEach(el=> obs.observe(el));
})();

// --------------------
// Parallax for elements with data-parallax (value = factor, e.g. 0.2)
// --------------------
(function(){
  const nodes = Array.from(document.querySelectorAll('[data-parallax]'));
  if(nodes.length === 0) return;
  let ticking = false;
  function update(){
    const y = window.scrollY || window.pageYOffset;
    for(const n of nodes){
      const rect = n.getBoundingClientRect();
      // compute factor from attribute or default
      const f = parseFloat(n.getAttribute('data-parallax')) || 0.18;
      const offset = (rect.top + rect.height/2) * f * -1;
      n.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if(!ticking){
      ticking = true; window.requestAnimationFrame(update);
    }
  }, {passive:true});
  // initial
  update();
})();

// --------------------
// Auto-hide header on scroll down, show on scroll up
// --------------------
(function(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  let lastY = window.scrollY || 0;
  let ticking = false;
  function onScroll(){
    const y = window.scrollY || 0;
    const diff = y - lastY;
    if(Math.abs(diff) < 8){ lastY = y; ticking = false; return; }
    if(y > 120 && diff > 0){
      header.classList.add('hidden');
    }else{
      header.classList.remove('hidden');
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if(!ticking){ ticking = true; window.requestAnimationFrame(onScroll); }
  }, {passive:true});
})();
