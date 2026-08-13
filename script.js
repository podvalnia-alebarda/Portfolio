document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const galleryContainer = document.querySelector(".floating-gallery");
  const languageModal = document.getElementById("languageModal");
  const languageButtons = document.querySelectorAll(".language-button");
  const adminPanel = document.getElementById("adminPanel");
  const adminClose = document.getElementById("adminClose");
  const adminSave = document.getElementById("adminSave");
  const adminReset = document.getElementById("adminReset");
  const heroBgImage = document.querySelector(".hero-bg-image");
  const leftSidebarImage = document.querySelector(".side-panel--left .side-panel-image");
  const rightSidebarImage = document.querySelector(".side-panel--right .side-panel-image");
  const adminHeaderImageBtn = document.getElementById("adminHeaderImageBtn");
  const adminHeaderImageInput = document.getElementById("adminHeaderImageInput");
  const adminLeftSidebarImageBtn = document.getElementById("adminLeftSidebarImageBtn");
  const adminLeftSidebarImageInput = document.getElementById("adminLeftSidebarImageInput");
  const adminRightSidebarImageBtn = document.getElementById("adminRightSidebarImageBtn");
  const adminRightSidebarImageInput = document.getElementById("adminRightSidebarImageInput");
  const adminHeaderImagePreview = document.getElementById("adminHeaderImagePreview");
  const adminLeftSidebarImagePreview = document.getElementById("adminLeftSidebarImagePreview");
  const adminRightSidebarImagePreview = document.getElementById("adminRightSidebarImagePreview");
  const adminUnlock = document.getElementById("adminUnlock");
  const passwordModal = document.getElementById("passwordModal");
  const adminPasswordInput = document.getElementById("adminPasswordInput");
  const passwordSubmit = document.getElementById("passwordSubmit");
  const passwordCancel = document.getElementById("passwordCancel");
  const passwordError = document.getElementById("passwordError");
  const adminTextList = document.getElementById("adminTextList");
  const adminGalleryFilterSelectors = document.getElementById("adminGalleryFilterSelectors");
  const adminGalleryFileInput = document.getElementById("adminGalleryFileInput");
  const adminFilterEditor = document.getElementById("adminFilterEditor");
  const adminAddPrimaryFilter = document.getElementById("adminAddPrimaryFilter");
  const adminAddSecondaryFilter = document.getElementById("adminAddSecondaryFilter");
  const adminGalleryList = document.getElementById("adminGalleryList");
  const adminAddGalleryItem = document.getElementById("adminAddGalleryItem");
  const adminApply = document.getElementById("adminApply");
  const adminNewPassword = document.getElementById("adminNewPassword");
  const adminConfirmPassword = document.getElementById("adminConfirmPassword");
  const filterRow = document.getElementById("filterRow");
  const filterRowSecondary = document.getElementById("filterRowSecondary");
  const filterClearBtn = document.getElementById("filterClear");
  const filterCountEl = document.getElementById("filterCount");
  const filterModeBtns = document.querySelectorAll(".filter-mode__btn");
  const themeToggle = document.getElementById("themeToggle");
  const langSwitcher = document.getElementById("langSwitcher");
  const langToggle = document.getElementById("langToggle");
  const langMenu = document.getElementById("langMenu");
  const langCurrent = document.getElementById("langCurrent");
  const heroTitle = document.querySelector(".hero-title");
  const heroWrap = document.querySelector(".hero-title-wrap");
  const bird = document.querySelector(".bird");
  const adminSocialLinks = document.getElementById("adminSocialLinks");
  const adminAddSocial = document.getElementById("adminAddSocial");
  const adminTextLang = document.getElementById("adminTextLang");
  const adminProjectsList = document.getElementById("adminProjectsList");
  const adminAddProject = document.getElementById("adminAddProject");
  const adminDiscountsList = document.getElementById("adminDiscountsList");
  const adminAddDiscount = document.getElementById("adminAddDiscount");
  const adminExport = document.getElementById("adminExport");
  const adminImport = document.getElementById("adminImport");
  const adminImportInput = document.getElementById("adminImportInput");
  const projectsFeed = document.getElementById("projectsFeed");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxWatermark = document.getElementById("lightboxWatermark");
  const lightboxClose = document.getElementById("lightboxClose");

  // Все поддерживаемые языки (один источник истины)
  const SUPPORTED_LANGS = ["ru", "en", "es", "zh", "ko"];
  // Язык, который сейчас редактируется в админке (по умолчанию — текущий язык сайта)
  let adminEditLang = null;

  // Gallery data
  const defaultGalleryItems = [
    { image: "", tags: "sketch animals", alt: "placeholder sketch" },
    { image: "", tags: "art concept", alt: "placeholder art" },
    { image: "", tags: "meme portrait", alt: "placeholder meme" },
    { image: "", tags: "animation fantasy", alt: "placeholder animation" },
    { image: "", tags: "art pixel", alt: "placeholder pixel art" },
    { image: "", tags: "mono concept", alt: "placeholder mono concept" },
    { image: "", tags: "sketch fantasy", alt: "placeholder fantasy" },
    { image: "", tags: "art animals", alt: "placeholder animals" },
    { image: "", tags: "portrait art", alt: "placeholder portrait" },
    { image: "", tags: "concept fantasy", alt: "placeholder concept" },
    { image: "", tags: "animation art", alt: "placeholder animation 2" },
    { image: "", tags: "pixel sketch", alt: "placeholder pixel" },
    { image: "", tags: "mono portrait", alt: "placeholder mono" },
    { image: "", tags: "art animals", alt: "placeholder animal" },
    { image: "", tags: "fantasy concept", alt: "placeholder fantasy 2" },
  ];

  let galleryItems = [];
  // Посты раздела «Мои проекты»: [{ image, date, caption: {ru, en, ...} }]
  let projectsData = [];
  // Скидки: [{ image, percent, caption: {ru, en, ...} }]
  let discountsData = [];
  let galleryStartIndex = 0;
  let galleryRotationTimer = null;
  let filterButtons = [];
  let filterMatchMode = localStorage.getItem("filterMatchMode") === "all" ? "all" : "any";

  const defaultFilterSettings = [
    { key: "all", label: "все", primary: true },
    { key: "sketch", label: "скетчи", primary: true },
    { key: "art", label: "арты", primary: true },
    { key: "meme", label: "меме", primary: true },
    { key: "animation", label: "анимации", primary: true },
    { key: "mono", label: "чб арты", primary: false },
    { key: "animals", label: "животные", primary: false },
    { key: "concept", label: "концепт арты", primary: false },
    { key: "pixel", label: "пиксель арты", primary: false },
    { key: "fantasy", label: "фэнтези", primary: false },
    { key: "portrait", label: "портреты", primary: false },
  ];

  // Полный редактор текста: каждая запись — отдельный ключ с подписью и типом поля.
  // Здесь можно править ВЕСЬ текст сайта на каждом языке: навигацию, фильтры, формы и т.д.
  // type: 'input' (одна строка) или 'area' (многострочное).
  const adminTextGroups = [
    {
      section: "Кнопки навигации",
      fields: [
        { key: "nav_order", label: "Кнопка «Заказать»" },
        { key: "nav_projects", label: "Кнопка «Проекты»" },
        { key: "nav_collab", label: "Кнопка «Сотрудничество»" },
        { key: "nav_about", label: "Кнопка «Обо мне»" },
        { key: "nav_discounts", label: "Кнопка «Скидки»" },
        { key: "nav_socials", label: "Кнопка «Мои соцсети»" },
      ],
    },
    {
      section: "Статус приёма заказов",
      fields: [
        { key: "order_status_open", label: "Надпись, когда приём ОТКРЫТ" },
        { key: "order_status_closed", label: "Надпись, когда приём ЗАКРЫТ" },
        { key: "order_slots_text", label: "Строка про слоты (напр. «свободно 2 из 5»). Пусто — не показывать" },
        { key: "order_wip_text", label: "Строка «сейчас в работе». Пусто — не показывать" },
      ],
    },
    {
      section: "Скидки",
      fields: [
        { key: "discounts_title", label: "Заголовок раздела" },
        { key: "discounts_text", label: "Текст раздела", type: "area" },
        { key: "discounts_empty", label: "Текст, когда скидок нет", type: "area" },
      ],
    },
    {
      section: "Главный экран",
      fields: [
        { key: "hero_title", label: "Ник (заголовок)" },
        { key: "hero_subtitle", label: "Подпись под ником" },
      ],
    },
    {
      section: "Галерея",
      fields: [
        { key: "gallery_title", label: "Заголовок" },
        { key: "gallery_description", label: "Описание", type: "area" },
        { key: "gallery_empty", label: "Текст при пустой галерее", type: "area" },
      ],
    },
    {
      // Названия самих фильтров теперь редактируются в разделе «Фильтры галереи»
      // (сразу на всех языках), поэтому здесь остались только режим совпадения и кнопка сброса.
      section: "Фильтры — режим и кнопки",
      fields: [
        { key: "filter_mode_label", label: "Подпись «Совпадение:»" },
        { key: "filter_mode_any", label: "Режим «любой»" },
        { key: "filter_mode_all", label: "Режим «все»" },
        { key: "filter_clear", label: "Кнопка «Сбросить фильтры»" },
      ],
    },
    {
      section: "Блок «Заказать»",
      fields: [
        { key: "order_title", label: "Заголовок" },
        { key: "order_p1", label: "Текст над прайсом", type: "area" },
        { key: "order_images_title", label: "Подпись над прайсом" },
        { key: "order_p2", label: "Текст под прайсом (над шаблоном)", type: "area" },
        { key: "order_template", label: "Шаблон заявки (копируется кнопкой)", type: "area" },
        { key: "copy_template_btn", label: "Кнопка «Скопировать шаблон»" },
        { key: "contact_dm_title", label: "Подпись «Напишите мне в ЛС»" },
      ],
    },
    {
      section: "Блок «Сотрудничество»",
      fields: [
        { key: "collab_title", label: "Заголовок" },
        { key: "collab_p1", label: "Текст над картой сотрудничества", type: "area" },
        { key: "collab_images_title", label: "Подпись над картой сотрудничества" },
        { key: "collab_p2", label: "Текст под картой (над шаблоном)", type: "area" },
        { key: "collab_template", label: "Шаблон предложения (копируется кнопкой)", type: "area" },
      ],
    },
    {
      section: "Проекты",
      fields: [
        { key: "projects_title", label: "Заголовок" },
        { key: "projects_description", label: "Описание", type: "area" },
        { key: "projects_item1", label: "Текст «постов пока нет»", type: "area" },
      ],
    },
    {
      section: "Обо мне",
      fields: [
        { key: "about_title", label: "Заголовок" },
        { key: "about_p1", label: "Текст", type: "area" },
        { key: "about_li1", label: "Пункт 1" },
        { key: "about_li2", label: "Пункт 2" },
        { key: "about_li3", label: "Пункт 3" },
      ],
    },
    {
      section: "Счётчик работ и служебные тексты",
      fields: [
        { key: "filter_count_one", label: "Счётчик: 1 работа (оставьте {n})" },
        { key: "filter_count_few", label: "Счётчик: 2–4 работы (оставьте {n})" },
        { key: "filter_count_many", label: "Счётчик: 5+ работ (оставьте {n})" },
        { key: "copy_template_done", label: "Статус «Скопировано»" },
      ],
    },
    {
      section: "Футер",
      fields: [
        { key: "footer_title", label: "Заголовок футера" },
        { key: "colleague_text", label: "Текст про коллегу (над соцсетями)", type: "area" },
        { key: "colleague_btn", label: "Кнопка «Портфолио коллеги»" },
        { key: "footer_copyright", label: "Копирайт", type: "area" },
        { key: "copy_warning", label: "Текст защиты от копирования", type: "area" },
      ],
    },
  ];

  const translations = {
    ru: {
      nav_order: "Заказать коммишку",
      nav_projects: "Мои проекты",
      nav_about: "Обо мне",
      nav_collab: "Предложить сотрудничество",
      nav_socials: "Мои соцсети",
      hero_title: "Podvalnia_alebarda",
      hero_subtitle: "диджитал‑художник и аниматор.",
      gallery_title: "Галерея работ",
      gallery_description: "Работы фильтруются по стилю и настроению. В будущем здесь появятся настоящие картины.",
      gallery_empty: "Работ пока нет — скоро появятся новые зарисовки.",
      filter_sketch: "Скетчи",
      filter_art: "Полноценные арты",
      filter_meme: "Меме",
      filter_animation: "Анимации",
      filter_all: "Все",
      filter_mono: "Ч/Б арты",
      filter_animals: "Животные",
      filter_concept: "Концепт‑арты",
      filter_pixel: "Пиксель‑арт",
      filter_fantasy: "Фэнтези",
      filter_portrait: "Портреты",
      order_status_open: "Приём заказов открыт",
      order_status_closed: "Приём заказов закрыт",
      order_slots_text: "",
      order_wip_text: "",
      share_btn: "Поделиться",
      share_done: "Ссылка скопирована!",
      order_title: "Заказать коммишку",
      order_p1: "Опишите идею, настроение и формат — я превращу её в тёплое цифровое произведение с цветочными и листовыми мотивами.",
      order_p2: "Напишите свои пожелания, и я предложу лучший вариант исполнения.",
      collab_title: "Предложить сотрудничество",
      collab_p1: "Ищу проекты, где можно добавить лёгкую магию с помощью диджитал‑арта. Буду рада сделать работу для бренда, игры, издательства или кампании.",
      collab_p2: "Оставьте запрос — я отвечу с предварительной идеей и примерными сроками.",
      collab_form_desc: "Опишите предложение",
      collab_form_submit: "Отправить предложение",
      collab_form_kind: "Сотрудничество",
      about_title: "Обо мне",
      about_p1: "Я художник, работаю в цифровой живописи: люблю тёплые цвета, мягкое освещение и характерных персонажей.",
      about_li1: "Люблю лыжный спорт, макароны и лапшу.",
      about_li2: "Фанат сериалов, фэнтези и классических иллюстраций.",
      about_li3: "Хочу создавать тёплые работы с атмосферой и характером.",
      projects_title: "Мои проекты",
      projects_description: "Здесь я рассказываю о проектах, в которых участвовал, и о том, над чем работал.",
      projects_item1: "Проекты будут добавлены в ближайшее время.",
      footer_title: "Следите за мной в соцсетях",
      social_instagram: "Instagram",
      social_telegram: "Telegram",
      social_vk: "VK",
      filter_mode_label: "Совпадение:",
      filter_mode_any: "любой",
      filter_mode_all: "все",
      filter_clear: "Сбросить фильтры",
      filter_count_one: "{n} работа",
      filter_count_few: "{n} работы",
      filter_count_many: "{n} работ",
      order_form_name: "Имя",
      order_form_contact_label: "Как с вами связаться",
      order_form_contact_email: "Email",
      order_form_contact_discord: "Discord",
      order_form_contact_telegram: "Telegram",
      order_form_contact_ph_email: "you@example.com",
      order_form_contact_ph_discord: "напр. username или username#1234",
      order_form_contact_ph_telegram: "напр. @username",
      order_form_type: "Тип работы",
      order_form_type_any: "Любой / уточним",
      order_form_desc: "Опишите идею",
      order_form_budget: "Бюджет (необязательно)",
      order_form_deadline: "Желаемый срок (необязательно)",
      order_form_consent: "Согласен(на) на обработку данных для ответа на заявку",
      order_form_submit: "Отправить заявку",
      order_form_sending: "Отправляем…",
      order_form_success: "Спасибо! Заявка отправлена — я свяжусь с вами по указанному контакту.",
      order_form_error: "Не удалось отправить. Заявка сохранена, попробуйте позже.",
      order_form_saved: "Заявка сохранена. Художник свяжется с вами по указанному контакту.",
      footer_copyright: "© Podvalnia_alebarda. Все работы защищены авторским правом. Копирование запрещено.",
      copy_warning: "Работы защищены авторским правом. Копирование запрещено.",
    },
    en: {
      nav_order: "Order commission",
      nav_projects: "Projects",
      nav_about: "About",
      nav_collab: "Collaborate",
      nav_socials: "My socials",
      hero_title: "Podvalnia_alebarda",
      hero_subtitle: "Digital artist & animator.",
      gallery_title: "Gallery",
      gallery_description: "Browse artworks filtered by style and mood. Original paintings coming soon.",
      gallery_empty: "No works yet — new pieces will appear soon.",
      filter_sketch: "Sketches",
      filter_art: "Full artworks",
      filter_meme: "Memes",
      filter_animation: "Animations",
      filter_all: "All",
      filter_mono: "B&W art",
      filter_animals: "Animals",
      filter_concept: "Concept art",
      filter_pixel: "Pixel art",
      filter_fantasy: "Fantasy",
      filter_portrait: "Portraits",
      order_status_open: "Commissions are open",
      order_status_closed: "Commissions are closed",
      order_slots_text: "",
      order_wip_text: "",
      share_btn: "Share",
      share_done: "Link copied!",
      order_title: "Commission an artwork",
      order_p1: "Describe the idea, mood and format — I'll turn it into a warm digital piece with floral and foliage motifs.",
      order_p2: "Share your preferences and I'll propose the best approach.",
      collab_title: "Propose a collaboration",
      collab_p1: "I'm open to projects where I can add a touch of magic with digital art — brands, games, publishers, or campaigns.",
      collab_p2: "Leave a request and I'll reply with an initial concept and estimated timeline.",
      collab_form_desc: "Describe your proposal",
      collab_form_submit: "Send proposal",
      collab_form_kind: "Collaboration",
      about_title: "About me",
      about_p1: "I create warm-toned digital art combining organic patterns, soft lighting, and expressive characters.",
      about_li1: "Focus on atmosphere and charm",
      about_li2: "Working in illustration, concept art, animation and pixel art",
      about_li3: "I love pieces that feel sunny and cozy",
      projects_title: "Projects",
      projects_description: "Here I share projects I've taken part in and my past work.",
      projects_item1: "Project details will be added soon.",
      footer_title: "Follow me on social media",
      social_instagram: "Instagram",
      social_telegram: "Telegram",
      social_vk: "VK",
      filter_mode_label: "Match:",
      filter_mode_any: "any",
      filter_mode_all: "all",
      filter_clear: "Clear filters",
      filter_count_one: "{n} work",
      filter_count_few: "{n} works",
      filter_count_many: "{n} works",
      order_form_name: "Your name",
      order_form_contact_label: "How to reach you",
      order_form_contact_email: "Email",
      order_form_contact_discord: "Discord",
      order_form_contact_telegram: "Telegram",
      order_form_contact_ph_email: "you@example.com",
      order_form_contact_ph_discord: "e.g. username or username#1234",
      order_form_contact_ph_telegram: "e.g. @username",
      order_form_type: "Work type",
      order_form_type_any: "Any / let's discuss",
      order_form_desc: "Describe the idea",
      order_form_budget: "Budget (optional)",
      order_form_deadline: "Deadline (optional)",
      order_form_consent: "I agree to the processing of my data to reply to this request",
      order_form_submit: "Send request",
      order_form_sending: "Sending…",
      order_form_success: "Thanks! Your request was sent — I'll reach out via the contact you provided.",
      order_form_error: "Could not send. Your request was saved, please try again later.",
      order_form_saved: "Your request was saved. The artist will contact you via the contact you provided.",
      footer_copyright: "© Podvalnia_alebarda. All works are protected by copyright. Copying is prohibited.",
      copy_warning: "These works are protected by copyright. Copying is not allowed.",
    },
    ko: {
      nav_order: "주문하기",
      nav_projects: "프로젝트",
      nav_about: "소개",
      nav_collab: "협업 제안",
      nav_socials: "내 소셜",
      hero_title: "Podvalnia_alebarda",
      hero_subtitle: "디지털 아티스트 겸 애니메이터.",
      gallery_title: "갤러리",
      gallery_description: "스타일과 분위기별로 작품을 필터링해 둘러보세요. 곧 원화들도 올라옵니다.",
      gallery_empty: "아직 작품이 없습니다 — 곧 새로운 작품이 추가됩니다.",
      filter_sketch: "스케치",
      filter_art: "완성작",
      filter_meme: "밈",
      filter_animation: "애니메이션",
      filter_all: "전체",
      filter_mono: "흑백 아트",
      filter_animals: "동물",
      filter_concept: "컨셉 아트",
      filter_pixel: "픽셀 아트",
      filter_fantasy: "판타지",
      filter_portrait: "초상화",
      order_status_open: "커미션 오픈",
      order_status_closed: "커미션 마감",
      order_slots_text: "",
      order_wip_text: "",
      share_btn: "공유하기",
      share_done: "링크가 복사되었습니다!",
      order_title: "커미션 의뢰",
      order_p1: "아이디어, 분위기, 형식을 알려주시면 꽃과 잎사귀 모티프가 있는 따뜻한 디지털 작품으로 만들어 드립니다.",
      order_p2: "원하시는 사항을 적어주시면 최적의 진행 방안을 제안하겠습니다.",
      collab_title: "협업 제안",
      collab_p1: "디지털 아트로 은은한 마법을 더할 수 있는 프로젝트를 찾고 있습니다. 브랜드, 게임, 출판사, 캠페인 작업 환영합니다.",
      collab_p2: "요청을 남겨주시면 초안 아이디어와 예상 일정을 회신드리겠습니다.",
      collab_form_desc: "제안 내용을 적어주세요",
      collab_form_submit: "제안 보내기",
      collab_form_kind: "협업",
      about_title: "소개",
      about_p1: "유기적인 패턴, 부드러운 조명, 감성적인 캐릭터를 결합한 따뜻한 톤의 디지털 아트를 제작합니다.",
      about_li1: "분위기와 온기에 중점",
      about_li2: "일러스트, 컨셉, 애니메이션, 픽셀 아트 작업",
      about_li3: "따뜻하고 포근한 분위기의 작품을 좋아합니다",
      projects_title: "프로젝트",
      projects_description: "참여한 프로젝트와 작업물을 소개합니다.",
      projects_item1: "프로젝트 정보는 곧 업데이트됩니다.",
      footer_title: "SNS에서 팔로우",
      social_instagram: "Instagram",
      social_telegram: "Telegram",
      social_vk: "VK",
      filter_mode_label: "일치:",
      filter_mode_any: "하나라도",
      filter_mode_all: "모두",
      filter_clear: "필터 초기화",
      filter_count_one: "작품 {n}점",
      filter_count_few: "작품 {n}점",
      filter_count_many: "작품 {n}점",
      order_form_name: "이름",
      order_form_contact_label: "연락 방법",
      order_form_contact_email: "이메일",
      order_form_contact_discord: "Discord",
      order_form_contact_telegram: "Telegram",
      order_form_contact_ph_email: "you@example.com",
      order_form_contact_ph_discord: "예: username 또는 username#1234",
      order_form_contact_ph_telegram: "예: @username",
      order_form_type: "작업 유형",
      order_form_type_any: "상관없음 / 상담",
      order_form_desc: "아이디어 설명",
      order_form_budget: "예산 (선택)",
      order_form_deadline: "희망 마감일 (선택)",
      order_form_consent: "이 요청에 답변하기 위한 데이터 처리에 동의합니다",
      order_form_submit: "요청 보내기",
      order_form_sending: "보내는 중…",
      order_form_success: "감사합니다! 요청이 전송되었습니다 — 입력하신 연락처로 연락드리겠습니다.",
      order_form_error: "전송하지 못했습니다. 요청이 저장되었으니 나중에 다시 시도해 주세요.",
      order_form_saved: "요청이 저장되었습니다. 작가가 입력하신 연락처로 연락드립니다.",
      footer_copyright: "© Podvalnia_alebarda. 모든 작품은 저작권으로 보호됩니다. 복제 금지.",
      copy_warning: "이 작품은 저작권으로 보호되어 있습니다. 복제할 수 없습니다.",
    },
    es: {
      nav_order: "Pedir comisión",
      nav_projects: "Proyectos",
      nav_about: "Sobre mí",
      nav_collab: "Colaborar",
      nav_socials: "Mis redes",
      hero_title: "Podvalnia_alebarda",
      hero_subtitle: "Artista digital y animador.",
      gallery_title: "Galería",
      gallery_description: "Explora obras filtradas por estilo y estado de ánimo. Pronto habrá pinturas originales.",
      gallery_empty: "Aún no hay obras — pronto se añadirán nuevas piezas.",
      filter_sketch: "Bocetos",
      filter_art: "Obras completas",
      filter_meme: "Memes",
      filter_animation: "Animaciones",
      filter_all: "Todo",
      filter_mono: "Arte B/N",
      filter_animals: "Animales",
      filter_concept: "Arte conceptual",
      filter_pixel: "Pixel art",
      filter_fantasy: "Fantasía",
      filter_portrait: "Retratos",
      order_status_open: "Comisiones abiertas",
      order_status_closed: "Comisiones cerradas",
      order_slots_text: "",
      order_wip_text: "",
      share_btn: "Compartir",
      share_done: "¡Enlace copiado!",
      order_title: "Pedir una comisión",
      order_p1: "Describe la idea, el estado de ánimo y el formato: lo convertiré en una pieza digital cálida con motivos florales y hojas.",
      order_p2: "Comparte tus preferencias y propondré la mejor forma de realizarlo.",
      collab_title: "Proponer colaboración",
      collab_p1: "Estoy abierta a proyectos donde pueda aportar un toque de magia con arte digital: marcas, juegos, editoriales o campañas.",
      collab_p2: "Deja una solicitud y te responderé con una idea inicial y plazos estimados.",
      collab_form_desc: "Describe tu propuesta",
      collab_form_submit: "Enviar propuesta",
      collab_form_kind: "Colaboración",
      about_title: "Sobre mí",
      about_p1: "Creo arte digital en tonos cálidos combinando patrones orgánicos, iluminación suave y personajes expresivos.",
      about_li1: "Enfoque en atmósfera y ternura",
      about_li2: "Trabajo en ilustración, concept art, animación y pixel art",
      about_li3: "Me encantan las obras que transmiten una sensación cálida y acogedora",
      projects_title: "Proyectos",
      projects_description: "Aquí comparto proyectos en los que participé y trabajos realizados.",
      projects_item1: "Los detalles de los proyectos se añadirán pronto.",
      footer_title: "Sígueme en redes sociales",
      social_instagram: "Instagram",
      social_telegram: "Telegram",
      social_vk: "VK",
      filter_mode_label: "Coincidencia:",
      filter_mode_any: "cualquiera",
      filter_mode_all: "todas",
      filter_clear: "Limpiar filtros",
      filter_count_one: "{n} obra",
      filter_count_few: "{n} obras",
      filter_count_many: "{n} obras",
      order_form_name: "Tu nombre",
      order_form_contact_label: "Cómo contactarte",
      order_form_contact_email: "Email",
      order_form_contact_discord: "Discord",
      order_form_contact_telegram: "Telegram",
      order_form_contact_ph_email: "you@example.com",
      order_form_contact_ph_discord: "p. ej. username o username#1234",
      order_form_contact_ph_telegram: "p. ej. @username",
      order_form_type: "Tipo de trabajo",
      order_form_type_any: "Cualquiera / lo hablamos",
      order_form_desc: "Describe la idea",
      order_form_budget: "Presupuesto (opcional)",
      order_form_deadline: "Fecha límite (opcional)",
      order_form_consent: "Acepto el tratamiento de mis datos para responder a esta solicitud",
      order_form_submit: "Enviar solicitud",
      order_form_sending: "Enviando…",
      order_form_success: "¡Gracias! Tu solicitud fue enviada — te contactaré por el medio que indicaste.",
      order_form_error: "No se pudo enviar. Tu solicitud se guardó, inténtalo más tarde.",
      order_form_saved: "Tu solicitud se guardó. El artista te contactará por el contacto que indicaste.",
      footer_copyright: "© Podvalnia_alebarda. Todas las obras están protegidas por derechos de autor. Prohibida su copia.",
      copy_warning: "Estas obras están protegidas por derechos de autor. No se permite copiarlas.",
    },
    zh: {
      nav_order: "委托创作",
      nav_projects: "项目",
      nav_about: "关于我",
      nav_collab: "合作",
      nav_socials: "我的社交",
      hero_title: "Podvalnia_alebarda",
      hero_subtitle: "数字艺术家与动画师.",
      gallery_title: "作品集",
      gallery_description: "按风格和氛围浏览作品。原创画作将很快上线.",
      gallery_empty: "暂无作品 — 新作品将很快添加.",
      filter_sketch: "草图",
      filter_art: "完整作品",
      filter_meme: "表情包",
      filter_animation: "动画",
      filter_all: "全部",
      filter_mono: "黑白艺术",
      filter_animals: "动物",
      filter_concept: "概念艺术",
      filter_pixel: "像素艺术",
      filter_fantasy: "奇幻",
      filter_portrait: "肖像",
      order_status_open: "约稿开放中",
      order_status_closed: "约稿已关闭",
      order_slots_text: "",
      order_wip_text: "",
      share_btn: "分享",
      share_done: "链接已复制！",
      order_title: "委托创作",
      order_p1: "描述想法、氛围和格式——我会把它变成带有花卉和叶片元素的温暖数字作品.",
      order_p2: "写下你的偏好，我会提出最佳实现方式.",
      collab_title: "提出合作",
      collab_p1: "我希望参与可以用数字艺术加入微妙魔法的项目，欢迎品牌、游戏、出版或活动的合作.",
      collab_p2: "留下请求，我会回复初步构想和预计时间.",
      collab_form_desc: "描述你的合作提案",
      collab_form_submit: "发送提案",
      collab_form_kind: "合作",
      about_title: "关于我",
      about_p1: "我以温暖色调创作数字作品，结合有机图案、柔和光线和富有表现力的角色.",
      about_li1: "注重氛围与温度",
      about_li2: "从事插画、概念、动画与像素艺术",
      about_li3: "喜欢作品看起来阳光且舒适",
      projects_title: "项目",
      projects_description: "在此展示我参与过的项目与作品.",
      projects_item1: "项目详情将很快补充.",
      footer_title: "在社交平台关注我",
      social_instagram: "Instagram",
      social_telegram: "Telegram",
      social_vk: "VK",
      filter_mode_label: "匹配：",
      filter_mode_any: "任一",
      filter_mode_all: "全部",
      filter_clear: "清除筛选",
      filter_count_one: "{n} 件作品",
      filter_count_few: "{n} 件作品",
      filter_count_many: "{n} 件作品",
      order_form_name: "你的名字",
      order_form_contact_label: "如何联系你",
      order_form_contact_email: "邮箱",
      order_form_contact_discord: "Discord",
      order_form_contact_telegram: "Telegram",
      order_form_contact_ph_email: "you@example.com",
      order_form_contact_ph_discord: "例如 username 或 username#1234",
      order_form_contact_ph_telegram: "例如 @username",
      order_form_type: "作品类型",
      order_form_type_any: "不限 / 详谈",
      order_form_desc: "描述你的想法",
      order_form_budget: "预算（可选）",
      order_form_deadline: "期望期限（可选）",
      order_form_consent: "我同意为回复此请求而处理我的数据",
      order_form_submit: "发送请求",
      order_form_sending: "发送中…",
      order_form_success: "谢谢！请求已发送——我会通过你填写的联系方式联系你。",
      order_form_error: "发送失败。请求已保存，请稍后再试。",
      order_form_saved: "请求已保存。艺术家将通过你填写的联系方式联系你。",
      footer_copyright: "© Podvalnia_alebarda。所有作品均受版权保护。禁止复制。",
      copy_warning: "这些作品受版权保护，禁止复制。",
    }
  };

  // Дефолтные подписи блоков «Заказать»/«Сотрудничество»: шаблоны заявок (копируются кнопкой),
  // подпись кнопки и заголовок примеров. Вшиваем в translations, чтобы работали getText,
  // переключение языка и редактирование в админке (раздел «Редактирование текста»).
  const SECTION_TEXT_DEFAULTS = {
    ru: {
      order_template: "Здравствуйте! Хочу заказать коммишку 🎨\n\n• Имя/ник: \n• Тип работы: \n• Описание идеи: \n• Референсы (ссылки): \n• Бюджет: \n• Желаемый срок: \n• Как со мной связаться: ",
      collab_template: "Здравствуйте! Есть предложение о сотрудничестве 🤝\n\n• Имя / компания: \n• О проекте: \n• Формат сотрудничества: \n• Сроки: \n• Бюджет: \n• Контакты для связи: ",
      copy_template_btn: "Скопировать шаблон",
      copy_template_done: "Скопировано ✓",
      order_images_title: "Прайс",
      collab_images_title: "Карта сотрудничества",
      contact_dm_title: "Напишите мне в личные сообщения:",
      colleague_text: "Также вы можете ознакомиться с портфолио моего коллеги и тоже что-нибудь у него заказать:",
      colleague_btn: "Портфолио коллеги",
      nav_discounts: "скидки",
      discounts_title: "Скидки",
      discounts_text: "Здесь появляются актуальные скидки на мои работы — следите за обновлениями.",
      discounts_empty: "Скидок пока нет — скоро появятся.",
    },
    en: {
      order_template: "Hello! I'd like to order a commission 🎨\n\n• Name/nick: \n• Type of work: \n• Idea description: \n• References (links): \n• Budget: \n• Desired deadline: \n• How to reach me: ",
      collab_template: "Hello! I have a collaboration proposal 🤝\n\n• Name / company: \n• About the project: \n• Type of collaboration: \n• Timeline: \n• Budget: \n• Contact details: ",
      copy_template_btn: "Copy template",
      copy_template_done: "Copied ✓",
      order_images_title: "Price list",
      collab_images_title: "Collaboration guide",
      contact_dm_title: "Message me directly:",
      colleague_text: "You can also check out my colleague's portfolio and order something from him too:",
      colleague_btn: "Colleague's portfolio",
      nav_discounts: "discounts",
      discounts_title: "Discounts",
      discounts_text: "Current discounts on my work appear here — stay tuned.",
      discounts_empty: "No discounts yet — coming soon.",
    },
    es: {
      order_template: "¡Hola! Quiero encargar una comisión 🎨\n\n• Nombre/apodo: \n• Tipo de trabajo: \n• Descripción de la idea: \n• Referencias (enlaces): \n• Presupuesto: \n• Plazo deseado: \n• Cómo contactarme: ",
      collab_template: "¡Hola! Tengo una propuesta de colaboración 🤝\n\n• Nombre / empresa: \n• Sobre el proyecto: \n• Tipo de colaboración: \n• Plazos: \n• Presupuesto: \n• Datos de contacto: ",
      copy_template_btn: "Copiar plantilla",
      copy_template_done: "¡Copiado! ✓",
      order_images_title: "Lista de precios",
      collab_images_title: "Guía de colaboración",
      contact_dm_title: "Escríbeme por privado:",
      colleague_text: "También puedes ver el portafolio de mi colega y encargarle algo a él también:",
      colleague_btn: "Portafolio del colega",
      nav_discounts: "descuentos",
      discounts_title: "Descuentos",
      discounts_text: "Aquí aparecen los descuentos actuales en mis trabajos — atento a las novedades.",
      discounts_empty: "Aún no hay descuentos — pronto los habrá.",
    },
    zh: {
      order_template: "你好！我想委托一幅作品 🎨\n\n• 称呼： \n• 作品类型： \n• 创意描述： \n• 参考（链接）： \n• 预算： \n• 期望完成时间： \n• 如何联系我： ",
      collab_template: "你好！我有一个合作提议 🤝\n\n• 姓名/公司： \n• 关于项目： \n• 合作方式： \n• 时间安排： \n• 预算： \n• 联系方式： ",
      copy_template_btn: "复制模板",
      copy_template_done: "已复制 ✓",
      order_images_title: "价格表",
      collab_images_title: "合作方案",
      contact_dm_title: "私信联系我：",
      colleague_text: "你也可以看看我同事的作品集，也可以向他下单：",
      colleague_btn: "同事的作品集",
      nav_discounts: "优惠",
      discounts_title: "优惠",
      discounts_text: "这里会显示我作品的当前优惠 — 敬请关注。",
      discounts_empty: "暂无优惠 — 即将推出。",
    },
    ko: {
      order_template: "안녕하세요! 커미션을 의뢰하고 싶어요 🎨\n\n• 이름/닉네임: \n• 작업 종류: \n• 아이디어 설명: \n• 레퍼런스(링크): \n• 예산: \n• 희망 마감일: \n• 연락 방법: ",
      collab_template: "안녕하세요! 협업을 제안하고 싶어요 🤝\n\n• 이름 / 회사: \n• 프로젝트 소개: \n• 협업 형태: \n• 일정: \n• 예산: \n• 연락처: ",
      copy_template_btn: "템플릿 복사",
      copy_template_done: "복사됨 ✓",
      order_images_title: "가격표",
      collab_images_title: "협업 안내",
      contact_dm_title: "개인 메시지로 연락주세요:",
      colleague_text: "제 동료의 포트폴리오도 둘러보고 그에게도 의뢰하실 수 있어요:",
      colleague_btn: "동료의 포트폴리오",
      nav_discounts: "할인",
      discounts_title: "할인",
      discounts_text: "제 작업에 대한 현재 할인 정보가 여기에 표시됩니다 — 기대해 주세요.",
      discounts_empty: "아직 할인이 없습니다 — 곧 제공됩니다.",
    },
  };
  SUPPORTED_LANGS.forEach((lang) => {
    if (translations[lang]) Object.assign(translations[lang], SECTION_TEXT_DEFAULTS[lang] || {});
  });

  let currentLanguage = localStorage.getItem("siteLanguage") || "ru";
  const customTextStore = JSON.parse(localStorage.getItem("customTexts") || "{}");

  // Translation functions
  // Пустые строки в кастомных переводах считаем «не задано» и падаем на стандартный текст —
  // чтобы случайно очищенное поле в админке не прятало кнопку/подпись.
  function getText(key) {
    const languageTexts = customTextStore[currentLanguage] || {};
    const translationText = translations[currentLanguage]?.[key];
    const russianCustom = customTextStore.ru?.[key];

    if (languageTexts[key]) return languageTexts[key];
    if (translationText !== undefined) return translationText;
    if (russianCustom) return russianCustom;
    if (translations.ru?.[key]) return translations.ru[key];
    return "";
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      if (element.dataset.manualLabel === "true") return;
      const key = element.dataset.i18n;
      const text = getText(key);
      if (element.tagName.toLowerCase() === "input" || element.tagName.toLowerCase() === "textarea") {
        element.placeholder = text;
      } else {
        element.textContent = text;
      }
    });
    try { buildFilterButtons(); } catch (e) { console.error("Filter rebuild error:", e); }
    try { renderSocialLinks(); } catch (e) { console.error('social render error', e); }
    try { renderSectionImagesPublic(); } catch (e) { console.error('section images error', e); }
    try { renderContactLinksPublic(); } catch (e) { console.error('contact links error', e); }
    try { applyColleagueLink(); } catch (e) { console.error('colleague link error', e); }
    try { renderProjectsFeed(); } catch (e) { console.error('projects feed error', e); }
    try { renderDiscounts(); } catch (e) { console.error('discounts error', e); }
  }

  // Лениво подгружаем CJK/корейские шрифты только при выборе zh/ko (они тяжёлые).
  function ensureScriptFont(language) {
    const map = {
      zh: { id: "notoSansSC", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;800&display=swap" },
      ko: { id: "notoSansKR", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;800&display=swap" },
    };
    const entry = map[language];
    if (!entry || document.getElementById(entry.id)) return;
    const link = document.createElement("link");
    link.id = entry.id;
    link.rel = "stylesheet";
    link.href = entry.href;
    document.head.appendChild(link);
  }

  function setLanguage(language) {
    localStorage.setItem("siteLanguage", language);
    currentLanguage = language;
    // Per-script: помечаем язык документа (активирует :lang() в CSS) и грузим нужный шрифт
    document.documentElement.lang = language;
    ensureScriptFont(language);
    // Переинициализировать customTextStore из localStorage
    const stored = localStorage.getItem("customTexts");
    if (stored) {
      try {
        Object.assign(customTextStore, JSON.parse(stored));
      } catch (e) {
        console.warn("customTextStore reinit error", e);
      }
    }
    applyTranslations();
    hideLanguageModal();
    updateLangSwitcher();
    playTitleEffects();
  }

  // Постоянный переключатель языка (выпадающий список рядом с темой)
  const langLabels = { ru: "RU", en: "EN", zh: "中文", es: "ES", ko: "KO" };
  function updateLangSwitcher() {
    if (langCurrent) langCurrent.textContent = langLabels[currentLanguage] || currentLanguage.toUpperCase();
    if (langMenu) {
      langMenu.querySelectorAll("li[data-lang]").forEach((li) => {
        li.setAttribute("aria-selected", li.dataset.lang === currentLanguage ? "true" : "false");
      });
    }
  }
  function openLangMenu() {
    if (!langMenu) return;
    langMenu.classList.remove("hidden");
    if (langToggle) langToggle.setAttribute("aria-expanded", "true");
  }
  function closeLangMenu() {
    if (!langMenu) return;
    langMenu.classList.add("hidden");
    if (langToggle) langToggle.setAttribute("aria-expanded", "false");
  }
  function toggleLangMenu() {
    if (langMenu && langMenu.classList.contains("hidden")) openLangMenu();
    else closeLangMenu();
  }

  function showLanguageModal() {
    if (!languageModal) return;
    languageModal.classList.remove("hidden");
    // Перезапускаем анимацию появления при каждом показе (в т.ч. при перезагрузке)
    languageModal.classList.remove("is-appearing");
    // reflow, чтобы анимация проиграла заново
    void languageModal.offsetWidth;
    languageModal.classList.add("is-appearing");
  }

  function hideLanguageModal() {
    if (languageModal) languageModal.classList.add("hidden");
  }

  // Gallery functions
  function loadGalleryItems() {
    try {
      const stored = localStorage.getItem("galleryItems");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (error) {
      console.warn("Failed to parse gallery items", error);
    }
    return defaultGalleryItems;
  }

  function renderGallery(items, startIndex = 0) {
    if (!galleryContainer) return;
    galleryContainer.innerHTML = "";
    if (!items || items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "gallery-empty";
      empty.textContent = getText("gallery_empty") || "No works found yet.";
      galleryContainer.appendChild(empty);
      return;
    }
    const wm = loadWatermarkSettings(); // читаем один раз на всю отрисовку (а не на каждую карточку)
    const count = Math.min(8, items.length);
    for (let i = 0; i < count; i++) {
      const item = items[(startIndex + i) % items.length];
      const card = document.createElement("article");
      card.className = "art-card";
      card.dataset.tags = item.tags || "";
      if (item.image) {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.alt || "gallery item";
        img.loading = "lazy";
        img.decoding = "async";
        img.draggable = false; // запрет перетаскивания
        card.appendChild(img);

        // Водяной знак (если включён в админке)
        if (wm.enabled) {
          const watermark = document.createElement("div");
          watermark.className = "art-watermark";
          const wmText = document.createElement("span");
          wmText.textContent = wm.text || getText("hero_title") || "Podvalnia_alebarda";
          watermark.appendChild(wmText);
          card.appendChild(watermark);
        }

        // Иконка-подсказка «развернуть»
        const hint = document.createElement("div");
        hint.className = "art-zoom-hint";
        card.appendChild(hint);

        // Прозрачный оверлей — перехватывает правый клик/перетаскивание изображения,
        // а по обычному клику открывает полноразмерный просмотр (lightbox).
        const guard = document.createElement("div");
        guard.className = "art-guard";
        guard.addEventListener("click", () => {
          // листаем только те работы, что реально показаны и не скрыты фильтром
          const shown = Array.from(galleryContainer.querySelectorAll('.art-card'))
            .filter((c) => c.style.display !== 'none' && c.dataset.image);
          const list = shown.map((c) => ({ image: c.dataset.image, alt: c.dataset.alt || '' }));
          const at = shown.indexOf(card);
          setLightboxGroup(list, at < 0 ? 0 : at);
          openLightbox(item.image, item.alt || "", true);
        });
        card.dataset.image = item.image;
        card.dataset.alt = item.alt || "";
        card.appendChild(guard);
        card.style.cursor = "zoom-in";
      } else {
        card.classList.add("art-card--placeholder");
      }
      galleryContainer.appendChild(card);
    }
  }

  /* =====================================================================
   * ПРОСМОТР РАБОТ: листание ← → , клавишами и свайпом, не закрывая окно.
   * lightboxGroup — список картинок той полосы, из которой открыли просмотр.
   * ===================================================================== */
  let lightboxGroup = [];
  let lightboxIndex = 0;

  function setLightboxGroup(items, index) {
    lightboxGroup = Array.isArray(items) ? items.filter((it) => it && it.image) : [];
    lightboxIndex = Math.max(0, index | 0);
    updateLightboxNav();
  }
  function updateLightboxNav() {
    const prev = document.getElementById('lightboxPrev');
    const next = document.getElementById('lightboxNext');
    const counter = document.getElementById('lightboxCounter');
    const many = lightboxGroup.length > 1;
    if (prev) prev.hidden = !many;
    if (next) next.hidden = !many;
    if (counter) {
      counter.hidden = !many;
      if (many) counter.textContent = (lightboxIndex + 1) + ' / ' + lightboxGroup.length;
    }
  }
  function showLightboxAt(index) {
    if (!lightboxGroup.length) return;
    // по кругу: с последней — на первую и наоборот
    lightboxIndex = (index + lightboxGroup.length) % lightboxGroup.length;
    const it = lightboxGroup[lightboxIndex];
    if (!it) return;
    openLightbox(it.image, it.alt || '', true);
    updateLightboxNav();
  }
  function lightboxStep(delta) { showLightboxAt(lightboxIndex + delta); }

  // Lightbox: открыть работу в полном размере (с водяным знаком, если включён)
  function openLightbox(src, alt, keepGroup) {
    if (!lightbox || !lightboxImage || !src) return;
    if (!keepGroup) { lightboxGroup = []; lightboxIndex = 0; updateLightboxNav(); }
    lightboxImage.src = src;
    lightboxImage.alt = alt || "";
    if (lightboxWatermark) {
      const wm = loadWatermarkSettings();
      lightboxWatermark.innerHTML = "";
      if (wm.enabled) {
        const span = document.createElement("span");
        span.textContent = wm.text || getText("hero_title") || "Podvalnia_alebarda";
        lightboxWatermark.appendChild(span);
      }
    }
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // не скроллить фон
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add("hidden");
    if (lightboxImage) lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  function getSelectedFilters() {
    return Array.from(filterButtons)
      .filter((button) => button.dataset.filter !== "all" && button.classList.contains("active"))
      .map((button) => button.dataset.filter);
  }

  function syncFilterButtonAria() {
    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
    });
  }

  function updateFilterButtons(clicked) {
    const filter = clicked.dataset.filter;
    if (filter === "all") {
      filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === "all"));
    } else {
      const allButton = filterButtons.find((button) => button.dataset.filter === "all");
      clicked.classList.toggle("active");
      if (allButton) {
        allButton.classList.remove("active");
      }
      if (getSelectedFilters().length === 0 && allButton) {
        allButton.classList.add("active");
      }
    }
    syncFilterButtonAria();
    updateFilterToolbar();
    resetGalleryRotation();
  }

  function clearAllFilters() {
    const allButton = filterButtons.find((button) => button.dataset.filter === "all");
    filterButtons.forEach((button) => button.classList.remove("active"));
    if (allButton) allButton.classList.add("active");
    syncFilterButtonAria();
    updateFilterToolbar();
    resetGalleryRotation();
  }

  function getFilteredGalleryItems() {
    const selected = getSelectedFilters();
    if (selected.length === 0) return galleryItems.slice();
    return galleryItems.filter((item) => {
      const tags = (item.tags || "").split(" ").filter(Boolean);
      // any = совпал хотя бы один тег (OR); all = совпали все выбранные (AND)
      return filterMatchMode === "all"
        ? selected.every((filter) => tags.includes(filter))
        : selected.some((filter) => tags.includes(filter));
    });
  }

  // Сколько работ соответствует конкретному тегу (для бейджа-счётчика)
  function countItemsForTag(tagKey) {
    if (tagKey === "all") return galleryItems.length;
    return galleryItems.filter((item) =>
      (item.tags || "").split(" ").filter(Boolean).includes(tagKey)
    ).length;
  }

  // Склонение/формат счётчика работ под язык
  function formatWorksCount(n) {
    if (currentLanguage === "ru") {
      const mod10 = n % 10;
      const mod100 = n % 100;
      let key = "filter_count_many";
      if (mod10 === 1 && mod100 !== 11) key = "filter_count_one";
      else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) key = "filter_count_few";
      return (getText(key) || "{n}").replace("{n}", n);
    }
    const key = n === 1 ? "filter_count_one" : "filter_count_many";
    return (getText(key) || "{n}").replace("{n}", n);
  }

  function updateFilterToolbar() {
    const selected = getSelectedFilters();
    if (filterClearBtn) filterClearBtn.classList.toggle("hidden", selected.length === 0);
    if (filterCountEl) {
      const shown = getFilteredGalleryItems().length;
      filterCountEl.textContent = formatWorksCount(shown);
    }
  }

  function rotateGallery() {
    // Не перестраиваем галерею, когда вкладка скрыта — экономим CPU/батарею на телефоне.
    if (document.hidden) return;
    const items = getFilteredGalleryItems();
    if (items.length === 0) {
      renderGallery(items);
      return;
    }
    renderGallery(items, galleryStartIndex);
    galleryStartIndex = (galleryStartIndex + 1) % items.length;
  }

  function resetGalleryRotation() {
    galleryStartIndex = 0;
    clearInterval(galleryRotationTimer);
    rotateGallery();
    galleryRotationTimer = setInterval(rotateGallery, 3500);
  }

  function loadFilterSettings() {
    try {
      const stored = localStorage.getItem("galleryFilters");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (error) {
      console.warn("Filter load error", error);
    }
    return defaultFilterSettings;
  }

  function buildFilterButtons() {
    if (!filterRow || !filterRowSecondary) return;
    const filters = loadFilterSettings();
    // Запоминаем активные фильтры, чтобы не сбрасывать выбор при перерисовке (смена языка и т.п.)
    const previouslyActive = new Set(getSelectedFilters());
    filterRow.innerHTML = "";
    filterRowSecondary.innerHTML = "";
    filters.forEach((filter) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-button";
      btn.dataset.filter = filter.key;
      const translatedLabel = getText(`filter_${filter.key}`) || filter.label;
      const count = countItemsForTag(filter.key);

      const labelSpan = document.createElement("span");
      labelSpan.className = "filter-label";
      labelSpan.textContent = translatedLabel;
      btn.appendChild(labelSpan);

      const badge = document.createElement("span");
      badge.className = "filter-badge";
      badge.textContent = count;
      btn.appendChild(badge);

      // Фильтр без работ — недоступен (кроме "Все")
      if (filter.key !== "all" && count === 0) {
        btn.disabled = true;
      }
      if (filter.key === "all" || previouslyActive.has(filter.key)) {
        btn.classList.add("active");
      }
      btn.setAttribute("aria-pressed", btn.classList.contains("active") ? "true" : "false");
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        updateFilterButtons(btn);
      });
      if (filter.primary !== false) {
        filterRow.appendChild(btn);
      } else {
        filterRowSecondary.appendChild(btn);
      }
    });
    filterButtons = Array.from(document.querySelectorAll(".filter-button"));
    // Если активных тегов нет — активируем "Все"
    if (getSelectedFilters().length === 0) {
      const allButton = filterButtons.find((b) => b.dataset.filter === "all");
      if (allButton) allButton.classList.add("active");
    }
    syncFilterButtonAria();
    updateFilterToolbar();
  }

  // Admin functions
  function applyAdminImages() {
    const headerValue = localStorage.getItem("adminHeaderImage") || heroBgImage.getAttribute("src");
    const leftValue = localStorage.getItem("adminLeftSidebar") || leftSidebarImage.getAttribute("src");
    const rightValue = localStorage.getItem("adminRightSidebar") || rightSidebarImage.getAttribute("src");
    if (headerValue) heroBgImage.src = headerValue;
    if (leftValue) leftSidebarImage.src = leftValue;
    if (rightValue) rightSidebarImage.src = rightValue;
  }

  // Сжатие загружаемых картинок: уменьшаем до maxDim по длинной стороне и кодируем в JPEG,
  // чтобы тяжёлые фото не раздували localStorage и не тормозили сайт. Прозрачный фон
  // заливаем белым (иначе JPEG сделает его чёрным). При любой ошибке — отдаём оригинал.
  function compressImageFile(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      if (!file) { reject(new Error('no file')); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result?.toString() || '';
        const img = new Image();
        img.onload = () => {
          try {
            let w = img.naturalWidth || img.width;
            let h = img.naturalHeight || img.height;
            if (!w || !h) { resolve(src); return; }
            const md = maxDim || 1600;
            if (Math.max(w, h) > md) {
              const s = md / Math.max(w, h);
              w = Math.round(w * s);
              h = Math.round(h * s);
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            const out = canvas.toDataURL('image/jpeg', quality || 0.82);
            resolve(out && out.length > 16 ? out : src);
          } catch (err) {
            console.warn('image compress failed, using original', err);
            resolve(src);
          }
        };
        img.onerror = () => resolve(src);
        img.src = src;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function handleImageUpload(file, targetId, previewId, storageKey) {
    if (!file) return;
    const maxDim = targetId === 'header' ? 1920 : 1400;
    compressImageFile(file, maxDim, 0.84).then((dataUrl) => {
      localStorage.setItem(storageKey, dataUrl);
      markContentDirty();
      // Update the displayed image
      if (targetId === 'header') {
        heroBgImage.src = dataUrl;
      } else if (targetId === 'left') {
        leftSidebarImage.src = dataUrl;
      } else if (targetId === 'right') {
        rightSidebarImage.src = dataUrl;
      }
      // Update preview in admin panel
      if (previewId) {
        const preview = document.getElementById(previewId);
        if (preview) {
          preview.innerHTML = `<img src="${dataUrl}" alt="preview" style="max-width: 100%; max-height: 150px;">`;
        }
      }
    }).catch((err) => console.warn('header/sidebar upload failed', err));
  }

  function openAdminPanel() {
    if (!adminPanel) return;
    if (!localStorage.getItem("adminPassword")) {
      localStorage.setItem("adminPassword", "МММ");
    }
    if (adminPasswordInput) {
      adminPasswordInput.value = "";
      passwordError?.classList.add("hidden");
    }
    passwordModal?.classList.remove("hidden");
  }

  function closeAdminPanel() {
    if (adminPanel) adminPanel.classList.add("hidden");
    if (adminPasswordInput) {
      adminPasswordInput.value = "";
    }
    if (passwordError) {
      passwordError.classList.add("hidden");
    }
  }

  /* =====================================================================
   * ИНДИКАТОР «ЕСТЬ НЕОПУБЛИКОВАННЫЕ ИЗМЕНЕНИЯ»
   * Правки в админке живут только в localStorage этого браузера. Пока их не
   * выгрузили в content.json, посетители видят старую версию сайта — это самая
   * частая причина «у меня всё есть, а на сайте по-старому». Показываем явно.
   * ===================================================================== */
  const DIRTY_KEY = 'contentDirty';           // '1' — есть правки, которых нет на сайте
  const DIRTY_EXPORTED_KEY = 'contentExported'; // '1' — копия скачана, ждём загрузки на GitHub

  function isContentDirty() {
    try { return localStorage.getItem(DIRTY_KEY) === '1'; } catch (e) { return false; }
  }
  function markContentDirty() {
    try {
      localStorage.setItem(DIRTY_KEY, '1');
      localStorage.removeItem(DIRTY_EXPORTED_KEY);
    } catch (e) {}
    refreshDirtyIndicator();
  }
  function markContentPublished() {
    try {
      localStorage.removeItem(DIRTY_KEY);
      localStorage.removeItem(DIRTY_EXPORTED_KEY);
    } catch (e) {}
    refreshDirtyIndicator();
  }
  function markContentExported() {
    try { localStorage.setItem(DIRTY_EXPORTED_KEY, '1'); } catch (e) {}
    refreshDirtyIndicator();
  }
  function refreshDirtyIndicator() {
    const dirty = isContentDirty();
    // Точка на плавающей кнопке «A» — видно, не открывая админку
    if (adminUnlock) adminUnlock.classList.toggle('has-unpublished', dirty);
    const banner = document.getElementById('adminDirtyBanner');
    if (!banner) return;
    banner.classList.toggle('hidden', !dirty);
    if (!dirty) return;
    let exported = false;
    try { exported = localStorage.getItem(DIRTY_EXPORTED_KEY) === '1'; } catch (e) {}
    const text = document.getElementById('adminDirtyText');
    const doneBtn = document.getElementById('adminDirtyDone');
    if (text) {
      text.textContent = exported
        ? 'Копия скачана. Осталось загрузить файл content.json на GitHub (рядом с index.html) — потом нажмите кнопку справа.'
        : 'Есть изменения, которых ещё нет на сайте — посетители пока видят старую версию. Нажмите «Опубликовать сейчас» или скачайте копию и загрузите её на GitHub.';
    }
    if (doneBtn) doneBtn.classList.toggle('hidden', !exported);
  }

  // Правки, набранные в форме, но ещё не сохранённые кнопкой — предупреждаем,
  // чтобы их случайно не потерять при закрытии вкладки или панели.
  let adminFormTouched = false;

  function populateAdminForm() {
    if (!adminEditLang) adminEditLang = "ru";
    adminFormTouched = false;
    refreshDirtyIndicator();
    renderAdminFilterEditor();
    renderAdminGalleryFilterSelectors();
    renderAdminGalleryList();
    renderAdminTextList();
    renderAdminSocialList();
    renderAdminProjectsList();
    renderAdminDiscountsList();
    renderAdminSectionImagesAll();
    populateContactLinkFields();
    populateColleagueField();
    populateWatermarkFields();
    populateOrdersOpenField();
    populateGhFields();
  }

  // closePanel=true → «Сохранить и закрыть»; false → «Применить (предпросмотр)».
  // В обоих случаях изменения пишутся в localStorage и сразу видны на странице.
  function saveAdminSettings(closePanel) {
    const filters = collectAdminFilterSettings();
    const oldFilters = loadFilterSettings();
    const oldFilterKeys = new Set(oldFilters.map((f) => f.key));
    const newFilterKeys = new Set(filters.map((f) => f.key));
    const removedKeys = Array.from(oldFilterKeys).filter((k) => !newFilterKeys.has(k));

    // В galleryFilters храним только {key,label,primary}; переводы названий уходят в customTexts ниже.
    localStorage.setItem("galleryFilters", JSON.stringify(
      filters.map((f) => ({ key: f.key, label: f.label, primary: f.primary }))
    ));

    const galleryData = collectAdminGalleryData();
    if (Array.isArray(galleryData)) {
      galleryItems = galleryData;
    }
    // Снимаем теги удалённых фильтров с работ ПОСЛЕ сбора галереи из DOM
    // (если делать это раньше, collectAdminGalleryData перетрёт правку и тег-сирота останется).
    if (removedKeys.length > 0) {
      galleryItems.forEach((item) => {
        const tags = (item.tags || "").split(" ").filter(Boolean);
        item.tags = tags.filter((tag) => !removedKeys.includes(tag)).join(" ");
      });
    }
    localStorage.setItem("galleryItems", JSON.stringify(galleryItems));

    // Тексты сохраняем ТОЛЬКО для выбранного в админке языка (adminEditLang),
    // чтобы можно было задать перевод отдельно для каждого языка.
    const editLang = adminEditLang || currentLanguage;
    const updatedText = collectAdminTextOverrides();
    const existingCustom = JSON.parse(localStorage.getItem("customTexts") || "{}");
    if (!existingCustom[editLang]) existingCustom[editLang] = {};
    Object.assign(existingCustom[editLang], updatedText);

    // Названия фильтров на всех языках берём прямо из карточек редактора фильтров.
    // Что вписано — пишем в customTexts[lang][filter_<key>]; пустые языки падают на
    // русское/стандартное название через getText, поэтому кнопка не остаётся без подписи.
    filters.forEach((filter) => {
      const filterKey = `filter_${filter.key}`;
      const labels = filter.labels || {};
      SUPPORTED_LANGS.forEach((lang) => {
        if (!existingCustom[lang]) existingCustom[lang] = {};
        const typed = (labels[lang] || "").trim();
        if (typed) {
          existingCustom[lang][filterKey] = typed;
        } else {
          const hasOwn = existingCustom[lang][filterKey] && existingCustom[lang][filterKey].trim();
          const hasBuiltin = translations[lang] && translations[lang][filterKey];
          if (!hasOwn && !hasBuiltin) {
            existingCustom[lang][filterKey] = (labels.ru || filter.label || "").trim();
          }
        }
      });
    });

    const newPassword = adminNewPassword?.value.trim();
    const confirmPassword = adminConfirmPassword?.value.trim();
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert('Пароли не совпадают. Изменение пароля не сохранено.');
      } else if (newPassword) {
        localStorage.setItem('adminPassword', newPassword);
      }
    }

    localStorage.setItem("customTexts", JSON.stringify(existingCustom));
    Object.assign(customTextStore, existingCustom);

    try {
      const social = collectAdminSocialLinks();
      localStorage.setItem('socialLinks', JSON.stringify(social));
    } catch (e) { console.warn('save social links failed', e); }

    // Проекты (посты)
    try {
      projectsData = collectAdminProjects();
      localStorage.setItem('projects', JSON.stringify(projectsData));
    } catch (e) { console.warn('save projects failed', e); }

    // Скидки
    try {
      discountsData = collectAdminDiscounts();
      localStorage.setItem('discounts', JSON.stringify(discountsData));
    } catch (e) { console.warn('save discounts failed', e); }

    try { saveWatermarkSettings(); } catch (e) { console.warn('save watermark failed', e); }
    try { saveOrdersOpen(); } catch (e) { console.warn('save orders status failed', e); }
    try { saveContactLinks(); } catch (e) { console.warn('save contact links failed', e); }
    try { saveColleagueUrl(); } catch (e) { console.warn('save colleague url failed', e); }

    if (adminNewPassword) adminNewPassword.value = '';
    if (adminConfirmPassword) adminConfirmPassword.value = '';

    resetGalleryRotation();
    applyTranslations();
    renderSocialLinks();
    renderProjectsFeed();
    adminFormTouched = false;
    markContentDirty();
    if (closePanel) {
      closeAdminPanel();
    } else {
      // предпросмотр: перерисуем редакторы, чтобы значения были консистентны
      renderAdminTextList();
      renderAdminProjectsList();
    }
  }

  // Собираем введённый текст: одно поле = один ключ. Пустое поле = ключ сбрасывается
  // (тогда показывается стандартный перевод).
  function collectAdminTextOverrides() {
    if (!adminTextList) return {};
    const result = {};
    Array.from(adminTextList.querySelectorAll("[data-text-key]")).forEach((field) => {
      const key = field.dataset.textKey;
      if (!key) return;
      result[key] = field.value.trim();
    });
    return result;
  }

  function renderAdminTextList() {
    if (!adminTextList) return;
    if (!adminEditLang) adminEditLang = "ru";
    if (adminTextLang) adminTextLang.value = adminEditLang;
    adminTextList.innerHTML = "";
    // Редактируем текст ВЫБРАННОГО в админке языка (а не текущего языка сайта).
    const editLang = adminEditLang;
    const currentCustom = customTextStore[editLang] || {};
    const langTr = translations[editLang] || {};

    adminTextGroups.forEach(({ section, fields }) => {
      const sectionWrap = document.createElement("div");
      sectionWrap.className = "admin-text-section";

      const sectionTitle = document.createElement("div");
      sectionTitle.className = "admin-text-section__title";
      sectionTitle.textContent = section;
      sectionWrap.appendChild(sectionTitle);

      fields.forEach(({ key, label, type }) => {
        const row = document.createElement("div");
        row.className = "admin-text-row";
        const lab = document.createElement("label");
        lab.textContent = label;
        lab.htmlFor = `adminTextField_${key}`;
        // Текущее значение: своё (если задано) → стандартный перевод языка → русский
        const value = (currentCustom[key] !== undefined && currentCustom[key] !== "")
          ? currentCustom[key]
          : (langTr[key] || translations.ru[key] || "");
        let field;
        if (type === "area") {
          field = document.createElement("textarea");
          field.rows = 3;
        } else {
          field = document.createElement("input");
          field.type = "text";
        }
        field.id = `adminTextField_${key}`;
        field.dataset.textKey = key;
        field.className = "admin-text-field";
        field.value = value;
        row.appendChild(lab);
        row.appendChild(field);
        sectionWrap.appendChild(row);
      });

      adminTextList.appendChild(sectionWrap);
    });
    // Соцсети рендерятся отдельно (в populateAdminForm), чтобы смена языка
    // редактирования не стирала несохранённые правки в списке соцсетей.
  }

  // Social links management
  const MAX_SOCIAL_LINKS = 10;

  // Соцсети хранятся МАССИВОМ [{label, url, i18nKey?}] (до 10 штук). У трёх стандартных
  // кнопок есть i18nKey для перевода; у добавленных пользователем — только label.
  function defaultSocialLinks() {
    return [
      { label: 'Instagram', url: '#', i18nKey: 'social_instagram' },
      { label: 'Telegram', url: '#', i18nKey: 'social_telegram' },
      { label: 'VK', url: '#', i18nKey: 'social_vk' },
    ];
  }

  // Приводим к массиву: поддерживаем и НОВЫЙ формат (массив), и СТАРЫЙ
  // ({ social_x: {label,url} }) — чтобы уже сохранённые/опубликованные данные не потерялись.
  function normalizeSocialLinks(parsed) {
    let arr = [];
    if (Array.isArray(parsed)) {
      arr = parsed.map((it) => ({
        label: (it && it.label != null ? String(it.label) : '').trim(),
        url: it && it.url ? it.url : '#',
        i18nKey: it && it.i18nKey ? it.i18nKey : undefined,
      }));
    } else if (parsed && typeof parsed === 'object') {
      arr = Object.keys(parsed).map((k) => ({
        label: (parsed[k] && parsed[k].label) || k.replace('social_', ''),
        url: (parsed[k] && parsed[k].url) || '#',
        i18nKey: k,
      }));
    }
    arr = arr.filter((it) => it && (it.label || (it.url && it.url !== '#')));
    return arr.slice(0, MAX_SOCIAL_LINKS);
  }

  function loadSocialLinks() {
    try {
      const stored = localStorage.getItem('socialLinks');
      if (stored) return normalizeSocialLinks(JSON.parse(stored));
    } catch (e) { console.warn('socialLinks parse error', e); }
    return defaultSocialLinks();
  }

  function normalizeUrl(url) {
    if (!url) return '#';
    const trimmed = url.trim();
    if (!trimmed || trimmed === '#') return '#';
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) return trimmed;
    if (trimmed.startsWith('//')) return 'https:' + trimmed;
    if (/^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return 'mailto:' + trimmed;
    return 'https://' + trimmed;
  }

  function renderSocialLinks() {
    const container = document.querySelector('.social-links');
    if (!container) return;
    const links = loadSocialLinks();
    container.innerHTML = '';
    links.forEach((item) => {
      const anchor = document.createElement('a');
      anchor.className = 'social-button';
      const href = normalizeUrl(item.url || '#');
      anchor.href = href;
      if (href.startsWith('http')) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
      const i18nKey = item.i18nKey;
      const translated = i18nKey ? getText(i18nKey) : '';
      const label = item.label || translated || 'link';
      anchor.textContent = label;
      // Перевод привязываем только к стандартным кнопкам, которые пользователь не переименовал.
      if (i18nKey && translated && (!item.label || item.label === translated)) {
        anchor.dataset.i18n = i18nKey;
      } else {
        anchor.removeAttribute('data-i18n');
        anchor.dataset.manualLabel = 'true';
      }
      container.appendChild(anchor);
    });
  }

  // Строка редактора соцсети: название + ссылка + «Удалить». Ключ перевода (если есть)
  // храним в data-атрибуте, пользователю он не показывается.
  function buildAdminSocialRow(item) {
    const row = document.createElement('div');
    row.className = 'admin-social-row';
    if (item && item.i18nKey) row.dataset.i18nKey = item.i18nKey;

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Название (напр. Instagram)';
    labelInput.className = 'admin-social-label';
    labelInput.value = (item && item.label) || (item && item.i18nKey ? getText(item.i18nKey) : '') || '';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Ссылка (https://…)';
    urlInput.className = 'admin-social-url';
    urlInput.value = item && item.url && item.url !== '#' ? item.url : '';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'admin-button admin-button--secondary admin-social-remove';
    removeBtn.textContent = 'Удалить';
    removeBtn.addEventListener('click', () => { row.remove(); updateAddSocialButton(); });

    row.appendChild(labelInput);
    row.appendChild(urlInput);
    row.appendChild(removeBtn);
    return row;
  }

  function updateAddSocialButton() {
    if (!adminAddSocial || !adminSocialLinks) return;
    const count = adminSocialLinks.querySelectorAll('.admin-social-row').length;
    adminAddSocial.disabled = count >= MAX_SOCIAL_LINKS;
    adminAddSocial.textContent = count >= MAX_SOCIAL_LINKS
      ? `Максимум ${MAX_SOCIAL_LINKS} соцсетей`
      : 'Добавить соцсеть';
  }

  function renderAdminSocialList() {
    if (!adminSocialLinks) return;
    adminSocialLinks.innerHTML = '';
    loadSocialLinks().forEach((item) => {
      adminSocialLinks.appendChild(buildAdminSocialRow(item));
    });
    updateAddSocialButton();
  }

  function collectAdminSocialLinks() {
    const rows = document.querySelectorAll('#adminSocialLinks .admin-social-row');
    const out = [];
    rows.forEach((row) => {
      const label = (row.querySelector('.admin-social-label')?.value || '').trim();
      const urlRaw = (row.querySelector('.admin-social-url')?.value || '').trim();
      if (!label && !urlRaw) return; // пустую строку пропускаем
      const item = { label: label || 'link', url: urlRaw ? normalizeUrl(urlRaw) : '#' };
      if (row.dataset.i18nKey) item.i18nKey = row.dataset.i18nKey;
      out.push(item);
    });
    return out.slice(0, MAX_SOCIAL_LINKS);
  }

  /* =====================================================================
   * ПРИМЕРЫ РАБОТ в блоках «Заказать»/«Сотрудничество» (крупные, без обрезки)
   * + копируемые шаблоны заявок (вместо форм).
   * ===================================================================== */
  const adminOrderImagesList = document.getElementById('adminOrderImagesList');
  const adminCollabImagesList = document.getElementById('adminCollabImagesList');
  const adminAddOrderImage = document.getElementById('adminAddOrderImage');
  const adminAddCollabImage = document.getElementById('adminAddCollabImage');

  function loadSectionImages(key) {
    try {
      const a = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(a) ? a.filter((x) => x && x.image) : [];
    } catch (e) { return []; }
  }

  // Подгружаем крупные картинки только когда посетитель до них доскроллил.
  // Листы прайса весят сотни килобайт — тянуть их сразу при открытии сайта незачем.
  const lazyImageObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }
          obs.unobserve(img);
        });
      }, { rootMargin: '400px 0px' })
    : null;

  function lazyLoadImage(img, src) {
    if (lazyImageObserver) {
      img.dataset.src = src;
      lazyImageObserver.observe(img);
    } else {
      img.src = src; // старый браузер — грузим сразу
    }
  }

  // Публичный рендер примеров (по 2 в ряд, без обрезки; клик — просмотр в lightbox)
  function renderSectionImages(container, key) {
    if (!container) return;
    const imgs = loadSectionImages(key).slice(0, 6);
    container.innerHTML = '';
    // Прячем заголовок «Примеры работ», если изображений нет
    const section = container.closest('.section-examples');
    if (section) section.style.display = imgs.length ? '' : 'none';
    imgs.forEach((it) => {
      const item = document.createElement('div');
      item.className = 'commission-item';
      const img = document.createElement('img');
      lazyLoadImage(img, it.image);
      img.alt = it.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      item.appendChild(img);
      const guard = document.createElement('div');
      guard.className = 'commission-guard';
      guard.addEventListener('click', () => {
        setLightboxGroup(imgs, imgs.indexOf(it));
        openLightbox(it.image, it.alt || '', true);
      });
      item.appendChild(guard);
      container.appendChild(item);
    });
  }
  /* =====================================================================
   * СТАТУС ПРИЁМА ЗАКАЗОВ — первое, что ищет заказчик.
   * Открыт/закрыт хранится отдельным флажком, подписи и строки про слоты
   * и «сейчас в работе» — обычные тексты (значит, переводятся на все языки).
   * ===================================================================== */
  function isOrdersOpen() {
    try { return localStorage.getItem('ordersOpen') !== '0'; } catch (e) { return true; }
  }
  function renderOrderStatus() {
    const wrap = document.getElementById('orderStatus');
    if (!wrap) return;
    const open = isOrdersOpen();
    const label = document.getElementById('orderStatusLabel');
    const badge = document.getElementById('orderStatusBadge');
    const slotsEl = document.getElementById('orderStatusSlots');
    const wipEl = document.getElementById('orderStatusWip');

    if (label) label.textContent = getText(open ? 'order_status_open' : 'order_status_closed') || '';
    if (badge) badge.classList.toggle('is-closed', !open);

    const slots = (getText('order_slots_text') || '').trim();
    if (slotsEl) {
      slotsEl.textContent = slots;
      slotsEl.hidden = !slots;
    }
    const wip = (getText('order_wip_text') || '').trim();
    if (wipEl) {
      wipEl.textContent = wip;
      wipEl.hidden = !wip;
    }
    wrap.hidden = false;
  }

  function renderSectionImagesPublic() {
    renderOrderStatus();
    renderSectionImages(document.getElementById('orderGallery'), 'orderImages');
    renderSectionImages(document.getElementById('collabGallery'), 'collabImages');
  }

  // Админка: управление примерами (до 6), сразу пишем в localStorage
  function renderAdminSectionImages(listEl, key, addBtn) {
    if (!listEl) return;
    const imgs = loadSectionImages(key);
    listEl.innerHTML = '';
    imgs.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'admin-section-image';
      const img = document.createElement('img');
      img.src = it.image || '';
      img.alt = '';
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'admin-button admin-button--secondary';
      rm.textContent = 'Удалить';
      rm.addEventListener('click', () => {
        const arr = loadSectionImages(key);
        arr.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(arr));
        markContentDirty();
        renderAdminSectionImagesAll();
        renderSectionImagesPublic();
      });
      row.appendChild(img);
      row.appendChild(rm);
      listEl.appendChild(row);
    });
    if (addBtn) {
      addBtn.disabled = imgs.length >= 6;
      addBtn.textContent = imgs.length >= 6 ? 'Максимум 6 изображений' : 'Добавить изображение';
    }
  }
  function renderAdminSectionImagesAll() {
    renderAdminSectionImages(adminOrderImagesList, 'orderImages', adminAddOrderImage);
    renderAdminSectionImages(adminCollabImagesList, 'collabImages', adminAddCollabImage);
  }
  function openSectionImagePicker(mode) {
    if (loadSectionImages(mode).length >= 6) { alert('Можно добавить максимум 6 изображений.'); return; }
    if (adminGalleryFileInput) {
      adminGalleryFileInput.dataset.mode = mode;
      adminGalleryFileInput.value = '';
      adminGalleryFileInput.click();
    }
  }

  // Копирование шаблона заявки/предложения по клику (вместо отправки формы)
  function fallbackCopyText(text, done) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (done) done();
    } catch (e) { console.warn('copy failed', e); }
  }
  function copyTemplate(textKey, statusEl) {
    const text = getText(textKey) || '';
    if (!text) return;
    const done = () => {
      if (statusEl) {
        statusEl.textContent = getText('copy_template_done') || 'Скопировано ✓';
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 2500);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopyText(text, done));
    } else {
      fallbackCopyText(text, done);
    }
  }

  // Контакты для ЛС (Discord/VK/Telegram) — жирная строка внизу блоков Заказать/Сотрудничество
  const adminContactDiscord = document.getElementById('adminContactDiscord');
  const adminContactVk = document.getElementById('adminContactVk');
  const adminContactTelegram = document.getElementById('adminContactTelegram');
  const adminColleagueUrl = document.getElementById('adminColleagueUrl');
  const CONTACT_PLATFORMS = [
    { key: 'discord', label: 'Discord' },
    { key: 'vk', label: 'VK' },
    { key: 'telegram', label: 'Telegram' },
  ];

  // Ссылка на портфолио коллеги (кнопка над соцсетями). null = ни разу не меняли → дефолт;
  // пустая строка = намеренно очистили → блок коллеги скрывается.
  const DEFAULT_COLLEAGUE_URL = 'https://9726303-blip.github.io/Kreatur_Herre/';
  function applyColleagueLink() {
    const a = document.getElementById('colleagueBtn');
    if (!a) return;
    const section = a.closest('.colleague-section');
    const stored = localStorage.getItem('colleagueUrl');
    const url = (stored === null) ? DEFAULT_COLLEAGUE_URL : stored.trim();
    if (!url) {
      if (section) section.style.display = 'none';
      return;
    }
    if (section) section.style.display = '';
    a.href = normalizeUrl(url);
  }
  function populateColleagueField() {
    if (!adminColleagueUrl) return;
    const stored = localStorage.getItem('colleagueUrl');
    adminColleagueUrl.value = (stored === null) ? DEFAULT_COLLEAGUE_URL : stored;
  }
  function saveColleagueUrl() {
    if (!adminColleagueUrl) return;
    localStorage.setItem('colleagueUrl', adminColleagueUrl.value.trim());
  }

  function loadContactLinks() {
    try {
      const c = JSON.parse(localStorage.getItem('contactLinks') || '{}');
      return {
        discord: (c.discord || '').trim(),
        vk: (c.vk || '').trim(),
        telegram: (c.telegram || '').trim(),
      };
    } catch (e) { return { discord: '', vk: '', telegram: '' }; }
  }
  function renderContactLinksInto(container) {
    if (!container) return;
    const links = loadContactLinks();
    container.innerHTML = '';
    let count = 0;
    CONTACT_PLATFORMS.forEach((p) => {
      const url = links[p.key];
      if (!url) return;
      const a = document.createElement('a');
      a.className = 'section-contact__btn section-contact__btn--' + p.key;
      a.href = normalizeUrl(url);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = p.label;
      container.appendChild(a);
      count++;
    });
    const wrap = container.closest('.section-contact');
    if (wrap) wrap.style.display = count ? '' : 'none';
  }
  function renderContactLinksPublic() {
    renderContactLinksInto(document.getElementById('orderContactLinks'));
    renderContactLinksInto(document.getElementById('collabContactLinks'));
  }
  function populateContactLinkFields() {
    const links = loadContactLinks();
    if (adminContactDiscord) adminContactDiscord.value = links.discord;
    if (adminContactVk) adminContactVk.value = links.vk;
    if (adminContactTelegram) adminContactTelegram.value = links.telegram;
  }
  function saveContactLinks() {
    const links = {
      discord: adminContactDiscord ? adminContactDiscord.value.trim() : '',
      vk: adminContactVk ? adminContactVk.value.trim() : '',
      telegram: adminContactTelegram ? adminContactTelegram.value.trim() : '',
    };
    localStorage.setItem('contactLinks', JSON.stringify(links));
  }

  /* =====================================================================
   * ПРОЕКТЫ (посты): картинка + дата + подпись на каждом языке
   * ===================================================================== */
  function loadProjects() {
    try {
      const stored = localStorage.getItem('projects');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { console.warn('projects parse error', e); }
    return [];
  }

  // Подпись поста на текущем языке (с откатом на русский / любой заполненный)
  function projectCaption(post, lang) {
    const cap = post && post.caption ? post.caption : {};
    if (typeof cap === 'string') return cap; // на случай старого формата
    return cap[lang] || cap.ru || cap.en || Object.values(cap).find(Boolean) || '';
  }

  function formatProjectDate(value, lang) {
    if (!value) return '';
    // value в формате YYYY-MM-DD из <input type=date>
    const d = new Date(value + 'T00:00:00');
    if (isNaN(d.getTime())) return value;
    const localeMap = { ru: 'ru-RU', en: 'en-US', es: 'es-ES', zh: 'zh-CN', ko: 'ko-KR' };
    try {
      return d.toLocaleDateString(localeMap[lang] || 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return value; }
  }

  function renderProjectsFeed() {
    if (!projectsFeed) return;
    projectsFeed.innerHTML = '';
    const posts = Array.isArray(projectsData) ? projectsData : [];
    if (!posts.length) {
      const empty = document.createElement('p');
      empty.className = 'projects-empty';
      empty.textContent = getText('projects_item1') || 'Проекты будут добавлены в ближайшее время.';
      projectsFeed.appendChild(empty);
      return;
    }
    posts.forEach((post) => {
      const card = document.createElement('article');
      card.className = 'project-post';

      if (post.image) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'project-post__media';
        const img = document.createElement('img');
        img.src = post.image;
        img.alt = projectCaption(post, currentLanguage) || 'Проект';
        img.loading = 'lazy';
        imgWrap.appendChild(img);
        card.appendChild(imgWrap);
      }

      const body = document.createElement('div');
      body.className = 'project-post__body';

      const dateStr = formatProjectDate(post.date, currentLanguage);
      if (dateStr) {
        const dateEl = document.createElement('time');
        dateEl.className = 'project-post__date';
        if (post.date) dateEl.dateTime = post.date;
        dateEl.textContent = dateStr;
        body.appendChild(dateEl);
      }

      const caption = projectCaption(post, currentLanguage);
      if (caption) {
        const capEl = document.createElement('p');
        capEl.className = 'project-post__caption';
        capEl.textContent = caption; // textContent — без XSS
        body.appendChild(capEl);
      }

      card.appendChild(body);
      projectsFeed.appendChild(card);
    });
  }

  // Читаем из localStorage картинку поста по индексу (картинки храним отдельно из-за размера)
  function renderAdminProjectsList() {
    if (!adminProjectsList) return;
    if (!adminEditLang) adminEditLang = "ru";
    adminProjectsList.innerHTML = '';
    const posts = Array.isArray(projectsData) ? projectsData : [];
    posts.forEach((post, index) => {
      const row = document.createElement('div');
      row.className = 'admin-project-row';
      row.dataset.index = String(index);

      // Превью + кнопка картинки
      const media = document.createElement('div');
      media.className = 'admin-project-media';
      const preview = document.createElement('div');
      preview.className = 'admin-project-preview';
      if (post.image) {
        const img = document.createElement('img');
        img.src = post.image;
        preview.appendChild(img);
      } else {
        preview.textContent = 'нет фото';
      }
      const imgBtn = document.createElement('button');
      imgBtn.type = 'button';
      imgBtn.className = 'admin-button admin-button--secondary';
      imgBtn.textContent = post.image ? 'Заменить фото' : 'Загрузить фото';
      imgBtn.addEventListener('click', () => pickProjectImage(index));
      media.appendChild(preview);
      media.appendChild(imgBtn);

      // Поля: дата + подпись (для выбранного языка)
      const fields = document.createElement('div');
      fields.className = 'admin-project-fields';

      const dateLabel = document.createElement('label');
      dateLabel.textContent = 'Дата';
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.className = 'admin-project-date';
      dateInput.value = post.date || '';

      const capLabel = document.createElement('label');
      capLabel.textContent = 'Подпись (' + adminEditLang.toUpperCase() + ')';
      const capInput = document.createElement('textarea');
      capInput.className = 'admin-project-caption';
      capInput.rows = 2;
      capInput.value = (post.caption && typeof post.caption === 'object') ? (post.caption[adminEditLang] || '') : (post.caption || '');

      fields.appendChild(dateLabel);
      fields.appendChild(dateInput);
      fields.appendChild(capLabel);
      fields.appendChild(capInput);

      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'admin-button admin-button--secondary admin-project-remove';
      rm.textContent = 'Удалить пост';
      rm.addEventListener('click', () => {
        // Сохраняем то, что введено сейчас, затем удаляем
        projectsData = collectAdminProjects();
        projectsData.splice(index, 1);
        renderAdminProjectsList();
      });

      row.appendChild(media);
      row.appendChild(fields);
      row.appendChild(rm);
      adminProjectsList.appendChild(row);
    });
  }

  // Собираем посты из админки (подпись пишется в выбранный язык, остальные языки сохраняются)
  function collectAdminProjects() {
    if (!adminProjectsList) return Array.isArray(projectsData) ? projectsData : [];
    const editLang = adminEditLang || currentLanguage;
    const out = [];
    adminProjectsList.querySelectorAll('.admin-project-row').forEach((row) => {
      const index = parseInt(row.dataset.index, 10);
      const existing = (Array.isArray(projectsData) && projectsData[index]) ? projectsData[index] : {};
      const date = row.querySelector('.admin-project-date')?.value || '';
      const capValue = row.querySelector('.admin-project-caption')?.value.trim() || '';
      const caption = (existing.caption && typeof existing.caption === 'object') ? { ...existing.caption } : {};
      caption[editLang] = capValue;
      out.push({ image: existing.image || '', date, caption });
    });
    return out;
  }

  let pendingProjectImageIndex = null;
  function pickProjectImage(index) {
    pendingProjectImageIndex = index;
    if (adminGalleryFileInput) {
      // используем общий файловый input в режиме «проект»
      adminGalleryFileInput.dataset.mode = 'project';
      adminGalleryFileInput.value = '';
      adminGalleryFileInput.click();
    }
  }

  /* =====================================================================
   * СКИДКИ: большая цифра в %, подпись (на каждом языке) и маленькая картинка
   * ===================================================================== */
  function loadDiscounts() {
    try {
      const stored = localStorage.getItem('discounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { console.warn('discounts parse error', e); }
    return [];
  }
  function discountCaption(item, lang) {
    const cap = item && item.caption ? item.caption : {};
    if (typeof cap === 'string') return cap;
    return cap[lang] || cap.ru || cap.en || Object.values(cap).find(Boolean) || '';
  }
  function formatPercent(value) {
    const v = (value == null ? '' : String(value)).trim();
    if (!v) return '';
    return /%/.test(v) ? v : v + '%';
  }
  function renderDiscounts() {
    const grid = document.getElementById('discountsGrid');
    if (!grid) return;
    const items = Array.isArray(discountsData) ? discountsData : [];
    grid.innerHTML = '';
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'discounts-empty';
      empty.textContent = getText('discounts_empty') || 'Скидок пока нет.';
      grid.appendChild(empty);
      return;
    }
    items.forEach((it) => {
      const card = document.createElement('div');
      card.className = 'discount-card';
      if (it.image) {
        const img = document.createElement('img');
        img.className = 'discount-card__img';
        img.src = it.image;
        img.alt = '';
        img.loading = 'lazy';
        img.draggable = false;
        card.appendChild(img);
      }
      const pct = formatPercent(it.percent);
      if (pct) {
        const p = document.createElement('div');
        p.className = 'discount-card__percent';
        p.textContent = pct;
        card.appendChild(p);
      }
      const cap = discountCaption(it, currentLanguage);
      if (cap) {
        const c = document.createElement('div');
        c.className = 'discount-card__caption';
        c.textContent = cap;
        card.appendChild(c);
      }
      grid.appendChild(card);
    });
  }

  function renderAdminDiscountsList() {
    if (!adminDiscountsList) return;
    if (!adminEditLang) adminEditLang = "ru";
    adminDiscountsList.innerHTML = '';
    const items = Array.isArray(discountsData) ? discountsData : [];
    items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'admin-discount-row';
      row.dataset.index = String(index);

      const media = document.createElement('div');
      media.className = 'admin-project-media';
      const preview = document.createElement('div');
      preview.className = 'admin-project-preview';
      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        preview.appendChild(img);
      } else {
        preview.textContent = 'нет фото';
      }
      const imgBtn = document.createElement('button');
      imgBtn.type = 'button';
      imgBtn.className = 'admin-button admin-button--secondary';
      imgBtn.textContent = item.image ? 'Заменить фото' : 'Загрузить фото';
      imgBtn.addEventListener('click', () => pickDiscountImage(index));
      media.appendChild(preview);
      media.appendChild(imgBtn);

      const fields = document.createElement('div');
      fields.className = 'admin-project-fields';

      const pctLabel = document.createElement('label');
      pctLabel.textContent = 'Скидка (напр. 20%)';
      const pctInput = document.createElement('input');
      pctInput.type = 'text';
      pctInput.className = 'admin-discount-percent';
      pctInput.value = item.percent != null ? String(item.percent) : '';

      const capLabel = document.createElement('label');
      capLabel.textContent = 'Подпись (' + adminEditLang.toUpperCase() + ')';
      const capInput = document.createElement('textarea');
      capInput.className = 'admin-discount-caption';
      capInput.rows = 2;
      capInput.value = (item.caption && typeof item.caption === 'object') ? (item.caption[adminEditLang] || '') : (item.caption || '');

      fields.appendChild(pctLabel);
      fields.appendChild(pctInput);
      fields.appendChild(capLabel);
      fields.appendChild(capInput);

      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'admin-button admin-button--secondary admin-project-remove';
      rm.textContent = 'Удалить скидку';
      rm.addEventListener('click', () => {
        discountsData = collectAdminDiscounts();
        discountsData.splice(index, 1);
        renderAdminDiscountsList();
      });

      row.appendChild(media);
      row.appendChild(fields);
      row.appendChild(rm);
      adminDiscountsList.appendChild(row);
    });
  }

  function collectAdminDiscounts() {
    if (!adminDiscountsList) return Array.isArray(discountsData) ? discountsData : [];
    const editLang = adminEditLang || currentLanguage;
    const out = [];
    adminDiscountsList.querySelectorAll('.admin-discount-row').forEach((row) => {
      const index = parseInt(row.dataset.index, 10);
      const existing = (Array.isArray(discountsData) && discountsData[index]) ? discountsData[index] : {};
      const percent = row.querySelector('.admin-discount-percent')?.value.trim() || '';
      const capValue = row.querySelector('.admin-discount-caption')?.value.trim() || '';
      const caption = (existing.caption && typeof existing.caption === 'object') ? { ...existing.caption } : {};
      caption[editLang] = capValue;
      out.push({ image: existing.image || '', percent, caption });
    });
    return out;
  }

  let pendingDiscountImageIndex = null;
  function pickDiscountImage(index) {
    pendingDiscountImageIndex = index;
    if (adminGalleryFileInput) {
      adminGalleryFileInput.dataset.mode = 'discount';
      adminGalleryFileInput.value = '';
      adminGalleryFileInput.click();
    }
  }

  /* =====================================================================
   * ЭКСПОРТ / ИМПОРТ всего редактируемого контента (перенос между устройствами)
   * ===================================================================== */
  // Ключи localStorage, которые относятся к контенту (без паролей и настроек публикации).
  const CONTENT_KEYS = [
    'galleryItems', 'galleryFilters', 'customTexts', 'projects', 'socialLinks',
    'adminHeaderImage', 'adminLeftSidebar', 'adminRightSidebar', 'watermark',
    'orderImages', 'collabImages', 'contactLinks', 'discounts', 'colleagueUrl', 'ordersOpen',
  ];

  // Собрать весь контент в один объект (строки, как в localStorage)
  function buildContentPayload() {
    const data = { _format: 'podvalnia-portfolio', _version: 1 };
    CONTENT_KEYS.forEach((k) => {
      const v = localStorage.getItem(k);
      if (v != null) data[k] = v;
    });
    return data;
  }

  // Применить контент из объекта в localStorage и перерисовать страницу
  function applyContentPayload(data, { repopulateAdmin } = {}) {
    if (!data || data._format !== 'podvalnia-portfolio') return false;
    // Опубликованный/импортированный контент — источник истины: что есть — пишем,
    // чего нет (например старый content.json без прайса/контактов) — убираем, чтобы
    // не оставался устаревший контент поверх «опубликованного».
    CONTENT_KEYS.forEach((k) => {
      if (typeof data[k] === 'string') localStorage.setItem(k, data[k]);
      else localStorage.removeItem(k);
    });
    galleryItems = loadGalleryItems();
    projectsData = loadProjects();
    discountsData = loadDiscounts();
    const ct = JSON.parse(localStorage.getItem('customTexts') || '{}');
    Object.keys(customTextStore).forEach((k) => delete customTextStore[k]);
    Object.assign(customTextStore, ct);
    applyAdminImages();
    resetGalleryRotation();
    applyTranslations();
    renderSocialLinks();
    renderProjectsFeed();
    renderSectionImagesPublic();
    if (repopulateAdmin) {
      // Загрузка копии из файла — это новые правки, которых ещё нет на сайте
      markContentDirty();
      populateAdminForm();
    } else {
      // Применили то, что реально опубликовано — значит расхождения нет
      markContentPublished();
    }
    return true;
  }

  function exportContent() {
    // Сначала зафиксируем текущие правки админки, чтобы экспорт был актуальным
    try { saveAdminSettings(false); } catch (e) { console.warn('pre-export save failed', e); }
    const data = buildContentPayload();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    markContentExported();
  }

  function handleImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result.toString());
        if (!applyContentPayload(data, { repopulateAdmin: true })) {
          alert('Это не файл контента сайта (content.json).');
          return;
        }
        alert('Контент загружен.');
      } catch (e) {
        console.warn('import failed', e);
        alert('Не удалось прочитать файл.');
      } finally {
        if (adminImportInput) adminImportInput.value = '';
      }
    };
    reader.readAsText(file);
  }

  /* =====================================================================
   * ПУБЛИКАЦИЯ НА САЙТ через GitHub Contents API.
   * Пишем content.json в репозиторий по личному токену. Сайт при загрузке
   * читает этот content.json — поэтому изменения видят ВСЕ устройства.
   * Токен хранится только в localStorage этого браузера и в код сайта не попадает.
   * ===================================================================== */
  const GH_CFG_KEY = 'ghPublishConfig';
  function loadGhConfig() {
    try { return JSON.parse(localStorage.getItem(GH_CFG_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveGhConfig(cfg) {
    try { localStorage.setItem(GH_CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
  }
  function setPublishStatus(msg, kind) {
    const el = document.getElementById('adminPublishStatus');
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'admin-publish-status' + (kind ? ' is-' + kind : '');
  }
  // base64 для UTF-8 строки (btoa не умеет кириллицу напрямую)
  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  async function publishToGitHub() {
    // Сохраняем текущие правки перед публикацией
    try { saveAdminSettings(false); } catch (e) {}
    const owner = document.getElementById('adminGhOwner')?.value.trim();
    const repo = document.getElementById('adminGhRepo')?.value.trim();
    const branch = (document.getElementById('adminGhBranch')?.value.trim()) || 'main';
    const token = document.getElementById('adminGhToken')?.value.trim();
    if (!owner || !repo || !token) {
      setPublishStatus('Заполните владельца, репозиторий и токен.', 'error');
      return;
    }
    // Сохраняем настройки (кроме токена показываем, токен тоже храним локально)
    saveGhConfig({ owner, repo, branch, token });

    const path = 'content.json';
    const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const payload = JSON.stringify(buildContentPayload(), null, 2);
    const headers = {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/vnd.github+json',
    };

    setPublishStatus('Публикую…', 'info');
    try {
      // 1) узнаём текущий SHA файла (если он уже есть)
      let sha = undefined;
      const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
      if (getRes.status === 200) {
        const cur = await getRes.json();
        sha = cur.sha;
      } else if (getRes.status === 401) {
        setPublishStatus('Неверный токен (401). Проверьте токен и его права.', 'error');
        return;
      } else if (getRes.status === 404) {
        // файла ещё нет или репозиторий/ветка не найдены — попробуем создать
        sha = undefined;
      }
      // 2) PUT — создаём/обновляем файл
      const body = {
        message: 'Обновление контента сайта через админку',
        content: utf8ToBase64(payload),
        branch,
      };
      if (sha) body.sha = sha;
      const putRes = await fetch(apiBase, { method: 'PUT', headers, body: JSON.stringify(body) });
      if (putRes.ok) {
        setPublishStatus('Опубликовано! Сайт обновится у всех за 1–2 минуты.', 'success');
        markContentPublished();
      } else {
        const err = await putRes.json().catch(() => ({}));
        setPublishStatus('Ошибка GitHub (' + putRes.status + '): ' + (err.message || 'см. консоль'), 'error');
        console.warn('GitHub publish error', putRes.status, err);
      }
    } catch (e) {
      console.warn('publish failed', e);
      setPublishStatus('Сбой сети при публикации.', 'error');
    }
  }

  // При загрузке страницы тянем опубликованный content.json из репозитория.
  // Это источник истины для всех посетителей. Своя локальная админка не трогается:
  // опубликованный контент применяем поверх localStorage только для отображения.
  async function loadPublishedContent() {
    try {
      // На устройстве ВЛАДЕЛЬЦА (где сохранён токен публикации) НЕ тянем опубликованный
      // content.json — иначе он перетёр бы локальную админку и несохранённые правки.
      // Посетители (без токена) всегда видят свежий опубликованный контент.
      const gh = loadGhConfig();
      if (gh && gh.token) return false;
      // Если в этом браузере есть правки, которых ещё нет на сайте, — не затираем их
      // опубликованной версией. Иначе перезагрузка страницы молча уничтожала бы
      // несохранённую работу того, кто публикует вручную (без токена).
      if (isContentDirty()) {
        refreshDirtyIndicator();
        return false;
      }
      // относительный путь — рядом с index.html в том же репозитории
      const res = await fetch('content.json?ts=' + (window.__cacheBust || ''), { cache: 'no-store' });
      if (!res.ok) return false;
      const data = await res.json();
      return applyContentPayload(data, { repopulateAdmin: false });
    } catch (e) {
      // нет файла или оффлайн — просто используем встроенный контент
      return false;
    }
  }

  function populateGhFields() {
    const cfg = loadGhConfig();
    const o = document.getElementById('adminGhOwner');
    const r = document.getElementById('adminGhRepo');
    const b = document.getElementById('adminGhBranch');
    const t = document.getElementById('adminGhToken');
    if (o) o.value = cfg.owner || '';
    if (r) r.value = cfg.repo || '';
    if (b) b.value = cfg.branch || 'main';
    if (t) t.value = cfg.token || '';
  }

  function slugifyFilterLabel(label) {
    return String(label)
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\d]+/gu, "-")
      .replace(/^-+|-+$/g, "");
  }

  function createUniqueFilterKey(label, existingKeys) {
    const base = slugifyFilterLabel(label) || "filter";
    let key = base;
    let suffix = 1;
    while (existingKeys.has(key)) {
      key = `${base}-${suffix}`;
      suffix += 1;
    }
    existingKeys.add(key);
    return key;
  }

  // Собираем фильтры из редактора: на каждый фильтр — название на всех языках.
  // base (русское или первое непустое) идёт в galleryFilters.label, а полная карта
  // labels уходит в customTexts[lang][filter_<key>] при сохранении (saveAdminSettings).
  function collectAdminFilterSettings() {
    if (!adminFilterEditor) return [];
    const filters = [];
    const keys = new Set();
    adminFilterEditor.querySelectorAll(".admin-filter-chip").forEach((chip) => {
      const labels = {};
      chip.querySelectorAll(".admin-filter-input[data-filter-lang]").forEach((input) => {
        labels[input.dataset.filterLang] = input.value.trim();
      });
      const base = labels.ru || SUPPORTED_LANGS.map((l) => labels[l]).find(Boolean) || "";
      if (!base) return; // пустая карточка — пропускаем
      let key = chip.dataset.filterKey || "";
      const primary = chip.dataset.filterPrimary === "true";
      if (!key || keys.has(key)) {
        key = createUniqueFilterKey(base, keys);
      } else {
        keys.add(key);
      }
      filters.push({ key, label: base, primary, labels });
    });
    return filters;
  }

  // Человекочитаемые названия языков для подписей в редакторе фильтров
  const FILTER_LANG_NAMES = { ru: "Русский", en: "English", es: "Español", zh: "中文", ko: "한국어" };

  // Карточка одного фильтра: поля названия СРАЗУ на всех языках (ru/en/es/zh/ko).
  // Существующие переводы подставляются автоматически; для нового фильтра поля пустые.
  function buildAdminFilterChip(filter) {
    const key = filter.key || "";
    const chip = document.createElement("div");
    chip.className = "admin-filter-chip";
    chip.dataset.filterKey = key;
    chip.dataset.filterPrimary = filter.primary ? "true" : "false";

    const head = document.createElement("div");
    head.className = "admin-filter-chip__head";
    const title = document.createElement("span");
    title.className = "admin-filter-chip__title";
    title.textContent = key ? `Фильтр: ${filter.label || key}` : "Новый фильтр";
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "admin-button admin-button--secondary admin-filter-delete";
    deleteBtn.textContent = "Удалить";
    deleteBtn.addEventListener("click", () => chip.remove());
    head.appendChild(title);
    head.appendChild(deleteBtn);
    chip.appendChild(head);

    const langWrap = document.createElement("div");
    langWrap.className = "admin-filter-langs";
    SUPPORTED_LANGS.forEach((lang) => {
      const fk = `filter_${key}`;
      const seeded = key
        ? ((customTextStore[lang] && customTextStore[lang][fk]) ||
           (translations[lang] && translations[lang][fk]) ||
           (lang === "ru" ? (filter.label || "") : ""))
        : "";
      const row = document.createElement("label");
      row.className = "admin-filter-lang-row";
      const cap = document.createElement("span");
      cap.className = "admin-filter-lang-name";
      cap.textContent = FILTER_LANG_NAMES[lang] || lang;
      const input = document.createElement("input");
      input.type = "text";
      input.className = "admin-filter-input";
      input.dataset.filterLang = lang;
      input.value = seeded;
      input.placeholder = lang === "ru" ? "Название фильтра" : FILTER_LANG_NAMES[lang];
      row.appendChild(cap);
      row.appendChild(input);
      langWrap.appendChild(row);
    });
    chip.appendChild(langWrap);

    // Заголовок карточки следует за русским названием (удобно для новых фильтров)
    const ruInput = langWrap.querySelector('input[data-filter-lang="ru"]');
    if (ruInput) {
      ruInput.addEventListener("input", () => {
        const v = ruInput.value.trim();
        title.textContent = v ? `Фильтр: ${v}` : (key ? `Фильтр: ${key}` : "Новый фильтр");
      });
    }

    return chip;
  }

  function renderAdminFilterEditor() {
    if (!adminFilterEditor) return;
    const filters = loadFilterSettings();
    adminFilterEditor.innerHTML = "";

    const primaryGroup = document.createElement("div");
    primaryGroup.className = "admin-filter-group";
    const primaryTitle = document.createElement("div");
    primaryTitle.className = "admin-filter-group__title";
    primaryTitle.textContent = "Основные фильтры (большие, верхняя строка)";
    const primaryList = document.createElement("div");
    primaryList.className = "admin-filter-chip-list";
    primaryGroup.appendChild(primaryTitle);
    primaryGroup.appendChild(primaryList);

    const secondaryGroup = document.createElement("div");
    secondaryGroup.className = "admin-filter-group";
    const secondaryTitle = document.createElement("div");
    secondaryTitle.className = "admin-filter-group__title";
    secondaryTitle.textContent = "Дополнительные фильтры (малые, нижняя строка)";
    const secondaryList = document.createElement("div");
    secondaryList.className = "admin-filter-chip-list";
    secondaryGroup.appendChild(secondaryTitle);
    secondaryGroup.appendChild(secondaryList);

    filters.forEach((filter) => {
      const chip = buildAdminFilterChip(filter);
      (filter.primary ? primaryList : secondaryList).appendChild(chip);
    });

    adminFilterEditor.appendChild(primaryGroup);
    adminFilterEditor.appendChild(secondaryGroup);
    renderAdminGalleryFilterSelectors();
  }

  // Новая карточка фильтра добавляется прямо в редактор (без записи в localStorage):
  // вписываете название на всех языках и затем «Применить»/«Сохранить».
  function addAdminFilter(primary) {
    if (!adminFilterEditor) return;
    const lists = adminFilterEditor.querySelectorAll(".admin-filter-chip-list");
    const targetList = primary ? lists[0] : lists[1];
    if (!targetList) {
      renderAdminFilterEditor();
      return;
    }
    const chip = buildAdminFilterChip({ key: "", label: "", primary });
    targetList.appendChild(chip);
    const ruInput = chip.querySelector('input[data-filter-lang="ru"]');
    if (ruInput) ruInput.focus();
    chip.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function getAdminSelectedGalleryFilters() {
    if (!adminGalleryFilterSelectors) return [];
    return Array.from(adminGalleryFilterSelectors.querySelectorAll('input[type="checkbox"]'))
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.dataset.filterKey)
      .filter(Boolean);
  }

  function renderAdminGalleryFilterSelectors() {
    if (!adminGalleryFilterSelectors) return;
    const filters = loadFilterSettings().filter((filter) => filter.key !== 'all');
    adminGalleryFilterSelectors.innerHTML = '';
    if (!filters.length) {
      adminGalleryFilterSelectors.textContent = 'Добавьте фильтры, чтобы назначать их работам.';
      return;
    }
    const selectorWrap = document.createElement('div');
    selectorWrap.className = 'admin-gallery-filter-selector';
    filters.forEach((filter) => {
      const label = document.createElement('label');
      label.className = 'admin-gallery-filter-option';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.dataset.filterKey = filter.key;
      checkbox.checked = false;
      const span = document.createElement('span');
      span.textContent = getText(`filter_${filter.key}`) || filter.label || filter.key;
      label.appendChild(checkbox);
      label.appendChild(span);
      selectorWrap.appendChild(label);
    });
    adminGalleryFilterSelectors.appendChild(selectorWrap);
  }

  function updateGalleryItemTags(index, tags) {
    galleryItems[index].tags = tags.join(' ').trim();
    renderAdminGalleryList();
  }

  function renderAdminGalleryList() {
    if (!adminGalleryList) return;
    adminGalleryList.innerHTML = "";

    galleryItems.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "admin-gallery-row";

      const preview = document.createElement("div");
      preview.className = "admin-gallery-preview";
      const previewImage = document.createElement("img");
      previewImage.src = item.image || "";
      previewImage.alt = item.alt || "preview";
      preview.appendChild(previewImage);

      const fields = document.createElement("div");
      fields.className = "admin-gallery-fields";

      const altInput = document.createElement("input");
      altInput.type = "text";
      altInput.value = item.alt || "";
      altInput.placeholder = "Alt / описание";
      altInput.addEventListener("input", () => {
        galleryItems[index].alt = altInput.value.trim();
      });

      const imageInput = document.createElement("input");
      imageInput.type = "text";
      imageInput.value = item.image || "";
      imageInput.placeholder = "URL изображения или Data URL";
      imageInput.addEventListener("input", () => {
        galleryItems[index].image = imageInput.value.trim();
      });

      const tagsContainer = document.createElement('div');
      tagsContainer.className = 'admin-gallery-tags';
      const assignedTags = (item.tags || '').split(' ').filter(Boolean);
      const availableFilters = loadFilterSettings().filter((filter) => filter.key !== 'all');

      assignedTags.forEach((tag) => {
        const filterInfo = availableFilters.find((filter) => filter.key === tag);
        const tagRow = document.createElement('div');
        tagRow.className = 'admin-gallery-tag';
        tagRow.dataset.filterKey = tag;
        tagRow.textContent = filterInfo ? filterInfo.label : tag;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'admin-button admin-button--secondary admin-gallery-tag-remove';
        remove.textContent = '×';
        remove.addEventListener('click', () => {
          const newTags = assignedTags.filter((existing) => existing !== tag);
          updateGalleryItemTags(index, newTags);
        });
        tagRow.appendChild(remove);
        tagsContainer.appendChild(tagRow);
      });

      const tagSelect = document.createElement('select');
      tagSelect.className = 'admin-gallery-tag-select';
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Добавить фильтр';
      tagSelect.appendChild(defaultOption);
      availableFilters
        .filter((filter) => !assignedTags.includes(filter.key))
        .forEach((filter) => {
          const option = document.createElement('option');
          option.value = filter.key;
          option.textContent = getText(`filter_${filter.key}`) || filter.label || filter.key;
          tagSelect.appendChild(option);
        });
      const addTagButton = document.createElement('button');
      addTagButton.type = 'button';
      addTagButton.className = 'admin-button admin-gallery-tag-add';
      addTagButton.textContent = '+';
      addTagButton.addEventListener('click', () => {
        const selected = tagSelect.value;
        if (!selected) return;
        const nextTags = [...assignedTags, selected];
        updateGalleryItemTags(index, nextTags);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "admin-button admin-button--secondary admin-gallery-delete";
      deleteBtn.textContent = "Удалить";
      deleteBtn.addEventListener("click", () => {
        galleryItems.splice(index, 1);
        renderAdminGalleryList();
      });

      fields.appendChild(imageInput);
      fields.appendChild(altInput);
      fields.appendChild(tagsContainer);
      fields.appendChild(tagSelect);
      fields.appendChild(addTagButton);
      fields.appendChild(deleteBtn);

      row.appendChild(preview);
      row.appendChild(fields);
      adminGalleryList.appendChild(row);
    });

    if (galleryItems.length === 0) {
      const empty = document.createElement("div");
      empty.className = "admin-gallery-empty";
      empty.textContent = "Нет записей. Добавьте элементы галереи ниже.";
      adminGalleryList.appendChild(empty);
    }
  }

  function collectAdminGalleryData() {
    if (!adminGalleryList) return galleryItems;
    const rows = Array.from(adminGalleryList.querySelectorAll(".admin-gallery-row"));
    return rows.map((row) => {
      const inputs = row.querySelectorAll("input");
      const tagKeys = Array.from(row.querySelectorAll('.admin-gallery-tag'))
        .map((tagEl) => tagEl.dataset.filterKey)
        .filter(Boolean);
      return {
        image: inputs[0]?.value.trim() || "",
        alt: inputs[1]?.value.trim() || "",
        tags: tagKeys.join(' '),
      };
    });
  }

  function addAdminGalleryItem() {
    const selectedFilters = getAdminSelectedGalleryFilters();
    if (!selectedFilters.length) {
      alert('Выберите хотя бы один фильтр для новой работы.');
      return;
    }
    if (adminGalleryFileInput) {
      adminGalleryFileInput.dataset.mode = 'gallery';
      adminGalleryFileInput.value = '';
      adminGalleryFileInput.click();
    }
  }

  function handleAdminGalleryFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const mode = adminGalleryFileInput?.dataset.mode || 'gallery';
    const resetInput = () => {
      if (adminGalleryFileInput) { adminGalleryFileInput.value = ''; adminGalleryFileInput.dataset.mode = 'gallery'; }
    };

    // Режим «проект»: вставляем картинку в выбранный пост (со сжатием)
    if (mode === 'project') {
      compressImageFile(file, 1280, 0.82).then((dataUrl) => {
        // зафиксируем текущие правки постов, затем подставим картинку
        projectsData = collectAdminProjects();
        const idx = pendingProjectImageIndex;
        if (idx != null && projectsData[idx]) {
          projectsData[idx].image = dataUrl;
        }
        pendingProjectImageIndex = null;
        resetInput();
        renderAdminProjectsList();
      }).catch((e) => { console.warn('project image failed', e); resetInput(); });
      return;
    }

    // Режим «скидка»: маленькая картинка к скидке (сильнее сжимаем — она небольшая)
    if (mode === 'discount') {
      compressImageFile(file, 800, 0.82).then((dataUrl) => {
        discountsData = collectAdminDiscounts();
        const idx = pendingDiscountImageIndex;
        if (idx != null && discountsData[idx]) {
          discountsData[idx].image = dataUrl;
        }
        pendingDiscountImageIndex = null;
        resetInput();
        renderAdminDiscountsList();
      }).catch((e) => { console.warn('discount image failed', e); resetInput(); });
      return;
    }

    // Режимы «примеры работ» в блоках Заказать/Сотрудничество (до 6, сразу в localStorage)
    if (mode === 'orderImages' || mode === 'collabImages') {
      const storageKey = mode;
      compressImageFile(file, 1600, 0.84).then((dataUrl) => {
        const arr = loadSectionImages(storageKey);
        if (arr.length >= 6) { alert('Можно добавить максимум 6 изображений.'); resetInput(); return; }
        arr.push({ image: dataUrl, alt: file.name });
        localStorage.setItem(storageKey, JSON.stringify(arr));
        markContentDirty();
        resetInput();
        renderAdminSectionImagesAll();
        renderSectionImagesPublic();
      }).catch((e) => { console.warn('section image failed', e); resetInput(); });
      return;
    }

    // Режим «галерея» (со сжатием)
    const selectedFilters = getAdminSelectedGalleryFilters();
    compressImageFile(file, 1280, 0.82).then((dataUrl) => {
      galleryItems.push({
        image: dataUrl,
        alt: file.name,
        tags: selectedFilters.join(' '),
      });
      renderAdminGalleryList();
      resetInput();
    }).catch((e) => { console.warn('gallery image failed', e); resetInput(); });
  }

  function playTitleEffects() {
    if (!heroTitle || !heroWrap) return;
    heroTitle.classList.add("title-animate");
    const sparks = 12;
    for (let i = 0; i < sparks; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      const tx = Math.floor(Math.random() * 260 - 130) + "px";
      const ty = Math.floor(-Math.random() * 160 - 20) + "px";
      const delay = Math.floor(Math.random() * 220) + "ms";
      s.style.setProperty("--tx", tx);
      s.style.setProperty("--ty", ty);
      s.style.setProperty("--delay", delay);
      heroWrap.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
    if (bird) {
      bird.classList.add("fly");
    }
  }

  /* =====================================================================
   * ЗАЩИТА КОНТЕНТА (затруднение копирования — не абсолютная защита).
   * Любое изображение, видимое в браузере, физически уже на устройстве
   * пользователя; полностью запретить скачивание на статическом сайте
   * нельзя. Эти меры отсекают случайное/ленивое копирование.
   * ===================================================================== */
  function loadWatermarkSettings() {
    try {
      const stored = JSON.parse(localStorage.getItem("watermark") || "{}");
      return { enabled: Boolean(stored.enabled), text: (stored.text || "").trim() };
    } catch (e) {
      return { enabled: false, text: "" };
    }
  }

  const copyToast = document.getElementById("copyToast");
  let copyToastTimer = null;
  function showCopyToast() {
    if (!copyToast) return;
    copyToast.textContent = getText("copy_warning") || "Работы защищены авторским правом.";
    copyToast.classList.add("is-visible");
    clearTimeout(copyToastTimer);
    copyToastTimer = setTimeout(() => copyToast.classList.remove("is-visible"), 2600);
  }

  // Разрешаем нормальную работу в полях ввода и в админке (иначе нельзя печатать/копировать в формах)
  function isEditableTarget(target) {
    if (!target) return false;
    const tag = (target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (target.isContentEditable) return true;
    if (target.closest && target.closest(".admin-modal, .password-modal")) return true;
    return false;
  }

  function initContentProtection() {
    // Контекстное меню — блокируем только на изображениях/карточках галереи и фонах
    document.addEventListener("contextmenu", (ev) => {
      if (isEditableTarget(ev.target)) return;
      const onProtected = ev.target.closest && ev.target.closest(".art-card, .side-panel, .hero-section");
      if (onProtected) {
        ev.preventDefault();
        showCopyToast();
      }
    });

    // Запрет перетаскивания изображений
    document.addEventListener("dragstart", (ev) => {
      if (ev.target && ev.target.tagName === "IMG") {
        ev.preventDefault();
      }
    });

    // Копирование вне полей ввода — показываем предупреждение
    document.addEventListener("copy", (ev) => {
      if (isEditableTarget(ev.target)) return;
      showCopyToast();
    });

    // Горячие клавиши: Ctrl/Cmd+S (сохранить), Ctrl+U (исходник), Ctrl+C вне полей, F12
    document.addEventListener("keydown", (ev) => {
      const key = (ev.key || "").toLowerCase();
      const ctrl = ev.ctrlKey || ev.metaKey;
      if (key === "f12") {
        ev.preventDefault();
        showCopyToast();
        return;
      }
      if (ctrl && (key === "s" || key === "u")) {
        ev.preventDefault();
        showCopyToast();
        return;
      }
      if (ctrl && key === "c" && !isEditableTarget(ev.target)) {
        ev.preventDefault();
        showCopyToast();
      }
    });
  }

  /* =====================================================================
   * ТЕМА (светлая / тёмная)
   * ===================================================================== */
  function getStoredTheme() {
    // По умолчанию — светлая тёплая палитра (как в прошлой версии). Тёмная только если
    // её явно выбрали кнопкой. Системную тёмную не навязываем.
    return localStorage.getItem("siteTheme") === "dark" ? "dark" : "light";
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#1a120b" : "#f5c56a");
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }
  function toggleTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("siteTheme", next);
    applyTheme(next);
  }

  // Водяной знак (защита контента) — настройки в админке
  const adminWatermarkEnabled = document.getElementById("adminWatermarkEnabled");
  const adminWatermarkText = document.getElementById("adminWatermarkText");

  function populateWatermarkFields() {
    const wm = loadWatermarkSettings();
    if (adminWatermarkEnabled) adminWatermarkEnabled.checked = wm.enabled;
    if (adminWatermarkText) adminWatermarkText.value = wm.text;
  }
  // Статус приёма заказов (флажок в админке)
  const adminOrdersOpen = document.getElementById('adminOrdersOpen');
  function populateOrdersOpenField() {
    if (adminOrdersOpen) adminOrdersOpen.checked = isOrdersOpen();
  }
  function saveOrdersOpen() {
    if (!adminOrdersOpen) return;
    try { localStorage.setItem('ordersOpen', adminOrdersOpen.checked ? '1' : '0'); } catch (e) {}
  }

  function saveWatermarkSettings() {
    const wm = {
      enabled: adminWatermarkEnabled ? adminWatermarkEnabled.checked : false,
      text: adminWatermarkText ? adminWatermarkText.value.trim() : "",
    };
    localStorage.setItem("watermark", JSON.stringify(wm));
  }

  // Event listeners
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang;
      setLanguage(lang);
    });
  });

  // Lightbox: закрытие по кнопке, клику по фону и Esc
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (ev) => {
      // закрываем при клике по фону, но не по самой картинке
      if (ev.target === lightbox || ev.target.classList.contains("lightbox__stage")) closeLightbox();
    });
  }
  // Листание работ: кнопки, клавиши ← → и свайп на телефоне
  const lightboxPrevBtn = document.getElementById('lightboxPrev');
  const lightboxNextBtn = document.getElementById('lightboxNext');
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', (ev) => { ev.stopPropagation(); lightboxStep(-1); });
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', (ev) => { ev.stopPropagation(); lightboxStep(1); });

  if (lightbox) {
    let touchX = null, touchY = null;
    lightbox.addEventListener('touchstart', (ev) => {
      if (ev.touches.length !== 1) { touchX = null; return; }
      touchX = ev.touches[0].clientX;
      touchY = ev.touches[0].clientY;
    }, { passive: true });
    lightbox.addEventListener('touchend', (ev) => {
      if (touchX === null || !ev.changedTouches.length) return;
      const dx = ev.changedTouches[0].clientX - touchX;
      const dy = ev.changedTouches[0].clientY - touchY;
      // горизонтальный жест длиннее 50px и явно не вертикальный
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) lightboxStep(dx < 0 ? 1 : -1);
      touchX = null;
    }, { passive: true });
  }

  document.addEventListener("keydown", (ev) => {
    const open = lightbox && !lightbox.classList.contains("hidden");
    if (!open) return;
    if (ev.key === "Escape") { closeLightbox(); return; }
    if (ev.key === "ArrowLeft") { ev.preventDefault(); lightboxStep(-1); }
    if (ev.key === "ArrowRight") { ev.preventDefault(); lightboxStep(1); }
  });

  // Тема
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Переключатель языка
  if (langToggle) {
    langToggle.addEventListener("click", (ev) => {
      ev.stopPropagation();
      toggleLangMenu();
    });
  }
  if (langMenu) {
    langMenu.querySelectorAll("li[data-lang]").forEach((li) => {
      li.addEventListener("click", () => {
        setLanguage(li.dataset.lang);
        closeLangMenu();
      });
    });
  }
  // Закрытие меню по клику вне и по Esc
  document.addEventListener("click", (ev) => {
    if (langSwitcher && !langSwitcher.contains(ev.target)) closeLangMenu();
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") closeLangMenu();
  });

  // Тулбар фильтров: режим AND/OR + очистка
  filterModeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterMatchMode = btn.dataset.mode === "all" ? "all" : "any";
      localStorage.setItem("filterMatchMode", filterMatchMode);
      filterModeBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      updateFilterToolbar();
      resetGalleryRotation();
    });
  });
  if (filterClearBtn) {
    filterClearBtn.addEventListener("click", clearAllFilters);
  }

  // Кнопки «Скопировать шаблон» (заказ / сотрудничество)
  const orderCopyBtn = document.getElementById('orderCopyBtn');
  const orderCopyStatus = document.getElementById('orderCopyStatus');
  if (orderCopyBtn) {
    orderCopyBtn.addEventListener('click', () => copyTemplate('order_template', orderCopyStatus));
  }
  const collabCopyBtn = document.getElementById('collabCopyBtn');
  const collabCopyStatus = document.getElementById('collabCopyStatus');
  if (collabCopyBtn) {
    collabCopyBtn.addEventListener('click', () => copyTemplate('collab_template', collabCopyStatus));
  }

  // Админка: «Добавить изображение» в блоки Заказать/Сотрудничество (до 6)
  if (adminAddOrderImage) {
    adminAddOrderImage.addEventListener('click', () => openSectionImagePicker('orderImages'));
  }
  if (adminAddCollabImage) {
    adminAddCollabImage.addEventListener('click', () => openSectionImagePicker('collabImages'));
  }

  if (adminHeaderImageBtn) {
    adminHeaderImageBtn.addEventListener("click", () => {
      if (adminHeaderImageInput) adminHeaderImageInput.click();
    });
  }

  if (adminHeaderImageInput) {
    adminHeaderImageInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file, 'header', 'adminHeaderImagePreview', 'adminHeaderImage');
      }
    });
  }

  if (adminLeftSidebarImageBtn) {
    adminLeftSidebarImageBtn.addEventListener("click", () => {
      if (adminLeftSidebarImageInput) adminLeftSidebarImageInput.click();
    });
  }

  if (adminLeftSidebarImageInput) {
    adminLeftSidebarImageInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file, 'left', 'adminLeftSidebarImagePreview', 'adminLeftSidebar');
      }
    });
  }

  if (adminRightSidebarImageBtn) {
    adminRightSidebarImageBtn.addEventListener("click", () => {
      if (adminRightSidebarImageInput) adminRightSidebarImageInput.click();
    });
  }

  if (adminRightSidebarImageInput) {
    adminRightSidebarImageInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file, 'right', 'adminRightSidebarImagePreview', 'adminRightSidebar');
      }
    });
  }

  if (adminAddPrimaryFilter) {
    adminAddPrimaryFilter.addEventListener("click", () => addAdminFilter(true));
  }

  if (adminAddSecondaryFilter) {
    adminAddSecondaryFilter.addEventListener("click", () => addAdminFilter(false));
  }

  if (adminAddGalleryItem) {
    adminAddGalleryItem.addEventListener("click", addAdminGalleryItem);
  }

  if (adminGalleryFileInput) {
    adminGalleryFileInput.addEventListener('change', handleAdminGalleryFileSelect);
  }

  // Переключение языка в редакторе текста админки
  if (adminTextLang) {
    adminTextLang.addEventListener('change', () => {
      // Сохраним текущие правки текста и постов перед переключением языка
      const editLang = adminEditLang || "ru";
      const updated = collectAdminTextOverrides();
      if (!customTextStore[editLang]) customTextStore[editLang] = {};
      Object.assign(customTextStore[editLang], updated);
      projectsData = collectAdminProjects();
      discountsData = collectAdminDiscounts();
      adminEditLang = adminTextLang.value;
      renderAdminTextList();
      renderAdminProjectsList();
      renderAdminDiscountsList();
    });
  }

  // Добавить пост в «Мои проекты»
  if (adminAddProject) {
    adminAddProject.addEventListener('click', () => {
      projectsData = collectAdminProjects();
      projectsData.push({ image: '', date: '', caption: {} });
      renderAdminProjectsList();
    });
  }

  if (adminAddDiscount) {
    adminAddDiscount.addEventListener('click', () => {
      discountsData = collectAdminDiscounts();
      discountsData.push({ image: '', percent: '', caption: {} });
      renderAdminDiscountsList();
    });
  }

  // Добавить ячейку соцсети (до 10): новая строка добавляется прямо в редактор,
  // сохраняется при «Применить»/«Сохранить».
  if (adminAddSocial) {
    adminAddSocial.addEventListener('click', () => {
      if (!adminSocialLinks) return;
      const count = adminSocialLinks.querySelectorAll('.admin-social-row').length;
      if (count >= MAX_SOCIAL_LINKS) return;
      const row = buildAdminSocialRow({ label: '', url: '' });
      adminSocialLinks.appendChild(row);
      row.querySelector('.admin-social-label')?.focus();
      updateAddSocialButton();
    });
  }

  // Экспорт всего контента в JSON-файл
  if (adminExport) {
    adminExport.addEventListener('click', exportContent);
  }
  if (adminImport && adminImportInput) {
    adminImport.addEventListener('click', () => adminImportInput.click());
    adminImportInput.addEventListener('change', handleImportFile);
  }
  // Публикация на сайт через GitHub
  const adminPublishBtn = document.getElementById('adminPublish');
  if (adminPublishBtn) {
    adminPublishBtn.addEventListener('click', publishToGitHub);
  }

  try {
    buildFilterButtons();
  } catch (e) {
    console.warn("Filter initialization error", e);
  }

  if (adminUnlock) {
    adminUnlock.addEventListener("click", openAdminPanel);
  }

  // Документированные способы открыть админку: Ctrl+Shift+A или ?admin в адресе.
  document.addEventListener("keydown", (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key || "").toLowerCase() === "a") {
      ev.preventDefault();
      openAdminPanel();
    }
  });
  try {
    if (new URLSearchParams(location.search).has("admin")) openAdminPanel();
  } catch (e) { /* location недоступен — игнорируем */ }

  if (passwordSubmit) {
    passwordSubmit.addEventListener("click", () => {
      const input = adminPasswordInput?.value || "";
      const stored = localStorage.getItem("adminPassword") || "";
      if (input === stored) {
        passwordModal?.classList.add("hidden");
        adminPanel?.classList.remove("hidden");
        populateAdminForm();
        if (adminPasswordInput) adminPasswordInput.value = "";
      } else {
        passwordError?.classList.remove("hidden");
      }
    });
  }

  if (passwordCancel) {
    passwordCancel.addEventListener("click", () => {
      passwordModal.classList.add("hidden");
      if (adminPasswordInput) adminPasswordInput.value = "";
      if (passwordError) passwordError.classList.add("hidden");
    });
  }

  if (adminClose) {
    adminClose.addEventListener("click", () => {
      if (adminFormTouched &&
          !confirm('Вы что-то изменили, но не нажали «Применить» или «Сохранить и закрыть».\nЗакрыть панель и потерять эти правки?')) {
        return;
      }
      adminFormTouched = false;
      closeAdminPanel();
    });
  }

  // Отмечаем, что в форме что-то правили, но ещё не сохранили
  const adminFormEl = document.getElementById('adminForm');
  if (adminFormEl) {
    adminFormEl.addEventListener('input', () => { adminFormTouched = true; });
    adminFormEl.addEventListener('change', () => { adminFormTouched = true; });
  }

  // Предупреждение при закрытии вкладки с несохранёнными правками админки
  window.addEventListener('beforeunload', (ev) => {
    const panelOpen = adminPanel && !adminPanel.classList.contains('hidden');
    if (panelOpen && adminFormTouched) {
      ev.preventDefault();
      ev.returnValue = '';
      return '';
    }
  });

  // «Я загрузил файл» — снимаем напоминание после ручной выгрузки на GitHub
  const adminDirtyDone = document.getElementById('adminDirtyDone');
  if (adminDirtyDone) {
    adminDirtyDone.addEventListener('click', markContentPublished);
  }

  /* =====================================================================
   * КНОПКА «ПОДЕЛИТЬСЯ»
   * На телефоне открывает системное меню «Поделиться», на компьютере
   * просто копирует ссылку на сайт в буфер обмена.
   * ===================================================================== */
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const url = location.href.split('?')[0].split('#')[0];
      const title = getText('hero_title') || 'Podvalnia_alebarda';
      const flash = () => {
        const original = getText('share_btn') || 'Поделиться';
        shareBtn.textContent = getText('share_done') || 'Ссылка скопирована!';
        shareBtn.classList.add('is-done');
        setTimeout(() => {
          shareBtn.textContent = original;
          shareBtn.classList.remove('is-done');
        }, 2000);
      };
      if (navigator.share) {
        try {
          await navigator.share({ title, text: getText('hero_subtitle') || '', url });
          return;
        } catch (e) { /* пользователь закрыл меню — просто копируем */ }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(flash).catch(() => fallbackCopyText(url, flash));
      } else {
        fallbackCopyText(url, flash);
      }
    });
  }

  /* =====================================================================
   * ПЛАВНОЕ ПОЯВЛЕНИЕ БЛОКОВ ПРИ ПРОКРУТКЕ
   * Дёшево: один наблюдатель, класс навешивается один раз и наблюдение
   * снимается — на прокрутке ничего не считается, тормозов не будет.
   * Если у человека включено «уменьшить движение» — эффект не применяем.
   * ===================================================================== */
  (function initScrollReveal() {
    let reduced = false;
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (reduced || !('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll('.info-section, .site-footer .footer-shell');
    if (!targets.length) return;
    targets.forEach((el) => el.classList.add('reveal'));
    const reveal = (el) => { el.classList.add('is-visible'); obs.unobserve(el); };
    // threshold 0 + запас 150px: срабатывает чуть раньше, чем блок доедет до экрана
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) reveal(entry.target); });
    }, { rootMargin: '150px 0px 150px 0px', threshold: 0 });
    targets.forEach((el) => obs.observe(el));

    // Страховка от «перепрыгивания»: если нажать кнопку навигации, страница
    // мгновенно перескакивает через блоки, и наблюдатель их не замечает — они
    // остались бы невидимыми. Поэтому дополнительно проверяем при прокрутке:
    // всё, что уже проехали, показываем. Проверка снимается, как только все
    // блоки раскрыты, так что на прокрутку это не влияет.
    let remaining = Array.prototype.slice.call(targets);
    let scheduled = false;
    const sweep = () => {
      scheduled = false;
      remaining = remaining.filter((el) => {
        if (el.classList.contains('is-visible')) return false;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 150) { reveal(el); return false; }
        return true;
      });
      if (!remaining.length) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    setTimeout(sweep, 1200); // и один раз после загрузки — на случай коротких страниц
  })();

  // «Забыли пароль?» — показать инструкцию по сбросу
  const passwordForgot = document.getElementById('passwordForgot');
  const passwordHint = document.getElementById('passwordHint');
  if (passwordForgot && passwordHint) {
    passwordForgot.addEventListener('click', () => {
      passwordHint.classList.toggle('hidden');
      passwordForgot.textContent = passwordHint.classList.contains('hidden')
        ? 'Забыли пароль?'
        : 'Скрыть подсказку';
    });
  }
  const passwordHintCopy = document.getElementById('passwordHintCopy');
  if (passwordHintCopy) {
    passwordHintCopy.addEventListener('click', () => {
      const code = document.getElementById('passwordHintCode');
      if (!code) return;
      const done = () => {
        passwordHintCopy.textContent = 'Скопировано!';
        setTimeout(() => { passwordHintCopy.textContent = 'Скопировать строку'; }, 1800);
      };
      const text = code.textContent || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopyText(text, done));
      } else {
        fallbackCopyText(text, done);
      }
    });
  }

  // «Сохранить и закрыть» — сохраняет и закрывает панель
  if (adminSave) {
    adminSave.addEventListener("click", () => saveAdminSettings(true));
  }
  // «Применить (предпросмотр)» — сохраняет и сразу показывает на странице, не закрывая панель
  if (adminApply) {
    adminApply.addEventListener("click", () => saveAdminSettings(false));
  }

  if (adminReset) {
    adminReset.addEventListener("click", () => {
      if (!confirm('Сбросить ВЕСЬ контент к стандартному (галерея, фильтры, тексты, проекты, соцсети, картинки шапки и полос, примеры работ, водяной знак)? Это нельзя отменить.\n\nНастройки (пароль, токен публикации) НЕ трогаются.')) return;
      // Чистим именно контентные ключи (без паролей/ключей-настроек).
      ['galleryItems','galleryFilters','customTexts','projects','socialLinks',
       'adminHeaderImage','adminLeftSidebar','adminRightSidebar','watermark',
       'orderImages','collabImages','contactLinks','discounts','colleagueUrl','ordersOpen'].forEach((k) => localStorage.removeItem(k));
      // Возвращаем картинки по умолчанию (как в исходном index.html)
      if (heroBgImage) heroBgImage.src = 'IMG_1858.PNG';
      if (leftSidebarImage) leftSidebarImage.src = 'Полосы.JPG';
      if (rightSidebarImage) rightSidebarImage.src = 'Полосы.JPG';
      galleryItems = loadGalleryItems();
      projectsData = loadProjects();
      discountsData = loadDiscounts();
      Object.keys(customTextStore).forEach((k) => delete customTextStore[k]);
      resetGalleryRotation();
      applyTranslations();
      renderSocialLinks();
      renderProjectsFeed();
      markContentDirty();
      populateAdminForm();
    });
  }

  // Initialize
  applyTheme(getStoredTheme());
  initContentProtection();
  document.documentElement.lang = currentLanguage;
  ensureScriptFont(currentLanguage);
  // Восстановить выбранный режим фильтра (any/all) в тулбаре
  filterModeBtns.forEach((b) => {
    const active = b.dataset.mode === filterMatchMode;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", active ? "true" : "false");
  });

  galleryItems = loadGalleryItems();
  projectsData = loadProjects();
  discountsData = loadDiscounts();
  resetGalleryRotation();
  applyTranslations();
  applyAdminImages();
  renderSectionImagesPublic();
  renderProjectsFeed();
  updateLangSwitcher();

  // Подтягиваем опубликованный контент (content.json в репозитории) — источник истины
  // для всех посетителей. Работает по http(s); на file:// просто пропускается.
  loadPublishedContent().then((ok) => {
    if (ok) {
      // перерисовать всё с опубликованными данными
      buildFilterButtons();
      resetGalleryRotation();
      applyTranslations();
      renderSocialLinks();
      renderProjectsFeed();
      updateLangSwitcher();
    }
  });
  // Плашку выбора языка показываем ТОЛЬКО при первом заходе (язык ещё не выбран).
  // После выбора язык сохраняется в localStorage, и при следующих заходах плашки нет.
  if (!localStorage.getItem("siteLanguage")) {
    showLanguageModal();
    // на первом заходе анимация запустится после выбора языка (в setLanguage)
  } else {
    // на повторных заходах плашки нет — запускаем анимацию заголовка сразу
    playTitleEffects();
  }
});
