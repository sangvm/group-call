import socketIOClient from "socket.io-client"
import {createContext, useEffect} from "react"
import {useNavigate} from "react-router-dom"

const WS = "http://localhost:8080";
const ws = socketIOClient(WS);
export const RoomContext = createContext<null | any> (null);

interface Props {
    children: React.ReactNode;
  }

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {
    const navigate = useNavigate();
    const EnterRoom = ({roomId}: {roomId: "string"}) => {
        navigate(`/room/${roomId}`);
    }

    useEffect (() => {
        ws.on("room-created", EnterRoom);
    });
    return (
        <RoomContext.Provider value= {{ ws }}> {children} </RoomContext.Provider>
    );
};