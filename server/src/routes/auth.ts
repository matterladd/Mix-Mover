import { Router } from 'express';

const authRoutes = Router();

authRoutes.use('/', (req, res) => {
    res.redirect('http://example.com');
});

export default authRoutes;