# RIDE 홈페이지 - 프로젝트 관리 기능 추가

## 📋 변경사항

### 1. 새로운 기능
- **동적 프로젝트 로딩**: JSON 파일 기반으로 프로젝트 데이터 관리
- **프로젝트 상세보기**: 각 사업 클릭 시 상세 정보 모달 표시
- **파일 다운로드**: 사업 결과물 및 요약본 다운로드 기능
- **사업 관리 페이지**: 사업 추가, 수정, 삭제 기능
- **파일 업로드**: 결과물 파일 업로드 기능

### 2. 새로 추가된 파일
- `data/projects.json` - 프로젝트 데이터 저장소
- `projects.js` - 프로젝트 표시 및 관리 JavaScript
- `admin.html` - 관리자 페이지
- `admin.js` - 관리자 기능 JavaScript
- `src/projects/` - 프로젝트 파일 저장 디렉토리

### 3. 수정된 파일
- `index.html` - 프로젝트 상세보기 모달 추가, projects.js 스크립트 추가
- `styles.css` - 프로젝트 모달 및 관리자 페이지 스타일 추가

## 🚀 사용 방법

### 사용자 페이지 (index.html)
1. **프로젝트 필터링**: 년도별 버튼 클릭으로 프로젝트 필터링
2. **프로젝트 상세보기**: 프로젝트 카드 클릭 또는 "상세보기" 버튼 클릭
3. **파일 다운로드**: 상세보기 모달에서 파일 다운로드 버튼 클릭

### 관리자 페이지 (admin.html)
1. **사업 관리 페이지 접근**: 메인 페이지에서 "사업 관리" 버튼 클릭
2. **사업 추가**: 
   - 폼에 사업 정보 입력
   - 주요 성과는 "성과 추가" 버튼으로 여러 개 추가 가능
   - 파일 업로드 영역 클릭하여 결과물 파일 업로드
   - "저장" 버튼 클릭
3. **사업 수정**: 
   - 등록된 사업 목록에서 "수정" 버튼 클릭
   - 정보 수정 후 "저장" 버튼 클릭
4. **사업 삭제**: 
   - 등록된 사업 목록에서 "삭제" 버튼 클릭
   - 확인 대화상자에서 확인

## 💾 데이터 저장 방식

현재는 **로컬 스토리지**와 **JSON 파일**을 함께 사용합니다:
- 새로 추가/수정/삭제된 데이터는 로컬 스토리지에 저장
- 로컬 스토리지가 없으면 `data/projects.json` 파일에서 로드
- 실제 프로덕션 환경에서는 백엔드 API로 교체 필요

## 🔧 백엔드 연동 (향후 작업)

실제 서버와 연동하려면 다음 부분을 수정해야 합니다:

### 1. 프로젝트 데이터 저장 (admin.js)
```javascript
// 현재 (로컬 스토리지)
localStorage.setItem('projects', JSON.stringify(projects));

// 변경 필요 (서버 API)
await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
});
```

### 2. 파일 업로드 (admin.js)
```javascript
// 추가 필요
const formData = new FormData();
formData.append('projectId', projectId);
uploadedFiles.forEach(file => {
    formData.append('files', file);
});

await fetch('/api/projects/upload', {
    method: 'POST',
    body: formData
});
```

### 3. 필요한 백엔드 API 엔드포인트
- `GET /api/projects` - 프로젝트 목록 조회
- `POST /api/projects` - 프로젝트 추가/수정
- `DELETE /api/projects/:id` - 프로젝트 삭제
- `POST /api/projects/upload` - 파일 업로드
- `GET /api/projects/:id/files/:filename` - 파일 다운로드

## 📁 프로젝트 구조

```
/home/user/webapp/
├── index.html              # 메인 페이지
├── admin.html              # 관리자 페이지
├── styles.css              # 스타일시트
├── script.js               # 메인 스크립트
├── projects.js             # 프로젝트 관리 스크립트
├── admin.js                # 관리자 페이지 스크립트
├── data/
│   └── projects.json       # 프로젝트 데이터
└── src/
    ├── projects/           # 프로젝트 파일 저장소
    └── (기타 이미지 파일들)
```

## 🎨 주요 기능 스크린샷 설명

### 메인 페이지
- 년도별 필터링 버튼
- 프로젝트 카드 그리드
- "사업 관리" 버튼 (우측 상단)

### 프로젝트 상세보기 모달
- 사업 정보 (년도, 발주처, 기간, 예산)
- 사업 개요 및 설명
- 주요 성과 목록
- 결과물 파일 다운로드

### 관리자 페이지
- 사업 정보 입력 폼
- 주요 성과 동적 추가
- 파일 업로드 영역
- 등록된 사업 목록 (수정/삭제 버튼)

## ⚠️ 주의사항

1. **파일 크기 제한**: 업로드 파일은 10MB 이하로 제한됨
2. **지원 파일 형식**: PDF, DOCX, XLSX, PPTX
3. **브라우저 호환성**: 최신 Chrome, Firefox, Safari, Edge 권장
4. **로컬 스토리지 제한**: 브라우저 로컬 스토리지 용량 제한 (약 5-10MB)
5. **데이터 영속성**: 로컬 스토리지 데이터는 브라우저 캐시 삭제 시 사라질 수 있음

## 🔄 업데이트 이력

- **2024-02-04**: 초기 버전 - 프로젝트 관리 기능 추가
  - 동적 프로젝트 로딩
  - 상세보기 모달
  - 관리자 페이지
  - 파일 업로드/다운로드
