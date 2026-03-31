// 프로젝트 관리 JavaScript

// 알림 함수 (script.js에 없는 경우 대비)
function showNotification(message, type = 'info') {
    console.log(`[알림-${type}]`, message);
    alert(message); // 임시로 alert 사용
}

// 프로젝트 데이터 저장소 (전역으로 노출)
// 전역 변수로만 사용하고 로컬 변수는 사용하지 않음
if (!window.projectsData) {
    window.projectsData = [];
}

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
    const existingYears = [...new Set(window.projectsData.map(p => p.year))].sort((a, b) => b - a);
    
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
        console.log('=== 프로젝트 로드 시작 ===');
        
        // 원본 JSON 파일에서 최신 데이터 로드 (admin.js와 동일)
        const response = await fetch('data/projects.json?bust=' + new Date().getTime());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonProjects = await response.json();
        
        console.log(`JSON 파일에서 ${jsonProjects.length}개 프로젝트 로드됨`);
        
        // 파일 정보 확인
        jsonProjects.forEach((p, i) => {
            const hasFiles = p.files && p.files.length > 0;
            console.log(`[${i+1}] ${p.title} (${p.year}년) - 파일: ${hasFiles ? p.files.length + '개' : '없음'}`);
        });
        
        // window.projectsData에 저장
        window.projectsData = jsonProjects;
        
        console.log('=== projectsData 설정 완료 ===');
        console.log('projectsData 길이:', window.projectsData.length);
        
        initializeYearFilters(); // 필터 버튼 생성
        renderProjects(window.projectsData);
    } catch (error) {
        console.error('프로젝트 데이터를 로드하는 중 오류가 발생했습니다:', error);
        
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #e74c3c; width: 100%;">
                    <i class="fas fa-exclamation-triangle"></i> 
                    프로젝트 데이터를 불러올 수 없습니다.<br>
                    <small>오류: ${error.message}</small>
                </div>
            `;
        }
        
        if (typeof showNotification === 'function') {
            showNotification('프로젝트 데이터를 로드할 수 없습니다.', 'error');
        }
    }
}

// 프로젝트 렌더링
function renderProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) {
        console.error('projectsGrid 요소를 찾을 수 없습니다.');
        return;
    }
    
    // 기존 프로젝트 카드 삭제 (로딩 메시지 포함)
    projectsGrid.innerHTML = '';
    
    console.log('프로젝트 렌더링:', projects.length, '개');
    
    if (!projects || projects.length === 0) {
        projectsGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #666; width: 100%;">등록된 프로젝트가 없습니다.</div>';
        return;
    }
    
    // 프로젝트 카드 생성
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-year', project.year);
        projectCard.setAttribute('data-project-id', project.id);
        
        // 사업 요약 파일 찾기
        const hasFiles = project.files && project.files.length > 0;
        console.log(`프로젝트 "${project.title}" - 파일:`, hasFiles ? project.files.length + '개' : '없음');
        
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
                ${hasFiles ? `
                <div class="project-action">
                    <button class="btn-view-file" onclick="viewProjectSummary('${project.id}')">
                        <i class="fas fa-file-pdf"></i> 파일 보기
                    </button>
                </div>
                ` : ''}
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
        
        // 파일 보기 버튼은 onclick으로 직접 연결 (admin.js와 동일)
        if (hasFiles) {
            console.log(`✓ 파일 보기 버튼 생성: ${project.title} (ID: ${project.id})`);
        }
    });
}

// 프로젝트 상세보기
function showProjectDetail(projectId) {
    const project = window.projectsData.find(p => p.id === projectId);
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
                <h4><i class="fas fa-file-download"></i> 첨부파일</h4>
                <div class="files-list">
                    ${project.files.map((file, index) => `
                        <div class="file-item">
                            <i class="fas fa-file-pdf"></i>
                            <span>${file.name}</span>
                            <button class="btn-view" data-project-id="${project.id}" data-file-index="${index}">
                                <i class="fas fa-file-alt"></i> 파일 보기
                            </button>
                            <button class="btn-download" data-project-id="${project.id}" data-file-index="${index}">
                                <i class="fas fa-download"></i> 다운로드
                            </button>
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
    
    // 파일 버튼 이벤트 리스너 추가
    setTimeout(() => {
        // 파일 보기 버튼들
        const viewButtons = modal.querySelectorAll('.btn-view');
        viewButtons.forEach(btn => {
            const projectId = btn.getAttribute('data-project-id');
            const fileIndex = parseInt(btn.getAttribute('data-file-index'));
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('파일 보기 클릭:', projectId, fileIndex);
                viewFileInModal(projectId, fileIndex);
            });
        });
        
        // 다운로드 버튼들
        const downloadButtons = modal.querySelectorAll('.btn-download');
        downloadButtons.forEach(btn => {
            const projectId = btn.getAttribute('data-project-id');
            const fileIndex = parseInt(btn.getAttribute('data-file-index'));
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('다운로드 클릭:', projectId, fileIndex);
                downloadFile(projectId, fileIndex);
            });
        });
    }, 100);
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

