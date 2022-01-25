const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const {route} = require("express/lib/router");
const {isAuthenticated} = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note')
})


// router.get('/notes', (req, res) => {
//     res.send('Nota from database')
// })

router.post('/notes/new-notes', isAuthenticated, async (req, res) => {
    const {title, description} = req.body
    const errors = []
    if (!title) {
        errors.push({text: 'Por favor inserta un titulo'})
    }

    if (!description) {
        errors.push({text: 'Por favor inserta una descripción'})
    }

    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors, title, description
        })
    } else {
        const newNote = new Note({title, description})
        newNote.user = req.user.id
        await newNote.save()
        req.flash('success_msg', 'Tu mensaje se agrego correctamente')
        res.redirect('/notes')
        // res.send('OK')
        // console.log(newNote)
    }
})

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'})
    res.render('notes/all-notes', {notes});
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id)
    req.flash('success_msg', 'nota actualizada satisfactoriamente')
    res.render('notes/edit-note', {note})
})

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    req.flash('success_msg', 'Nota actualizada satisfcatoriamente')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Nota eliminada satisfcatoriamente')
    res.redirect('/notes')
})

module.exports = router;