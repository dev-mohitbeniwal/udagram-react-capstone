import { Router, Request, Response } from 'express';
import { VideoRouter } from './feed/routes/video.router';

const router: Router = Router();

router.use('/video', VideoRouter);

router.get('/', async (req: Request, res: Response) => {
    res.send(`V0`);
});

export const IndexRouter: Router = router;