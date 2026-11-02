import React, { useMemo, useState } from "react";
import "./styles.css";

const vehicles = [
  {
    id: "ranger",
    name: "Ford Ranger",
    type: "Bán tải",
    badge: "BÁN CHẠY",
    price: "Liên hệ báo giá",
    versions: ["XL", "XLS", "Sport", "Wildtrak", "Stormtrak"],
    short: "Mẫu bán tải đa dụng, cân bằng giữa công việc, di chuyển hằng ngày và những chuyến đi xa.",
    image: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85"
    ],
    intro: "Ford Ranger hướng đến người cần một chiếc xe linh hoạt cho cả công việc lẫn cuộc sống. Khi tìm hiểu Ranger, khách hàng nên cân nhắc nhu cầu chở hàng, tần suất đi đường dài, địa hình thường di chuyển và trang bị mong muốn.",
    highlights: ["Thiết kế bán tải khỏe khoắn", "Khoang lái hướng đến người lái", "Nhiều lựa chọn phiên bản và cấu hình", "Phù hợp cả nhu cầu cá nhân và công việc"],
    specs: [["Phân khúc", "Bán tải"], ["Số chỗ", "5 chỗ"], ["Động cơ", "Tùy phiên bản"], ["Hộp số", "Tùy phiên bản"], ["Dẫn động", "Tùy phiên bản"], ["Kích thước / tải trọng", "Xem theo phiên bản cụ thể"]]
  },
  {
    id: "everest",
    name: "Ford Everest",
    type: "SUV",
    badge: "SUV 7 CHỖ",
    price: "Liên hệ báo giá",
    versions: ["Ambient", "Sport", "Titanium", "Platinum"],
    short: "SUV 7 chỗ dành cho gia đình, những hành trình dài và người cần không gian đa dụng.",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85"],
    intro: "Ford Everest là lựa chọn đáng cân nhắc nếu bạn ưu tiên không gian 7 chỗ, tư thế lái cao và khả năng đồng hành trên nhiều loại hành trình. Trang bị và hệ dẫn động cần đối chiếu theo đúng phiên bản đang phân phối.",
    highlights: ["Cấu hình SUV 7 chỗ", "Không gian cho gia đình và hành lý", "Các phiên bản có trang bị khác nhau", "Nên trải nghiệm hàng ghế và tầm nhìn trước khi chọn"],
    specs: [["Phân khúc", "SUV"], ["Số chỗ", "7 chỗ"], ["Động cơ", "Tùy phiên bản"], ["Hộp số", "Tùy phiên bản"], ["Dẫn động", "Tùy phiên bản"], ["Dung tích khoang hành lý", "Thay đổi theo cách bố trí ghế"]]
  },
  {
    id: "territory",
    name: "Ford Territory",
    type: "SUV",
    badge: "SUV ĐÔ THỊ",
    price: "Liên hệ báo giá",
    versions: ["Trend", "Titanium", "Titanium X"],
    short: "SUV đô thị hướng đến sự tiện nghi, thiết kế hiện đại và nhu cầu sử dụng hằng ngày.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85"],
    intro: "Ford Territory phù hợp với khách hàng thường xuyên di chuyển trong đô thị nhưng vẫn cần không gian cho gia đình. Khi so sánh các phiên bản, hãy tập trung vào hệ thống hỗ trợ lái, tiện nghi, ghế ngồi và các trang bị thực tế.",
    highlights: ["Kiểu dáng SUV đô thị", "Không gian sử dụng cho gia đình", "Các phiên bản có mức trang bị khác nhau", "Phù hợp nhu cầu đi làm và đi chơi cuối tuần"],
    specs: [["Phân khúc", "SUV đô thị"], ["Số chỗ", "5 chỗ"], ["Động cơ", "Đối chiếu theo phiên bản"], ["Hộp số", "Đối chiếu theo phiên bản"], ["Dẫn động", "Đối chiếu theo phiên bản"], ["Tiện nghi", "Khác nhau theo phiên bản"]]
  },
  {
    id: "transit",
    name: "Ford Transit",
    type: "Thương mại",
    badge: "XE THƯƠNG MẠI",
    price: "Liên hệ báo giá",
    versions: ["Các phiên bản theo thị trường"],
    short: "Giải pháp xe thương mại cho vận chuyển hành khách, doanh nghiệp và dịch vụ.",
    image: "https://images.unsplash.com/photo-1464219789935-c2d9d9aber?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1464219789935-c2d9d9aber?auto=format&fit=crop&w=1400&q=85"],
    intro: "Ford Transit thường được khách hàng doanh nghiệp quan tâm cho hoạt động vận tải hành khách và dịch vụ. Việc lựa chọn cần dựa trên số chỗ, cấu hình ghế, mục đích khai thác, chi phí vận hành và chính sách bảo dưỡng.",
    highlights: ["Định hướng sử dụng thương mại", "Có thể khai thác trong hoạt động vận tải", "Cần lựa chọn cấu hình phù hợp mô hình kinh doanh", "Nên tính tổng chi phí sở hữu trước khi đầu tư"],
    specs: [["Phân khúc", "Xe thương mại"], ["Số chỗ", "Theo cấu hình"], ["Động cơ", "Theo phiên bản"], ["Hộp số", "Theo phiên bản"], ["Kích thước", "Theo cấu hình"], ["Tải trọng", "Theo hồ sơ xe"]]
  },
  {
    id: "ranger-raptor",
    name: "Ford Ranger Raptor",
    type: "Bán tải",
    badge: "HIỆU NĂNG CAO",
    price: "Liên hệ báo giá",
    versions: ["Ranger Raptor"],
    short: "Phiên bản bán tải hiệu năng cao dành cho người yêu thích trải nghiệm off-road.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85"],
    intro: "Ranger Raptor tập trung vào trải nghiệm vận hành hiệu năng cao và khả năng di chuyển trên địa hình khó. Khách hàng nên tìm hiểu kỹ cấu hình động cơ, hệ thống treo, chế độ lái và điều kiện bảo hành của xe.",
    highlights: ["Định hướng bán tải hiệu năng cao", "Thiết kế ngoại thất thể thao", "Tập trung vào trải nghiệm địa hình", "Nên lái thử và tìm hiểu đúng cấu hình xe"],
    specs: [["Phân khúc", "Bán tải hiệu năng cao"], ["Số chỗ", "5 chỗ"], ["Động cơ", "Theo đời xe / thị trường"], ["Hệ thống treo", "Theo cấu hình"], ["Dẫn động", "Theo phiên bản"], ["Chế độ lái", "Theo trang bị xe"]]
  },
  {
    id: "explorer",
    name: "Ford Explorer",
    type: "SUV",
    badge: "SUV CAO CẤP",
    price: "Liên hệ tình trạng xe",
    versions: ["Tùy nguồn xe và đời xe"],
    short: "SUV cỡ lớn với không gian rộng và định hướng tiện nghi cho những chuyến đi dài.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85",
    gallery: ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85"],
    intro: "Thông tin Ford Explorer tại Việt Nam cần được xác nhận theo nguồn xe, năm sản xuất và tình trạng phân phối. Hoàng Ford Auto nên công bố rõ xe mới, xe đã qua sử dụng hay xe nhập khẩu theo từng trường hợp.",
    highlights: ["SUV cỡ lớn", "Không gian đa dụng", "Cần xác nhận năm sản xuất và nguồn gốc", "Thông số cần đối chiếu theo xe thực tế"],
    specs: [["Phân khúc", "SUV cỡ lớn"], ["Số chỗ", "Theo cấu hình"], ["Năm sản xuất", "Xác nhận theo xe"], ["Nguồn xe", "Xác nhận theo xe"], ["Động cơ", "Theo đời xe"], ["Bảo hành", "Theo chính sách áp dụng"]]
  }
];

