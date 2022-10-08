import { httpServer } from './http';
import './websocket';

httpServer.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});