const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());



const courses = [
    {id: 1, name: "First course"},
    {id: 2, name: "Second course"},
    {id: 3, name: "Third course"}
]
app.get('/', (req, res) => {
   res.send("You've reached the main page!");
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/course/:id', (req, res) => {
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given id was not found');

    res.send(course);
});

app.post('/api/courses', (req, res) => {

    const {error} = validateCourse(req.body);
    if(error) { res.status(400).send("Bad request")
        return
    };

    const course = {
        id: (courses.length + 1),
        name: req.body.name
    };
    courses.push(course);
    res.send(courses);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("No such course");

    const {error} = validateCourse(req.body);
    if(error) { res.status(400).send("Bad request")
        return
    };

    course.name = req.body.name;
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("No such course");

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    
    res.send(course);
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}