const categories = ["Tất cả", "Bán tải", "SUV", "Thương mại"];

function scrollToContact(carName = "") {
  const event = new CustomEvent("select-vehicle", { detail: carName });
  window.dispatchEvent(event);
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  return (
    <>
      <div className="topbar">HOÀNG FORD AUTO <span>•</span> TƯ VẤN SẢN PHẨM & TRẢI NGHIỆM XE</div>
      <header className="site-header">
        <a className="brand" href="#home" onClick={close}>
          <span className="brand-symbol">H</span>
          <span className="brand-name">HOÀNG FORD <small>AUTO • TƯ VẤN XE</small></span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu">{menuOpen ? "✕" : "☰"}</button>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"}>
          <a href="#home" onClick={close}>Trang chủ</a>
          <a href="#vehicles" onClick={close}>Các dòng xe</a>
          <a href="#technology" onClick={close}>Công nghệ</a>
          <a href="#about" onClick={close}>Giới thiệu</a>
          <a className="nav-contact" href="#contact" onClick={close}>Nhận tư vấn ↗</a>
        </nav>
      </header>
    </>
  );
}

function VehicleCard({ car, onDetails }) {
  return (
    <article className="vehicle-card">
      <button className="vehicle-photo" onClick={() => onDetails(car)} aria-label={`Xem chi tiết ${car.name}`}>
        <img src={car.image} alt={`${car.name} - ảnh minh họa`} loading="lazy" />
        <span className="vehicle-badge">{car.badge}</span>
        <span className="photo-arrow">↗</span>
      </button>
      <div className="vehicle-card-body">
        <div className="vehicle-category">{car.type}</div>
        <h3>{car.name}</h3>
        <p>{car.short}</p>
        <div className="vehicle-card-bottom">
          <span>{car.price}</span>
          <button className="text-button" onClick={() => onDetails(car)}>Khám phá xe ↗</button>
        </div>
      </div>
    </article>
  );
}

