import { createContext } from 'react'

const SocketContext = createContext({
  setSocket: socket => {}
})

export default SocketContext