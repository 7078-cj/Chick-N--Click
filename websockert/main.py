from fastapi import WebSocket, WebSocketDisconnect, FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
import json
import uvicorn
from dotenv import load_dotenv
import os


app = FastAPI()
load_dotenv()

origins = os.getenv("CORS_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
     allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials = True,
    allow_methods=['*'],
    allow_headers=['*']
)

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

@app.websocket('/ws/order/{client_id}')
async def order_ws(websocket: WebSocket, client_id: int):
    await order_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await order_manager.broadcast(f"Client {client_id}: {data}", sender=websocket)
    except WebSocketDisconnect:
        order_manager.disconnect(websocket)
        await order_manager.broadcast(f"Client {client_id} left", sender=websocket)

@app.websocket('/ws/food/{client_id}')
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
    user_id = data.get("user_id", "")    
    
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



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)