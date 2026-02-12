from fastapi import WebSocket, WebSocketDisconnect, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import uvicorn
from dotenv import load_dotenv
import os

app = FastAPI()
load_dotenv()

# CORS
origins = os.getenv("CORS_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Connection Manager
# -------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"🔗 Client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"❌ Client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: str, sender: WebSocket = None):
        to_remove = []
        for connection in self.active_connections:
            if connection != sender:
                try:
                    await connection.send_text(message)
                except Exception as e:
                    print(f"⚠️ Failed to send to client: {e}")
                    to_remove.append(connection)

        # Remove broken connections
        for conn in to_remove:
            self.disconnect(conn)


# Managers for order and food
order_manager = ConnectionManager()
food_manager = ConnectionManager()


# -------------------------
# WebSocket Routes
# -------------------------
@app.websocket("/ws/order/{client_id}")
async def order_ws(websocket: WebSocket, client_id: int):
    await order_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await order_manager.broadcast(
                f"Client {client_id}: {data}", sender=websocket
            )
    except WebSocketDisconnect:
        order_manager.disconnect(websocket)


@app.websocket("/ws/food/{client_id}")
async def food_ws(websocket: WebSocket, client_id: int):
    await food_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            await food_manager.broadcast(
                f"Client {client_id}: {data}", sender=websocket
            )
    except WebSocketDisconnect:
        food_manager.disconnect(websocket)


# -------------------------
# HTTP Broadcast Routes
# -------------------------
@app.post("/broadcast/order")
async def broadcast_order(request: Request):
    data = await request.json()
    payload = {
        "type": "order",
        "event": data.get("event", ""),
        "order": data.get("order", {}),
        "user_id": data.get("user_id", ""),
    }
    await order_manager.broadcast(json.dumps(payload))
    return {"status": "ok", "broadcasted": payload}


@app.post("/broadcast/food")
async def broadcast_food(request: Request):
    data = await request.json()
    payload = {
        "type": "food",
        "event": data.get("event", ""),
        "food": data.get("food", {}),
    }
    await food_manager.broadcast(json.dumps(payload))
    return {"status": "ok", "broadcasted": payload}


# -------------------------
# Run app
# -------------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
