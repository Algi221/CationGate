// Map to keep track of active WebSocket connections and their metadata
export const activeSockets = new Map<any, { isAdmin: boolean }>();

/**
 * Handle new WebSocket connection and events
 */
export function handleWsConnection(ws: any, isAdmin: boolean = false): void {
  console.log(`New WebSocket Client connected (isAdmin: ${isAdmin}).`);
  activeSockets.set(ws, { isAdmin });

  try {
    ws.send(JSON.stringify({
      event: 'SYSTEM_INFO',
      data: {
        message: 'Koneksi real-time WebSocket PPDB SMK Taruna Bhakti aktif.',
        timestamp: new Date().toISOString(),
        role: isAdmin ? 'admin' : 'public'
      }
    }));
  } catch (err: any) {
    console.error("Failed to send welcome WS message:", err.message);
  }
}

export function removeWsConnection(ws: any): void {
  console.log('WebSocket Client disconnected.');
  activeSockets.delete(ws);
}

export function handleWsMessage(ws: any, message: any): void {
  try {
    const parsed = typeof message === 'string' ? JSON.parse(message) : JSON.parse(message.toString());
    console.log(`Received WS Frame:`, parsed);
    
    // If client responds to keepalive or sends event
    if (parsed.event === 'PING') {
      ws.send(JSON.stringify({ event: 'PONG' }));
    }
  } catch (err) {
    console.warn('Received invalid JSON WS message:', message);
  }
}

/**
 * Broadcast event to connected clients with authorization filtering
 * @param payload { event: string, data: any }
 * @param requireAdmin Whether this event is sensitive and should only go to admins
 */
export function broadcast(payload: { event: string; data: any }, requireAdmin: boolean = false): void {
  const jsonString = JSON.stringify(payload);
  console.log(`Broadcasting WS event: "${payload.event}" (requireAdmin: ${requireAdmin}) to ${activeSockets.size} active terminals.`);
  
  let inactiveCount = 0;
  
  for (const [socket, info] of activeSockets.entries()) {
    if (requireAdmin && !info.isAdmin) {
      continue; // Skip non-admin sockets for sensitive events
    }
    try {
      if (socket.readyState === 1 || socket.readyState === 'OPEN' || typeof socket.send === 'function') {
        socket.send(jsonString);
      } else {
        activeSockets.delete(socket);
        inactiveCount++;
      }
    } catch (err: any) {
      console.error('Failed to send WS message, pruning socket client:', err.message);
      activeSockets.delete(socket);
      inactiveCount++;
    }
  }
  
  if (inactiveCount > 0) {
    console.log(`Cleaned up ${inactiveCount} inactive WebSocket clients.`);
  }
}
