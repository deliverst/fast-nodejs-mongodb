const express = require('express')
const path = require('path')
const {engine} = require('express-handlebars');
const methodOverride = require('method-override')
const session = require('express-session')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const flash = require('connect-flash')
const passport = require('passport')

//INITIALIZATIONS
const app = express()
require('./database')
require('./config/passport')

//SETTINGS
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    runtimeOptions: {allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true}
}));
app.set('view engine', '.hbs')



//MIDELWARES
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'mySecreteApp', resave: true, saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//GLOBALES VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next()
})

//ROUTES
app.use(require('./routes/index'))
app.use(require('./routes/users'))
app.use(require('./routes/notes'))


// STATICS FILES
app.use(express.static(path.join(__dirname, 'public')))


// SERVER IS LISTEN
app.listen(app.get('port'), () => console.log('El servidor esta escuchando', app.get('port')))


