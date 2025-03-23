import {mongooseConnect} from "@/lib/mongoose";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {Address} from "@/models/Address";

export default async function handle(req, res){
    await mongooseConnect();
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user;

    // If no user is logged in, return an empty array
    if (!user) {
        return res.status(200).json([]);
    }

    if (req.method === "PUT"){
        const address = await Address.findOne({userEmail: user.email});
        if (address) {
            res.json(await Address.findOneAndUpdate(address._id, req.body));
        } else {
            res.json(await Address.create({userEmail: user.email, ...req.body}));
        }
    }

    if (req.method === "GET"){
        const address = await Address.findOne({userEmail: user.email});
        res.json(address);
    }
}
