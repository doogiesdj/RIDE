// 관리자 페이지 JavaScript

let uploadedFiles = [];
let editingProjectId = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeYearOptions(); // 년도 옵션 초기화 추가
    loadProjectsList();
    initializeFileUpload();
    initializeForm();
});

// 년도 옵션 동적 생성
function initializeYearOptions() {
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    const startYear = 2020; // 시작 년도
    
    // 기존 옵션 삭제 (선택하세요 제외)
    while (yearSelect.options.length > 1) {
        yearSelect.remove(1);
    }
    
    // 현재 년도부터 시작 년도까지 역순으로 추가
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `${year}년`;
        yearSelect.appendChild(option);
    }
}

// 폼 초기화
function initializeForm() {
    const form = document.getElementById('projectForm');
    form.addEventListener('submit', handleFormSubmit);
}

// 파일 업로드 초기화
function initializeFileUpload() {
    const fileInput = document.getElementById('hiddenFileInput');
    fileInput.addEventListener('change', handleFileSelect);
}

// 파일 선택 처리
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        // 파일 크기 체크 (10MB 제한)
        if (file.size > 10 * 1024 * 1024) {
            showAlert('파일 크기는 10MB를 초과할 수 없습니다: ' + file.name, 'error');
            return;
        }
        
        // 파일 타입 체크
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                             'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        if (!allowedTypes.includes(file.type)) {
            showAlert('지원하지 않는 파일 형식입니다: ' + file.name, 'error');
            return;
        }
        
        uploadedFiles.push(file);
    });
    
    renderFileList();
    event.target.value = ''; // 입력 초기화
}

// 파일 목록 렌더링
function renderFileList() {
    const fileList = document.getElementById('fileList');
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    
    fileList.innerHTML = uploadedFiles.map((file, index) => `
        <div class="file-item">
            <div class="file-item-info">
                <i class="fas fa-file-pdf"></i>
                <span>${file.name}</span>
                <span style="color: #999; font-size: 12px;">(${formatFileSize(file.size)})</span>
            </div>
            <button type="button" class="btn-remove-file" onclick="removeFile(${index})">
                <i class="fas fa-times"></i> 삭제
            </button>
        </div>
    `).join('');
}

// 파일 삭제
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
}

