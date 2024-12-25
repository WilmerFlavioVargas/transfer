import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useApi<T>(url: string) {
  const { data, error, mutate } = useSWR<T>(url, fetcher)

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}

