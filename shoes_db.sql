-- drop database if exists shoes_db;
-- create database shoes_db;


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



-- Thêm shopping cart mẫu ứng với 2 customer mẫu

*/
insert into users values
(1, 'admin', 'My Shop', '0123456789', '$2b$10$qWUsTPJj8H3/PD.gtEuhgerIZNhp6oOniuHEQsjqBmEBYmmNNftGq', 1)
insert into carts values (1, 1);

-- Thêm giày mẫu
insert into shoes ("shoes_name","image","brand_id","size","price","stock","state")
values
('nike air max 90', '{1646464763316-570335583-nike_air_max90_01.png,1646464763322-605086825-nike_air_max90_02.png,1646464763324-724841558-nike_air_max90_03.png,1646464763330-651199165-nike_air_max90_04.png,1646464763335-275097293-nike_air_max90_05.png}',
	1, '{40,41,42,43}', 2799000.0000, '{99,97,98,12}',true),
('nike dunk high 85 x undercover', '{1646465395039-451240183-Nike_Dunk_High_85_x_UNDERCOVER.png,1646465395044-123751806-Nike_Dunk_High_85_x_UNDERCOVER2.png,1646465395047-909071746-Nike_Dunk_High_85_x_UNDERCOVER3.png,1646465395054-818722385-Nike_Dunk_High_85_x_UNDERCOVER4.png,1646465395058-387283725-Nike_Dunk_High_85_x_UNDERCOVER5.png}',
	1,'{40,41,42,43,44,45}', 4409000.0000, '{99,99,98,100,198,34}',true),
('jordan max2x', '{"1646464384693-110839749-Jordan MA2.png","1646464384697-549824186-Jordan MA2_2.png","1646464384701-660290268-Jordan MA2_3.png","1646464384715-84552668-Jordan MA2_4.png","1646464384724-149933172-Jordan MA2_5.png"}',
	1, '{40,41,42,43}', 3279000.0000, '{100,103,98,201}',true),
('zx 5k boost', '{1647018301409-269216089-zx5kboost.png,1647018301409-766115404-zx5kboost1.png,1647018301410-326874355-zx5kboost2.png,1647018301411-924903808-zx5kboost3.png,1647018301411-331809869-zx5kboost4.png}',
	2, '{40,41,42,43}',2800000.0000,'{99,96,98,12}',true),
('alphatorsion 2.0 blue','{1647017295877-368186294-alphatorisionblue1.png,1647017295878-779375016-alphatorisionblue2.png,1647017295878-426355953-alphatorisionblue3.png,1647017295879-718660607-alphatorisionblue4.png,1647017295880-317257469-alphatorisionblue5.png}',
	2, '{40,41,42,43}', 3500000.0000, '{101,101,98,102}',true),
('alphatorsion 2.0 white', '{1647017585209-708077340-alphatorisionwhite1.png,1647017585210-404769762-alphatorisionwhite2.png,1647017585210-245412817-alphatorisionwhite3.png,1647017585210-220013187-alphatorisionwhite4.png,1647017585211-547975247-alphatorisionwhite5.png}',
	2, '{40,41,42,43}',3560000.0000, '{99,99,98,11}',true),
('bitis hunter core go for love 2k22','{"1646486730360-874383760-Bitis Hunter Core Go For Love 2K22.png","1646486730360-156129045-Bitis Hunter Core Go For Love 2K22_2.png","1646486730361-382112932-Bitis Hunter Core Go For Love 2K22_3.png","1646486730361-427318116-Bitis Hunter Core Go For Love 2K22_4.png","1646486730365-548721135-Bitis Hunter Core Go For Love 2K22_5.png"}',
	3, '{40,41,42,43,44,45}', 1029000.0000, '{99,99,98,201,32,107}',true),
('bitis DSM074733TRG', '{"1646487035259-373066688-Bitis DSM074733TRG.png","1646487035260-593731529-Bitis DSM074733TRG_2.png","1646487035261-200749276-Bitis DSM074733TRG_3.png","1646487035262-116574970-Bitis DSM074733TRG_4.png","1646487035271-563872188-Bitis DSM074733TRG_5 .png"}',
	3, '{40,41,42,43}', 745000.0000, '{99,99,98,109}',true),
('bitis hunter street DSMH03400 đen', '{"1646488030827-697449715-Bitis Hunter Street DSMH08000TR.png","1646488030828-507166712-Bitis Hunter Street DSMH08000TRG.png","1646488030828-978267763-Bitis Hunter Street DSMH08000TRG3.png","1646488030829-728577227-Bitis Hunter Street DSMH08000TRG4.png","1646488030838-131317542-Bitis Hunter Street DSMH08000TRG5.png"}',
	3, '{40,41,42,43}', 1029000.0000, '{99,99,98,100}',true),
