--drop database if exists shoes_db;
--create database shoes_db;


-- Hãng giày. Cố định, chỉ có thể thêm trực tiếp từ db, không làm thao tác xóa hãng giày
drop table if exists brands cascade;
create table brands (
	brand_id	serial,
	brand_name		varchar(30),
	primary key(brand_id)
);


-- Giày. Owner có thể thêm, xóa, sửa. Customer chỉ có thể xem
drop table if exists shoes cascade;
create table shoes (
	shoes_id	serial,
	shoes_name	varchar(225),
	image		varchar(255)[], --Địa chỉ 1 hình
	brand_id	serial,
	size		int[],
	price		numeric(19, 4),
	stock		int[], --Số lượng trong kho
	state       boolean,
	primary key(shoes_id),
	constraint fk_shoes_brand --Chỉ được thêm giày thuộc những hãng có trước
	foreign key(brand_id) references brands
);


-- Tài khoản. Chỉ có thể thêm vào, không làm thao tác xóa tài khoản
drop table if exists users cascade;
create table users (
	user_id		serial,
	username	varchar(50), --Tên đăng nhập
	fullname	varchar(50), --Tên người
	phone		varchar(15), --Sđt, phục vụ cho việc liên lạc
	pwd			varchar(255),

	-- Khi đăng ký chỉ tạo tài khoản customer thêm vào db
	-- Tài khoản onwer chỉ có thể thêm trực tiếp từ db

	role_id		int, --0: customer; 1: owner;

	primary key(user_id)
);


-- Bình luận. Mang tính chất hiển thị là chính (kịp thì làm)
-- Owner có thể xem, xóa tất cả bình luận
-- Customer chỉ có thể xem bình luận tương ứng từng giày
drop table if exists comments cascade;
create table comments (
	comment_id		serial,
	shoes_id		serial, --Trang giày được bình luận
	user_id			serial, 
	comment_time	timestamp, --Thời điểm bình luận
	body			varchar(255), --Nội dung comment, giới hạn 255 ký tự
	primary key(comment_id),

	constraint fk_comment_user
	foreign key(user_id) references users,
	
	constraint fk_comment_shoes  --Lưu ý xóa comment thuộc giày trước khi owner xóa giày
	foreign key(shoes_id) references shoes
);


-- Giỏ hàng. Mỗi customer có 1 giỏ hàng riêng.
-- Khi customer đăng ký sẽ tự động tạo 1 giỏ hàng mới của customer đó đưa vào db.
-- Vì vậy, giỏ hàng có tính chất như customer.
drop table if exists carts cascade;
create table carts (
	cart_id		serial,
	user_id		serial,
	primary key(cart_id),
	constraint fk_cart_user
	foreign key(user_id) references users
);


-- Thông tin giỏ hàng, gồm nhiều giày trong giỏ
drop table if exists cart_content cascade;
create table cart_content (
	cart_content_id	serial,
	cart_id			serial,
	shoes_id		serial,
	cart_size			int,

	cart_quantity		int,

	primary key(cart_content_id),
	constraint fk_cc_cart
	foreign key(cart_id) references carts,

	constraint fk_cc_shoes --Lưu ý xóa khóa ngoại trước khi owner xóa giày
	foreign key(shoes_id) references shoes
);


-- Hóa đơn.
-- Owner có thể xem, sửa state, hủy (khó, khỏi làm cũng được) mọi hóa đơn. Customer chỉ có thể xem hóa đơn của mình.
-- Không làm thao tác xóa hóa đơn
drop table if exists orders cascade;
create table orders (
	order_id		serial,
	user_id			serial, --Chủ hóa đơn
	total			numeric(19, 4),
	order_time		timestamp, --Ngày giờ tạo hóa đơn
	order_phone		varchar(15), --Sđt, phục vụ cho việc giao hàng
	address			varchar(250), --Địa chỉ, phục vụ cho việc giao hàng

	-- Sẽ có 2 lựa chọn là "Đặt mua" \(thanh toán sau khi nhận hàng\) -> tạo hóa đơn state 0
    --				  hoặc "Thanh toán ngay" 						  -> tạo hóa đơn state 1
	-- Owner sẽ quản lý hóa đơn bằng cách sửa state hóa đơn giữa 0 và 1
	--hoặc hủy hóa đơn \(khó hơn, chắc khỏi làm, vì có liên quan đến vụ thêm lại
	--quantity của từng giày vào lại db, bao gồm xác thực giày còn trong db không\) 

	status			int, --0: chưa thanh toán; 1: đã thanh toán; -1: đã hủy (khỏi làm)
	
	primary key(order_id),
	constraint fk_order_user
	foreign key(user_id) references users
);


