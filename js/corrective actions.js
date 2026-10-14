const cacTheSuCo = [...document.querySelectorAll('.the-su-co')];
const oTimKiem = document.getElementById('oTimKiem');
const boLocKhuVuc = document.getElementById('boLocKhuVuc');
const nutLocUuTien = document.getElementById('nutLocUuTien');
const bangKanban = document.getElementById('bangKanban');
const cheXemDS = document.getElementById('cheXemDS');
const demKetQua = document.getElementById('demKetQua');
const cuaSoSuCo = document.getElementById('cuaSoSuCo');
const thongBao = document.getElementById('thongBao');
let theDangChon = null;
let chiUuTien = false;
let henGioThongBao;

const tenTrangThai = { 'can-lam': 'Cần làm', 'dang-xu-ly': 'Đang xử lý', 'nghiem-thu': 'Đang nghiệm thu', 'da-dong': 'Đã đóng' };
const classTrangThai = { 'can-lam': 'trang-thai-can-lam', 'dang-xu-ly': 'trang-thai-dang-xu-ly', 'nghiem-thu': 'trang-thai-nghiem-thu', 'da-dong': 'trang-thai-da-dong' };

function hienThongBao(noiDung) {
    thongBao.textContent = noiDung;
    thongBao.classList.add('hien-thi');
    clearTimeout(henGioThongBao);
    henGioThongBao = setTimeout(() => thongBao.classList.remove('hien-thi'), 2600);
}

const nutChuyenKhuVucSidebar = document.getElementById('nutChuyenKhuVucSidebar');
const menuThaXuongSidebar = document.getElementById('menuThaXuongSidebar');
const nutChuyenDuAnTop = document.getElementById('nutChuyenDuAnTop');
const menuThaXuongTop = document.getElementById('menuThaXuongTop');

nutChuyenKhuVucSidebar.addEventListener('click', (e) => {
    e.stopPropagation();
    menuThaXuongSidebar.hidden = !menuThaXuongSidebar.hidden;
    menuThaXuongTop.hidden = true;
});

nutChuyenDuAnTop.addEventListener('click', (e) => {
    e.stopPropagation();
    menuThaXuongTop.hidden = !menuThaXuongTop.hidden;
    menuThaXuongSidebar.hidden = true;
});

document.querySelectorAll('.muc-chon-khu-vuc').forEach(muc => {
    muc.addEventListener('click', (e) => {
        e.stopPropagation();
        const tenMoi = muc.dataset.khuVuc;
        document.getElementById('tenKhuVucHienTai').textContent = tenMoi;
        document.getElementById('tenDuAnHienTai').textContent = tenMoi;
        menuThaXuongSidebar.hidden = true;
        menuThaXuongTop.hidden = true;
        hienThongBao(`Đã chuyển sang: ${tenMoi}`);
    });
});

document.addEventListener('click', () => {
    menuThaXuongSidebar.hidden = true;
    menuThaXuongTop.hidden = true;
});

function locDanhSachThe() {
    const tuKhoa = oTimKiem.value.trim().toLocaleLowerCase('vi');
    const khuVucChon = boLocKhuVuc.value;
    return cacTheSuCo.filter(the => {
        const khopVanBan = `${the.dataset.ma} ${the.dataset.tieuDe} ${the.dataset.khuVuc}`.toLocaleLowerCase('vi').includes(tuKhoa);
        const khopKhuVuc = khuVucChon === 'all' || the.dataset.khuVuc === khuVucChon;
        const khopUuTien = !chiUuTien || the.dataset.uuTien === 'true';
        return khopVanBan && khopKhuVuc && khopUuTien;
    });
}

function renderDanhSach(danhSach) {
    document.getElementById('cacHangDS').innerHTML = danhSach.map(the => `
    <div class="hang-du-lieu-ds" data-ma-the="${the.dataset.ma}" tabindex="0">
      <span>${the.dataset.ma}</span><b>${the.dataset.tieuDe}</b><span>Zone ${the.dataset.khuVuc}</span>
      <span><i class="trang-thai-ds ${classTrangThai[the.dataset.trangThai]}">${tenTrangThai[the.dataset.trangThai]}</i></span>
      <span>${the.querySelector('.han-chot')?.textContent.replace('● ', '') || '—'}</span>
    </div>`).join('');
    document.querySelectorAll('.hang-du-lieu-ds').forEach(hang => {
        const mo = () => moTheSuCo(cacTheSuCo.find(t => t.dataset.ma === hang.dataset.maThe));
        hang.addEventListener('click', mo);
        hang.addEventListener('keydown', e => { if (e.key === 'Enter') mo(); });
    });
}

function apDungBoLoc() {
    const ketQuaLoc = locDanhSachThe();
    cacTheSuCo.forEach(the => the.hidden = !ketQuaLoc.includes(the));
    document.querySelectorAll('.cot-kanban').forEach(cot => {
        const hienThi = [...cot.querySelectorAll('.the-su-co')].filter(the => !the.hidden);
        cot.querySelector('.so-luong').textContent = hienThi.length;
    });
    demKetQua.textContent = `Hiển thị ${ketQuaLoc.length} sự cố · Ưu tiên xử lý sự cố tại công trường`;
    renderDanhSach(ketQuaLoc);
}

function moTheSuCo(the) {
    if (!the) return;
    theDangChon = the;
    document.getElementById('maSuCoModal').textContent = `MÃ SỰ CỐ ${the.dataset.ma}`;
    document.getElementById('tieuDeModal').textContent = the.dataset.tieuDe;
    document.getElementById('khuVucModal').textContent = `Zone ${the.dataset.khuVuc}`;
    document.getElementById('trangThaiModal').textContent = tenTrangThai[the.dataset.trangThai];
    document.getElementById('nguoiPhuTrachModal').textContent = the.querySelector('.nguoi-phu-trach')?.textContent.trim() || 'Chưa phân công';
    document.getElementById('anhModal').src = the.querySelector('img').src;
    document.getElementById('chonTrangThaiModal').value = the.dataset.trangThai;
    cuaSoSuCo.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('nutDongModal').focus();
}