// 사업 요약 보기 (admin.js와 동일한 방식)
async function viewProjectSummary(projectId) {
    console.log('=== viewProjectSummary 호출됨 ===');
    console.log('프로젝트 ID:', projectId);
    
    try {
        // window.projectsData에서 프로젝트 찾기
        let project = window.projectsData.find(p => p.id === projectId);
        
        // window.projectsData가 비어있거나 프로젝트를 찾지 못한 경우, JSON에서 다시 로드
        if (!project || window.projectsData.length === 0) {
            console.log('projectsData에서 찾지 못함. JSON 파일에서 로드 시도...');
            const response = await fetch('data/projects.json?bust=' + new Date().getTime());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const projects = await response.json();
            window.projectsData = projects;
            project = projects.find(p => p.id === projectId);
        }
        
        console.log('프로젝트 정보:', project);
        
        if (!project) {
            console.error('프로젝트를 찾을 수 없습니다:', projectId);
            alert('프로젝트 정보를 찾을 수 없습니다.');
            return;
        }
        
        if (!project.files || project.files.length === 0) {
            console.warn('파일 없음:', project.files);
            alert('업로드된 파일이 없습니다.');
            return;
        }
        
        const file = project.files[0];
        console.log('파일 정보:', {
            name: file.name,
            size: file.size,
            type: file.type,
            hasData: !!file.data,
            dataLength: file.data ? file.data.length : 0
        });
        
        if (!file.data) {
            alert('파일 데이터가 없습니다.');
            return;
        }
        
        // Base64 데이터를 Blob으로 변환 (admin.js와 동일)
        const base64Data = file.data.split(',')[1];
        if (!base64Data) {
            alert('파일 데이터 형식이 잘못되었습니다.');
            return;
        }
        
        const mimeType = file.type || 'application/octet-stream';
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        
        console.log('Blob URL 생성됨:', blobUrl);
        console.log('✅ 새 창에서 파일 열기...');
        
        // 새 창에서 열기 (admin.js와 동일)
        window.open(blobUrl, '_blank');
        
        // 메모리 정리 (5초 후)
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        
    } catch (error) {
        console.error('파일 보기 오류:', error);
        alert('파일을 열 수 없습니다: ' + error.message);
    }
}

// 파일 보기 (상세보기 모달에서 사용)
async function viewFileInModal(projectId, fileIndex) {
    console.log('viewFileInModal 호출:', projectId, fileIndex);
    const project = window.projectsData.find(p => p.id === projectId);
    
    if (!project || !project.files || !project.files[fileIndex]) {
        showNotification('파일을 찾을 수 없습니다.', 'error');
        return;
    }
    
    const file = project.files[fileIndex];
    console.log('파일 정보:', file);
    
    // 사업 요약 모달로 파일 표시
    viewProjectSummaryByFile(project, file);
}

// 파일 다운로드
async function downloadFile(projectId, fileIndex) {
    console.log('downloadFile 호출:', projectId, fileIndex);
    const project = window.projectsData.find(p => p.id === projectId);
    
    if (!project || !project.files || !project.files[fileIndex]) {
        showNotification('파일을 찾을 수 없습니다.', 'error');
        return;
    }
    
    const file = project.files[fileIndex];
    console.log('다운로드 파일:', file.name);
    
    try {
        if (!file.data) {
            showNotification('파일 데이터가 없습니다.', 'error');
            return;
        }
        
        // Base64 데이터를 Blob으로 변환
        const base64Data = file.data.split(',')[1];
        if (!base64Data) {
            showNotification('파일 데이터 형식이 잘못되었습니다.', 'error');
            return;
        }
        
        const mimeType = file.type || 'application/octet-stream';
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        
        // 다운로드 링크 생성 및 클릭
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // 메모리 정리
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        
        showNotification(`${file.name} 다운로드 시작`, 'success');
    } catch (error) {
        console.error('다운로드 오류:', error);
        showNotification('파일 다운로드 중 오류가 발생했습니다: ' + error.message, 'error');
    }
}

