-- Xóa toàn bộ bảng kèm reset id serial
--TRUNCATE TABLE cart_content RESTART IDENTITY;
select array_length(image,1)
from shoes
-- Chỉ set lại id serial
--alter sequence cart_content_cart_content_id_seq restart with 1

-- Thêm cc
--insert into cart_content ("cart_id", "shoes_id", "cart_quantity") values (1, 2, 1), (1, 3, 1) returning *;

-- Xóa toàn bộ cart
--delete from cart_content where cart_id = 1;

-- Update cc
--select * from cart_content where cart_id = 1 and shoes_id = 1;
--update cart_content set cart_quantity = 2 where cart_id = 1 and shoes_id = 1 returning *;

-- Trừ số lượng trong kho
--update shoes set stock = 99 where shoes_id = 2;


--select * from cart_content where cart_id = 1 and shoes_id = 3;
--update shoes set stock = stock + 4 where shoes_id = 32;

/*
--Tổng giá tiền cart
select sum(cc.cart_quantity*s.price) as price
from cart_content cc inner join shoes s
on cc.shoes_id = s.shoes_id
where cart_id = 1;
*/


--Hóa đơn
--insert into orders("user_id", "total", "order_time", "address", "status") values (3, 0, Now(), null, 0);
--delete from orders where order_id = 1;
--alter sequence order_content_order_content_id_seq restart with 1









