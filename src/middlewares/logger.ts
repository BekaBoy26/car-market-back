import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`
        Time: ${new Date()}    Method: ${req.method}   ===>   URL: ${req.url}
    `);

    next();
};