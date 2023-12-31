import socketIOClient from "socket.io-client"
import {createContext, useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import Peer from "peerjs";
import {v4 as uuidV4 } from "uuid"
import { peersReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const WS = "http://localhost:8080";
const ws = socketIOClient(WS);
export const RoomContext = createContext<null | any> (null);

interface Props {
    children: React.ReactNode;
  }

export const RoomProvider: React.FunctionComponent<Props> = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const enterRoom = ({roomId}: {roomId: "string"}) => {
        navigate(`/room/${roomId}`);
    }
    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log({ participants });
    };

    const removePeer = (peerId: string) => {
        dispatch(removePeerAction(peerId));
    };

    useEffect (() => {
        const meId = uuidV4();
        const peer = new Peer(meId);
        setMe(peer);

        try {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setStream(stream);
                });
        } catch (error) {
            console.error(error);
        }

        ws.on("room-created", enterRoom);
        ws.on("get-users", getUsers);
        ws.on("user-disconnected", removePeer);
    }, []);

    useEffect(() => {
        if (!me) return;
        if (!stream) return;

        ws.on("user-joined", ({ peerId }) => {
            const call = me.call(peerId, stream);
            call.on("stream", (peerStream) => {
                dispatch(addPeerAction(peerId, peerStream));
            });
        });

        me.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (peerStream) => {
                dispatch(addPeerAction(call.peer, peerStream));
            });
        });
    }, [me, stream]);

    console.log({ peers });

    return (
        <RoomContext.Provider value={{ ws, me, stream, peers }}>
            {children}
        </RoomContext.Provider>
    );
};

function useReducer(peersReducer: (state: import("./peerReducer").PeerState, action: { type: "ADD_PEER"; payload: { peerId: string; stream: MediaStream; }; } | { type: "REMOVE_PEER"; payload: { peerId: string; }; }) => { [x: string]: { stream: MediaStream; }; }, arg1: {}): [any, any] {
    throw new Error("Function not implemented.");
}
