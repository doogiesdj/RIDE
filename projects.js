// 프로젝트 관리 JavaScript

// 프로젝트 데이터 저장소
let projectsData = [];

// 프로젝트 로드
async function loadProjects() {
    try {
        // 로컬 스토리지에서 먼저 확인
        const localProjects = localStorage.getItem('projects');
        if (localProjects) {
            projectsData = JSON.parse(localProjects);
        } else {
            // JSON 파일에서 로드
            const response = await fetch('data/projects.json');
            projectsData = await response.json();
        }
        renderProjects(projectsData);
    } catch (error) {
        console.error('프로젝트 데이터를 로드하는 중 오류가 발생했습니다:', error);
        showNotification('프로젝트 데이터를 로드할 수 없습니다.', 'error');
    }
}

// 프로젝트 렌더링
function renderProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    // 기존 프로젝트 카드 삭제
    projectsGrid.innerHTML = '';
    
    // 프로젝트 카드 생성
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-year', project.year);
        projectCard.setAttribute('data-project-id', project.id);
        projectCard.onclick = () => showProjectDetail(project.id);
        
        projectCard.innerHTML = `
            <div class="project-header">
                <span class="project-year">${project.year}</span>
                <h3 class="project-title">${project.title}</h3>
            </div>
            <div class="project-content">
                <p class="project-overview">${project.overview}</p>
                <div class="project-client">
                    <strong>발주처:</strong> ${project.client}
                </div>
                <div class="project-action">
                    <button class="btn-view-detail">
                        <i class="fas fa-eye"></i> 상세보기
                    </button>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// 프로젝트 상세보기
function showProjectDetail(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
        showNotification('프로젝트 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    const modal = document.getElementById('projectDetailModal');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalBody = document.getElementById('modalProjectBody');
    
    // 모달 제목 설정
    modalTitle.textContent = project.title;
    
    // 모달 본문 설정
    let filesHtml = '';
    if (project.files && project.files.length > 0) {
        filesHtml = `
            <div class="project-files">
                <h4><i class="fas fa-file-download"></i> 결과물 다운로드</h4>
                <div class="files-list">
                    ${project.files.map(file => `
                        <div class="file-item">
                            <i class="fas fa-file-pdf"></i>
                            <span>${file.name}</span>
                            <a href="${file.path}" download class="btn-download">
                                <i class="fas fa-download"></i> 다운로드
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        filesHtml = `
            <div class="project-files">
                <p class="no-files"><i class="fas fa-info-circle"></i> 등록된 파일이 없습니다.</p>
            </div>
        `;
    }
    
    let resultsHtml = '';
    if (project.results && project.results.length > 0) {
        resultsHtml = `
            <div class="project-results">
                <h4><i class="fas fa-check-circle"></i> 주요 성과</h4>
                <ul>
                    ${project.results.map(result => `<li>${result}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="project-detail">
            <div class="project-info-grid">
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-calendar-alt"></i> 사업년도</span>
                    <span class="info-value">${project.year}년</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-building"></i> 발주처</span>
                    <span class="info-value">${project.client}</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-clock"></i> 사업기간</span>
                    <span class="info-value">${project.period || '미정'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label"><i class="fas fa-won-sign"></i> 사업예산</span>
                    <span class="info-value">${project.budget || '미공개'}</span>
                </div>
            </div>
            
            <div class="project-description">
                <h4><i class="fas fa-file-alt"></i> 사업 개요</h4>
                <p>${project.description}</p>
            </div>
            
            ${resultsHtml}
            ${filesHtml}
        </div>
    `;
    
    // 모달 표시
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 프로젝트 모달 닫기
function closeProjectModal() {
    const modal = document.getElementById('projectDetailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 프로젝트 필터링 (기존 함수 업데이트)
function filterProjects(year) {
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.projects-filter .filter-btn');
    const projectsGrid = document.getElementById('projectsGrid');
    
    // 버튼 상태 업데이트
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 그리드 컨테이너에 애니메이션 효과 추가
    projectsGrid.style.transition = 'all 0.3s ease';
    
    let visibleCount = 0;
    
    // 프로젝트 카드 필터링
    projectCards.forEach((card, index) => {
        const cardYear = card.dataset.year;
        
        if (year === 'all' || cardYear === year) {
            card.classList.remove('hidden');
            card.style.display = '';
            // 순차적으로 나타나는 애니메이션
            card.style.animationDelay = `${index * 0.05}s`;
            card.style.animation = 'fadeInUp 0.5s ease forwards';
            visibleCount++;
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
    
    // 필터링 결과 알림
    setTimeout(() => {
        const yearText = year === 'all' ? '전체' : `${year}년`;
        showNotification(`${yearText} 사업 ${visibleCount}개를 표시합니다.`, 'info');
    }, 300);
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
    const modal = document.getElementById('projectDetailModal');
    if (event.target === modal) {
        closeProjectModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('projectDetailModal');
        if (modal && modal.style.display === 'block') {
            closeProjectModal();
        }
    }
});

// DOM 로드 후 프로젝트 로드
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjects);
} else {
    loadProjects();
}
