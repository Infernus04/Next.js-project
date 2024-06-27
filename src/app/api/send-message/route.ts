import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

import { Message } from "@/models/User";
export async function POST(request : Request) {
    await dbConnect()

    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success : false,
                message : "User not found"
            } , {status : 404})
        }

        //is User accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success : false,
                message : "Use is not accepting the messages"
            }, {status : 403})
        }
        const newMessage = {content, createdAt : new Date()}
        user.message.push(newMessage as Message)
        await user.save()
        return Response.json({
            success : true,
            message : "message sent successfully "
        }, {status : 403})

    } catch (error) {
        console.log("Error sending messages", Error)
        return Response.json({
            success : false,
            message : "Internal server error"
        }, {status : 500})

    }
}