process.env.NODE_ENV = "test";
const request = require("supertest");
const itemsRoutes = require('./itemsRoutes');
const app = require('../app');
const {items, Item, ItemsList} = require('../fakeDB');

beforeEach(()=>{
    const popsicle = new Item("popsicle", 1.45);
    const cheerios = new Item("cheerios", 3.40);
    items.addItem(popsicle);
    items.addItem(cheerios);
});

afterEach(()=>{
    items.items.length = 0;
});

describe("GET /items", ()=>{
    test("Gets list of items", async()=>{
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(items);
    });
});

describe("POST /items",()=>{

    test("Creates a new item", async ()=>{
        const resp = await request(app)
            .post('/items')
            .send({
                name:'apple',
                price:1.11
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            name:'apple',
            price:1.11
        });
    });

    test("Returns a 500 error", async ()=>{
        const resp = await request(app)
        .post('/items')
        .send({
            price:1.11
        });
    expect(resp.statusCode).toBe(500);
    expect(resp.body).toBe("Need valid a item with name and price.");
    });
})

describe("GET /items/:iname", ()=>{

    test("Gets the specified item",async ()=>{
        const resp = await request(app).get('/items/cheerios');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(items.find("cheerios"));
    });

    test("Returns an error", async ()=>{
        const resp = await request(app).get('/items/432432');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual("Item not found");
    });
});

describe("PATCH /items/:iname", ()=>{

    test("Updates the specified item", async ()=>{
        const resp = await request(app)
            .patch('/items/cheerios')
            .send({name: 'coffee', price: 2.51});
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({name: 'coffee', price: 2.51});
    });
});

describe("DELETE /items/:iname", ()=>{

    test("Deletes the specified item", async ()=>{
        const resp = await request(app).delete('/items/cheerios');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual("Item deleted");
    });
});