import { io } from './http';

interface IUser {
  socket_id: string;
  username: string;
  room: string;
}

interface IMessage {
  username: string;
  room: string;
  message: string;
  createdAt: Date;
}

const users: IUser[] = [];
const messages: IMessage[] = [];

io.on("connection", socket => {
  socket.on("select_room", (data: Omit<IUser, 'socket_id'>, callback) => {
    socket.join(data.room);

    const userAlreadyInRoom = users.find(user => user.username === data.username && user.room === data.room)

    if(userAlreadyInRoom){
      userAlreadyInRoom.socket_id = socket.id
    }else {
      users.push({
        ...data,
        socket_id: socket.id
      })
    }

    callback(getMessagesRoom(data.room));
  });

  socket.on("message", (data: IMessage) => {
    const message: IMessage = {
      ...data,
      createdAt: new Date()
    }
    
    messages.push(message)

    io.to(data.room).emit("message", message);
  })
})

function getMessagesRoom(room: string): IMessage[] {
  return messages.filter(message => message.room === room);
}