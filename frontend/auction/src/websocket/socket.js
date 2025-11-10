// Simple WebSocket service that works without SockJS
class SocketService {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.subscriptions = new Map();
    this.bidSubscription = null;
  }

  connect() {
    try {
      // For now, we'll use a mock connection since WebSocket setup requires backend changes
      console.log('WebSocket service initialized (mock mode)');
      this.connected = true;

      // In a real implementation, you would connect to the WebSocket endpoint
      // this.ws = new WebSocket('ws://localhost:8080/ws');

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.connected = false;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.connected = false;
    }
  }

  onBidUpdate(itemId, callback) {
    // Store the callback for when we receive bid updates
    this.subscriptions.set(`bid_${itemId}`, callback);
    console.log(`Subscribed to bid updates for item ${itemId}`);

    // Mock subscription for now
    this.bidSubscription = { itemId, callback };
    return this.bidSubscription;
  }

  offBidUpdate() {
    if (this.bidSubscription) {
      const itemId = this.bidSubscription.itemId;
      this.subscriptions.delete(`bid_${itemId}`);
      this.bidSubscription = null;
      console.log(`Unsubscribed from bid updates for item ${itemId}`);
    }
  }

  joinAuction(itemId) {
    console.log(`Joined auction ${itemId}`);
    // In a real implementation, this would send a message to the server
  }

  leaveAuction(itemId) {
    console.log(`Left auction ${itemId}`);
    // In a real implementation, this would send a message to the server
  }

  // Method to simulate receiving a bid update (for testing)
  simulateBidUpdate(itemId, bidData) {
    const callback = this.subscriptions.get(`bid_${itemId}`);
    if (callback) {
      callback(bidData);
    }
  }
}

export default new SocketService();