('canvas terrex voyager 21','{"1646488900540-161784808-Canvas Terrex Voyager 21.png","1646488900541-467815636-Canvas Terrex Voyager 211.png","1646488900542-404505995-Canvas Terrex Voyager 212.png","1646488900543-252377548-Canvas Terrex Voyager 213.png","1646488900544-168553477-Canvas Terrex Voyager 214.png"}',2,'{40,41,42,44}',2700000.0000,'{99,99,98,105}',true),
('nike air force 1 low by you','{1646465143809-610443292-Nike_Air_Force_1_Low_By_You.png,1646465143809-354144871-Nike_Air_Force_1_Low_By_You2.png,1646465143812-871894848-Nike_Air_Force_1_Low_By_You3.png,1646465143820-476582885-Nike_Air_Force_1_Low_By_You4.png,1646465143821-31654915-Nike_Air_Force_1_Low_By_You5.png}',1,'{40,41,42}',1375000.0000,'{92,93,99,98}',true),
('4D fusio','{1647018002732-329484321-4dfusio.png,1647018002733-407525049-4dfusio1.png,1647018002734-673099108-4dfusio2.png,1647018002734-235396739-4dfusio3.png,1647018002737-272032956-4dfusio5.png}',2,'{40,41,42,43,44}',3400000.0000,'{99,99,98,101,102}',true),
('alphatorsion 2.0 black','{1647016408762-473267263-alphatorision1.png,1647016408763-468731063-alphatorision2.png,1647016408763-647823056-alphatorision3.png,1647016408765-774727473-alphatorision4.png,1647016408767-901841941-alphatorision5.png}',2,'{40,41,42}'	,3800000.0000,'{99,99,98}',true),
('bitis hunter x army green DSHM05100REU','{"1647054120195-689592430-Bitis Hunter X Army Green DSMH05100REU.png","1647054120196-309031788-Bitis Hunter X Army Green DSMH05100REU1.png","1647054120205-544887120-Bitis Hunter X Army Green DSMH05100REU3.png","1647054120206-100033267-Bitis Hunter X Army Green DSMH05100REU4.png","1647054120207-734226008-Bitis Hunter X Army Green DSMH05100REU5.png"}',3,'{40,41,42}',945000.0000,'{99,99,98}',true),
('retropy e5','{1647018450593-112586098-retropye51.png,1647018450594-643760672-retropye52.png,1647018450594-331633201-retropye53.png,1647018450594-369365654-retropye54.png,1647018450595-364004396-retropye55.png}',2,'{40,41,42}',3800000.0000,'{99,98,98}',true),
('bitis hunter nameless edition','{"1646484316186-28530820-Bitis Hunter Nameless Edition.png","1646484316187-18009961-Bitis Hunter Nameless Edition1.png","1646484316188-839426259-Bitis Hunter Nameless Edition2.png","1646484316189-480833132-Bitis Hunter Nameless Edition4.png","1646484316190-302996502-Bitis Hunter Nameless Edition5.png"}',3,'{39,43,47}',1290000.0000,'{19,99,100}',true),
('jordan zoom separate pf','{1646470392465-505625652-jordan-zoom-separate-pf-basketball_01.png,1646470392478-576995480-jordan-zoom-separate-pf-basketball_02.png,1646470392484-225761553-jordan-zoom-separate-pf-basketball_04.png,1646470392494-674757961-jordan-zoom-separate-pf-basketball_05.png,1646470392501-792664930-jordan-zoom-separate-pf-basketball_06.png}',1,'{40,41,42,43,44,45,46}',3299000.0000,'{29,32,105,9,100,100,99}',true),
('trainer v','{1647016130022-206295502-trainerv1.png,1647016130022-377331980-trainerv2.png,1647016130023-633623238-trainerv3.png,1647016130024-591087143-trainerv4.png,1647016130025-895334460-trainerv5.png}',2,'{40,41,42}',3800000.0000,'{99,97,98}',true),
('high forum white','{1647015860293-485025998-HighForum.png,1647015860295-63951502-HighForum1.png,1647015860296-629702187-HighForum2.png,1647015860297-407806378-HighForum3.png,1647015860298-267220682-HighForum4.png}',2,'{40,41,42}',3400000.0000,'{99,99,98}',true),
('air jordan 1 mid se','{"1646463455643-403049972-Air Jordan 1 Mid SE1.png","1646463455655-974056637-Air Jordan 1 Mid SE2.png","1646463455661-723402995-Air Jordan 1 Mid SE3.png","1646463455669-912243684-Air Jordan 1 Mid SE4.png","1646463455682-303031458-Air Jordan 1 Mid SE5.png"}',1,'{39,40,41,42,43,44,45}',7900000.0000,'{100,102,104,104,105,106,107}',true),
('dropset trainer m','{1647016276821-376678356-dropsettrainner1.png,1647016276822-819939653-dropsettrainner2.png,1647016276824-852349093-dropsettrainner3.png,1647016276825-872031549-dropsettrainner4.png,1647016276825-167613052-dropsettrainner5.png}',	2,'{40,41,42}',3100000.0000,'{99,99,98}',true),
('nike dunk high up yeah','{1646466627990-5496940-dunkhighupcustom.png,1646466627996-719811671-dunkhighupcustom1.png,1646466628000-544567132-dunkhighupcustom2.png,1646466628008-445528657-dunkhighupcustom3.png,1646466628016-245480630-dunkhighupcustom4.png}',1,'{40,41,42,43}',4990000.0000,'{98,112,98,200}',true),
('alphatorsion 2.0 grey','{1647017443322-331224405-alphatorisiongrey1.png,1647017443323-944896335-alphatorisiongrey2.png,1647017443325-976570531-alphatorisiongrey3.png,1647017443326-530160135-alphatorisiongrey4.png,1647017443326-62247568-alphatorisiongrey5.png}',2,'{40,41,42,43}',3800000.0000,'{100,99,99,98}',true),
('pureboost 21','{1647017766139-386619430-Pureboost21_00.png,1647017766140-307502463-Pureboost21_01.png,1647017766141-372897559-Pureboost21_02.png,1647017766142-269170443-Pureboost21_03.png,1647017766142-871371718-Pureboost21_04.png}',2,'{40,41,42}',	3500000.0000,'{99,32,98}',true),
('ozelia marvel','{1647018139832-484435799-ozeliamarvel1.png,1647018139832-364834236-ozeliamarvel2.png,1647018139833-208154211-ozeliamarvel3.png,1647018139833-209816023-ozeliamarvel4.png,1647018139834-300909556-ozeliamarvel5.png}',2,'{40,41,42}',3100000.0000,'{99,99,98}',true),
('bitis hunter x midnight ez-strap dSMH07600 đen','{"1647054078692-446472910-Bitis Hunter X Midnight EZ-STRAP DSMH07600DEN.png","1647054078692-436005846-Bitis Hunter X Midnight EZ-STRAP DSMH07600DEN2.png","1647054078694-707776744-Bitis Hunter X Midnight EZ-STRAP DSMH07600DEN3.png","1647054078695-352874339-Bitis Hunter X Midnight EZ-STRAP DSMH07600DEN4.png","1647054078706-470863413-Bitis Hunter X Midnight EZ-STRAP DSMH07600DEN5.png"}',3,'{40,41,42}',945000.0000,'{99,99,98}',true),
('nike dunk high up','{1646466561338-588416485-dunkhighup.png,1646466561342-829796064-dunkhighup1.png,1646466561345-571231701-dunkhighup3.png,1646466561354-897730069-dunkhighup4.png,1646466561360-282337934-dunkhighup5.png}',1,'{40,41,42}',3519000.0000	,'{104,108,99}',true),
('bitis hunter street black DSMH08000den','{"1646487803129-251295015-Bitis Hunter Street Black DSMH08000DEN.png","1646487803130-372410802-Bitis Hunter Street Black DSMH08000DEN1.png","1646487803131-708349546-Bitis Hunter Street Black DSMH08000DEN2.png","1646487803131-457019880-Bitis Hunter Street Black DSMH08000DEN3.png","1646487803132-27975175-Bitis Hunter Street Black DSMH08000DEN4.png"}',3,'{40,41,42}',1029000.0000,'{98,99,98}',true),
('bitis hunter x z midnight black mid - top','{"1646486411244-605166309-Bitis Hunter X Z MIDNIGHT BLACK MID - TO.png","1646486411244-992406791-Bitis Hunter X Z MIDNIGHT BLACK MID - TOP.png","1646486411245-976587489-Bitis Hunter X Z MIDNIGHT BLACK MID - TOP3.png","1646486411250-900665270-Bitis Hunter X Z MIDNIGHT BLACK MID - TOP4.png","1646486411252-635802119-Bitis Hunter X Z MIDNIGHT BLACK MID - TOP5.png"}',3,'{40,41,42}',1200000.0000,'{99,98,98}',true),
('nike air zoom pegasus 38 black','{1646467393988-227842388-1airzoom_peganus_black001.png,"1646467393995-283605422-2airzoom_ peganus_black005.png",1646467394000-858552296-3airzoom_peganus_black02.png,"1646467394012-274629692-4airzoom_ peganus_black4.png","1646467394019-232574779-5airzoom_ peganus_black003.png"}',1,'{39,40,41,42,43,44,45}',2499000.0000,'{98,101,200,201,101,200,101}',true),
('low forum white','{1646490488579-155415172-Giay_Co_Thap_Forum_trang_FY7755_1.jpg,1646490488580-163469525-Giay_Co_Thap_Forum_trang_FY7755_02.jpg,1646490488580-756434060-Giay_Co_Thap_Forum_trang_FY7755_2.jpg,1646490488581-651471532-Giay_Co_Thap_Forum_trang_FY7755_03.jpg,1646490488584-246991914-Giay_Co_Thap_Forum_trang_FY7755_04.jpg}',2,'{39,40,41,42,43,44,45}',1499000.0000,'{101,101,104,104,105,106,107}',true),
('bitis hunter x classik grey dsmh06500xam','{"1647054154339-240279391-Bitis Hunter X Classik Grey DSMH06500XAM.png","1647054154340-372285348-Bitis Hunter X Classik Grey DSMH06500XAM2.png","1647054154341-468660961-Bitis Hunter X Classik Grey DSMH06500XAM3.png","1647054154347-522815666-Bitis Hunter X Classik Grey DSMH06500XAM4.png","1647054154348-377307126-Bitis Hunter X Classik Grey DSMH06500XAM5.png"}',3,'{40,41,42}',745000.0000,'{99,99,98}',true),
('nike air force one craft white','{1646462172768-295201-air_force_one_craft_01.png,1646462172777-110147766-air_force_one_craft_02.png,1646462172786-694174013-air_force_one_craft_03.png,1646462172794-751344017-air_force_one_craft_04.png,1646462172800-100758124-air_force_one_craft_05.png}',1,'{40,41,42,43}',3699000.0000,'{199,108,99,201}',true),
('nike air max terrascape 90','{1646465819194-626568326-airmaxterrascape90_1.png,1646465819198-640694666-airmaxterrascape90_2.png,1646465819201-209905052-airmaxterrascape90_3.png,1646465819206-913618621-airmaxterrascape90_4.png,1646465819216-864502311-airmaxterrascape90_5.png}',1,'{40,41,42}',1379000.0000,'{99,98,98}',true),
('bitis hunter x 1.0 festive armor black','{"1646486130469-728062329-Bitis Hunter X 1.0 Festive Armor Black.png","1646486130470-820594403-Bitis Hunter X 1.0 Festive Armor Black1.png","1646486130471-41218327-Bitis Hunter X 1.0 Festive Armor Black2.png","1646486130471-512162609-Bitis Hunter X 1.0 Festive Armor Black4.png","1646486130484-909753487-Bitis Hunter X 1.0 Festive Armor Black5.png"}',3,'{40,41,42,43}',1010000.0000,'{95,99,98,200}',true),
('defy all day trainning','{"1646468534501-655626932-Nike Defy All Day.png","1646468534512-709189927-Nike Defy All Day1.png","1646468534517-126130247-Nike Defy All Day3.png","1646468534525-611266021-Nike Defy All Day4.png","1646468534531-764160812-Nike Defy All Day5.png"}',1	,'{40,41,42}',	2399000.0000,'{110,116,101}',true),
('bitis hunter x old kool black DSMH06500 đen','{"1647054018224-638975385-Bitis Hunter X Old Kool Black DSMH06500DE.png","1647054018227-949457541-Bitis Hunter X Old Kool Black DSMH06500DEN.png","1647054018228-37178319-Bitis Hunter X Old Kool Black DSMH06500DEN2.png","1647054018229-465193338-Bitis Hunter X Old Kool Black DSMH06500DEN3.png","1647054018232-241129430-Bitis Hunter X Old Kool Black DSMH06500DEN4.png"}',3,'{40,41,42,43}','745000.0000','{99,99,98,100}',true),
('bitis hunter x 1.0 festive armor grey','{"1646485890877-555704231-Bitis Hunter X 1.0 Festive Armor Grey.png","1646485890879-103993645-Bitis Hunter X 1.0 Festive Armor Grey1.png","1646485890882-487150777-Bitis Hunter X 1.0 Festive Armor Grey2.png","1646485890883-433205489-Bitis Hunter X 1.0 Festive Armor Grey3.png","1646485890893-681096403-Bitis Hunter X 1.0 Festive Armor Grey4.png"}',3,'{39,43,47}',1010000.0000,'{20,97,100}',true);
