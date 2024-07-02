import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Некорректный email').isEmail(),
    body('password', 'Пароль должен содержать не менее 5 символов').isLength({ min: 5 }),

];


export const registerValidation = [
    body('email', 'Некорректный email').isEmail(),
    body('password', 'Пароль должен содержать не менее 5 символов').isLength({ min: 5 }),
    body('fullName', 'Имя должно содержать не менее 3 символов').isLength({ min: 3 }),
    body('avatarUrl', 'Некорректная ссылка на аватарку').optional().isURL(),
];


export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isString(),
    body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Некорректная ссылка на изображение').optional().isString(),
];
