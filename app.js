const express = require('express'),
    bodyParser = require('body-parser'),
    
    methodOverride = require('method-override'),
    // Mitigate XSS using sanitizer
    sanitizer = require('sanitizer'),
    app = express(),
    port = 8000

app.use(bodyParser.urlencoded({
    extended: false
}));
// https: //github.com/expressjs/method-override#custom-logic
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method
    }
}));


let todolist = [];

/* The to do list and the form are displayed */
app.get('/todo', function (req, res) {
        res.render('todo.ejs', {
            todolist,
            clickHandler: "func1();"
        });
    })

    
    .post('/todo/add/', function (req, res) {
        
        let newTodo = sanitizer.escape(req.body.newtodo);
        if (req.body.newtodo != '') {
            todolist.push(newTodo);
        }
        res.redirect('/todo');
    })

   
    .get('/todo/delete/:id', function (req, res) {
        if (req.params.id != '') {
            todolist.splice(req.params.id, 1);
        }
        res.redirect('/todo');
    })

    // Get a single todo item and render edit page
    .get('/todo/:id', function (req, res) {
        let todoIdx = req.params.id;
        let todo = todolist[todoIdx];

        if (todo) {
            res.render('edititem.ejs', {
                todoIdx,
                todo,
                clickHandler: "func1();"
            });
        } else {
            res.redirect('/todo');
        }
    })

    // Edit item in the todo list 
    .put('/todo/edit/:id', function (req, res) {
        let todoIdx = req.params.id;
        
        let editTodo = sanitizer.escape(req.body.editTodo);
        if (todoIdx != '' && editTodo != '') {
            todolist[todoIdx] = editTodo;
        }
        res.redirect('/todo');
    })
    
    .use(function (req, res, next) {
        res.redirect('/todo');
    })

    .listen(port, function () {
        // Logging to console
        console.log(`Todolist running on http://0.0.0.0:${port}`)
    });
// Export app
module.exports = app;