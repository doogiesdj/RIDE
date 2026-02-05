// 관리자 페이지 JavaScript

// 인증 관련 상수
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'ride2025!@'  // 실제 운영 환경에서는 서버 측 인증 필요
};

const AUTH_SESSION_KEY = 'ride_admin_session';
const AUTH_EXPIRY_HOURS = 8; // 8시간 동안 세션 유지

let uploadedFiles = [];
let editingProjectId = null;

// 인증 확인 함수
function isAuthenticated() {
    const session = localStorage.getItem(AUTH_SESSION_KEY);
    if (!session) return false;
    
    try {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        
        // 세션 만료 확인
        if (now > sessionData.expiry) {
            localStorage.removeItem(AUTH_SESSION_KEY);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('세션 확인 오류:', error);
        return false;
    }
}

// 로그인 처리
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    const errorMessage = document.getElementById('loginErrorMessage');
    
    // 인증 확인
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // 세션 생성
        const now = new Date().getTime();
        const expiry = now + (AUTH_EXPIRY_HOURS * 60 * 60 * 1000);
        
        const sessionData = {
            username: username,
            loginTime: now,
            expiry: expiry
        };
        
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData));
        
        // 로그인 성공
        console.log('✅ 로그인 성공');
        
        // 로그인 성공 피드백
        const loginBtn = event.target.querySelector('button[type="submit"]');
        if (loginBtn) {
            loginBtn.textContent = '✅ 로그인 성공!';
            loginBtn.style.background = '#28a745';
        }
        
        // 짧은 지연 후 관리 페이지 표시
        setTimeout(() => {
            showAdminPage();
        }, 500);
        
    } else {
        // 로그인 실패
        errorMessage.textContent = '사용자 이름 또는 비밀번호가 올바르지 않습니다';
        errorElement.classList.add('show');
        
        // 3초 후 에러 메시지 숨김
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 3000);
        
        // 비밀번호 필드 초기화
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

// 로그아웃 처리
function handleLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem(AUTH_SESSION_KEY);
        console.log('✅ 로그아웃 완료');
        showLoginPage();
    }
}

// 관리자 페이지 표시
function showAdminPage() {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('logoutBtn').style.display = 'block';
    console.log('관리자 페이지 접근 허용');
}

// 로그인 페이지 표시
function showLoginPage() {
    document.getElementById('loginOverlay').classList.remove('hidden');
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('username').focus();
    console.log('로그인 페이지 표시');
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 폼 이벤트
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 로그아웃 버튼 이벤트
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 인증 확인
    if (isAuthenticated()) {
        showAdminPage();
    } else {
        showLoginPage();
    }
    
    // 기존 초기화 함수들
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
    const uploadArea = document.querySelector('.file-upload-area');
    
    // 파일 선택 이벤트
    fileInput.addEventListener('change', handleFileSelect);
    
    // 드래그 앤 드롭 이벤트
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
    }
}

// 드래그 오버 처리
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.background = '#e3f2fd';
    event.currentTarget.style.borderColor = '#2196f3';
}

// 드래그 리브 처리
function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.background = 'white';
    event.currentTarget.style.borderColor = '#667eea';
}

// 드롭 처리
function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.style.background = 'white';
    event.currentTarget.style.borderColor = '#667eea';
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        // 파일 입력에 파일 할당 (제한적)
        // 대신 직접 처리
        const fakeEvent = {
            target: {
                files: files,
                value: ''
            }
        };
        handleFileSelect(fakeEvent);
    }
}

// 파일 선택 처리
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    files.forEach(file => {
        // 파일 크기 체크 (50MB 제한으로 증가)
        if (file.size > 50 * 1024 * 1024) {
            showAlert('파일 크기는 50MB를 초과할 수 없습니다: ' + file.name, 'error');
            return;
        }
        
        // 파일 확장자 체크 (더 유연하게)
        const fileName = file.name.toLowerCase();
        const allowedExtensions = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.hwp', '.txt', '.zip'];
        const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
        
        // MIME 타입 체크 (선택적)
        const allowedTypes = [
            'application/pdf', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-powerpoint',
            'application/haansofthwp',
            'application/x-hwp',
            'text/plain',
            'application/zip',
            'application/x-zip-compressed'
        ];
        
        // 확장자나 MIME 타입 중 하나라도 맞으면 허용
        if (!hasValidExtension && file.type && !allowedTypes.includes(file.type)) {
            showAlert('지원하지 않는 파일 형식입니다: ' + file.name + '\n(지원 형식: PDF, DOCX, XLSX, PPTX, HWP, TXT, ZIP)', 'error');
            return;
        }
        
        uploadedFiles.push(file);
        console.log('파일 추가됨:', file.name, '크기:', formatFileSize(file.size), 'MIME:', file.type);
    });
    
    renderFileList();
    showAlert(`${files.length}개의 파일이 추가되었습니다.`, 'success');
    event.target.value = ''; // 입력 초기화
}

