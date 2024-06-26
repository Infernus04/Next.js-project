import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import brcypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials : any) : Promise<any>{
        await dbConnect()
        try{
            const user = await UserModel.findOne({
                $or: [
                    {email : credentials.identifier},
                    {username : credentials.identifier}
                ]
            })
            if(!user){
                throw new Error("No user found with this email")
            }

            if(!user.isVerified){
                throw new Error("Please verify your account before login")
            }
            const isPasswordCorret = await brcypt.compare(credentials.password, user.password)

            if(isPasswordCorret){
              return user
            }else{
              throw new Error("Incorrect password")
            }

        }catch(err : any){
            throw new Error
        }
      }
    }),
  ],
  callbacks : {
    async jwt({ user, token }){
      if(user){
        token._id = user._id?.toString()
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessage;
        token.username = user.username
      }
      
      return token
    },
    async session({session , token}){
      if(token){
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessage = token.isAcceptingMessage
        session.user.username = token.username

      }
      return session
    }

  },

  pages : {
    signIn : "/sign-in"
  },
  session : {
    strategy : "jwt"
  },
  secret : process.env.NEXTAUTH_SECRET
};
