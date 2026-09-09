/** One page of a list, as every list endpoint answers. */
export interface Paged<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface PageRequest {
  page?: number
  size?: number
}

/** Enough to fill a list pane without asking the provider for more than it will answer. */
export const DEFAULT_PAGE_SIZE = 20

/** What the API says a page is at most, so a request never comes back a 422. */
export const MAX_PAGE_SIZE = 100

export function emptyPage<T>(page: PageRequest = {}): Paged<T> {
  return {
    items: [],
    total: 0,
    page: page.page ?? 1,
    size: page.size ?? DEFAULT_PAGE_SIZE,
    pages: 0,
  }
}

/** Identifies a page of a scope, so two scopes never share a cached answer. */
export function pageKey(scope: string[], page: PageRequest): string {
  return [
    [...scope].sort().join(','),
    page.page ?? 1,
    page.size ?? DEFAULT_PAGE_SIZE,
  ].join('|')
}

/**
 * The page numbers to offer, with gaps where there are too many to show.
 * A null stands for a run of pages that is not worth a button.
 */
export function pageWindow(current: number, total: number, span = 1): (number | null)[] {
  if (total <= 1) return total === 1 ? [1] : []

  const shown = new Set<number>([1, total])
  for (let n = current - span; n <= current + span; n++) {
    if (n >= 1 && n <= total) shown.add(n)
  }

  const ordered = [...shown].sort((a, b) => a - b)
  const withGaps: (number | null)[] = []
  ordered.forEach((n, index) => {
    if (index > 0 && n - ordered[index - 1]! > 1) withGaps.push(null)
    withGaps.push(n)
  })
  return withGaps
}

/** What a reader is looking at, phrased the way they would say it. */
export function pageSummary(page: Paged<unknown>): string {
  if (!page.total) return 'Nothing here'
  const first = (page.page - 1) * page.size + 1
  const last = Math.min(page.page * page.size, page.total)
  return `${first}–${last} of ${page.total}`
}
