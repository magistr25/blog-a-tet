import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Некорректный email').isEmail(),
    body('password', 'Пароль должен содержать не менее 5 символов').isLength({ min: 5 }),
    body('fullName', 'Имя должно содержать не менее 3 символов').isLength({ min: 3 }),
    body('avatarUrl', 'Некорректная ссылка на аватарку').optional().isURL(),
];

