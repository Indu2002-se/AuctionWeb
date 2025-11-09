class NativeSocketService {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.subscriptions = new Map();
  }

  connect() {
    try {
      // Use native WebSocket for direct connection
      this.ws = new WebSocket('ws://localhost:8080/ws');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.connected = true;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.connected = false;
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connected = false;
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.connected = false;
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    }
  }

  handleMessage(data) {
    // Handle different message types
    if (data.type === 'BID_UPDATE') {
      const callback = this.subscriptions.get(`bid_${data.itemId}`);
      if (callback) {
        callback(data);
      }
    }
  }

  onBidUpdate(itemId, callback) {
    this.subscriptions.set(`bid_${itemId}`, callback);
    
    // Send subscription message if connected
    if (this.connected) {
      this.send({
        type: 'SUBSCRIBE',
        topic: `auction/${itemId}/bids`
      });
    }
  }

  offBidUpdate(itemId) {
    this.subscriptions.delete(`bid_${itemId}`);
    
    // Send unsubscription message if connected
    if (this.connected) {
      this.send({
        type: 'UNSUBSCRIBE',
        topic: `auction/${itemId}/bids`
      });
    }
  }

  joinAuction(itemId) {
    if (this.connected) {
      this.send({
        type: 'JOIN_AUCTION',
        itemId: itemId
      });
    }
  }

  leaveAuction(itemId) {
    if (this.connected) {
      this.send({
        type: 'LEAVE_AUCTION',
        itemId: itemId
      });
    }
  }

  send(data) {
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

export default new NativeSocketService();