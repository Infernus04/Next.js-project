import { Message } from "@/models/User";
import { ArrayCardinality } from "zod";

export interface ApiResponse{
    success : boolean;
    message : string;
    isAcceptingMessages ? : boolean;
    messages? : Array<Message>  
}