// 파일 목록 렌더링
function renderFileList() {
    const fileList = document.getElementById('fileList');
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    
    fileList.innerHTML = uploadedFiles.map((file, index) => {
        const icon = getFileIcon(file.name);
        return `
            <div class="file-item">
                <div class="file-item-info">
                    <i class="fas ${icon}"></i>
                    <span>${file.name}</span>
                    <span style="color: #999; font-size: 12px;">(${formatFileSize(file.size)})</span>
                </div>
                <button type="button" class="btn-remove-file" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i> 삭제
                </button>
            </div>
        `;
    }).join('');
}

// 파일 확장자에 따른 아이콘 반환
function getFileIcon(filename) {
    const ext = filename.toLowerCase().split('.').pop();
    const iconMap = {
        'pdf': 'fa-file-pdf',
        'doc': 'fa-file-word',
        'docx': 'fa-file-word',
        'xls': 'fa-file-excel',
        'xlsx': 'fa-file-excel',
        'ppt': 'fa-file-powerpoint',
        'pptx': 'fa-file-powerpoint',
        'hwp': 'fa-file-alt',
        'txt': 'fa-file-alt',
        'zip': 'fa-file-archive'
    };
    return iconMap[ext] || 'fa-file';
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
    
    // 파일 처리 - Base64로 인코딩하여 저장
    const files = [];
    for (const file of uploadedFiles) {
        try {
            const base64 = await fileToBase64(file);
            files.push({
                name: file.name,
                size: file.size,
                type: file.type,
                data: base64 // Base64 인코딩된 데이터
            });
        } catch (error) {
            console.error('파일 인코딩 오류:', file.name, error);
            showAlert(`파일 처리 중 오류: ${file.name}`, 'error');
        }
    }
    
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

// 파일을 Base64로 인코딩
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
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
                    ${project.files && project.files.length > 0 ? `
                    <button class="btn-view-file" onclick="viewProjectFile('${project.id}')">
                        <i class="fas fa-file-alt"></i> 파일 보기
                    </button>
                    ` : ''}
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

// 프로젝트 파일 보기 (관리자 페이지)
async function viewProjectFile(projectId) {
    console.log('viewProjectFile 호출됨:', projectId);
    try {
        let projects = [];
        const localProjects = localStorage.getItem('projects');
        if (localProjects) {
            projects = JSON.parse(localProjects);
            console.log('로컬 스토리지에서 로드됨:', projects.length, '개 프로젝트');
        } else {
            const response = await fetch('data/projects.json');
            projects = await response.json();
            console.log('JSON 파일에서 로드됨:', projects.length, '개 프로젝트');
        }
        
        const project = projects.find(p => p.id === projectId);
        console.log('프로젝트 정보:', project);
        
        if (!project || !project.files || project.files.length === 0) {
            console.warn('파일 없음:', project ? project.files : 'project not found');
            showAlert('업로드된 파일이 없습니다.', 'error');
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
            showAlert('파일 데이터가 없습니다.', 'error');
            return;
        }
        
        // Base64 데이터를 Blob으로 변환
        const base64Data = file.data.split(',')[1];
        if (!base64Data) {
            showAlert('파일 데이터 형식이 잘못되었습니다.', 'error');
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
        
        // 새 창에서 열기
        window.open(blobUrl, '_blank');
        
        // 메모리 정리 (5초 후)
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        
    } catch (error) {
        console.error('파일 보기 오류:', error);
        showAlert('파일을 열 수 없습니다: ' + error.message, 'error');
    }
}
