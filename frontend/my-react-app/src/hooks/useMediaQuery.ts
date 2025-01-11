/*useMediaQuery.ts: 미디어 쿼리를 사용하여 화면 크기에 따라 다른 스타일을 적용하는 훅
* 미디어 쿼리를 사용하여 화면 크기에 따라 다른 스타일을 적용하는 훅*/

import { useEffect, useState } from 'react'

/*useMediaQuery: 미디어 쿼리를 사용하여 화면 크기에 따라 다른 스타일을 적용하는 훅
* query: 미디어 쿼리 문자열*/
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  /*useEffect: 컴포넌트가 마운트되거나 업데이트될 때 특정 작업을 수행하는 훅
  * 미디어 쿼리를 사용하여 화면 크기에 따라 다른 스타일을 적용하는 훅*/
  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  /*return matches: 현재 매칭 상태를 반환*/
  return matches
}
