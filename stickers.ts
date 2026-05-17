export const STICKERS_DB: Record<string, Array<{id: string; name: string; desc: string; icon: string; title: string}>> = {
  common: [
    { id: "ve_thang_xanh", name: "V\u00e9 th\u00e1ng xanh", desc: "M\u1ed9t t\u1ea5m v\u00e9, v\u1ea1n chuy\u1ebfn \u0111i \u2013 gi\u1ea3m k\u1eb9t xe, t\u0103ng ni\u1ec1m vui.", icon: "\ud83d\udfe2", title: "V\u00e9 th\u00e1ng" },
    { id: "the_sinh_vien", name: "Th\u1ebb sinh vi\u00ean", desc: "V\u1eeba qua c\u1ed5ng so\u00e1t v\u00e9, v\u1eeba ghi \u0111i\u1ec3m c\u00f4ng d\u00e2n xanh.", icon: "\ud83c\udfab", title: "Th\u1ebb SV" },
    { id: "banh_quy_sang", name: "B\u00e1nh quy s\u00e1ng", desc: "N\u0103ng l\u01b0\u1ee3ng nhanh \u2013 g\u1ecdn \u2013 l\u00e0nh, kh\u00f4ng v\u1ee5n b\u00e1nh r\u01a1i ra gh\u1ebf.", icon: "\ud83c\udf6a", title: "B\u00e1nh quy" },
    { id: "nhanh_bac_ha", name: "Nh\u00e1nh b\u1ea1c h\u00e0", desc: "H\u01b0\u01a1ng th\u01a1m thanh m\u00e1t, \u00e1t c\u1ea3 m\u00f9i \u0111i\u1ec1u h\u00f2a c\u0169 k\u1ef9.", icon: "\ud83c\udf3f", title: "B\u1ea1c h\u00e0" },
    { id: "may_man_nho", name: "May m\u1eafn nh\u1ecf", desc: "Nh\u1eb7t \u0111\u01b0\u1ee3c tr\u00ean gh\u1ebf ch\u1edd \u2013 c\u00f3 th\u1ec3 l\u00e0 \u0111i\u1ec1m b\u00e1o m\u1ed9t ng\u00e0y su\u00f4n s\u1ebb.", icon: "\ud83c\udf40", title: "May m\u1eafn" },
    { id: "mam_xanh", name: "M\u1ea7m xanh", desc: "H\u00e0nh tr\u00ecnh n\u00e0o c\u0169ng b\u1eaft \u0111\u1ea7u t\u1eeb nh\u1eefng \u0111i\u1ec1u b\u00e9 nh\u1ecf.", icon: "\ud83c\udf31", title: "M\u1ea7m" },
    { id: "o_banh_mi", name: "\u1ed4 b\u00e1nh m\u00ec", desc: "B\u1eefa s\u00e1ng qu\u1ed1c d\u00e2n cho h\u00e0nh kh\u00e1ch v\u1ed9i gi\u1edd cao \u0111i\u1ec3m.", icon: "\ud83c\udf5e", title: "B\u00e1nh m\u00ec" },
    { id: "ca_phe_phin", name: "C\u00e0 ph\u00ea phin", desc: "T\u1ec9nh t\u00e1o \u0111\u1ec3 kh\u00f4ng ng\u1ee7 qu\u00ean tr\u1ea1m \u2013 \u0111\u1eadm ch\u1ea5t ph\u1ed1.", icon: "\u2615", title: "C\u00e0 ph\u00ea" },
    { id: "qua_tao_xanh", name: "Qu\u1ea3 t\u00e1o xanh", desc: "\u0102n m\u1ed9t qu\u1ea3, \u0111i th\u00eam ba ch\u1eb7ng.", icon: "\ud83c\udf4e", title: "T\u00e1o xanh" },
    { id: "ly_chanh_leo", name: "Ly chanh leo", desc: "Chua chua ng\u1ecdng ng\u1ecd, \u0111\u00fang \u0111i\u1ec7u h\u00e8 H\u00e0 N\u1ed9i.", icon: "\ud83c\udf4b", title: "Chanh leo" },
    { id: "banh_mi_kep", name: "B\u00e1nh m\u00ec k\u1eb9p", desc: "B\u1eefa tr\u01b0a tinh g\u1ecdn, kh\u00f4ng s\u1ee3 r\u1edbt \u0111\u1ed3 khi xe phanh g\u1ea5p.", icon: "\ud83e\udd6a", title: "B\u00e1nh k\u1eb9p" },
    { id: "banh_vong", name: "B\u00e1nh v\u00f2ng", desc: "V\u00f2ng tr\u00f2n may m\u1eafn \u2013 nhai vui tai, qu\u00ean m\u1ec7t.", icon: "\ud83c\udf69", title: "B\u00e1nh v\u00f2ng" },
    { id: "hu_mat_ong", name: "H\u0169 m\u1eadt ong", desc: "Ng\u1ecdt nh\u01b0 t\u1ea5m l\u00f2ng ng\u01b0\u1eddi H\u00e0 N\u1ed9i nh\u01b0\u1eddng gh\u1ebf cho c\u1ee5 gi\u00e0.", icon: "\ud83c\udf6f", title: "M\u1eadt ong" },
    { id: "mieng_dua_hau", name: "Mi\u1ebfng d\u01b0a h\u1ea5u", desc: "\u0110\u1ecf l\u00f2ng, m\u00e1t d\u1ea1 \u2013 gi\u1ea3i nhi\u1ec7t sau c\u01a1n n\u1eafng 40\u00b0C.", icon: "\ud83c\udf49", title: "D\u01b0a h\u1ea5u" },
    { id: "qua_quyt_vang", name: "Qu\u1ea3 qu\u00fdt v\u00e0ng", desc: "T\u1eb7ng b\u1ea1n c\u00f9ng gh\u1ebf \u0111\u1ec3 ph\u00e1 b\u0103ng v\u00e0 c\u00f9ng \u0103n.", icon: "\ud83c\udf4a", title: "Qu\u00fdt" },
    { id: "qua_le_thom", name: "Qu\u1ea3 l\u00ea th\u01a1m", desc: "Th\u01a1m d\u1ecbu, g\u1ee3i nh\u1edb m\u00f9a thu H\u00e0 N\u1ed9i kh\u00f4ng kh\u00f3i b\u1ee5i.", icon: "\ud83c\udf50", title: "Qu\u1ea3 l\u00ea" },
    { id: "kiwi_xanh", name: "Tr\u00e1i kiwi xanh", desc: "Nh\u1ecf nh\u01b0ng c\u00f3 v\u00f5 \u2013 gi\u00e0u vitamin, \u00edt calo.", icon: "\ud83e\udd5d", title: "Kiwi" },
    { id: "doi_cherry", name: "\u0110\u00f4i cherry", desc: "Gh\u00e9p c\u1eb7p ho\u00e0n h\u1ea3o \u2013 nh\u01b0 \u0111\u00f4i b\u1ea1n c\u00f9ng chuy\u1ebfn.", icon: "\ud83c\udf52", title: "Cherry" },
    { id: "hop_sua_tuoi", name: "H\u1ed9p s\u1eefa t\u01b0\u01a1i", desc: "U\u1ed1ng h\u1ebft nh\u1edb b\u1ecf v\u1ecf v\u00e0o th\u00f9ng r\u00e1c nh\u00e9!", icon: "\ud83e\uddc3", title: "S\u1eefa" },
    { id: "goi_lac_rang", name: "G\u00f3i l\u1ea1c rang", desc: "Nh\u1ea5m nh\u00e1p gi\u00f2n tan, \u0111\u1eebng \u0111\u1ec3 r\u01a1i v\u00e3i xu\u1ed1ng s\u00e0n.", icon: "\ud83e\udd5c", title: "L\u1ea1c rang" },
    { id: "qua_chuoi_vang", name: "Qu\u1ea3 chu\u1ed1i v\u00e0ng", desc: "D\u1ec5 \u0103n, d\u1ec5 mang, n\u0103ng l\u01b0\u1ee3ng b\u1ec1n v\u1eefng.", icon: "\ud83c\udf4c", title: "Chu\u1ed1i" }
  ],
  uncommon: [
    { id: "quet_the_thong_minh", name: "Qu\u1eb9t th\u1ebb th\u00f4ng minh", desc: "B\u00edp m\u1ed9t c\u00e1i \u2013 thanh to\u00e1n xong, kh\u1ecfi l\u1ee5c v\u00ed.", icon: "\ud83d\udcf1", title: "Qu\u1eb9t th\u1ebb" },
    { id: "tai_nghe_khong_day", name: "Tai nghe kh\u00f4ng d\u00e2y", desc: "C\u00e1ch ly \u1ed3n \u00e0o, ch\u00ecm \u0111\u1eafm trong th\u1ebf gi\u1edbi ri\u00eang.", icon: "\ud83c\udfa7", title: "Tai nghe" },
    { id: "ba_lo_xanh", name: "Ba l\u00f4 xanh", desc: "\u0110\u1ed3ng h\u00e0nh t\u1eeb gi\u1ea3ng \u0111\u01b0\u1eddng \u0111\u1ebfn b\u1ebfn xe, b\u1ec1n b\u1ec9 nh\u01b0 sinh vi\u00ean.", icon: "\ud83c\udf92", title: "Ba l\u00f4" },
    { id: "mu_luoi_trai", name: "M\u0169 l\u01b0\u1ee1i trai", desc: "Che n\u1eafng chu\u1ea9n, t\u1ea1o d\u00e1ng ch\u1ea5t cho h\u00e0nh kh\u00e1ch.", icon: "\ud83e\udde2", title: "M\u0169" },
    { id: "kinh_ram_hn", name: "K\u00ednh r\u00e2m H\u00e0 N\u1ed9i", desc: "Nh\u00ecn ph\u1ed1 ph\u01b0\u1eddng qua l\u0103ng k\u00ednh xanh \u2013 ng\u1ea7u v\u00e0 b\u1ea3o v\u1ec7 m\u1eaft.", icon: "\ud83d\udd76\ufe0f", title: "K\u00ednh r\u00e2m" },
    { id: "pin_du_phong", name: "Pin d\u1ef1 ph\u00f2ng", desc: "S\u1ea1c tinh th\u1ea7n l\u1eabn \u0111i\u1ec7n tho\u1ea1i, kh\u00f4ng s\u1ee3 h\u1ebft pin gi\u1eefa \u0111\u01b0\u1eddng.", icon: "\ud83d\udd0b", title: "Pin" },
    { id: "chia_khoa_nha", name: "Ch\u00ec\u00e0 kh\u00f3a nh\u00e0", desc: "Nh\u1eafc b\u1ea1n r\u1eb1ng cu\u1ed1i ng\u00e0y v\u1eabn c\u00f3 m\u1ed9t m\u00e1i \u1ea5m ch\u1edd.", icon: "\ud83d\udd11", title: "Ch\u00ec\u00e0 kh\u00f3a" },
    { id: "so_tay_hanh_trinh", name: "S\u1ed5 tay h\u00e0nh tr\u00ecnh", desc: "Ghi l\u1ea1i nh\u1eefng c\u00e2u chuy\u1ec7n th\u00fa v\u1ecb tr\u00ean t\u1eebng tuy\u1ebfn bus.", icon: "\ud83d\udcd8", title: "S\u1ed5 tay" },
    { id: "but_bi_xanh", name: "B\u00fat bi xanh", desc: "Vi\u1ebft ti\u1ebfp \u01b0\u1edbc m\u01a1, ngay c\u1ea3 khi xe h\u01a1i x\u00f3c.", icon: "\ud83d\udd8a\ufe0f", title: "B\u00fat bi" },
    { id: "kep_giay_tai_che", name: "K\u1eb9p gi\u1ea5y t\u00e1i ch\u1ebf", desc: "G\u1ecdn g\u00e0ng, xanh \u2013 gi\u1eef m\u1ecdi th\u1ee9 ng\u0103n n\u1eafp nh\u01b0 l\u1ecbch tr\u00ecnh xe.", icon: "\ud83d\udcce", title: "K\u1eb9p gi\u1ea5y" },
    { id: "gau_bong_nho", name: "G\u1ea5u b\u00f4ng nh\u1ecf", desc: "Ng\u01b0\u1eddi b\u1ea1n tr\u1ebb em b\u1ecf qu\u00ean \u2013 gi\u1edd l\u00e0 linh v\u1eadt c\u1ee7a tuy\u1ebfn.", icon: "\ud83e\uddf8", title: "G\u1ea5u b\u00f4ng" },
    { id: "cuong_ve_cu", name: "Cu\u1ed1ng v\u00e9 c\u0169", desc: "L\u01b0u gi\u1eef k\u1ef7 ni\u1ec7m m\u1ed9t l\u1ea7n l\u1ee1 chuy\u1ebfn v\u00e0 b\u00e0i h\u1ecdc \u0111\u00fang gi\u1edd.", icon: "\ud83c\udfdf\ufe0f", title: "Cu\u1ed1ng v\u00e9" },
    { id: "anh_pho_co", name: "\u1ea2nh ph\u1ed1 c\u1ed5", desc: "Kho\u1ea3nh kh\u1eafc H\u00e0 N\u1ed9i nh\u1eb9 nh\u00e0ng, kh\u00f4ng filter.", icon: "\ud83d\udcf7", title: "\u1ea2nh ph\u1ed1" },
    { id: "dong_ho_bam_gio", name: "\u0110\u1ed3ng h\u1ed3 b\u1ea5m gi\u1edd", desc: "\u0110\u1ebfm ng\u01b0\u1ee3c th\u1eddi gian \u0111\u1ebfn tr\u1ea1m \u2013 \u0111\u1eebng \u0111\u1ec3 l\u1ee1 h\u1eb9n!", icon: "\u231a", title: "\u0110\u1ed3ng h\u1ed3" },
    { id: "dia_nhac_xanh", name: "\u0110\u0129a nh\u1ea1c xanh", desc: "Playlist chill d\u00e0nh ri\u00eang cho d\u00e2n nghi\u1ec1n bus.", icon: "\ud83d\udcbf", title: "\u0110\u0129a nh\u1ea1c" }
  ],
  rare: [
    { id: "rong_thang_long", name: "R\u1ed3ng bay Th\u0103ng Long", desc: "Bay tr\u00ean b\u1ea7u tr\u1eddi kh\u00f4ng kh\u00f3i b\u1ee5i \u2013 t\u01b0\u1ee3ng \u0111\u00e0i giao th\u00f4ng xanh.", icon: "\ud83d\udc09", title: "R\u1ed3ng Th\u0103ng Long" },
    { id: "xe_buyt_dem", name: "Xe bu\u00fdt \u0111\u00eam", desc: "L\u1eb7ng l\u1ebd l\u01b0\u1edbt qua ph\u1ed1 v\u1eafng, nh\u01b0 m\u1ed9t c\u00e2u th\u01a1 kh\u00f4ng v\u1ea7n.", icon: "\ud83c\udf19", title: "Xe \u0111\u00eam" },
    { id: "vuong_mien_xanh", name: "V\u01b0\u01a1ng mi\u1ec7n xanh", desc: "\u0110\u1ed9i l\u00ean \u0111\u1ea7u h\u00e0nh kh\u00e1ch VIP \u2013 \u0111i bus \u0111\u1ec1u nh\u01b0 c\u01a1m b\u1eefa.", icon: "\ud83d\udc51", title: "V\u01b0\u01a1ng mi\u1ec7n" },
    { id: "ten_lua_metro", name: "T\u00ean l\u1eeda metro", desc: "Lao vun v\u00fat \u2013 t\u01b0\u01a1ng lai giao th\u00f4ng kh\u00f4ng t\u1eafc \u0111\u01b0\u1eddng.", icon: "\ud83d\ude80", title: "T\u00ean l\u1eeda" },
    { id: "set_xanh", name: "S\u00e9t xanh", desc: "Ngu\u1ed3n n\u0103ng l\u01b0\u1ee3ng t\u00e1i t\u1ea1o th\u1eafp s\u00e1ng m\u1ecdi ch\u1eb7ng.", icon: "\u26a1", title: "S\u00e9t" },
    { id: "ngon_lua_xanh", name: "Ng\u1ecdn l\u1eeda xanh", desc: "Ch\u00e1y m\u00e3i \u0111am m\u00ea \u0111i bus, kh\u00f4ng ng\u1ea1i n\u1eafng m\u01b0a.", icon: "\ud83d\udd25", title: "Ng\u1ecdn l\u1eeda" },
    { id: "ngoi_sao", name: "Ng\u00f4i sao d\u1eabn \u0111\u01b0\u1eddng", desc: "Lu\u00f4n ch\u1ec9 l\u1ed1i v\u1ec1 nh\u00e0, d\u00f9 b\u1ea1n xu\u1ed1ng tr\u1ea1m n\u00e0o.", icon: "\ud83c\udf1f", title: "Ng\u00f4i sao" },
    { id: "la_ban_hn", name: "La b\u00e0n H\u00e0 N\u1ed9i", desc: "Xoay \u0111\u00e2u c\u0169ng th\u1ea5y m\u1ed9t tuy\u1ebfn bus \u2013 kh\u00f4ng lo l\u1ea1c.", icon: "\ud83e\udded", title: "La b\u00e0n" },
    { id: "mat_phong_thuy", name: "M\u1eaft phong th\u1ee7y", desc: "Canh gi\u1eef b\u00ecnh an, xua tan r\u1ee7i ro tr\u00ean \u0111\u01b0\u1eddng.", icon: "\ud83e\uddff", title: "M\u1eaft phong th\u1ee7y" },
    { id: "chia_khoa_cong_thanh", name: "Ch\u00ec\u00e0 kh\u00f3a c\u1ed5ng th\u00e0nh", desc: "M\u1edf ra 36 ph\u1ed1 ph\u01b0\u1eddng b\u1eb1ng m\u1ed9t t\u1ea5m v\u00e9 th\u00e1ng.", icon: "\ud83d\udddd\ufe0f", title: "Ch\u00ec\u00e0 kh\u00f3a" },
    { id: "hoa_sua", name: "Hoa s\u1eefa m\u00f9a thu", desc: "H\u01b0\u01a1ng th\u01a1m g\u00e2y nghi\u1ec7n nh\u1eb9, nh\u01b0ng v\u1eabn d\u1ec5 ch\u1ecbu.", icon: "\ud83c\udff5\ufe0f", title: "Hoa s\u1eefa" }
  ],
  epic: [
    { id: "cup_xanh_thanh_pho", name: "C\u00fap xanh th\u00e0nh ph\u1ed1", desc: "Gi\u1ea3i th\u01b0\u1edfng cho cao th\u1ee7 ch\u01b0a bao gi\u1edd b\u1ecf chuy\u1ebfn.", icon: "\ud83c\udfc6", title: "C\u00fap" },
    { id: "phuong_hoang_lua_xanh", name: "Ph\u01b0\u1ee3ng ho\u00e0ng l\u1eeda xanh", desc: "H\u1ed3i sinh t\u1eeb n\u0103ng l\u01b0\u1ee3ng m\u1eb7t tr\u1eddi \u2013 r\u1ef1c r\u1ee1 v\u00e0 b\u1ea5t t\u1eed.", icon: "\ud83e\udd85", title: "Ph\u01b0\u1ee3ng ho\u00e0ng" },
    { id: "hiep_si_xanh", name: "Hi\u1ec7p s\u0129 xanh", desc: "Chi\u1ebfn \u0111\u1ea5u v\u00ec kh\u00f4ng kh\u00ed trong l\u00e0nh \u2013 kh\u00f4ng c\u1ea7n \u00e1o gi\u00e1p.", icon: "\ud83d\udee1\ufe0f", title: "Hi\u1ec7p s\u0129" },
    { id: "rong_xanh_co_loa", name: "R\u1ed3ng xanh C\u1ed5 Loa", desc: "Th\u1ee9c t\u1ec9nh huy\u1ec1n tho\u1ea1i, phun h\u01a1i m\u00e1t thay v\u00ec kh\u00f3i.", icon: "\ud83d\udc32", title: "R\u1ed3ng C\u1ed5 Loa" },
    { id: "cau_vong_sau_mua", name: "C\u1ea7u v\u1ed3ng sau m\u01b0a", desc: "Xu\u1ea5t hi\u1ec7n sau c\u01a1n m\u01b0a r\u00e0o, b\u00e1o hi\u1ec7u tr\u1eddi quang.", icon: "\ud83c\udf08", title: "C\u1ea7u v\u1ed3ng" },
    { id: "huan_chuong_xanh", name: "Hu\u00e2n ch\u01b0\u01a1ng xanh", desc: "\u0110\u1ed9i l\u00ean ng\u1ef1c \u00e1o \u2013 t\u1ef1 h\u00e0o l\u00e0 chi\u1ebfn binh bus 30 ng\u00e0y.", icon: "\ud83c\udf96\ufe0f", title: "Hu\u00e2n ch\u01b0\u01a1ng" },
    { id: "bong_den_nang_luong", name: "B\u00f3ng \u0111\u00e8n n\u0103ng l\u01b0\u1ee3ng", desc: "\u00dd t\u01b0\u1edfng s\u00e1ng b\u1eebng, soi \u0111\u01b0\u1eddng cho giao th\u00f4ng b\u1ec1n v\u1eefng.", icon: "\ud83d\udca1", title: "B\u00f3ng \u0111\u00e8n" },
    { id: "phao_hoa_xanh", name: "Ph\u00e1o hoa xanh", desc: "N\u1ed5 bung s\u1eafc m\u00e0u, ch\u00fac m\u1eebng m\u1ed9t ch\u1eb7ng \u0111\u01b0\u1eddng m\u1edbi.", icon: "\ud83c\udf86", title: "Ph\u00e1o hoa" },
    { id: "dai_ngan_ha_bus", name: "D\u1ea3i ng\u00e2n h\u00e0 bus", desc: "H\u1ec7 th\u1ed1ng tuy\u1ebfn xe l\u1ea5p l\u00e1nh, \u0111\u1eb9p nh\u01b0 tr\u1eddi sao.", icon: "\ud83d\udcab", title: "D\u1ea3i ng\u00e2n h\u00e0" },
    { id: "ve_tinh_xanh", name: "V\u1ec7 tinh xanh", desc: "Quan s\u00e1t th\u00e0nh ph\u1ed1 t\u1eeb tr\u00ean cao \u2013 kh\u00f4ng th\u1ea5y t\u1eafc \u0111\u01b0\u1eddng.", icon: "\ud83d\udef0\ufe0f", title: "V\u1ec7 tinh" }
  ],
  legendary: [
    { id: "vua_xe_buyt_hn", name: "Vua xe bu\u00fdt H\u00e0 N\u1ed9i", desc: "Cai tr\u1ecb m\u1ecdi tuy\u1ebfn \u0111\u01b0\u1eddng, kh\u00f4ng ng\u1ea1i ng\u1ea1i gi\u1edd cao \u0111i\u1ec3m.", icon: "\ud83d\udc51", title: "Vua bus" },
    { id: "long_mach_giao_thong", name: "Long m\u1ea1ch giao th\u00f4ng", desc: "D\u00f2ng ch\u1ea3y linh thi\u00eang k\u1ebft n\u1ed1i m\u1ecdi mi\u1ec1n kh\u00f4ng t\u1eafc ngh\u1ebd\u1edn.", icon: "\ud83d\udc09", title: "Long m\u1ea1ch" },
    { id: "thien_ma_xanh", name: "Thi\u00ean m\u00e3 xanh", desc: "Ng\u1ef1a th\u1ea7n ch\u1ea1y b\u1eb1ng n\u0103ng l\u01b0\u1ee3ng m\u1eb7t tr\u1eddi \u2013 t\u1ed1c \u0111\u1ed9 v\u00e0 thu\u1ea7n khi\u1ebft.", icon: "\ud83e\udd84", title: "Thi\u00ean m\u00e3" },
    { id: "co_cu_do_sao_vang", name: "C\u1edd \u0111\u1ecf sao v\u00e0ng", desc: "Bay tr\u00ean m\u1ecdi chuy\u1ebfn bus, nh\u1eafc nh\u1edf l\u00f2ng t\u1ef1 h\u00e0o d\u00e2n t\u1ed9c.", icon: "\ud83d\udea9", title: "C\u1edd" },
    { id: "duoc_xanh", name: "\u0110u\u1ed1c xanh", desc: "Ng\u1ecdn \u0111u\u1ed1c d\u1eabn l\u1ed1i, truy\u1ec1n c\u1ea3m h\u1ee9ng s\u1ed1ng xanh.", icon: "\ud83c\udf87", title: "\u0110u\u1ed1c" },
    { id: "guom_than", name: "G\u01b0\u01a1m th\u1ea7n", desc: "S\u1eafc b\u00e9n nh\u01b0 \u00fd ch\u00ed b\u1ea3o v\u1ec7 m\u00f4i tr\u01b0\u1eddng c\u1ee7a ng\u01b0\u1eddi tr\u1ebb.", icon: "\u2694\ufe0f", title: "G\u01b0\u01a1m" }
  ],
  mythic: [
    { id: "tinh_tu_hn", name: "Tinh t\u00fa H\u00e0 N\u1ed9i", desc: "\u00c1nh s\u00e1ng v\u0129nh c\u1eedu, soi \u0111\u01b0\u1eddng cho m\u1ecdi chuy\u1ebfn xe \u0111\u00eam.", icon: "\ud83c\udf1f", title: "Tinh t\u00fa" },
    { id: "anh_sang_xanh", name: "\u00c1nh s\u00e1ng xanh", desc: "Tinh hoa n\u0103ng l\u01b0\u1ee3ng s\u1ea1ch \u2013 \u0111\u1eb9p \u0111\u1ebfn m\u1ee9c kh\u00f3 tin.", icon: "\u2728", title: "\u00c1nh s\u00e1ng" },
    { id: "am_duong", name: "\u00c2m d\u01b0\u01a1ng giao h\u00f2a", desc: "C\u00e2n b\u1eb1ng gi\u1eefa ph\u00e1t tri\u1ec3n v\u00e0 thi\u00ean nhi\u00ean \u2013 nh\u01b0 xe bu\u00fdt v\u00e0 c\u00e2y xanh.", icon: "\u262f\ufe0f", title: "\u00c2m d\u01b0\u01a1ng" }
  ],
  secret: [
    { id: "so_tay_co", name: "S\u1ed5 tay c\u1ed5", desc: "B\u00ed k\u00edp \u0111i bus b\u00e1 \u0111\u1ea1o \u2013 ghi ch\u00e9p t\u1eeb th\u1eddi bao c\u1ea5p.", icon: "\ud83d\udcd5", title: "S\u1ed5 tay c\u1ed5" },
    { id: "cuon_giay_rong", name: "Cu\u1ed9n gi\u1ea5y r\u1ed3ng", desc: "S\u1eafc phong c\u1ee7a vua L\u00fd: Ng\u01b0\u01a1i h\u00e3y \u0111i bus, \u0111\u1eebng \u0111i xe m\u00e1y.", icon: "\ud83d\udcdc", title: "Cu\u1ed9n gi\u1ea5y" }
  ],
  impossible: [
    { id: "xuong_rong_huyen_thoai", name: "X\u01b0\u01a1ng r\u1ed3ng huy\u1ec1n tho\u1ea1i", desc: "Sinh v\u1eadt t\u1ed1i th\u01b0\u1ee3ng \u2013 canh gi\u1eef nh\u1eefng tuy\u1ebfn bus\u2026 kh\u00f4ng bao gi\u1edd t\u1eafc.", icon: "\ud83d\udc80", title: "X\u01b0\u01a1ng r\u1ed3ng" }
  ]
};

