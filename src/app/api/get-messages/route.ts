import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";
import { setUncaughtExceptionCaptureCallback } from "process";

export async function GET(request : Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
          {
            success: false,
            message: "Not Authenticated",
          },
          { status: 401 }
        );
      }
      const userId = new mongoose.Types.ObjectId(user._id)

      try {
        const user = await UserModel.aggregate([
            {$match : {id : userId}},
            {$unwind : "$messages"},
            {$sort : {"messages.createdAt" : -1}},
            {$group : {_id : "$id", messages : {$push : "$messages"}}}
        ])

        if(!user || user.length === 0){
            return Response.json({
                success : false,
                message : "User not found"
            },{status : 401})
        }
        return Response.json({
            success : true,
            messages : user[0].messages
        },{status : 200})

      } catch (error) {
        console.log("An unexpected error occured")
        return Response.json(
            {
                success : false,
                message : "Not Authenticated"
            },{status : 500}
        )
      }
}