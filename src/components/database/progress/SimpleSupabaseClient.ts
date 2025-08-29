import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_PROJECT_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && key && /^https?:\/\//.test(url))

const safeFetch: typeof fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return new Promise<Response>(async (resolve, reject) => {
    try {
      const req = input instanceof Request ? input : undefined
      const url = req ? req.url : (typeof input === 'string' ? input : (input as URL).toString())
      const method = (init?.method || (req?.method || 'GET')).toUpperCase()
      const xhr = new XMLHttpRequest()
      xhr.open(method, url, true)

      const merged = new Headers()
      if (req) req.headers.forEach((v, k) => merged.set(k, v))
      if (init?.headers) new Headers(init.headers as any).forEach((v, k) => merged.set(k, v))
      merged.forEach((v, k) => { try { xhr.setRequestHeader(k, v) } catch {} })

      xhr.responseType = 'arraybuffer'
      xhr.onload = () => {
        const raw = xhr.getAllResponseHeaders().trim()
        const hdrPairs = raw ? raw.split(/\r?\n/).filter(Boolean).map(line => {
          const idx = line.indexOf(':')
          return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
        }) : []
        const options: ResponseInit = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: new Headers(hdrPairs as any)
        }
        const body = xhr.response ? new Uint8Array(xhr.response) : undefined
        resolve(new Response(body, options))
      }
      xhr.onerror = () => reject(new TypeError('Network request failed'))
      xhr.ontimeout = () => reject(new TypeError('Network request timed out'))

      if (init?.body) {
        xhr.send(init.body as any)
      } else if (req) {
        try {
          const buf = await req.clone().arrayBuffer()
          xhr.send(buf)
        } catch {
          xhr.send()
        }
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
