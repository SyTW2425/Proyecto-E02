import { Request, Response, NextFunction, RequestHandler } from 'express';
import Catalog from '../models/catalog.js';

export const getCatalog = async (req: Request, res: Response) => {
  try {
    const catalog = await Catalog.find();
    res.status(200).json(catalog);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving catalog', error });
  }
};