export const RARITY_CONFIG = [
  { name: "common", chance: 55, display: "COMMON", color: "#6c757d" },
  { name: "uncommon", chance: 25, display: "UNCOMMON", color: "#28a745" },
  { name: "rare", chance: 12, display: "RARE", color: "#007bff" },
  { name: "epic", chance: 5, display: "EPIC", color: "#9b59b6" },
  { name: "legendary", chance: 2, display: "LEGENDARY", color: "#f39c12" },
  { name: "mythic", chance: 0.8, display: "MYTHIC", color: "#e84393" },
  { name: "secret", chance: 0.19, display: "SECRET", color: "#f1c40f" },
  { name: "impossible", chance: 0.01, display: "IMPOSSIBLE", color: "#ff0066" },
];

export const RARITY_ORDER = ["impossible", "secret", "mythic", "legendary", "epic", "rare", "uncommon", "common"];

export function rollRarity(pityCounter: number, pityActive: boolean): string {
  if (pityActive) {
    if (Math.random() * 100 < 50) return "impossible";
  }
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const rarity of RARITY_CONFIG) {
    cumulative += rarity.chance;
    if (rand < cumulative) return rarity.name;
  }
  return "common";
}

export function getRandomSticker(rarity: string) {
  const list = STICKERS_DB[rarity];
  if (!list || list.length === 0) return STICKERS_DB.common[0];
  return list[Math.floor(Math.random() * list.length)];
}

