// 프로젝트 관리 JavaScript

// 프로젝트 데이터 저장소
let projectsData = [];

// 년도 필터 버튼 초기화
function initializeYearFilters() {
    const currentYear = new Date().getFullYear();
    const startYear = 2020;
    const filterContainer = document.getElementById('projectsFilter');
    
    if (!filterContainer) return;
    
    // 기존 년도 버튼들 제거 (전체 버튼은 유지)
    const existingButtons = filterContainer.querySelectorAll('.filter-btn:not(:first-child)');
    existingButtons.forEach(btn => btn.remove());
    
    // 프로젝트 데이터에서 실제 존재하는 년도 추출
    const existingYears = [...new Set(projectsData.map(p => p.year))].sort((a, b) => b - a);
    
    // 현재 년도부터 시작 년도까지 또는 실제 데이터가 있는 년도만 표시
    const yearsToShow = [];
    for (let year = currentYear; year >= startYear; year--) {
        if (existingYears.includes(year.toString()) || year >= currentYear - 1) {
            yearsToShow.push(year);
        }
    }
    
    // 년도 버튼 추가
    yearsToShow.forEach(year => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = `${year}년`;
        button.onclick = function() { filterProjects(year.toString()); };
        filterContainer.appendChild(button);
    });
}

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
        initializeYearFilters(); // 필터 버튼 생성
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
        
        // 사업 요약 파일 찾기
        const summaryFile = project.files && project.files.length > 0 ? project.files[0] : null;
        
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
                    ${summaryFile ? `
                    <button class="btn-view-summary" onclick="event.stopPropagation(); viewProjectSummary('${project.id}')">
                        <i class="fas fa-file-alt"></i> 사업 요약
                    </button>
                    ` : ''}
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

// 프로젝트 요약 모달 닫기
function closeProjectSummaryModal() {
    const modal = document.getElementById('projectSummaryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 사업 요약 보기
async function viewProjectSummary(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
        showNotification('프로젝트 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    
    if (!project.files || project.files.length === 0) {
        showNotification('업로드된 사업 요약 파일이 없습니다.', 'error');
        return;
    }
    
    const summaryFile = project.files[0];
    const modal = document.getElementById('projectSummaryModal');
    const modalTitle = document.getElementById('modalSummaryTitle');
    const modalBody = document.getElementById('modalSummaryBody');
    
    if (!modal) {
        // 모달이 없으면 생성
        createSummaryModal();
        return viewProjectSummary(projectId); // 재귀 호출
    }
    
    // 모달 제목 설정
    modalTitle.textContent = `${project.title} - 사업 요약`;
    
    // 파일 확장자 확인
    const fileExt = summaryFile.name.toLowerCase().split('.').pop();
    
    // Base64 데이터를 Blob URL로 변환
    let blobUrl = '';
    if (summaryFile.data) {
        try {
            const base64Data = summaryFile.data.split(',')[1];
            const mimeType = summaryFile.type || 'application/octet-stream';
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            blobUrl = URL.createObjectURL(blob);
        } catch (error) {
            console.error('파일 변환 오류:', error);
            showNotification('파일을 불러올 수 없습니다.', 'error');
            return;
        }
    } else {
        // 기존 경로 방식 (하위 호환성)
        blobUrl = summaryFile.path || '';
    }
    
    // 파일 내용 표시
    if (fileExt === 'pdf') {
        // PDF 뷰어
        modalBody.innerHTML = `
            <div class="file-viewer">
                <div class="file-info">
                    <i class="fas fa-file-pdf"></i>
                    <span>${summaryFile.name}</span>
                </div>
                <div class="pdf-viewer-container">
                    <iframe src="${blobUrl}" width="100%" height="600px" style="border: none; border-radius: 8px;"></iframe>
                </div>
                <div class="file-actions">
                    <a href="${blobUrl}" download="${summaryFile.name}" class="btn-download-large">
                        <i class="fas fa-download"></i> 다운로드
                    </a>
                    <a href="${blobUrl}" target="_blank" class="btn-open-new">
                        <i class="fas fa-external-link-alt"></i> 새 창에서 열기
                    </a>
                </div>
            </div>
        `;
    } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExt)) {
        // Office 파일 - Base64로는 Google Viewer 사용 불가
        modalBody.innerHTML = `
            <div class="file-viewer">
                <div class="file-info">
                    <i class="fas fa-file-word"></i>
                    <span>${summaryFile.name}</span>
                </div>
                <div class="file-info-large">
                    <i class="fas fa-file-word" style="font-size: 64px; color: #2b579a;"></i>
                    <h3>${summaryFile.name}</h3>
                    <p style="color: #666;">파일 크기: ${formatFileSize(summaryFile.size)}</p>
                </div>
                <p style="color: #666; text-align: center; margin: 20px 0;">
                    <i class="fas fa-info-circle"></i> Office 문서는 다운로드하여 확인하세요.
                </p>
                <div class="file-actions">
                    <a href="${blobUrl}" download="${summaryFile.name}" class="btn-download-large">
                        <i class="fas fa-download"></i> 다운로드
                    </a>
                </div>
            </div>
        `;
    } else {
        // 기타 파일 - 다운로드만 가능
        modalBody.innerHTML = `
            <div class="file-viewer">
                <div class="file-info-large">
                    <i class="fas fa-file" style="font-size: 64px; color: #667eea;"></i>
                    <h3>${summaryFile.name}</h3>
                    <p style="color: #666;">파일 크기: ${formatFileSize(summaryFile.size)}</p>
                </div>
                <p style="color: #666; text-align: center; margin: 20px 0;">
                    이 파일은 브라우저에서 미리보기를 지원하지 않습니다.<br>
                    다운로드하여 확인하세요.
                </p>
                <div class="file-actions">
                    <a href="${blobUrl}" download="${summaryFile.name}" class="btn-download-large">
                        <i class="fas fa-download"></i> 다운로드
                    </a>
                </div>
            </div>
        `;
    }
    
    // 모달 표시
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 요약 모달 생성
function createSummaryModal() {
    const modalHtml = `
        <div id="projectSummaryModal" class="modal">
            <div class="modal-content summary-modal-content">
                <div class="modal-header">
                    <h3 id="modalSummaryTitle">사업 요약</h3>
                    <span class="close" onclick="closeProjectSummaryModal()">&times;</span>
                </div>
                <div class="modal-body" id="modalSummaryBody">
                    <!-- 파일 내용이 여기에 표시됩니다 -->
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 파일 크기 포맷 (admin.js와 동일)
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
    const detailModal = document.getElementById('projectDetailModal');
    const summaryModal = document.getElementById('projectSummaryModal');
    
    if (event.target === detailModal) {
        closeProjectModal();
    }
    
    if (event.target === summaryModal) {
        closeProjectSummaryModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const detailModal = document.getElementById('projectDetailModal');
        const summaryModal = document.getElementById('projectSummaryModal');
        
        if (detailModal && detailModal.style.display === 'block') {
            closeProjectModal();
        }
        
        if (summaryModal && summaryModal.style.display === 'block') {
            closeProjectSummaryModal();
        }
    }
});

// DOM 로드 후 프로젝트 로드
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjects);
} else {
    loadProjects();
}
