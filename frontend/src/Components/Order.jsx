import React, { useState } from "react";
import { Button } from "@mantine/core";
import OrdersModal from "./OrdersModal";

function Order() {
    const [ordersOpen, setOrdersOpen] = useState(false);
    
  return (
    <div className="p-4">
      <Button onClick={() => setOrdersOpen(true)}>View My Orders</Button>

      <OrdersModal
        opened={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        
      />
    </div>
  )
}

export default Order