-- Thông tin hóa đơn, gồm nhiều giày trong hóa đơn
drop table if exists order_content cascade;
create table order_content (
	order_content_id	serial,
	order_id			serial,
	-- Tương tự như với giỏ hàng, order sẽ lưu cứng thông tin lấy được từ giỏ hàng
	shoes_id	serial,
	orc_size		int,
	price		numeric(19, 4),
	quantity	int,

	primary key(order_content_id),
	constraint fk_oc_order
	foreign key(order_id) references orders

	/* Lý do không tạo khóa ngoại với giày tương tự như với giỏ hàng
	constraint fk_oc_shoes
	foreign key(shoes_id) references shoes
	*/
);


-- Thêm hãng giày mẫu
insert into brands values (1, 'Nike'), (2, 'Adidas'), (3, 'Bitis');

/*
-- Thêm user mẫu
insert into users values
(1, 'owner01', 'Phạm Ngọc Truyền', '0123456789', '$2b$10$Vkhen5eBmVHW7KlxsemqO.tiAzjyE1poZugSaqWTJTC7OQJMn72QS', 1),
(2, 'owner02', 'Phan Khắc Uy', '0123456789', '$2b$10$Il4SD6hazZ0HO6GlpzzzH.7dAmmV8jsHwEcs44vSa2R1AdZT.Nyke', 1),
(3, 'customer01', 'Nguyễn Văn A', '0987654321', 'E0308DA5BBE8279ADC296567334D429B', 0),
(4, 'customer02', 'Nguyễn Văn B', '0321654987', 'BABA9830D1E5DEAE4954C1364B536D66', 0);


-- Thêm shopping cart mẫu ứng với 2 customer mẫu
insert into carts values (1, 3), (2, 4);
*/

-- Thêm giày mẫu
insert into shoes ("shoes_name","image","brand_id","size","price","stock","state")
values
('nike basketball', '{https://i.pinimg.com/564x/28/75/87/28758783cf8d4de54e4e2b7e6f711d3b.jpg?fbclid=IwAR2kmnjwvLy0jvfesmUDSvIUcmb-7iiGb1yTkGMsBQIxlFqcvti9E0MZmsQ}',
	1, '{40,41,42}', 400000, '{99,99,98}',true),
('defy all day trainning', '{https://i.pinimg.com/564x/0e/e1/1d/0ee11d498476883a1eb33ba52da3bdb7.jpg?fbclid=IwAR1oUfYLQKBakO8CRygtKIlNYlTivqQjVf_sU6TBkA-6xINdoqVmdwGaagQ}',
	1,'{40,41,42}', 2299000, '{99,99,98}',true),
('dunk hight up', '{https://i.pinimg.com/736x/c8/7b/d7/c87bd7e584aeca170dddc8a735a97854.jpg?fbclid=IwAR1RZkDwtr3T-RGQfXtocfDOk5C7UCavbF3geYprApX-ZcFm1Up_3ilIgIc}',
	1, '{40,41,42}', 1199000, '{99,99,98}',true),
('nike air force one white', '{https://i.pinimg.com/564x/69/c1/2d/69c12d686d70fc347877626a7a477049.jpg?fbclid=IwAR1ODFApoczPdt8rwE-K8lU7oouaehtpHh3i1mmTJJN7uGfhirAjDniPLKg}',
	1, '{40,41,42}', 3699000, '{99,99,98}',true),
('air zoom','{https://i.pinimg.com/564x/27/cf/c3/27cfc32d010b7e352f644b7592ec9130.jpg?fbclid=IwAR1f5zgGoLQs7cNChKoHSXUbHKsDtDIuLQmwyFvGdMRf6A1cyBu5tY-miFs}',
	1, '{40,41,42}', 2499000, '{99,99,98}',true),
('nike air max', '{https://i.pinimg.com/564x/06/1b/4f/061b4f9ffc0dc3001d896c9d44f7ae95.jpg?fbclid=IwAR2KGXaI9EeGSBzYs-hq3Ingwy007tbdq-QtLzACV_ZblYf_np2B3VYDH9s}',
	1, '{40,41,42}', 1799000, '{99,99,98}',true),
('air jordan one red','{https://i.pinimg.com/564x/84/45/6a/84456a1832dc21323278d41aba9f643d.jpg?fbclid=IwAR1oUfYLQKBakO8CRygtKIlNYlTivqQjVf_sU6TBkA-6xINdoqVmdwGaagQ}',
	1, '{40,41,42}', 1379000, '{99,99,98}',true),
('air jordan custom', '{https://i.pinimg.com/564x/95/64/2e/95642ec6eea92dd6732df818ef8dd99f.jpg?fbclid=IwAR2qHV4aXaaYcljiYAncLECi4tGJqPRgMldvJdVNXj2BVpnNEmfMoMj4nU8}',
	1, '{40,41,42}', 1172000, '{99,99,98}',true),
('nike force one brown', '{https://i.pinimg.com/564x/d1/83/a8/d183a800fe70d1502a3c59c9827f86a0.jpg?fbclid=IwAR3kGWPCSOz4igoagcLtGCL95SfzVs4avKaKwDIhIXlLu_hnVTqDsPLegh4}',
	1, '{40,41,42}', 1375000, '{99,99,98}',true),
