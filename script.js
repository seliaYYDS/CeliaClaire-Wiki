// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子背景
    initParticles();
    
    // 初始化鼠标拖尾效果
    initCursorTrail();
    
    // 初始化点击特效
    initClickEffect();
    
    // 主页动画效果
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // 添加页面加载动画
        document.body.classList.add('page-loading');
        setTimeout(() => {
            document.body.classList.remove('page-loading');
        }, 100);
    }
    
    // 资料页面内容加载
    const infoContent = document.querySelector('.info-content');
    if (infoContent) {
        loadInfoContent();
    }
    
    // 插画页面内容加载
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        loadGalleryImages();
    }
    
    // 导航高亮
    setupNavigation();
    
    // 为主页添加视差效果
    addParallaxEffect();
    
    // 添加悬停效果
    addHoverEffects();
});

// 初始化鼠标拖尾效果
function initCursorTrail() {
    let mouseX = 0;
    let mouseY = 0;
    const trails = [];
    
    // 创建拖尾元素
    const trailCount = 15; // 增加拖尾元素数量
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0,
            size: 12 - (i * 0.6), // 增大初始尺寸
            opacity: 0.7 - (i * 0.04), // 增加初始透明度
            delay: i * 0.05 // 调整延迟
        });
    }
    
    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // 使用requestAnimationFrame创建平滑的拖尾动画
    function animateTrail() {
        // 更新拖尾元素位置
        trails.forEach((trail, index) => {
            if (index === 0) {
                // 第一个元素跟随鼠标
                trail.x = mouseX;
                trail.y = mouseY;
            } else {
                // 其他元素跟随前一个元素
                const prevTrail = trails[index - 1];
                const targetX = prevTrail.x;
                const targetY = prevTrail.y;
                
                // 使用插值创建跟随效果，减慢跟随速度使拖尾更明显
                trail.x += (targetX - trail.x) * (0.2 + trail.delay * 0.3);
                trail.y += (targetY - trail.y) * (0.2 + trail.delay * 0.3);
            }
            
            // 更新元素样式
            trail.element.style.left = `${trail.x}px`;
            trail.element.style.top = `${trail.y}px`;
            trail.element.style.width = `${trail.size}px`;
            trail.element.style.height = `${trail.size}px`;
            trail.element.style.opacity = trail.opacity;
            
            // 添加缩放效果增强视觉
            const scale = 1 + (index * 0.05);
            trail.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    // 启动动画
    requestAnimationFrame(animateTrail);
}

// 初始化粒子背景
function initParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('particles-js');
    
    // 设置画布大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    
    // 添加到容器
    container.appendChild(canvas);
    
    // 粒子数组
    let particles = [];
    const particleCount = 100;
    
    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(147, 112, 219, ${Math.random() * 0.5 + 0.1})`; // 使用主题色
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    // 创建粒子
    function initParticlesArray() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // 绘制粒子和连线
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新和绘制粒子
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // 绘制连线
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(147, 112, 219, ${0.2 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(drawParticles);
    }
    
    // 处理窗口大小变化
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticlesArray();
    });
    
    // 初始化并开始动画
    initParticlesArray();
    drawParticles();
}

// 页面切换事件监听
document.addEventListener('click', function(e) {
    // 检查是否点击了导航链接
    if (e.target.tagName === 'A' && e.target.closest('nav')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        // 添加页面切换动画
        const main = document.querySelector('main');
        main.style.opacity = '0';
        
        setTimeout(() => {
            // 使用fetch获取页面内容
            fetch(href)
                .then(response => response.text())
                .then(html => {
                    // 创建临时DOM元素来解析返回的HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // 更新页面标题
                    document.title = doc.title;
                    
                    // 更新主内容区域
                    const newMainContent = doc.querySelector('main').innerHTML;
                    document.querySelector('main').innerHTML = newMainContent;
                    
                    // 添加淡入效果
                    main.style.opacity = '0';
                    setTimeout(() => {
                        main.style.transition = 'opacity 0.3s ease';
                        main.style.opacity = '1';
                    }, 50);
                    
                    // 更新导航高亮
                    setupNavigation();
                    
                    // 根据新页面重新绑定事件
                    if (href.includes('info')) {
                        loadInfoContent();
                    } else if (href.includes('gallery')) {
                        loadGalleryImages();
                    } else if (href === 'index.html' || href === '/') {
                        addParallaxEffect();
                        addHoverEffects();
                    }
                    
                    // 滚动到顶部
                    window.scrollTo(0, 0);
                })
                .catch(error => {
                    console.error('页面切换失败:', error);
                    // 如果AJAX加载失败，则使用传统页面跳转
                    window.location.href = href;
                });
        }, 300);
    }
});

// 加载资料内容
function loadInfoContent() {
    // 资料内容已经在HTML中静态定义，无需动态加载
    console.log("资料内容已静态加载");
}

// 加载插画图片
function loadGalleryImages() {
    // 获取插画文件夹中的所有图片
    const imageFiles = [
        'img/Celia illustration collection/0c872380e34e925bd59154222fc41f5d660009991.jpg',
        'img/Celia illustration collection/100352334_p0_master1200.jpg',
        'img/Celia illustration collection/100403785_p0_master1200.jpg',
        'img/Celia illustration collection/101323440_p0_master1200.jpg',
        'img/Celia illustration collection/104855048_p0_master1200.jpg',
        'img/Celia illustration collection/107005962_p0_master1200.jpg',
        'img/Celia illustration collection/107005962_p1_master1200.jpg',
        'img/Celia illustration collection/107005962_p2_master1200.jpg',
        'img/Celia illustration collection/119024031_p0_master1200.jpg',
        'img/Celia illustration collection/124086810_p0.jpg',
        'img/Celia illustration collection/124275552_p0_master1200.jpg',
        'img/Celia illustration collection/124602181_p0_master1200.jpg',
        'img/Celia illustration collection/125403335_p0_master1200.jpg',
        'img/Celia illustration collection/126376361_p0_master1200.jpg',
        'img/Celia illustration collection/130121869_p0_master1200.jpg',
        'img/Celia illustration collection/131223970_p0_master1200.jpg',
        'img/Celia illustration collection/161f2487857466f0a380de8d3c9c3ac7.jpeg',
        'img/Celia illustration collection/2bd0a4112f222afb7d9c945cfad2effa.jpeg',
        'img/Celia illustration collection/826eeec483fc2bb0163f8500f1a70305660009991.jpg',
        'img/Celia illustration collection/91525848_p0_master1200.jpg',
        'img/Celia illustration collection/91532128_p0_master1200.jpg',
        'img/Celia illustration collection/91639311_p0_master1200.jpg',
        'img/Celia illustration collection/91725094_p0_master1200.jpg',
        'img/Celia illustration collection/92056020_p0_master1200.jpg',
        'img/Celia illustration collection/92113833_p0_master1200.jpg',
        'img/Celia illustration collection/92639289_p0_master1200.jpg',
        'img/Celia illustration collection/92791962_p0_master1200.jpg',
        'img/Celia illustration collection/93160403_p0_master1200.jpg',
        'img/Celia illustration collection/93189035_p0_master1200.jpg',
        'img/Celia illustration collection/93364354_p0_master1200.jpg',
        'img/Celia illustration collection/94750043_p0_master1200.jpg',
        'img/Celia illustration collection/95467008_p0_master1200.jpg',
        'img/Celia illustration collection/96971670_p0_master1200.jpg',
        'img/Celia illustration collection/97617812_p0_master1200.jpg',
        'img/Celia illustration collection/97656941_p0_master1200.jpg',
        'img/Celia illustration collection/98599221_p0_master1200.jpg',
        'img/Celia illustration collection/bd2ba44bc27950d69d9bc1364c9347ef.jpeg',
        'img/Celia illustration collection/cs.png',
        'img/Celia illustration collection/d61bbfa99ee8e6bd7b83d727ef9bedaf660009991.jpg',
        'img/Celia illustration collection/IMG_0113.PNG',
        'img/Celia illustration collection/IMG_0114.PNG',
        'img/Celia illustration collection/IMG_0115.PNG',
        'img/Celia illustration collection/IMG_0116.PNG',
        'img/Celia illustration collection/IMG_0117.PNG',
        'img/Celia illustration collection/IMG_0118.PNG',
        'img/Celia illustration collection/IMG_0261.PNG',
        'img/Celia illustration collection/IMG_0262.PNG',
        'img/Celia illustration collection/IMG_0263.PNG',
        'img/Celia illustration collection/IMG_0265.PNG',
        'img/Celia illustration collection/IMG_0266.PNG',
        'img/Celia illustration collection/IMG_0267.PNG',
        'img/Celia illustration collection/IMG_0274.PNG',
        'img/Celia illustration collection/IMG_0275.PNG',
        'img/Celia illustration collection/IMG_0508.png',
        'img/Celia illustration collection/IMG_0612.JPG',
        'img/Celia illustration collection/IMG_0614.JPG',
        'img/Celia illustration collection/IMG_0961.JPG',
        'img/Celia illustration collection/IMG_0963.JPG',
        'img/Celia illustration collection/org.jpeg'
    ];
    
    const galleryGrid = document.querySelector('.gallery-grid');
    
    // 清空现有内容
    galleryGrid.innerHTML = '';
    
    // 加载所有图片
    imageFiles.forEach((imagePath, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `瑟莉亚插画 ${index+1}`;
        img.loading = 'lazy';
        
        // 添加点击放大功能
        img.addEventListener('click', function() {
            // 创建模态框显示大图
            showImageModal(imagePath);
        });
        
        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    });
}

// 显示图片模态框
function showImageModal(imageSrc) {
    // 创建模态框元素
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img src="${imageSrc}" alt="插画预览">
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 添加关闭事件
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // 添加ESC键关闭功能
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
        }
    });
}

// 设置导航高亮
function setupNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        // 清除当前高亮
        link.classList.remove('active');
        
        // 根据当前页面设置高亮
        if ((currentPage === '' || currentPage === 'index.html') && link.getAttribute('href') === 'index.html') {
            link.classList.add('active');
        } else if (currentPage === link.getAttribute('href')) {
            link.classList.add('active');
        }
    });
}

// 添加视差效果
function addParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    const characterImage = document.querySelector('.character-image');
    const characterInfo = document.querySelector('.character-info');
    const characterName = document.querySelector('.character-name');
    const mengniangLink = document.querySelector('.mengniang-link');
    const characterShowcase = document.querySelector('.character-showcase');
    
    if (heroSection && characterImage && characterInfo && characterShowcase) {
        // 使用requestAnimationFrame实现平滑的视差效果
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        const speed = 0.05; // 控制视差跟随速度，数值越小越平滑
        
        // 监听鼠标移动
        document.addEventListener('mousemove', (e) => {
            mouseX = (window.innerWidth / 2 - e.pageX) / 25; // 减小视差强度使更自然
            mouseY = (window.innerHeight / 2 - e.pageY) / 25;
        });
        
        // 使用缓动动画实现平滑的视差效果
        function animateParallax() {
            // 使用缓动公式使移动更平滑
            currentX += (mouseX - currentX) * speed;
            currentY += (mouseY - currentY) * speed;
            
            // 对不同元素应用不同程度的视差效果
            if (characterShowcase) {
                characterShowcase.style.transform = `translate(${currentX * 0.1}px, ${currentY * 0.1}px)`;
            }
            if (characterImage) {
                characterImage.style.transform = `translate(${currentX * 0.8}px, ${currentY * 0.8}px) scale(1.02)`;
            }
            if (characterInfo) {
                characterInfo.style.transform = `translate(${currentX * 0.4}px, ${currentY * 0.4}px)`;
            }
            if (characterName) {
                characterName.style.transform = `translate(${currentX * 0.3}px, ${currentY * 0.3}px)`;
            }
            if (mengniangLink) {
                mengniangLink.style.transform = `translate(${currentX * 0.5}px, ${currentY * 0.5}px)`;
            }
            
            requestAnimationFrame(animateParallax);
        }
        
        // 启动视差动画
        animateParallax();
    }
}

// 添加悬停效果
function addHoverEffects() {
    const characterImage = document.querySelector('.character-image');
    const characterName = document.querySelector('.character-name');
    const mengniangLink = document.querySelector('.mengniang-link');
    
    if (characterImage) {
        characterImage.addEventListener('mouseenter', () => {
            // 获取当前的变换样式并添加缩放效果
            const currentTransform = characterImage.style.transform;
            // 保持当前的3D变换并添加缩放
            if (currentTransform.includes('scale')) {
                // 如果已经有缩放，替换它
                const newTransform = currentTransform.replace(/scale\([^)]*\)/g, 'scale(1.05)');
                characterImage.style.transform = newTransform;
            } else {
                // 否则添加缩放
                characterImage.style.transform = `${currentTransform} scale(1.05)`;
            }
        });
        
        characterImage.addEventListener('mouseleave', () => {
            // 保持当前的3D变换，但移除额外的缩放
            const currentTransform = characterImage.style.transform;
            const baseTransform = currentTransform.replace(/scale\([^)]*\)/g, '').trim();
            // 重新添加基础的3D变换
            characterImage.style.transform = baseTransform + ' scale(1)';
        });
    }
    
    if (characterName) {
        characterName.addEventListener('mouseenter', () => {
            const currentTransform = characterName.style.transform;
            if (currentTransform.includes('scale')) {
                const newTransform = currentTransform.replace(/scale\([^)]*\)/g, 'scale(1.05)');
                characterName.style.transform = newTransform;
            } else {
                characterName.style.transform = `${currentTransform} scale(1.05)`;
            }
        });
        
        characterName.addEventListener('mouseleave', () => {
            const currentTransform = characterName.style.transform;
            const baseTransform = currentTransform.replace(/scale\([^)]*\)/g, '').trim();
            characterName.style.transform = baseTransform;
        });
    }
    
    if (mengniangLink) {
        mengniangLink.addEventListener('mouseenter', () => {
            const currentTransform = mengniangLink.style.transform;
            if (currentTransform.includes('scale')) {
                const newTransform = currentTransform.replace(/scale\([^)]*\)/g, 'scale(1.1)');
                mengniangLink.style.transform = newTransform;
            } else {
                mengniangLink.style.transform = `${currentTransform} scale(1.1)`;
            }
        });
        
        mengniangLink.addEventListener('mouseleave', () => {
            const currentTransform = mengniangLink.style.transform;
            const baseTransform = currentTransform.replace(/scale\([^)]*\)/g, '').trim();
            mengniangLink.style.transform = baseTransform;
        });
    }
}

// 初始化点击特效
function initClickEffect() {
    document.addEventListener('click', function(e) {
        // 创建点击特效元素
        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect';
        clickEffect.style.left = `${e.clientX}px`;
        clickEffect.style.top = `${e.clientY}px`;
        document.body.appendChild(clickEffect);
        
        // 动画结束后移除元素
        setTimeout(() => {
            clickEffect.remove();
        }, 600);
    });
}