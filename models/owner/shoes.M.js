const db = require('../db');



exports.addOneShoe = async(name, img, idbranch, size, price, stock) => {
    const pds = await db.query(`
    INSERT INTO public.shoes
    ("shoes_name","image","brand_id","size","price","stock","state")
    VALUES('${name}','${img}','${idbranch}','${size}','${price}','${stock}','true')
    RETURNING* ;`)
    return pds.rows;
}

exports.getBranches = async() => {
    const data = await db.query(`
    
    SELECT * FROM public.brands
    `)

    return data.rows;
}

exports.delOneShoe = async(idShoes) => {
    const { rows } = await db.query(`
    UPDATE public.shoes
    SET "state"='false'
    WHERE "shoes_id" = '${idShoes}'
    Returning *;`)

    return rows;
}


exports.delOneShoeInCart = async(idShoes) => {
    const { rows } = await db.query(`
    DELETE FROM public.cart_content
    WHERE "shoes_id" = '${idShoes}'
    Returning *;`)
    return rows;
}