// 파일 크기 포맷
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 성과 입력 추가
function addResultInput() {
    const resultsList = document.getElementById('resultsList');
    const newItem = document.createElement('div');
    newItem.className = 'result-item';
    newItem.innerHTML = `
        <input type="text" placeholder="주요 성과를 입력하세요" class="result-input">
        <button type="button" class="btn-remove-file" onclick="removeResult(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    resultsList.appendChild(newItem);
}

// 성과 입력 삭제
function removeResult(button) {
    const resultsList = document.getElementById('resultsList');
    if (resultsList.children.length > 1) {
        button.parentElement.remove();
    } else {
        showAlert('최소 하나의 성과 입력란이 필요합니다.', 'error');
    }
}

// 폼 제출 처리
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // 성과 수집
    const results = Array.from(document.querySelectorAll('.result-input'))
        .map(input => input.value.trim())
        .filter(value => value !== '');
    
    // 프로젝트 ID 생성 (수정이 아닌 경우)
    let projectId = document.getElementById('projectId').value;
    if (!projectId) {
        const year = formData.get('year');
        const timestamp = Date.now();
        projectId = `proj_${year}_${timestamp}`;
    }
    
    // 파일 처리 (실제로는 서버에 업로드해야 함)
    // 여기서는 파일 정보만 저장
    const files = uploadedFiles.map(file => ({
        name: file.name,
        path: `src/projects/${projectId}/${file.name}`,
        size: file.size
    }));
    
    const projectData = {
        id: projectId,
        year: formData.get('year'),
        title: formData.get('title'),
        overview: formData.get('overview'),
        client: formData.get('client'),
        description: formData.get('description'),
        period: formData.get('period') || '',
        budget: formData.get('budget') || '',
        results: results,
        files: files
    };
    
    try {
        await saveProject(projectData);
        showAlert('프로젝트가 성공적으로 저장되었습니다!', 'success');
        resetForm();
        loadProjectsList();
    } catch (error) {
        showAlert('프로젝트 저장 중 오류가 발생했습니다: ' + error.message, 'error');
    }
}

// 프로젝트 저장
async function saveProject(projectData) {
    try {
        // 기존 프로젝트 데이터 로드
        const response = await fetch('data/projects.json');
        let projects = await response.json();
        
        // 수정 또는 추가
        const existingIndex = projects.findIndex(p => p.id === projectData.id);
        if (existingIndex >= 0) {
            projects[existingIndex] = projectData;
        } else {
            projects.unshift(projectData); // 맨 앞에 추가
        }
        
        // 로컬 스토리지에 저장 (실제로는 서버에 저장해야 함)
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // 실제 환경에서는 서버 API를 호출해야 합니다
        // await fetch('/api/projects', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(projectData)
        // });
        
        return projectData;
    } catch (error) {
        console.error('프로젝트 저장 오류:', error);
        throw error;
    }
}

// 프로젝트 목록 로드
async function loadProjectsList() {
    try {
        let projects = [];
        
        // 로컬 스토리지에서 먼저 확인
        const localProjects = localStorage.getItem('projects');
        if (localProjects) {
            projects = JSON.parse(localProjects);
        } else {
            // JSON 파일에서 로드
            const response = await fetch('data/projects.json');
            projects = await response.json();
        }
        
        renderProjectsList(projects);
    } catch (error) {
        console.error('프로젝트 목록 로드 오류:', error);
        showAlert('프로젝트 목록을 로드할 수 없습니다.', 'error');
    }
}

// 프로젝트 목록 렌더링
function renderProjectsList(projects) {
    const projectsList = document.getElementById('projectsList');
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">등록된 사업이 없습니다.</p>';
        return;
    }
    
    // 년도별로 정렬
    projects.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.id.localeCompare(a.id);
    });
    
    projectsList.innerHTML = projects.map(project => `
        <div class="project-item">
            <div class="project-item-header">
                <div class="project-item-title">
                    <h3>${project.title}</h3>
                    <span>${project.year}년 · ${project.client}</span>
                </div>
                <div class="project-item-actions">
                    <button class="btn-edit" onclick="editProject('${project.id}')">
                        <i class="fas fa-edit"></i> 수정
                    </button>
                    <button class="btn-delete" onclick="deleteProject('${project.id}')">
                        <i class="fas fa-trash"></i> 삭제
                    </button>
                </div>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">${project.overview}</p>
            ${project.files && project.files.length > 0 ? `
                <p style="color: #999; font-size: 13px; margin-top: 8px;">
                    <i class="fas fa-paperclip"></i> 첨부파일 ${project.files.length}개
                </p>
            ` : ''}
        </div>
    `).join('');
}

// 프로젝트 수정
async function editProject(projectId) {
    try {
        let projects = [];
        const localProjects = localStorage.getItem('projects');
        if (localProjects) {
            projects = JSON.parse(localProjects);
        } else {
            const response = await fetch('data/projects.json');
            projects = await response.json();
        }
        
        const project = projects.find(p => p.id === projectId);
        if (!project) {
            showAlert('프로젝트를 찾을 수 없습니다.', 'error');
            return;
        }
        
        // 폼에 데이터 채우기
        document.getElementById('projectId').value = project.id;
        document.getElementById('year').value = project.year;
        document.getElementById('title').value = project.title;
        document.getElementById('overview').value = project.overview;
        document.getElementById('client').value = project.client;
        document.getElementById('description').value = project.description;
        document.getElementById('period').value = project.period || '';
        document.getElementById('budget').value = project.budget || '';
        
        // 성과 데이터 채우기
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';
        if (project.results && project.results.length > 0) {
            project.results.forEach(result => {
                const newItem = document.createElement('div');
                newItem.className = 'result-item';
                newItem.innerHTML = `
                    <input type="text" placeholder="주요 성과를 입력하세요" class="result-input" value="${result}">
                    <button type="button" class="btn-remove-file" onclick="removeResult(this)">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                resultsList.appendChild(newItem);
            });
        } else {
            addResultInput();
        }
        
        // 파일 정보는 표시만 (재업로드 필요)
        if (project.files && project.files.length > 0) {
            showAlert(`기존 파일 ${project.files.length}개가 있습니다. 필요시 새 파일을 업로드하세요.`, 'info');
        }
        
        // 스크롤 이동
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        editingProjectId = projectId;
        
    } catch (error) {
        console.error('프로젝트 수정 오류:', error);
        showAlert('프로젝트를 불러올 수 없습니다.', 'error');
    }
}

// 프로젝트 삭제
async function deleteProject(projectId) {
    if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        let projects = [];
        const localProjects = localStorage.getItem('projects');
        if (localProjects) {
            projects = JSON.parse(localProjects);
        } else {
            const response = await fetch('data/projects.json');
            projects = await response.json();
        }
        
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('projects', JSON.stringify(projects));
        
        showAlert('프로젝트가 삭제되었습니다.', 'success');
        loadProjectsList();
        
    } catch (error) {
        console.error('프로젝트 삭제 오류:', error);
        showAlert('프로젝트 삭제 중 오류가 발생했습니다.', 'error');
    }
}

// 폼 초기화
function resetForm() {
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    uploadedFiles = [];
    renderFileList();
    editingProjectId = null;
    
    // 성과 입력란 초기화
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = `
        <div class="result-item">
            <input type="text" placeholder="주요 성과를 입력하세요" class="result-input">
            <button type="button" class="btn-remove-file" onclick="removeResult(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

// 알림 표시
function showAlert(message, type = 'info') {
    const alertArea = document.getElementById('alertArea');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    alert.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    alertArea.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}
