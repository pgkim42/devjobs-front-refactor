# DevJobs Frontend

개발자 채용 플랫폼 프론트엔드 애플리케이션

## 기술 스택

- React 18
- Vite
- React Router v6
- styled-components
- Axios
- JavaScript (JSX)

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트: 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 린트 검사
npm run lint
```

## 주요 기능

### 개인 회원
- 회원가입 / 로그인
- 채용공고 검색 및 상세 조회
- 지원하기 / 지원 취소
- 마이페이지 (지원 현황 관리)
- 프로필 관리
- 이력서 업로드

### 기업 회원
- 회원가입 / 로그인
- 채용공고 등록 / 수정 / 삭제
- 지원자 관리 (서류 통과, 불합격 처리)
- 기업정보 관리
- 채용 현황 대시보드

### 공통
- 홈페이지 (통계, 최신 채용공고, 인기 카테고리)
- 반응형 디자인
- JWT 기반 인증

## 프로젝트 구조

```
src/
├── api/          # API 서비스 레이어
├── components/   # 공통 컴포넌트
├── pages/        # 페이지 컴포넌트
├── utils/        # 유틸리티 함수
└── App.jsx       # 라우팅 설정
```

## 환경 설정

```javascript
// vite.config.js
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## 주요 페이지

- `/` - 홈페이지
- `/login` - 로그인
- `/signup` - 회원가입 선택
- `/jobs` - 채용공고 목록
- `/jobs/:id` - 채용공고 상세
- `/mypage` - 마이페이지
- `/profile/individual` - 개인 프로필 관리
- `/profile/company` - 기업정보 관리
- `/resume/upload` - 이력서 업로드