function VehicleModal({ car, onClose }) {
  if (!car) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="vehicle-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Đóng">✕</button>
        <img className="modal-hero" src={car.image} alt={`${car.name} ảnh minh họa`} />
        <div className="modal-content">
          <div className="eyebrow">{car.type} / {car.badge}</div>
          <h2 id="modal-title">{car.name}</h2>
          <p className="modal-intro">{car.intro}</p>
          <h3>Điểm nổi bật</h3>
          <div className="highlight-grid">
            {car.highlights.map((item) => <div className="highlight" key={item}><span>✓</span>{item}</div>)}
          </div>
          <h3>Phiên bản tham khảo</h3>
          <div className="version-list">{car.versions.map((version) => <span key={version}>{version}</span>)}</div>
          <h3>Thông tin kỹ thuật cần tìm hiểu</h3>
          <div className="spec-table">
            {car.specs.map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <p className="small-note">Thông tin phiên bản và thông số có thể thay đổi theo năm sản xuất, thị trường và cấu hình xe. Vui lòng yêu cầu tư vấn xác nhận theo xe cụ thể.</p>
          <button className="button button-primary full-button" onClick={() => { onClose(); scrollToContact(car.name); }}>Nhận tư vấn về {car.name} ↗</button>
        </div>
      </section>
    </div>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", interest: "Tư vấn chọn xe", message: "" });
  const [notice, setNotice] = useState("");
  const email = "2k2hoangha@gmail.com";
  const phone = "0978841002";

  React.useEffect(() => {
    const handler = (event) => setForm((current) => ({ ...current, interest: event.detail ? `Tư vấn ${event.detail}` : current.interest }));
    window.addEventListener("select-vehicle", handler);
    return () => window.removeEventListener("select-vehicle", handler);
  }, []);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Yêu cầu tư vấn xe - ${form.interest}`);
    const body = encodeURIComponent(
      `Họ tên: ${form.name}\nSố điện thoại: ${form.phone}\nNhu cầu: ${form.interest}\nLời nhắn: ${form.message || "Không có"}`
    );
    setNotice("Đang mở ứng dụng email để gửi yêu cầu. Nếu không mở được, vui lòng gọi hotline hoặc Zalo.");
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-section section-shell" id="contact">
      <div className="contact-copy">
        <div className="eyebrow">KẾT NỐI VỚI HOÀNG FORD AUTO</div>
        <h2>Bạn đang tìm chiếc xe <em>phù hợp?</em></h2>
        <p>Để lại thông tin hoặc liên hệ trực tiếp để trao đổi về phiên bản, giá bán, chi phí lăn bánh và lịch trải nghiệm xe.</p>
        <div className="contact-lines">
          <a href={`tel:${phone}`}><span>HOTLINE</span><strong>{phone}</strong></a>
          <a href={`https://zalo.me/${phone}`} target="_blank" rel="noreferrer"><span>ZALO</span><strong>Nhắn tin tư vấn ↗</strong></a>
          <a href={`mailto:${email}`}><span>EMAIL</span><strong>{email}</strong></a>
          <div><span>ĐỊA CHỈ</span><strong>311 Đ. Trường Chinh, Phương Liệt, Hà Nội</strong></div>
        </div>
      </div>
      <form className="contact-form" onSubmit={submit}>
        <div className="form-heading"><span>ĐĂNG KÝ TƯ VẤN</span><small>* Trường bắt buộc</small></div>
        <label>Họ và tên *<input name="name" value={form.name} onChange={update} placeholder="Nguyễn Văn A" required /></label>
        <label>Số điện thoại *<input name="phone" value={form.phone} onChange={update} placeholder="09xx xxx xxx" type="tel" pattern="[0-9+(). -]{9,16}" required /></label>
        <label>Dòng xe quan tâm<select name="interest" value={form.interest} onChange={update}><option>Tư vấn chọn xe</option><option>Đăng ký lái thử</option>{vehicles.map((car) => <option key={car.id} value={`Tư vấn ${car.name}`}>Tư vấn {car.name}</option>)}</select></label>
        <label>Lời nhắn<textarea name="message" value={form.message} onChange={update} rows="4" placeholder="Nhu cầu sử dụng, phiên bản quan tâm hoặc thời gian muốn lái thử..." /></label>
        <button className="button button-primary full-button" type="submit">Gửi yêu cầu qua email ↗</button>
        {notice && <p className="form-notice" role="status">{notice}</p>}
        <p className="privacy-note">Thông tin được sử dụng để liên hệ tư vấn theo yêu cầu của bạn.</p>
      </form>
    </section>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);

  const filteredVehicles = useMemo(() => vehicles.filter((car) => {
    const matchesCategory = activeCategory === "Tất cả" || car.type === activeCategory;
    const query = search.trim().toLocaleLowerCase("vi");
    const matchesSearch = !query || `${car.name} ${car.type} ${car.short}`.toLocaleLowerCase("vi").includes(query);
    return matchesCategory && matchesSearch;
  }), [activeCategory, search]);

  return (
    <>
      <Header />
      <main>
        <section className="hero" id="home">
          <div className="hero-image" />
          <div className="hero-overlay" />
          <div className="hero-content section-shell">
            <div className="eyebrow light-eyebrow"><span /> HOÀNG FORD AUTO</div>
            <h1>Khám phá Ford.<br /><em>Chọn hành trình riêng.</em></h1>
            <p>Tìm hiểu các dòng xe, khám phá điểm nổi bật và nhận tư vấn theo nhu cầu sử dụng thực tế của bạn.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#vehicles">Khám phá các dòng xe ↗</a>
              <a className="button button-outline" href="#contact">Nhận tư vấn</a>
            </div>
            <div className="hero-caption">THÔNG TIN THAM KHẢO • TƯ VẤN THEO NHU CẦU • ĐỒNG HÀNH TRÊN MỌI HÀNH TRÌNH</div>
          </div>
          <a className="scroll-cue" href="#vehicles">CUỘN ĐỂ KHÁM PHÁ ↓</a>
        </section>

        <section className="intro-section section-shell" id="about">
          <div className="section-label">01 / GIỚI THIỆU</div>
          <div className="intro-layout">
            <h2>Hiểu chiếc xe.<br />Chọn đúng <em>nhu cầu.</em></h2>
            <div>
              <p className="large-copy">Một chiếc xe phù hợp không chỉ nằm ở kiểu dáng hay giá bán, mà còn ở cách chiếc xe phục vụ công việc, gia đình và những hành trình mỗi ngày.</p>
              <p>Hoàng Ford Auto xây dựng không gian tham khảo thông tin các dòng xe Ford, giúp bạn tìm hiểu đặc điểm, so sánh lựa chọn và kết nối tư vấn trước khi quyết định.</p>
            </div>
          </div>
        </section>

        <section className="catalog-section" id="vehicles">
          <div className="section-shell">
            <div className="section-heading">
              <div><div className="section-label">02 / DANH MỤC SẢN PHẨM</div><h2>Chọn dòng xe<br /><em>bạn quan tâm.</em></h2></div>
              <p>Khám phá các lựa chọn từ bán tải đa dụng, SUV gia đình đến xe thương mại.</p>
            </div>
            <div className="catalog-controls">
              <div className="category-filters">
                {categories.map((category) => <button key={category} className={activeCategory === category ? "filter active" : "filter"} onClick={() => setActiveCategory(category)}>{category}</button>)}
              </div>
              <label className="search-field"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên dòng xe..." /></label>
            </div>
            <div className="vehicle-grid">
              {filteredVehicles.map((car) => <VehicleCard key={car.id} car={car} onDetails={setSelectedCar} />)}
            </div>
            {filteredVehicles.length === 0 && <div className="empty-state">Không tìm thấy dòng xe phù hợp. Hãy thử từ khóa khác.</div>}
            <p className="disclaimer">* Danh mục mang tính tham khảo. Tình trạng phân phối, phiên bản, giá bán và trang bị cần được xác nhận tại thời điểm tư vấn.</p>
          </div>
        </section>

        <section className="technology-section section-shell" id="technology">
          <div className="section-label">03 / TÌM HIỂU CÔNG NGHỆ</div>
          <div className="section-heading">
            <div><h2>Công nghệ tạo nên<br /><em>trải nghiệm lái.</em></h2></div>
            <p>Tìm hiểu những nhóm công nghệ thường được khách hàng quan tâm. Trang bị thực tế phụ thuộc mẫu xe và phiên bản.</p>
          </div>
          <div className="technology-grid">
            <article><div className="tech-number">01</div><h3>Động cơ & vận hành</h3><p>Tìm hiểu cấu hình động cơ, hộp số, hệ dẫn động và đặc tính vận hành của từng phiên bản.</p></article>
            <article><div className="tech-number">02</div><h3>An toàn & hỗ trợ lái</h3><p>Khám phá các hệ thống hỗ trợ người lái, cảnh báo và công nghệ an toàn theo trang bị xe.</p></article>
            <article><div className="tech-number">03</div><h3>Kết nối & tiện nghi</h3><p>Tìm hiểu màn hình giải trí, kết nối điện thoại, tiện ích khoang lái và không gian hành khách.</p></article>
            <article><div className="tech-number">04</div><h3>Khả năng đa địa hình</h3><p>Đối chiếu hệ dẫn động, chế độ lái và các tính năng hỗ trợ theo điều kiện sử dụng.</p></article>
          </div>
        </section>

        <section className="experience-banner">
          <div className="experience-bg" />
          <div className="experience-content section-shell">
            <div className="eyebrow light-eyebrow">TRẢI NGHIỆM THỰC TẾ</div>
            <h2>Đọc thông tin là bước đầu.<br /><em>Cầm lái mới là cảm nhận.</em></h2>
            <p>Đăng ký để trao đổi về lịch lái thử, phiên bản và những câu hỏi bạn đang quan tâm.</p>
            <a className="button button-primary" href="#contact">Đăng ký tư vấn ↗</a>
          </div>
        </section>

        <section className="guide-section section-shell">
          <div className="section-label">04 / KINH NGHIỆM CHỌN XE</div>
          <h2>Chọn xe từ <em>nhu cầu thực tế.</em></h2>
          <div className="guide-grid">
            <article><span>01</span><h3>Xác định mục đích</h3><p>Gia đình, công việc, kinh doanh vận tải hay thường xuyên đi đường dài?</p></article>
            <article><span>02</span><h3>Dự trù ngân sách</h3><p>Tính cả giá xe, chi phí lăn bánh, nhiên liệu, bảo dưỡng và bảo hiểm.</p></article>
            <article><span>03</span><h3>So sánh phiên bản</h3><p>Chọn trang bị thực sự cần thiết thay vì chỉ nhìn tên phiên bản hoặc giá bán.</p></article>
            <article><span>04</span><h3>Lái thử trước khi mua</h3><p>Trải nghiệm vị trí lái, tầm nhìn, độ êm và không gian sử dụng thực tế.</p></article>
          </div>
        </section>

        <ContactSection />
      </main>
      <footer className="site-footer">
        <div className="footer-main section-shell">
          <a className="brand footer-brand" href="#home"><span className="brand-symbol">H</span><span className="brand-name">HOÀNG FORD <small>AUTO • TƯ VẤN XE</small></span></a>
          <p>Thông tin tham khảo và tư vấn lựa chọn xe Ford. Vui lòng xác nhận giá bán, phiên bản, tình trạng xe và chính sách tại thời điểm giao dịch.</p>
          <a className="footer-phone" href="tel:0978841002">0978 841 002 ↗</a>
        </div>
        <div className="footer-bottom section-shell"><span>© {new Date().getFullYear()} Hoàng Ford Auto.</span><span>Website tư vấn độc lập, không phải website chính thức của Ford Motor Company.</span><a href="#home">Lên đầu trang ↑</a></div>
      </footer>
      <a className="floating-call" href="tel:0978841002" aria-label="Gọi tư vấn">☎</a>
      <VehicleModal car={selectedCar} onClose={() => setSelectedCar(null)} />
    </>
  );
}