// 파일별 요약 보기 (내부 함수)
function viewProjectSummaryByFile(project, file) {
    const modal = document.getElementById('projectSummaryModal');
    const modalTitle = document.getElementById('modalSummaryTitle');
    const modalBody = document.getElementById('modalSummaryBody');
    
    if (!modal || !modalTitle || !modalBody) {
        console.error('모달 요소를 찾을 수 없습니다.');
        showNotification('페이지 오류가 발생했습니다. 페이지를 새로고침하세요.', 'error');
        return;
    }
    
    // 모달 제목 설정
    modalTitle.textContent = `${project.title} - ${file.name}`;
    
    // 파일 확장자 확인
    const fileExt = file.name.toLowerCase().split('.').pop();
    console.log('파일 확장자:', fileExt);
    
    // Base64 데이터를 Blob URL로 변환
    let blobUrl = '';
    if (file.data) {
        try {
            console.log('Base64 데이터 변환 시작...');
            const base64Data = file.data.split(',')[1];
            if (!base64Data) {
                throw new Error('Base64 데이터가 없습니다');
            }
            
            const mimeType = file.type || 'application/octet-stream';
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            blobUrl = URL.createObjectURL(blob);
            console.log('Blob URL 생성됨:', blobUrl);
        } catch (error) {
            console.error('파일 변환 오류:', error);
            showNotification('파일을 불러올 수 없습니다: ' + error.message, 'error');
            return;
        }
    } else {
        showNotification('파일 데이터가 없습니다.', 'error');
        return;
    }
    
    // 파일 내용 표시
    if (fileExt === 'pdf') {
        // PDF 뷰어
        modalBody.innerHTML = `
            <div class="file-viewer">
                <div class="file-info">
                    <i class="fas fa-file-pdf"></i>
                    <span>${file.name}</span>
                </div>
                <div class="pdf-viewer-container">
                    <iframe src="${blobUrl}#toolbar=1&navpanes=1&scrollbar=1" width="100%" height="600px" style="border: none; border-radius: 8px;"></iframe>
                </div>
                <div class="file-actions">
                    <a href="${blobUrl}" download="${file.name}" class="btn-download-large">
                        <i class="fas fa-download"></i> 다운로드
                    </a>
                    <a href="${blobUrl}" target="_blank" class="btn-open-new">
                        <i class="fas fa-external-link-alt"></i> 새 창에서 열기
                    </a>
                </div>
            </div>
        `;
    } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExt)) {
        // Office 파일
        modalBody.innerHTML = `
            <div class="file-viewer">
                <div class="file-info">
                    <i class="fas fa-file-word"></i>
                    <span>${file.name}</span>
                </div>
                <div class="file-info-large">
                    <i class="fas fa-file-word" style="font-size: 64px; color: #2b579a;"></i>
                    <h3>${file.name}</h3>
                    <p style="color: #666;">파일 크기: ${formatFileSize(file.size)}</p>
                </div>
                <p style="color: #666; text-align: center; margin: 20px 0;">
                    <i class="fas fa-info-circle"></i> Office 문서는 다운로드하여 확인하세요.
                </p>
                <div class="file-actions">
                    <a href="${blobUrl}" download="${file.name}" class="btn-download-large">
                        <i class="fas fa-download"></i> 다운로드
                    </a>
                </div>
            </div>
        `;
    } else {
        // 기타 파일
        modalBody.innerHTML = `
            <div class="file-viewer">
                <div class="file-info-large">
                    <i class="fas fa-file" style="font-size: 64px; color: #667eea;"></i>
                    <h3>${file.name}</h3>
                    <p style="color: #666;">파일 크기: ${formatFileSize(file.size)}</p>
                </div>
                <p style="color: #666; text-align: center; margin: 20px 0;">
                    이 파일은 브라우저에서 미리보기를 지원하지 않습니다.<br>
                    다운로드하여 확인하세요.
                </p>
                <div class="file-actions">
                    <a href="${blobUrl}" download="${file.name}" class="btn-download-large">
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

// 전역 스코프에 함수 노출 (HTML onclick에서 호출 가능하도록)
window.viewProjectSummary = viewProjectSummary;
window.filterProjects = filterProjects;
window.closeProjectModal = closeProjectModal;
window.closeProjectSummaryModal = closeProjectSummaryModal;

// DOM 로드 후 프로젝트 로드
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProjects);
} else {
    loadProjects();
}
