from fastapi import APIRouter, WebSocket, WebSocketDisconnect, FastAPI

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        
    async def connect(self, websocket:WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def discconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        
    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
        
    async def broadcast(self, message: str, sender: WebSocket):
        for connection in self.active_connections:
            if connection != sender:  
                await connection.send_text(message)

            
manager = ConnectionManager()

@app.websocket('/ws/{client_id}')
async def  websocket_endpoint(websocket: WebSocket, client_id:int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            
            # await manager.send_message(data, websocket)
            await manager.broadcast(f"Client {client_id}: {data}", sender=websocket)
    except WebSocketDisconnect:
        manager.discconnect(websocket)
        await manager.broadcast(f"Client {client_id} left the chat", sender=websocket)