function dongCuaSo() {
    cuaSoSuCo.hidden = true;
    document.body.style.overflow = '';
}

cacTheSuCo.forEach(the => the.addEventListener('click', () => moTheSuCo(the)));
[oTimKiem, boLocKhuVuc].forEach(el => el.addEventListener('input', apDungBoLoc));

nutLocUuTien.addEventListener('click', () => {
    chiUuTien = !chiUuTien;
    nutLocUuTien.classList.toggle('dang-chon', chiUuTien);
    apDungBoLoc();
});

document.getElementById('nutMoBoLoc').addEventListener('click', () => {
    boLocKhuVuc.value = 'all';
    chiUuTien = false;
    nutLocUuTien.classList.remove('dang-chon');
    oTimKiem.value = '';
    apDungBoLoc();
    hienThongBao('Đã xóa các bộ lọc.');
});

document.getElementById('nutKanban').addEventListener('click', () => {
    bangKanban.hidden = false;
    bangKanban.style.display = 'grid';
    cheXemDS.hidden = true;
    cheXemDS.style.display = 'none';
    document.getElementById('nutKanban').classList.add('dang-chon');
    document.getElementById('nutDanhSach').classList.remove('dang-chon');
});

document.getElementById('nutDanhSach').addEventListener('click', () => {
    bangKanban.hidden = true;
    bangKanban.style.display = 'none';
    cheXemDS.hidden = false;
    cheXemDS.style.display = 'block';
    document.getElementById('nutDanhSach').classList.add('dang-chon');
    document.getElementById('nutKanban').classList.remove('dang-chon');
    renderDanhSach(locDanhSachThe());
});

document.getElementById('nutDongModal').addEventListener('click', dongCuaSo);
document.getElementById('nutHuyModal').addEventListener('click', dongCuaSo);
cuaSoSuCo.addEventListener('click', e => { if (e.target === cuaSoSuCo) dongCuaSo(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !cuaSoSuCo.hidden) dongCuaSo(); });

document.getElementById('nutLuuTrangThai').addEventListener('click', () => {
    if (!theDangChon) return;
    const trangThaiMoi = document.getElementById('chonTrangThaiModal').value;
    theDangChon.dataset.trangThai = trangThaiMoi;
    const thuTuCot = { 'can-lam': 0, 'dang-xu-ly': 1, 'nghiem-thu': 2, 'da-dong': 3 };
    const cotDich = document.querySelectorAll('.cot-kanban')[thuTuCot[trangThaiMoi]];
    cotDich.querySelector('.danh-sach-the').appendChild(theDangChon);
    const hanChot = theDangChon.querySelector('.han-chot');

    if (trangThaiMoi === 'da-dong') {
        hanChot.className = 'han-chot ngay-da-dong';
        hanChot.textContent = '● Đã đóng · Vừa cập nhật';
    } else if (trangThaiMoi === 'nghiem-thu') {
        hanChot.className = 'han-chot ngay-nghiem-thu';
        hanChot.textContent = '◉ Chờ nghiệm thu';
    } else if (trangThaiMoi === 'dang-xu-ly') {
        hanChot.className = 'han-chot sap-den-han';
        hanChot.textContent = '● Đang xử lý';
    } else {
        hanChot.className = 'han-chot sap-den-han';
        hanChot.textContent = '● Chờ phân công';
    }

    document.getElementById('trangThaiModal').textContent = tenTrangThai[trangThaiMoi];
    dongCuaSo();
    apDungBoLoc();
    hienThongBao(`Đã cập nhật ${theDangChon.dataset.ma}: ${tenTrangThai[trangThaiMoi]}.`);
});

document.getElementById('nutXuatBaoCao').addEventListener('click', () => {
    const cacDong = [['Mã sự cố', 'Tiêu đề', 'Khu vực', 'Trạng thái', 'Hạn xử lý']];
    locDanhSachThe().forEach(the => cacDong.push([
        the.dataset.ma, the.dataset.tieuDe, `Zone ${the.dataset.khuVuc}`, tenTrangThai[the.dataset.trangThai],
        the.querySelector('.han-chot')?.textContent.trim() || ''
    ]));
    const csv = '\ufeff' + cacDong.map(dong => dong.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const duongDanUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const theA = document.createElement('a');
    theA.href = duongDanUrl; theA.download = 'tien-do-xu-ly-su-co.csv'; theA.click();
    URL.revokeObjectURL(duongDanUrl);
    hienThongBao('Đã xuất báo cáo CSV.');
});

document.getElementById('nutMenuMobile').addEventListener('click', () => {
    document.getElementById('thanhBen').classList.toggle('mo');
});

document.querySelectorAll('.muc-dieu-huong').forEach(muc => muc.addEventListener('click', () => {
    document.querySelectorAll('.muc-dieu-huong').forEach(m => m.classList.remove('dang-chon'));
    muc.classList.add('dang-chon');
    if (!muc.textContent.includes('Hành động khắc phục')) hienThongBao('Mục này đang là giao diện minh họa.');
    document.getElementById('thanhBen').classList.remove('mo');
}));

document.querySelectorAll('.cong-cu-cot button').forEach(nut => nut.addEventListener('click', () => hienThongBao('Tùy chọn cột: chức năng demo.')));
apDungBoLoc();