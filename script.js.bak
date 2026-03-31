// RIDE 홈페이지 JavaScript

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeFormHandling();
    initializeChatbot();
    initializeOrgChart();
    initializeScrollAnimations();
    initializeHeaderScroll();
});

// 네비게이션 초기화
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 메뉴 링크 클릭 시 모바일 메뉴 닫기
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// 헤더 스크롤 효과 초기화
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 스크롤 애니메이션 초기화
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // 스크롤 애니메이션 대상 요소들 관찰
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// 부드러운 스크롤링 초기화
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 폼 처리 초기화
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }
}

// 폼 제출 처리
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const formObject = {};
    
    // 폼 데이터 수집
    form.querySelectorAll('input, textarea').forEach(input => {
        if (input.type !== 'submit') {
            formObject[input.placeholder] = input.value;
        }
    });
    
    // 간단한 유효성 검사
    if (!formObject['이름'] || !formObject['이메일'] || !formObject['제목'] || !formObject['메시지']) {
        showNotification('모든 필드를 입력해주세요.', 'error');
        return;
    }
    
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject['이메일'])) {
        showNotification('올바른 이메일 주소를 입력해주세요.', 'error');
        return;
    }
    
    // 성공 메시지 표시
    showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
    form.reset();
}

// 알림 표시
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 스타일 적용
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// PDF 뷰어 열기
function openPDFViewer() {
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // PDF 로드 확인
        const iframe = document.getElementById('pdfViewer');
        if (iframe) {
            iframe.onload = function() {
                console.log('PDF가 성공적으로 로드되었습니다.');
            };
            
            iframe.onerror = function() {
                showNotification('PDF 파일을 로드할 수 없습니다. 파일 경로를 확인해주세요.', 'error');
            };
        }
    }
}

