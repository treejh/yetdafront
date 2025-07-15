# FRONT-END

Global CrowdFunding 서비스 - Frontend 프로젝트

사용 스택:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- React Query
- Axios

---

## 📦 폴더 구조

```
.vscode/
app/
  ├── api/
  ├── global-error.tsx
  ├── globals.css
  ├── layout.tsx
  ├── not-found.tsx
  └── page.tsx
components/
constants/
hooks/
lib/
public/
queries/
stores/
types/
utils/

.eslintignore
.eslintrc.js
.gitignore
.prettierrc
README.md
components.json
middleware.ts
next.config.ts
package-lock.json
package.json
postcss.config.mjs
tsconfig.json
```

---

## 🗂️ 커밋 컨벤션

| Type     | 설명                           |
| -------- | ------------------------------ |
| Feat     | 새로운 기능 추가               |
| Fix      | 버그 수정                      |
| Docs     | 문서 수정                      |
| Style    | 코드 스타일 (포맷, 세미콜론 등) |
| Refactor | 기능 변화 없이 코드 구조 개선   |
| Test     | 테스트 코드 추가               |
| Chore    | 빌드/설정/패키지 등 기타 변경  |
| Remove   | 불필요한 코드/파일 제거        |

---

## 💻 코드 컨벤션

| 종류         | 표기법    | 조합                     | 예시               |
| ------------ | --------- | ------------------------ | ------------------ |
| 컴포넌트     | PascalCase | 명사                    | `LoginPage`        |
| 함수         | camelCase  | handle/get + 동사 + 명사 | `handleUpdateName` |
| 변수         | camelCase  |                          | `userId`           |
| Boolean 변수 | camelCase  | is + (동사/명사)         | `isClicked`        |
| 상수         | SNAKE_CASE |                          | `API_URL`          |

---

## ⚡ 함수 작성 규칙

- 한 줄: 중괄호 생략
- 여러 줄: `{ return … }`

| 구분      | 사용 방식   | 예제                              |
| --------- | ---------- | --------------------------------- |
| 파싱 함수  | 일반 함수   | `function parseData(data) {}`     |
| 유틸 함수  | 일반 함수   | `function formatDate(date) {}`    |
| 기타 함수  | 화살표 함수 | `const handleClick = () => {}`    |

---

## ✅ 상태 관리 규칙

- 상태 변경 시 **이전 상태 기반으로 업데이트**
  ```tsx
  setState((prev) => !prev);
  ```
- 불변성 유지
  ```tsx
  setState((prev) => [...prev, newItem]);
  ```

---

## 🧩 페이지 작성 예시

```tsx
export default function Home() {
  return (
    <main>
      ...
    </main>
  );
}
```

---

## 📝 타입 정의

- **interface** 사용 권장

---
