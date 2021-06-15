const { Router } = require('express');
const info = require('../middleware/info');
const Info = require('../models/info');
const Request = require('../models/request');
const router = Router();
const nodemailer = require('nodemailer');

router.get('/', info, async (req, res) => {
    const map = (await Info.findOne({ infoId: 'map' })).value;
    const textCooperation = (await Info.findOne({ infoId: 'textCooperation' })).value;
    res.render('contacts', {
        title: 'Контакты',
        textCooperation, map,
        success: req.flash('success')
    })
})

router.post('/', async (req, res) => {
    try {
        const { name, phone, email, comment } = req.body;
        const status = true;
        const request = new Request({
            name, phone, email, comment, status
        });
        await request.save();

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'kod678@gmail.com', // like : abc@gmail.com
                pass: 'Olya_utrom678'           // like : pass@123
            }
        });
        await transporter.sendMail({
            from: 'sevmarket@example.com',
            to: 'kod678@gmail.com, olga.kolesnikova@atank.ru',
            subject: 'Заявка СевМаркет',
            html:
                `<h3>Отправлена заявка с формы обратной связи</h3>
                <p><b>Имя:</b> ${name}</p>
                <p><b>Телефон:</b> ${phone}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Комментарий:</b> ${comment}</p>`,

        })
        
        req.flash('success', 'Спасибо за заявку! Мы скоро свяжемся с вами!');
        res.redirect('/contacts#requestForm');
    } catch (e) {
        console.log(e);
    }
})
module.exports = router