const express = require('express');
const router = new express.Router();
const ExpressError = require("../errors");
const {items, Item, ItemsList} = require('../fakeDB');

router.get('/',(req,res,next)=>{
    try{
        return res.json(items);
    }catch(e){
        return next(e);
    }
});

router.post('/',(req,res,next)=>{
    try{
        if(!req.body || !req.body.name || !req.body.price) throw new ExpressError("Need valid a item with name and price.",500);
        const newItem = new Item(req.body.name, req.body.price);
        items.addItem(newItem);
        return res.status(201).json(newItem);
    }catch(e){
        return next(e);
    };
});

router.get('/:iname',(req,res,next)=>{
    try{
        const item = items.find(req.params.iname);
        if(!item) throw new ExpressError("Item not found", 200);
        return res.status(200).json(item);
    }catch(e){
        next(e);
    }
});

router.patch('/:iname',(req,res,next)=>{
    try{
        const item = items.find(req.params.iname);
        if(!item) throw new ExpressError("Item not found", 200);
        item.update(req.body.name, req.body.price);
        return res.status(201).json(item);
    }catch(e){
        next(e);
    }
});

router.delete('/:iname',(req,res,next)=>{
    try{
        items.removeItem(req.params.iname);
        return res.status(200).json("Item deleted");
    }catch(e){
        next(e);
    }
});

module.exports = router;