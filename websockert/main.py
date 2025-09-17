from fastapi import WebSocket, WebSocketDisconnect, FastAPI
from fastapi import Request
import json

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str, sender: WebSocket = None):
        for connection in self.active_connections:
            if connection != sender:  
                await connection.send_text(message)


order_manager = ConnectionManager()
food_manager = ConnectionManager()

@app.websocket("/ws/order")
async def order_ws(websocket: WebSocket, client_id: int):
    await order_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await order_manager.broadcast(f"Client {client_id}: {data}", sender=websocket)
    except WebSocketDisconnect:
        order_manager.disconnect(websocket)
        await order_manager.broadcast(f"Client {client_id} left", sender=websocket)

@app.websocket("/ws/food")
async def food_ws(websocket: WebSocket, client_id: int):
    await food_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await food_manager.broadcast(f"Client {client_id}: {data}", sender=websocket)
    except WebSocketDisconnect:
        food_manager.disconnect(websocket)
        await food_manager.broadcast(f"Client {client_id} left", sender=websocket)
        
        
@app.post("/broadcast/order")
async def broadcast_order(request: Request):
    data = await request.json()
    event = data.get("event", "")
    order = data.get("order", {})  
    
    payload = {
        "type": "order",
        "event": event,
        "order": order
    }

    await order_manager.broadcast(json.dumps(payload))

    return {"status": "ok", "broadcasted": payload}

@app.post("/broadcast/food")
async def broadcast_food(request: Request):
    data = await request.json()
    event = data.get("event", "")
    order = data.get("food", {})  
    
    payload = {
        "type": "food",
        "event": event,
        "food": order
    }

    await food_manager.broadcast(json.dumps(payload))

    return {"status": "ok", "broadcasted": payload}