// PDF 뷰어 닫기
function closePDFViewer() {
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
    const modal = document.getElementById('pdfModal');
    if (event.target === modal) {
        closePDFViewer();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePDFViewer();
    }
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
`;
document.head.appendChild(style);

// 챗봇 초기화
function initializeChatbot() {
    const chatbotInput = document.getElementById('chatbotInput');
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// 메시지 전송
function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (message) {
        addUserMessage(message);
        input.value = '';
        
        // 챗봇 응답 생성
        setTimeout(() => {
            const response = generateResponse(message);
            addBotMessage(response);
        }, 1000);
    }
}

// 사용자 메시지 추가
function addUserMessage(message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
    `;
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

// 봇 메시지 추가
function addBotMessage(message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
    `;
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

// RIDE 소개 자료 기반 Q&A 데이터베이스
const rideQA = {
    // 기본 정보
    "설립연도": "디지털경제사회연구원(RIDE)은 2021년에 설립되었습니다. 디지털 전환 시대의 도래와 함께 디지털 경제와 사회 변화에 대한 체계적인 연구의 필요성을 인식하여 전문 연구기관으로 출범하게 되었습니다.",
    
    "설립목적": "디지털경제사회연구원(RIDE)은 2021년에 설립되었습니다. 디지털 전환(DX) 시대의 도래와 함께 디지털 경제와 사회 변화에 대한 체계적인 연구의 필요성을 인식하여 전문 연구기관으로 출범하였습니다. 또한 디지털 전환을 넘어 인공지능 전환(AX) 시대로 진입 발전하면서 AI 분야와 이공계열 분야와 인문사회경제 분야가 공동으로 협력해서 해결해야 할 다양한 정책 개발 및 사회문제가 대두되면서 이를 해결하는 연구에 집중하고 있습니다.",
    
    "법인형태": "디지털경제사회연구원은 사단법인으로 설립된 비영리 연구기관입니다. 공공의 이익을 위해 디지털 경제와 사회 연구를 수행합니다.",
    
    "영문명칭": "디지털경제사회연구원의 영문명칭은 'Research Institute for Digital Economy and Society'이며, 약칭은 'RIDE'입니다.",
    
    // 비전/미션
    "비전": "RIDE는 디지털 기술과 사회의 조화로운 발전을 바탕으로 인공지능 전환(AX)을 선도하며, 모두가 디지털 혁신의 혜택을 누릴 수 있는 포용적이고 지속가능한 디지털 사회를 구현하는 것을 목표로 합니다.",
    
    "미션": "우리는 디지털 포용성과 격차 해소, 그리고 AI 기반의 지속가능한 발전 전략을 통해 사회적 가치와 혁신적 성장을 동시에 추구합니다.",
    
    "핵심가치": "혁신성(새로운 관점과 방법론 추구), 포용성(모든 사람이 디지털 혜택을 누릴 수 있는 사회), 지속가능성(환경과 사회를 고려한 디지털 발전)이 핵심가치입니다.",
    
    // 조직구조
    "조직구조": "이사회(최고 의사결정기구), 고문, 감사, 대표이사(원장:연구원 운영 총괄), 자문위원회(연구업무 자문)을 두며, 원장 산하에 전문 분야로서 총괄기획분야, 경제사회분야, 과학기술분야, 국제개발협력분야, 사무국이 있습니다. 자세한 업무를 살펴보려면, 조직도 상세보기를 클릭하시기 바랍니다.",
    
    "이사회": "이사회는 연구원의 최고 의사결정기구로, 주요 정책 결정과 연구 방향을 설정합니다. 연구원의 전략적 방향을 제시하고 운영을 감독합니다.",
    
    "원장역할": "원장은 연구원의 운영을 총괄하며, 연구 전략 수립, 외부 기관과의 협력, 연구원의 대표 역할을 수행합니다.",
    
    "연구센터": "디지털경제연구센터(경제 분야 연구), 디지털사회연구센터(사회 분야 연구), 정책개발센터(정책 개발)로 구성되어 있으며, 각각 전문 분야의 연구를 수행합니다.",
    
    // 연구분야
    "주요연구분야": "RIDE는 인문사회와 이공학의 융합을 토대로 디지털 경제 정책, 사회 변화, 그리고 기술의 사회적 영향을 심층적으로 연구합니다. 이를 기반으로 디지털 포용성과 격차 해소 방안을 제시하고, 지속가능한 디지털 발전 전략을 수립하며, 나아가 인공지능 전환(AX) 시대에 요구되는 첨단 AI 기술을 접목해 사회와 산업이 직면한 복합적 문제 해결을 실현하고자 합니다.",
    
    "디지털경제연구": "디지털 기술이 경제에 미치는 영향을 분석하고, 디지털 경제 정책의 효과를 연구합니다. 데이터 경제, 플랫폼 경제, 디지털 금융 등 다양한 분야를 다룹니다.",
    
    "디지털사회연구": "디지털 기술이 사회에 미치는 영향을 연구하고, 디지털 사회의 변화를 분석합니다. 디지털 격차, 디지털 포용성, 디지털 윤리 등이 주요 연구 주제입니다.",
    
    "정책개발": "연구 성과를 바탕으로 정부 정책에 기여할 수 있는 정책 방안을 개발하고 제안합니다. 실현 가능하고 효과적인 정책 대안을 제시합니다.",
    
    // 사업실적
    "2024년사업": "2024년에는 디지털 경제 정책 연구, 디지털 사회 변화 분석, AI 윤리 가이드라인 개발, 디지털 정부 서비스 혁신, 블록체인 활용 정책, 디지털 헬스케어 정책, 스마트 모빌리티 정책 등 7개 사업을 수행했습니다.",
    
    "2023년사업": "2023년에는 디지털 포용성 정책 연구, 스마트시티 정책 개발, 데이터 경제 활성화 방안, 디지털 교육 정책, 그린 디지털 정책, 디지털 금융 정책, 디지털 농업 정책 등 7개 사업을 수행했습니다.",
    
    "2022년사업": "2022년에는 디지털 뉴딜 정책 평가, 메타버스 정책 연구, 디지털 문화정책, 디지털 노동정책, 디지털 중소기업 정책, 디지털 에너지 정책 등 6개 사업을 수행했습니다.",
    
    "2021년사업": "2021년에는 디지털 전환 정책 수립, 사이버보안 정책 연구, 디지털 복지정책, 디지털 환경정책 등 4개 사업을 수행했습니다.",
    
    "총사업수": "설립 이후 총 20여 건의 정부 연구사업을 성공적으로 수행했습니다. 각 사업은 정부의 디지털 정책 수립에 기여하는 의미 있는 성과를 창출했습니다.",
    
    // 협력기관
    "협력기관": "과학기술정보통신부, 행정안전부, 보건복지부, 국토교통부, 기획재정부, 교육부, 환경부, 금융위원회, 농림축산식품부, 문화체육관광부, 고용노동부, 중소벤처기업부, 산업통상자원부 등 다양한 정부기관과 협력하고 있습니다.",
    
    "연구협력": "국가과학기술연구회, 각종 정책연구원, 국내 주요 대학 연구소, 디지털 기술 관련 기업 및 스타트업과 공동 연구 프로젝트를 수행하고 있습니다.",
    
    "협력분야": "공동 연구 프로젝트 수행, 정책 자문 및 컨설팅, 세미나 및 워크숍 개최, 연구 성과 공유 및 확산 등 다양한 분야에서 협력하고 있습니다.",
    
    // 성과
    "주요성과": "2021년 설립 이후 20여 건의 정부 연구사업 수행, 디지털 경제 및 사회 분야 정책 보고서 다수 발간, 정부 정책 수립에 기여한 연구 성과 창출이 주요 성과입니다.",
    
    "정책기여": "디지털 뉴딜 정책 평가 및 개선방안 제시, AI 윤리 가이드라인 개발 참여, 스마트시티 정책 방향성 제시, 디지털 포용성 정책 수립 지원 등 정부 정책에 실질적으로 기여했습니다.",
    
    "사회적기여": "디지털 격차 해소 방안 연구, 지속가능한 디지털 발전 전략 제시, 디지털 사회 변화에 대한 인식 제고 등 사회적 가치 창출에 기여하고 있습니다.",
    
    // 연락처
    "연락처": "디지털경제사회연구원 연락처 정보입니다.<br><br>주소:<br>세종특별자치시 집현중앙7로 6, 대명벨리온 주1동 A1013호(집현동, 지식산업센터)<br><br>전화:<br>010-3942-1538<br><br>이메일:<br>aia.hmkim@gmail.com<br><br>대중교통을 이용하시거나 자가용으로 방문하실 수 있습니다.<br>자세한 길찾기가 필요하시면 전화로 문의해 주세요.<br><br><a href='https://map.naver.com/v5/search/세종특별자치시+집현중앙7로+6+대명벨리온+주1동+A1013호' target='_blank' style='display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; padding: 8px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: 500; transition: all 0.3s ease;'><i class='fas fa-directions'></i> 네이버 지도로 길찾기</a>",
    
    "주소": "세종특별자치시 집현중앙7로 6, 대명벨리온 주1동 A1013호(집현동, 지식산업센터)에 위치하고 있습니다.",
    
    "전화번호": "010-3942-1538로 연락하실 수 있습니다.",
    
    "이메일": "aia.hmkim@gmail.com으로 이메일을 보내실 수 있습니다.",
    
    "방문안내": "대중교통을 이용하시거나 자가용으로 방문하실 수 있습니다. 자세한 길찾기가 필요하시면 전화로 문의해 주세요.",
    
    // 기타
    "소개자료": "RIDE 소개자료는 홈페이지 상단의 '소개자료' 섹션에서 온라인으로 보시거나 다운로드하실 수 있습니다. 연구원의 비전, 미션, 주요 연구분야 등에 대한 자세한 정보가 포함되어 있습니다.",
    
    "향후계획": "앞으로도 디지털 사회 발전에 기여하는 연구를 지속적으로 수행하며, 특히 인공지능 전환(AX)이 가져올 사회·산업적 변화를 심층적으로 탐구하겠습니다. 디지털 기술과 AI의 융합을 기반으로 새로운 연구 주제를 발굴하고, 정책적 대안을 제시함으로써 사회적 가치 창출과 지속가능한 디지털 혁신에 기여하겠습니다."
};

// 챗봇 응답 생성
function generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Q&A 데이터베이스에서 직접 매칭
    for (const [key, answer] of Object.entries(rideQA)) {
        if (message.includes(key.toLowerCase()) || 
            (key === '설립연도' && (message.includes('설립') || message.includes('언제') || message.includes('연도') || message.includes('창립'))) ||
            (key === '설립목적' && (message.includes('목적') || message.includes('왜') || message.includes('설립이유'))) ||
            (key === '법인형태' && (message.includes('법인') || message.includes('형태') || message.includes('기관'))) ||
            (key === '영문명칭' && (message.includes('영문') || message.includes('english') || message.includes('약칭'))) ||
            (key === '비전' && (message.includes('비전') || message.includes('vision'))) ||
            (key === '미션' && (message.includes('미션') || message.includes('mission'))) ||
            (key === '핵심가치' && (message.includes('가치') || message.includes('value'))) ||
            (key === '조직구조' && (message.includes('조직') || message.includes('구조') || message.includes('부서') || message.includes('센터'))) ||
            (key === '이사회' && (message.includes('이사회'))) ||
            (key === '원장역할' && (message.includes('원장') || message.includes('역할'))) ||
            (key === '연구센터' && (message.includes('연구센터') || message.includes('센터'))) ||
            (key === '주요연구분야' && (message.includes('연구') || message.includes('분야') || message.includes('업무'))) ||
            (key === '디지털경제연구' && (message.includes('디지털경제') || message.includes('경제연구'))) ||
            (key === '디지털사회연구' && (message.includes('디지털사회') || message.includes('사회연구'))) ||
            (key === '정책개발' && (message.includes('정책개발') || message.includes('정책'))) ||
            (key === '2024년사업' && (message.includes('2024') || message.includes('올해'))) ||
            (key === '2023년사업' && (message.includes('2023'))) ||
            (key === '2022년사업' && (message.includes('2022'))) ||
            (key === '2021년사업' && (message.includes('2021'))) ||
            (key === '총사업수' && (message.includes('총') || message.includes('전체') || message.includes('모든'))) ||
            (key === '협력기관' && (message.includes('협력') || message.includes('파트너') || message.includes('제휴'))) ||
            (key === '연구협력' && (message.includes('연구협력') || message.includes('공동연구'))) ||
            (key === '협력분야' && (message.includes('협력분야') || message.includes('협력영역'))) ||
            (key === '주요성과' && (message.includes('성과') || message.includes('실적') || message.includes('결과'))) ||
            (key === '정책기여' && (message.includes('정책기여') || message.includes('기여'))) ||
            (key === '사회적기여' && (message.includes('사회적') || message.includes('사회기여'))) ||
            (key === '연락처' && (message.includes('연락처') || message.includes('연락') || message.includes('contact'))) ||
            (key === '주소' && (message.includes('주소') || message.includes('위치') || message.includes('어디'))) ||
            (key === '전화번호' && (message.includes('전화') || message.includes('번호'))) ||
            (key === '이메일' && (message.includes('이메일') || message.includes('email'))) ||
            (key === '방문안내' && (message.includes('방문') || message.includes('찾아'))) ||
            (key === '소개자료' && (message.includes('자료') || message.includes('브로셔') || message.includes('pdf'))) ||
            (key === '향후계획' && (message.includes('향후') || message.includes('미래') || message.includes('계획')))
        ) {
            return answer;
        }
    }
    
    // 연구원 소개 관련 (기본)
    if (message.includes('연구원') || message.includes('소개') || message.includes('rid') || message.includes('디지털경제사회연구원')) {
        return `디지털경제사회연구원(RIDE)은 디지털 경제와 사회의 변화를 연구하는 전문 연구기관입니다. 
        우리는 디지털 기술이 경제와 사회에 미치는 영향을 분석하고, 
        지속가능한 디지털 사회 구현을 위한 정책과 솔루션을 제시합니다.`;
    }
    
    // 인사 관련
    if (message.includes('안녕') || message.includes('hello') || message.includes('hi') || message.includes('반가워')) {
        return `안녕하세요! 😊 디지털경제사회연구원 챗봇입니다. 
        연구원에 대해 궁금한 것이 있으시면 언제든지 물어보세요!`;
    }
    
    // 기본 응답
    return `죄송합니다. 해당 질문에 대한 구체적인 답변을 드리기 어렵습니다. 
    다음과 같은 주제로 질문해 주시면 더 정확한 답변을 드릴 수 있습니다:
    
    📋 **기본 정보:**
    • 연구원 소개 및 비전/미션
    • 설립연도 및 설립배경
    • 조직구조 및 연구진
    
    🔬 **연구 활동:**
    • 주요 연구분야
    • 사업실적 및 프로젝트
    • 연구 성과 및 업적
    
    🤝 **협력 및 네트워크:**
    • 협력기관 및 파트너십
    • 정책 기여 및 사회적 역할
    
    📞 **연락 정보:**
    • 연락처 및 위치
    • 소개자료 및 브로셔
    
    또는 직접 전화(010-3942-1538)나 이메일(aia.hmkim@gmail.com)로 문의해 주세요!`;
}

// 제안 질문 클릭
function askQuestion(question) {
    const input = document.getElementById('chatbotInput');
    input.value = question;
    sendMessage();
}

// 채팅창 맨 아래로 스크롤
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbotMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 조직도 관련 함수들 (HTML 조직도용)
function initializeOrgChart() {
    // HTML 조직도는 별도의 초기화가 필요하지 않음
    // 각 조직 박스는 이미 HTML에서 정의되어 있음
    console.log('HTML 조직도가 초기화되었습니다.');
}

function showOrgDetails(orgName) {
    const orgInfo = getOrgInfo(orgName);
    
    // 더 상세한 정보와 함께 모달 형태로 표시
    const modal = document.createElement('div');
    modal.className = 'org-detail-modal';
    modal.innerHTML = `
        <div class="org-detail-content">
            <div class="org-detail-header">
                <h3>${orgInfo.name}</h3>
                <span class="close-org-detail" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</span>
            </div>
            <div class="org-detail-body">
                <p><strong>역할:</strong> ${orgInfo.description}</p>
                <p><strong>주요 업무:</strong></p>
                <p style="white-space: pre-line; margin-left: 1rem;">${orgInfo.role}</p>
                <p><strong>연락처:</strong> ${orgInfo.contact}</p>
            </div>
        </div>
    `;
    
    // 모달 스타일 추가
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function getOrgInfo(orgName) {
    const orgData = {
        '총회': {
            name: '총회',
            description: '연구원의 최고 의사결정기구로, 연구원의 기본 정책과 중요 사항을 결정합니다.',
            role: '• 연구원 정관 변경\n• 예산 승인\n• 이사 선임 및 해임\n• 중요 사항 심의 결정',
            contact: '총회 (010-3942-1538)'
        },
        '이사장': {
            name: '이사장',
            description: '연구원의 대표이자 최고 경영자로, 연구원의 전반적인 운영을 책임집니다.',
            role: '• 연구원 대표\n• 이사회 소집 및 주재\n• 연구원 운영 총괄\n• 대외 협력 및 교류',
            contact: '이사장 (010-3942-1538)'
        },
        '대표이사': {
            name: '대표이사',
            description: '연구원의 일상적인 운영을 담당하며, 각 부서의 업무를 총괄 관리합니다.',
            role: '• 연구원 운영 관리\n• 부서별 업무 조율\n• 연구 프로젝트 관리\n• 행정 업무 총괄',
            contact: '대표이사 (010-3942-1538)'
        },
        '고문': {
            name: '고문',
            description: '연구원의 발전을 위한 자문 역할을 수행하는 전문가들입니다.',
            role: '• 연구원 발전 자문\n• 정책 방향 제시\n• 전문 분야 조언\n• 네트워크 구축 지원',
            contact: '고문 (010-3942-1538)'
        },
        '이사회': {
            name: '이사회',
            description: '연구원의 의사결정기구로, 주요 정책과 운영 방향을 결정합니다.',
            role: '• 주요 정책 결정\n• 예산 심의\n• 조직 운영 감독\n• 연구 방향 설정',
            contact: '이사회 (010-3942-1538)'
        },
        '감사': {
            name: '감사',
            description: '연구원의 회계와 업무를 감사하여 투명한 운영을 보장합니다.',
            role: '• 회계 감사\n• 업무 감사\n• 내부 통제 점검\n• 감사 보고서 작성',
            contact: '감사 (010-3942-1538)'
        },
        '자문위원회': {
            name: '자문위원회',
            description: '연구원의 연구 활동과 정책 수립에 전문적인 자문을 제공합니다.',
            role: '• 연구 방향 자문\n• 정책 수립 지원\n• 전문 분야 조언\n• 연구 성과 평가',
            contact: '자문위원회 (010-3942-1538)'
        },
        '총괄기획분야': {
            name: '총괄기획분야',
            description: '연구원의 전반적인 기획과 계획 수립을 담당하는 부서입니다.',
            role: '• 연구원 전략 기획\n• 연구 계획 수립\n• 예산 기획\n• 성과 관리',
            contact: '총괄기획분야 (010-3942-1538)'
        },
        '경제사회분야': {
            name: '경제사회분야',
            description: '디지털 경제와 사회 변화에 대한 연구를 수행하는 부서입니다.',
            role: '• 디지털 경제 연구\n• 사회 변화 분석\n• 경제 정책 연구\n• 사회 정책 개발',
            contact: '경제사회분야 (010-3942-1538)'
        },
        '과학기술분야': {
            name: '과학기술분야',
            description: '디지털 기술과 과학기술 정책에 대한 연구를 수행하는 부서입니다.',
            role: '• 디지털 기술 연구\n• 과학기술 정책 연구\n• 기술 혁신 분석\n• R&D 정책 개발',
            contact: '과학기술분야 (010-3942-1538)'
        },
        '국제개발협력': {
            name: '국제개발협력',
            description: '국제적인 개발협력과 글로벌 디지털 정책에 대한 연구를 수행합니다.',
            role: '• 국제 개발협력 연구\n• 글로벌 디지털 정책 분석\n• 국제 교류 협력\n• 해외 프로젝트 관리',
            contact: '국제개발협력 (010-3942-1538)'
        },
        '사무국': {
            name: '사무국',
            description: '연구원의 행정 업무와 지원 업무를 담당하는 부서입니다.',
            role: '• 일반 행정 업무\n• 인사 관리\n• 회계 관리\n• 시설 관리',
            contact: '사무국 (010-3942-1538)'
        }
    };
    
    return orgData[orgName] || {
        name: orgName,
        description: '정보를 찾을 수 없습니다.',
        role: '상세 정보 없음',
        contact: '문의 필요 (010-3942-1538)'
    };
}

function showOrganizationDetails() {
    console.log('showOrganizationDetails 함수 호출됨');
    const modal = document.getElementById('orgDetailModal');
    
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('모달이 표시되었습니다');
    } else {
        console.error('orgDetailModal 요소를 찾을 수 없습니다');
        alert('조직도 상세보기 기능을 준비 중입니다.');
    }
}

function closeOrgDetailModal() {
    const modal = document.getElementById('orgDetailModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('모달이 닫혔습니다');
    }
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('orgDetailModal');
    if (event.target === modal) {
        closeOrgDetailModal();
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('orgDetailModal');
        if (modal && modal.style.display === 'block') {
            closeOrgDetailModal();
        }
    }
});

// 프로젝트 필터링 함수
function filterProjects(year) {
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.projects-filter .filter-btn');
    const projectsGrid = document.getElementById('projectsGrid');
    
    // 버튼 상태 업데이트
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 그리드 컨테이너에 애니메이션 효과 추가
    projectsGrid.style.transition = 'all 0.3s ease';
    
    // 프로젝트 카드 필터링
    projectCards.forEach((card, index) => {
        const cardYear = card.dataset.year;
        
        if (year === 'all' || cardYear === year) {
            card.classList.remove('hidden');
            // 순차적으로 나타나는 애니메이션
            card.style.animationDelay = `${index * 0.1}s`;
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.classList.add('hidden');
        }
    });
    
    // 필터링 결과 알림
    setTimeout(() => {
        const visibleCards = document.querySelectorAll('.project-card:not(.hidden)');
        const yearText = year === 'all' ? '전체' : `${year}년`;
        showNotification(`${yearText} 사업 ${visibleCards.length}개를 표시합니다.`, 'info');
    }, 300);
}