export const FORTUNE_COOKIES = [
  "Chuy\u1ebfn bus h\u00f4m nay s\u1ebd mang l\u1ea1i \u0111i\u1ec1u b\u1ea5t ng\u1edd th\u00fa v\u1ecb cho b\u1ea1n.",
  "Ng\u01b0\u1eddi ng\u1ed3i c\u1ea1nh b\u1ea1n c\u00f3 th\u1ec3 l\u00e0 ng\u01b0\u1eddi b\u1ea1n t\u1ed1t nh\u1ea5t trong t\u01b0\u01a1ng lai.",
  "H\u00e3y nh\u01b0\u1eddng gh\u1ebf cho ng\u01b0\u1eddi cao tu\u1ed5i \u2013 ph\u01b0\u1edbc b\u00e1u s\u1ebd \u0111\u1ebfn v\u1edbi b\u1ea1n.",
  "T\u1eaft m\u00e1y \u0111i\u1ec1u h\u00f2a, m\u1edf c\u1eeda s\u1ed5 \u2013 tr\u1eddi H\u00e0 N\u1ed9i \u0111\u1eb9p l\u1eafm \u0111\u00f3.",
  "B\u1ea1n s\u1ebd t\u00ecm \u0111\u01b0\u1ee3c th\u1ee9 b\u1ea1n \u0111ang t\u00ecm ki\u1ebfm, nh\u01b0ng kh\u00f4ng ph\u1ea3i h\u00f4m nay.",
  "L\u1ed9 tr\u00ecnh cu\u1ed9c \u0111\u1eddi kh\u00f4ng gi\u1ed1ng l\u1ecbch tr\u00ecnh xe bu\u00fdt \u2013 \u0111\u1eebng lo n\u1ebfu l\u1ee1 m\u1ed9t chuy\u1ebfn.",
  "\u0110i\u1ec1u t\u1ed1t \u0111\u1eb9p nh\u1ea5t s\u1eafp \u0111\u1ebfn. H\u00e3y ki\u00ean nh\u1eabn nh\u01b0 ch\u1edd xe \u1edf tr\u1ea1m.",
  "Sticker hi\u1ebfm \u0111ang ch\u1edd b\u1ea1n \u1edf chuy\u1ebfn t\u1edbi!",
  "Streak c\u1ee7a b\u1ea1n s\u1ebd t\u1ea1o n\u00ean k\u1ef7 l\u1ee5c m\u1edbi.",
  "H\u00e0nh tr\u00ecnh ng\u00e0n d\u1eb7m b\u1eaft \u0111\u1ea7u t\u1eeb m\u1ed9t b\u01b0\u1edbc l\u00ean xe bu\u00fdt.",
  "B\u1ea1n \u0111ang tr\u00ean \u0111\u00fang \u0111\u01b0\u1eddng r\u1ed3i \u2013 theo ngh\u0129a \u0111en v\u00e0 ngh\u0129a b\u00f3ng.",
  "H\u00f4m nay l\u00e0 ng\u00e0y t\u1ed1t \u0111\u1ec3 b\u1eaft \u0111\u1ea7u m\u1ed9t streak m\u1edbi.",
];

export const WHEEL_PRIZES = [
  { prize: "roll", label: "+1 Roll", weight: 35 },
  { prize: "roll2", label: "+2 Rolls", weight: 20 },
  { prize: "streak", label: "+1 Streak", weight: 15 },
  { prize: "nothing", label: "Ch\u00fac may m\u1eafn l\u1ea7n sau", weight: 20 },
  { prize: "roll3", label: "+3 Rolls", weight: 8 },
  { prize: "pity_reset", label: "Pity Reset!", weight: 2 },
];

export function spinWheel(): { prize: string; label: string } {
  const totalWeight = WHEEL_PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const prize of WHEEL_PRIZES) {
    rand -= prize.weight;
    if (rand <= 0) return prize;
  }
  return WHEEL_PRIZES[0];
}
