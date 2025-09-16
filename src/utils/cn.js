// Tailwind CSS 클래스 네임을 조건부로 결합하는 유틸리티 함수
// clsx와 tailwind-merge를 간단하게 구현한 버전

export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}