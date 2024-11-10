const express = require('express');
const prisma = require('./prisma');
const { sendErrorMessage, sendSuccessMessage } = require('./utils');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello server');
});

app.post('/createingredient', async (req, res) => {
    try {
        const params = req.body;
        await prisma.ingredient.create({
            data: {
                name: params.name,
            },
        });

        res.status(200).send(JSON.stringify({ message: "Success" }));
    } catch (error) {
        res.status(500).send(JSON.stringify({ error, message: "Something went wrong" }));
    }
});

app.get('/getingredients', async (req, res) => {
    try {
        const results = await prisma.ingredient.findMany();
        res.status(200).send(JSON.stringify(results));
    } catch (error) {
        res.status(500).send({ error, message: "Something went wrong" });
    }
});

app.get('/getingredient/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await prisma.ingredient.findMany({
            where : {
                name: {
                    contains : name,
                }
            }
        });

        res.status(200).send(JSON.parse(result));
    } catch (error) {
        res.status(500).send(JSON.parse({ error, message: "Something went wrong" }))
    }
});

app.post('/createrecipe', async (req, res) => {
    try {
        const { name, cooktime } = req.body;

        await prisma.recipe.create({
            data: {
                name: name,
                cooktime: cooktime,
            }
        });

        sendSuccessMessage(res);
    } catch (error) {
        sendErrorMessage(res);
    }
});

app.get('/getrecipe/:recipe_id', async (req, res) => {
    try {
        const recipe_id = req.params.recipe_id;

        const result = await prisma.recipe.findUnique({
            where: {
                id: recipe_id,
            }
        });

        sendSuccessMessage(res, result);
    } catch (error) {
        sendErrorMessage(res);
    }
});

app.post('/addrecipeingredient', async (req, res) => {
    try {
        const { ingredient_id, recipe_id, quantity } = req.body;

        await prisma.recipeIngredient.create({
            data: {
                recipeid: recipe_id,
                ingredientid: ingredient_id,
                quantityNeeded: quantity,
            }
        });

        res.status(200).send(JSON.stringify({ message: "Success" }));
    } catch (error) {
        res.status(500).send(JSON.stringify({ error, message: "Something went wrong" }));
    }
});

app.put('/updaterecipeingredientquantity', async (req, res) => {
    try {
        const { recipe_ingredient_id, quantity } = req.body;

        await prisma.recipeIngredient.update({
            data: {
                quantityNeeded: quantity,
            },
            where: {
                id: recipe_ingredient_id,
            },
        });

        sendSuccessMessage(res);
    } catch (error) {
        sendErrorMessage(res);
    }
});

app.delete('/deleterecipeingredient/:id', async (req, res) => {
    try {
        await prisma.recipeIngredient.delete({
            where: {
                id: req.params.id,
            }
        });

        sendSuccessMessage(res);
    } catch (error) {
        sendErrorMessage(res, error)
    }
})

app.post('/addrecipeinstruction', async (req, res) => {
    try {
        const { recipe_id, instruction_text, list_position } = req.body;

        await prisma.instruction.create({
            data: {
                instruction: instruction_text,
                recipeid: recipe_id,
                position: list_position,
            }
        });

        sendSuccessMessage(res);
    } catch (error) {
        sendErrorMessage(res);
    }
});

app.put('/deleterecipeinstruction/:id', async (req, res) => {
    try {
        await prisma.instruction.delete({
            where: {
                id: req.params.id,
            }
        });

        sendSuccessMessage(res);
    } catch (error) {
        sendErrorMessage(res);
    }
});

app.get('/getrecipes', async (req, res) => {
    try {
        const result = await prisma.recipe.findMany();

        sendSuccessMessage(res, result);
    } catch (error) {
        sendErrorMessage(res);
    }
});

app.post('/addfridgeingredient', async (req, res) => {
    try {
        const { ingredient_id, fridge_id, quantity } = req.body;

        await prisma.fridgeIngredient.create({
            data: {
                fridgeid: fridge_id,
                ingredientid: ingredient_id,
                quantityAvailable: quantity,
            }
        });

        res.status(200).send(JSON.stringify({ message: "Success" }));
    } catch (error) {
        res.status(500).send(JSON.stringify({ error, message: "Something went wrong" }));
    }
});

app.put('/updatefridgeingredientquantity', async (req, res) => {
    try {
        const { fridge_ingredient_id, quantity } = req.body;

        await prisma.fridgeIngredient.update({
            data: {
                quantityAvailable: quantity,
            },
            where: {
                id: fridge_ingredient_id,
            },
        });

        sendSuccessMessage(res);
    } catch (error) {
        sendErrorMessage(res);
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});