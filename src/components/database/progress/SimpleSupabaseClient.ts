import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_PROJECT_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && key && /^https?:\/\//.test(url))

const safeFetch: typeof fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  return new Promise<Response>((resolve, reject) => {
    try {
      const url = typeof input === 'string' ? input : (input as URL).toString()
      const method = (init?.method || 'GET').toUpperCase()
      const xhr = new XMLHttpRequest()
      xhr.open(method, url, true)
      const headers = init?.headers as Record<string, string> | undefined
      if (headers) {
        Object.entries(headers).forEach(([k, v]) => {
          try { xhr.setRequestHeader(k, v as string) } catch {}
        })
      }
      xhr.responseType = 'arraybuffer'
      xhr.onload = () => {
        const options: ResponseInit = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: new Headers(xhr.getAllResponseHeaders().trim().split(/\r?\n/).filter(Boolean).map(line => {
            const idx = line.indexOf(':')
            return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
          }))
        }
        const body = xhr.response ? new Uint8Array(xhr.response) : undefined
        resolve(new Response(body, options))
      }
      xhr.onerror = () => reject(new TypeError('Network request failed'))
      xhr.ontimeout = () => reject(new TypeError('Network request timed out'))
      if (init && init.body) {
        xhr.send(init.body as any)
      } else {
        xhr.send()
      }
    } catch (e) {
      reject(e)
    }
  })
}

// Simple Supabase client for progress operations (no JWT/auth)
const supabase = createClient(
    url || '',
    key || '',
    { global: { fetch: safeFetch } }
)

export { supabase }
