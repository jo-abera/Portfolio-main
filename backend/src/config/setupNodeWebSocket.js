/**
 * @supabase/supabase-js (realtime) expects WebSocket. Node 20 on Render may not
 * expose it globally — polyfill before any Supabase client is imported.
 */
import ws from 'ws';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws;
}