('nike jordan one grey','{https://i.pinimg.com/736x/0e/03/1c/0e031cf43206838ee9d503be1b5a6e99.jpg?fbclid=IwAR1MZFhZdL5gjVVmlrl0g2KwlvYQGwAr3n-MAZ3RAGQGA_ZksoCy53qyT9I}',
	1, '{40,41,42}', 3271000, '{99,99,98}',true),
('ultraboost 21', '{https://i.pinimg.com/236x/36/8b/1b/368b1bf0c13740f1c2f9483fb5a06dfd.jpg}', 2, '{40,41,42}', 5000000, '{99,99,98}',true),
('x9000l4', '{https://i.pinimg.com/236x/41/fd/6c/41fd6cf1a902867c24e3278587b8846f.jpg}', 2,'{40,41,42}', 3800000, '{99,99,98}',true),
('canvas terrex voyager 21', '{https://i.pinimg.com/236x/be/ac/05/beac05c4d36ca181273b862f8b8b5779.jpg}', 2, '{40,41,42}', 2700000, '{99,99,98}',true),
('giày chạy bộ eq21','{https://i.pinimg.com/236x/1a/cd/1b/1acd1b567bf67aab837fcd6d7c100227.jpg}', 2,'{40,41,42}', 2800000, '{99,99,98}',true),
('zx 10000 krusty burger', '{https://i.pinimg.com/236x/d1/41/c6/d141c6084a57e390ec50eeda5f2dd46e.jpg}', 2, '{40,41,42}', 3100000, '{99,99,98}',true),
('nmd_r1 primeblue','{https://i.pinimg.com/564x/31/af/4b/31af4b7eb24f704633f1dd7112523374.jpg}', 2, '{40,41,42}', 3400000, '{99,99,98}',true),
('pureboost 21', '{https://i.pinimg.com/564x/da/50/bf/da50bf7b9d5b3e85f58ed49122c1bf66.jpg}', 2, '{40,41,42}', 3500000, '{99,99,98}',true),
('response sr', '{https://i.pinimg.com/564x/ad/60/d5/ad60d51b41f4822897ec88fd347956c8.jpg}', 2, '{40,41,42}', 1800000, '{99,99,98}',true),
('x9000l4 guard', '{https://i.pinimg.com/564x/a5/43/c7/a543c7254f96efed4c48967f873e6bd9.jpg}', 2, '{40,41,42}', 3800000, '{99,99,98}',true),
('adistar', '{https://i.pinimg.com/564x/52/ff/a1/52ffa18aea5cfd712133e6787dc0c2f7.jpg}', 2, '{40,41,42}', 3500000, '{99,99,98}',true),
('culture dsmh02502trg', '{https://i.pinimg.com/originals/5c/5c/3c/5c5c3cab1e717db2b1316ff0a323a14b.png}',
	3,'{40,41,42}', 745000,'{99,99,98}',true),
('patchwork dsmh025 xanh ngọc','{https://i.pinimg.com/originals/8d/29/14/8d2914a205af4947c77ac7bf0cfffb07.png}',
	3, '{40,41,42}', 945000, '{99,99,98}',true),
('patchwork dsmh025 nâu', '{https://i.pinimg.com/originals/54/8b/ea/548bea9dfb46afd5f8c484fc2b569e33.png}',
	3, '{40,41,42}', 945000, '{99,99,98}',true),
('blue dsmh05000xdg xanh dương', '{https://i.pinimg.com/originals/2d/6a/0f/2d6a0f3f83cccad102cc232747f7d760.png}',
	3, '{40,41,42}', 745000, '{99,99,98}',true),
('2k20 dsmh03400 đen', '{https://i.pinimg.com/originals/c1/9d/fe/c19dfe76eba247a4cb8aeb896dab6e0f.png}',
	3, '{40,41,42}', 1029000, '{99,99,98}',true),
('2k20 dsmh03400 xanh nhớt', '{https://i.pinimg.com/originals/fd/cf/01/fdcf012002dba120eed524c3a39098fd.png}',
	3, '{40,41,42}', 1029000,'{99,99,98}',true),
('street dsmh04300 trắng', '{https://i.pinimg.com/564x/0f/c0/3f/0fc03f13e957696778bbc1b504149c75.jpg}',
	3, '{40,41,42}', 745000, '{99,99,98}',true),
('2k20 dsmh03400 cam','{https://i.pinimg.com/564x/b8/0e/65/b80e65b69561a65159805674f98aa03f.jpg}',
	3, '{40,41,42}', 1029000, '{99,99,98}',true),
('street dsmh04300 đen', '{https://i.pinimg.com/736x/b6/10/37/b610376654b771ac825b798d827cfa70.jpg}',
	3, '{40,41,42}', 745000, '{99,99,98}',true),
('layered upper dsmh02800den đen','{https://i.pinimg.com/564x/21/28/d9/2128d91eb1d980a4c7617c0348251622.jpg}',
	3, '{40,41,42}', 949000, '{99,99,98}',true);