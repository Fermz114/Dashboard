const express = require('express');
const router = express.Router();
const User = require('../models/mysql/users');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

// Registro
router.get('/register', (req, res) => {
    res.render('register', { roles: ['cliente', 'vendedor', 'gerente'] });
});

router.post('/register', [
    check('username').notEmpty().withMessage('Usuario es requerido'),
    check('email').isEmail().withMessage('Email inválido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('role').isIn(['cliente', 'vendedor', 'gerente']).withMessage('Rol inválido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('auth/register', { 
            errors: errors.array(),
            roles: ['cliente', 'vendedor', 'gerente'] 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        });
        res.redirect('/login');
    } catch (error) {
        res.render('register', { 
            error: 'Error al registrar usuario',
            roles: ['cliente', 'vendedor', 'gerente'] 
        });
    }
});

// Login
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByUsername(req.body.username);
        if (!user) {
            return res.render('login', { error: 'Usuario no encontrado' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.render('login', { error: 'Contraseña incorrecta' });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        switch(user.role) {
            case 'cliente':
                res.redirect('/cliente');
                break;
            case 'vendedor':
                res.redirect('/vendedor');
                break;
            case 'gerente':
                res.redirect('/gerente');
                break;
            default:
                res.redirect('/');
        }
    } catch (error) {
        res.render('login', { error: 'Error en el servidor' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;