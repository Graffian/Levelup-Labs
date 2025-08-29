import { createClient } from "@supabase/supabase-js"

// Create a regular Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && /^https?:\/\//.test(String(supabaseUrl)))

const safeFetch: typeof fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return new Promise<Response>(async (resolve, reject) => {
    try {
      const req = input instanceof Request ? input : undefined
      const url = req ? req.url : (typeof input === 'string' ? input : (input as URL).toString())
      const method = (init?.method || (req?.method || 'GET')).toUpperCase()
      const xhr = new XMLHttpRequest()
      xhr.open(method, url, true)

      // Merge headers from Request and init to preserve Supabase apikey/Authorization
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

export const supabase = createClient(String(supabaseUrl || ''), String(supabaseAnonKey || ''), {
  global: {
    fetch: safeFetch
  }
})

// Create a function that returns a function to get Supabase client with Clerk session
export const createSupabaseClient = (getToken: () => Promise<string | null>) => {
  return async () => {
    try {
      const token = await getToken()
      
      if (!token) {
        console.error('No token available')
        return supabase
      }

      return createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            },
            fetch: safeFetch
          }
        }
      )
    } catch (error) {
      console.error('Error creating Supabase client:', error)
      return supabase
    }
  }
}

export default supabase
