import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response): void => {
  res.status(404);
  res.json({
    message: `Route ${req.originalUrl} not found`,
  });
};
