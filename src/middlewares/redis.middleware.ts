import redisClient from "../config/redis";
import { Request, Response, NextFunction } from "express";
class redisCache {

    public getNote = async (req: Request, res: Response, next: NextFunction) => {
        console.log("User ID found:", req.body.createdBy);
        try {
            const note = await redisClient.get(`Note?id=${req.params.id}&user=${req.body.createdBy}`);
            if (note) {
                return res.status(200).json({ data: JSON.parse(note), message: 'Fetched from cache' });
            }
            next();
        } catch (error) {
            console.error("Error retrieving note:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
    
    public getNotes = async (req: Request, res: Response, next: NextFunction) => {
        console.log("Fetching notes for user:", req.body.createdBy);
        try {
            const notes = await redisClient.get(`Notes?user=${req.body.createdBy}`);
            if (notes) {
                // If notes are found in the cache, send the response and do not call next()
                return res.status(200).json({ data: JSON.parse(notes), message: 'Fetched from cache' });
            }
            // If notes are not found in the cache, proceed to the next middleware
            next();
        } catch (error) {
            console.error("Error retrieving notes:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    };
    
}
export default redisCache;