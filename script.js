
// ========================================
// MY GLOW UP — MAIN JAVASCRIPT
// ========================================

// 1. SUPABASE CONFIGURATION
// ჩასვი შენი Supabase Project URL და Anon Key.

const SUPABASE_URL = "https://pqwfawkrewwxynueinqt.supabase.co";
const SUPABASE_KEY = "sb_publishable_My5JP1iaSQVU7dbH-I5JtQ_OCVae1xu";
const configured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&

  SUPABASE_KEY &&
  !SUPABASE_KEY.includes("YOUR_");

const db = configured
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

let currentUser = null;
let isRegister = true;
let currentMode = "Daily Mentor";
let currentPage = "dashboard";
let entries = [];
let dailyTasks = [];
let chatHistory = [];

const $ = id => document.getElementById(id);

// 2. MODULE INFORMATION

const modules = {
  profile: ["My Personal Profile","შენი პირადი ინფორმაცია, ინტერესები და ოცნებები.","👤"],
  routine: ["Daily Routine","შენი ყოველდღიური გეგმები და დავალებები.","🌸"],
  goals: ["My Goals","დაისახე მიზნები და მიუახლოვდი მათ პატარა ნაბიჯებით.","🎯"],
  challenges: ["30 Days Challenges","შექმენი კარგი ჩვევები ყოველდღიური გამოწვევებით.","📅"],
  focus: ["Focus Room","კონცენტრაცია და პროდუქტიული სწავლის დრო.","🍅"],
  diary: ["My Diary","შენი პირადი აზრები და ყოველდღიური ჩანაწერები.","📔"],
  reflection: ["Monthly Reflection","შეაჯამე შენი მიღწევები და გამოცდილებები.","🗓️"],
  fashion: ["Fashion & Style AI","აღმოაჩინე შენი პირადი სტილი.","👗"],
  closet: ["My Digital Closet","შეინახე შენი გარდერობის ნივთები.","👚"],
  beauty: ["Beauty & Self-care","შენი თავის მოვლის ყოველდღიური რუტინა.","💄"],
  fitness: ["Healthy Lifestyle","ჯანსაღი ჩვევები, მოძრაობა და დასვენება.","🌿"],
  mindset: ["Mindset & Wellness","თავდაჯერებულობა და ემოციური განვითარება.","🧠"],
  social: ["Social Skills","კომუნიკაცია და თავდაჯერებული საუბარი.","🗣️"],
  discover: ["Discover Yourself","შეისწავლე შენი ინტერესები და ძლიერი მხარეები.","🌷"],
  study: ["Study Assistant","შენი პირადი სასწავლო სივრცე.","📚"],
  english: ["English Corner","ისწავლე ინგლისური ყოველდღიურად.","🇬🇧"],
  reading: ["My Reading Corner","შენი პირადი ციფრული ბიბლიოთეკა.","📖"],
  career: ["Career & Future","დაგეგმე შენი მომავალი პროფესია.","💼"],
  finance: ["Financial Literacy","ისწავლე ფულის მართვა და დაზოგვა.","💰"],
  vision: ["My Dream Life","შექმენი შენი ოცნების ცხოვრების დაფა.","🌈"],
  achievements: ["Achievement Room","შეინახე შენი წარმატებები.","🏆"],
  future: ["Letter to Future Me","დაწერე წერილი შენს მომავალ თავს.","💌"],
  recipes: ["Healthy Recipes","შეაგროვე მარტივი რეცეპტები.","🥗"]
};

const questions = [
  "რა არის ერთი რამ, რაც დღეს ახალი ისწავლე?",
  "რომელი მომენტით ხარ დღეს ყველაზე მეტად კმაყოფილი?",
  "რა გინდა ხვალ უკეთ გააკეთო?",
  "რომელი მიზნისკენ გადადგი დღეს ნაბიჯი?",
  "რა ახალი უნარის განვითარება გინდა?",
  "რა დაგეხმარა დღეს კარგი განწყობის შენარჩუნებაში?",
  "რისთვის ხარ დღეს მადლიერი?",
  "რა გინდა საკუთარ თავს შეახსენო?"
];

const quotes = [
  "Small steps every day lead to beautiful changes.",
  "You are allowed to grow at your own pace.",
  "Consistency creates progress.",
  "Your journey is yours. Enjoy every step.",
  "Believe in your ability to learn and improve."
];

// 3. GENERAL FUNCTIONS

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",
    '"':"&quot;","'":"&#39;"
  })[char]);
}

function getToday() {
  return new Date().toLocaleDateString("ka-GE", {
    weekday:"long", year:"numeric", month:"long", day:"numeric"
  });
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function showPage(id) {
  currentPage = id;
  $("dashboardPage").classList.toggle("hidden", id !== "dashboard");
  $("aiPage").classList.toggle("hidden", id !== "ai");
  $("modulePage").classList.toggle("hidden", !modules[id]);

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === id);
  });

  if (modules[id]) renderModule(id);
  if (id === "dashboard") updateDashboard();

  $("sidebar").classList.remove("open");
  window.scrollTo({top:0, behavior:"smooth"});
}

// 4. AUTHENTICATION

$("authToggle").addEventListener("click", () => {
  isRegister = !isRegister;
  $("authTitle").textContent = isRegister
    ? "Welcome to your world 🌷"
    : "Welcome back! ✨";
  $("authDescription").textContent = isRegister
    ? "შექმენი შენი პირადი ანგარიში"
    : "შედი შენს პირად სივრცეში";
  $("authSubmit").textContent = isRegister ? "ანგარიშის შექმნა" : "შესვლა";
  $("authToggle").textContent = isRegister ? "შესვლა" : "ანგარიშის შექმნა";
  $("authName").classList.toggle("hidden", !isRegister);
});

$("authForm").addEventListener("submit", async e => {
  e.preventDefault();

  if (!db) {
    notify("ჯერ Supabase-ის კონფიგურაცია შეავსე.");
    return;
  }

  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const name = $("authName").value.trim();

  try {
    $("authSubmit").disabled = true;

    if (isRegister) {
      if (!name) throw new Error("შეიყვანე შენი სახელი.");

      const {data,error} = await db.auth.signUp({
        email,
        password,
        options: { data: { full_name:name } }
      });

      if (error) throw error;

      if (!data.session) {
        notify("ანგარიში შექმნილია. შეამოწმე ელფოსტა დასადასტურებლად.");
      } else {
        notify("კეთილი იყოს შენი მობრძანება! 🌷");
      }
    } else {
      const {error} = await db.auth.signInWithPassword({
        email,password
      });
      if (error) throw error;
    }

    $("authForm").reset();
  } catch(error) {
    notify(error.message);
  } finally {
    $("authSubmit").disabled = false;
  }
});

async function logout() {
  if (db) await db.auth.signOut();
  currentUser = null;
  $("app").classList.add("hidden");
  $("authScreen").classList.remove("hidden");
}

$("logoutBtn").addEventListener("click", logout);

async function initializeApp() {
  if (!db) {
    $("authScreen").classList.remove("hidden");
    return;
  }

  const {data:{session}} = await db.auth.getSession();

  if (session) {
    await startSession(session.user);
  }

  db.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      setTimeout(() => startSession(session.user),0);
    }
    if (event === "SIGNED_OUT") {
      currentUser = null;
      $("app").classList.add("hidden");
      $("authScreen").classList.remove("hidden");
    }
  });
}

async function startSession(user) {
  currentUser = user;
  $("authScreen").classList.add("hidden");
  $("app").classList.remove("hidden");

  const name = user.user_metadata?.full_name ||
    user.email?.split("@")[0] || "Friend";

  $("welcomeName").textContent = name;
  $("sideName").textContent = name;
  $("todayDate").textContent = getToday();

  await loadEntries();
  await loadProfile();
  await loadTasks();
  updateDashboard();
}

// 5. DATABASE — ENTRIES

async function loadEntries() {
  if (!currentUser) return;

  const {data,error} = await db.from("entries")
    .select("*")
    .eq("user_id",currentUser.id)
    .order("created_at",{ascending:false});

  if (error) {
    notify("მონაცემების ჩატვირთვა ვერ მოხერხდა.");
    return;
  }

  entries = data || [];
}

async function addEntry(type, title, content, extra = {}) {
  if (!currentUser) return;

  const payload = {
    user_id:currentUser.id,
    type,
    title,
    content,
    extra
  };

  const {data,error} = await db.from("entries")
    .insert(payload)
    .select()
    .single();

  if (error) {
    notify("შენახვა ვერ მოხერხდა: " + error.message);
    return false;
  }

  entries.unshift(data);
  notify("წარმატებით შეინახა! ✨");
  return true;
}

async function deleteEntry(id) {
  const {error} = await db.from("entries")
    .delete()
    .eq("id",id)
    .eq("user_id",currentUser.id);

  if (error) return notify("წაშლა ვერ მოხერხდა.");

  entries = entries.filter(item => item.id !== id);
  renderModule(currentPage);
  updateDashboard();
  notify("ჩანაწერი წაიშალა.");
}

// 6. MODULE RENDERING

function renderModule(id) {
  const [title,description,icon] = modules[id];

  $("moduleTitle").textContent = title;
  $("moduleDescription").textContent = description;
  $("moduleIcon").textContent = icon;

  const content = $("moduleContent");

  if (id === "profile") {
    renderProfile(content);
    return;
  }

  if (id === "focus") {
    renderFocus(content);
    return;
  }

  if (id === "challenges") {
    renderChallenges(content);
    return;
  }

  if (id === "closet") {
    renderCloset(content);
    return;
  }

  const type = id;
  const relevant = entries.filter(item => item.type === type);

  let placeholder = "ჩაწერე შენი ინფორმაცია...";
  let titlePlaceholder = "სათაური";

  if (id === "goals") {
    placeholder = "აღწერე შენი მიზანი და პირველი ნაბიჯები...";
    titlePlaceholder = "ჩემი მიზანი";
  } else if (id === "diary") {
    placeholder = "როგორ ჩაიარა დღემ? რისი გაზიარება გინდა?";
    titlePlaceholder = "დღევანდელი ჩანაწერი";
  } else if (id === "reading") {
    placeholder = "ავტორი, ბოლო წაკითხული გვერდი, შთაბეჭდილებები...";
    titlePlaceholder = "წიგნის სახელი";
  } else if (id === "english") {
    placeholder = "სიტყვა, თარგმანი და მაგალითი...";
    titlePlaceholder = "ახალი ინგლისური სიტყვა";
  } else if (id === "routine") {
    placeholder = "აღწერე დავალება...";
    titlePlaceholder = "დღის დავალება";
  } else if (id === "future") {
    placeholder = "რას ეტყოდი შენს მომავალ თავს?";
    titlePlaceholder = "წერილის სათაური";
  } else if (id === "fashion") {
    placeholder = "აღწერე სასურველი ლუქი, ფერები ან შემთხვევა...";
    titlePlaceholder = "Outfit იდეა";
  }

  content.innerHTML = `
    <div class="panel">
      <h3>+ ახალი ჩანაწერი</h3>
      <form class="module-form" id="entryForm">
        <input id="entryTitle" maxlength="120" placeholder="${escapeHTML(titlePlaceholder)}" required>
        <textarea id="entryContent" maxlength="10000" placeholder="${escapeHTML(placeholder)}" required></textarea>
        <button class="primary-btn" type="submit">შენახვა ✨</button>
      </form>
    </div>
    <div class="section-heading">
      <div><h2>ჩემი ჩანაწერები</h2><p>ყველაფერი შენს პირად სივრცეში ინახება.</p></div>
    </div>
    <div class="module-list" id="entryList">
      ${relevant.length ? relevant.map(item => `
        <article class="entry-card">
          <h3>${escapeHTML(item.title)}</h3>
          <small>${new Date(item.created_at).toLocaleDateString("ka-GE")}</small>
          <p>${escapeHTML(item.content)}</p>
          <div class="entry-actions">
            <button data-delete="${escapeHTML(item.id)}">წაშლა</button>
          </div>
        </article>
      `).join("") : '<div class="empty-state">🌷 ჯერ ჩანაწერები არ გაქვს. დაიწყე პირველით!</div>'}
    </div>
  `;

  $("entryForm").addEventListener("submit", async e => {
    e.preventDefault();
    const ok = await addEntry(type,$("entryTitle").value.trim(),
      $("entryContent").value.trim());

    if (ok) renderModule(id);
    updateDashboard();
  });

  content.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click",() => deleteEntry(button.dataset.delete));
  });
}

// 7. PERSONAL PROFILE

async function loadProfile() {
  if (!currentUser) return;

  const {data} = await db.from("profiles")
    .select("*")
    .eq("id",currentUser.id)
    .maybeSingle();

  if (data) {
    $("welcomeName").textContent = data.full_name || "beautiful soul";
    $("sideName").textContent = data.full_name || "My Profile";
    $("sideAvatar").textContent = data.full_name?.[0] || "✿";
  }
}

async function renderProfile(container) {
  const {data,error} = await db.from("profiles")
    .select("*")
    .eq("id",currentUser.id)
    .maybeSingle();

  if (error) return notify("პროფილის ჩატვირთვა ვერ მოხერხდა.");

  const p = data || {};

  container.innerHTML = `
    <div class="panel">
      <h3>My Personal Information 👤</h3>
      <form id="profileForm" class="module-form">
        <input id="pName" maxlength="80" placeholder="სახელი" value="${escapeHTML(p.full_name || "")}" required>
        <textarea id="pAbout" maxlength="2000" placeholder="ჩემ შესახებ...">${escapeHTML(p.about || "")}</textarea>
        <input id="pInterests" placeholder="ჩემი ინტერესები" value="${escapeHTML(p.interests || "")}">
        <input id="pGoals" placeholder="ჩემი ოცნებები და მიზნები" value="${escapeHTML(p.goals || "")}">
        <input id="pColors" placeholder="საყვარელი ფერები" value="${escapeHTML(p.favorite_colors || "")}">
        <input id="pStyle" placeholder="ჩემი სტილი" value="${escapeHTML(p.style || "")}">
        <input id="pHobbies" placeholder="ჰობები" value="${escapeHTML(p.hobbies || "")}">
        <textarea id="pStrengths" placeholder="ჩემი ძლიერი მხარეები">${escapeHTML(p.strengths || "")}</textarea>
        <textarea id="pImprove" placeholder="რის განვითარება მინდა?">${escapeHTML(p.improvements || "")}</textarea>
        <button class="primary-btn">პროფილის შენახვა</button>
      </form>
    </div>
  `;

  $("profileForm").addEventListener("submit",async e => {
    e.preventDefault();

    const profile = {
      id:currentUser.id,
      full_name:$("pName").value.trim(),
      about:$("pAbout").value,
      interests:$("pInterests").value,
      goals:$("pGoals").value,
      favorite_colors:$("pColors").value,
      style:$("pStyle").value,
      hobbies:$("pHobbies").value,
      strengths:$("pStrengths").value,
      improvements:$("pImprove").value,
      updated_at:new Date().toISOString()
    };

    const {error} = await db.from("profiles").upsert(profile);

    if (error) return notify("პროფილის შენახვა ვერ მოხერხდა.");

    $("welcomeName").textContent = profile.full_name;
    $("sideName").textContent = profile.full_name;
    $("sideAvatar").textContent = profile.full_name[0] || "✿";
    notify("პროფილი განახლებულია! 🌷");
  });
}

// 8. DAILY TASKS

async function loadTasks() {
  if (!currentUser) return;

  const {data,error} = await db.from("daily_tasks")
    .select("*")
    .eq("user_id",currentUser.id)
    .eq("task_date",todayKey())
    .order("created_at");

  if (!error) dailyTasks = data || [];
}

async function addTask(title) {
  const {data,error} = await db.from("daily_tasks")
    .insert({
      user_id:currentUser.id,
      title,
      task_date:todayKey(),
      completed:false
    })
    .select()
    .single();

  if (error) return notify("დავალების დამატება ვერ მოხერხდა.");

  dailyTasks.push(data);
  updateDashboard();
}

async function toggleTask(id,completed) {
  const {error} = await db.from("daily_tasks")
    .update({completed})
    .eq("id",id)
    .eq("user_id",currentUser.id);

  if (error) return notify("განახლება ვერ მოხერხდა.");

  const task = dailyTasks.find(t => t.id === id);
  if (task) task.completed = completed;

  updateDashboard();
}

function updateDashboard() {
  if (!currentUser) return;

  const goals = entries.filter(e => e.type === "goals");
  const diaries = entries.filter(e => e.type === "diary");
  const achievements = entries.filter(e => e.type === "achievements");

  $("goalCount").textContent = goals.length;
  $("taskCount").textContent = dailyTasks.filter(t => t.completed).length;
  $("diaryCount").textContent = diaries.length;
  $("achievementCount").textContent = achievements.length;

  $("todayTasks").innerHTML = `
    ${dailyTasks.length ? dailyTasks.map(task => `
      <label class="task-row ${task.completed ? "done":""}">
        <input type="checkbox" data-task="${task.id}" ${task.completed ? "checked":""}>
        <span>${escapeHTML(task.title)}</span>
      </label>
    `).join("") : '<div class="empty-state">დღის დავალებები ჯერ არ გაქვს.</div>'}
  `;

  $("todayTasks").querySelectorAll("[data-task]").forEach(input => {
    input.addEventListener("change",() => toggleTask(input.dataset.task,input.checked));
  });

  $("dashboardGoals").innerHTML = goals.slice(0,4).map(g => `
    <div class="task-row"><i class="fa-solid fa-bullseye"></i><span>${escapeHTML(g.title)}</span></div>
  `).join("") || '<div class="empty-state">დაამატე შენი პირველი მიზანი.</div>';

  const progress = goals.length
    ? Math.round((achievements.length / Math.max(goals.length,1))*100)
    : 0;

  const percentage = Math.min(progress,100);
  $("progressNumber").textContent = percentage + "%";
  document.querySelector(".progress-circle").style.background =
    `conic-gradient(var(--pink) ${percentage}%,#f8e9eb ${percentage}%)`;

  $("dailyQuestion").textContent =
    questions[Math.floor(Date.now()/86400000)%questions.length];

  $("dailyQuote").textContent =
    quotes[new Date().getDate()%quotes.length];
}

// 9. DAILY QUESTION

$("saveDailyAnswer").addEventListener("click",async () => {
  const answer = $("dailyAnswer").value.trim();
  if (!answer) return notify("ჯერ შენი პასუხი ჩაწერე.");

  const ok = await addEntry("daily_answer",$("dailyQuestion").textContent,answer);
  if (ok) $("dailyAnswer").value = "";
});

// 10. AI CHAT

document.querySelectorAll(".mode-card").forEach(button => {
  button.addEventListener("click",() => {
    currentMode = button.dataset.mode;
    document.querySelectorAll(".mode-card").forEach(b =>
      b.classList.toggle("selected",b === button)
    );
    $("currentMode").textContent = currentMode;
    notify("რეჟიმი შეიცვალა: " + currentMode);
  });
});

function addMessage(text,type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.textContent = text;
  $("chatMessages").appendChild(div);
  $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
}

$("chatForm").addEventListener("submit",async e => {
  e.preventDefault();

  const message = $("chatInput").value.trim();
  if (!message) return;

  if (!db || !currentUser) return notify("ჯერ ანგარიშში შედი.");

  $("chatInput").value = "";
  addMessage(message,"user");

  const loading = document.createElement("div");
  loading.className = "message assistant";
  loading.textContent = "ვფიქრობ... ✨";
  $("chatMessages").appendChild(loading);

  try {
    const recentEntries = entries.slice(0,12).map(item => ({
      type:item.type,
      title:item.title,
      content:item.content
    }));

    const {data,error} = await db.functions.invoke("ai-assistant",{
      body:{
        message,
        mode:currentMode,
        history:chatHistory.slice(-8),
        context:recentEntries
      }
    });

    if (error) throw error;
    if (!data?.reply) throw new Error("AI პასუხი ვერ მივიღე.");

    loading.remove();
    addMessage(data.reply,"assistant");

    chatHistory.push(
      {role:"user",content:message},
      {role:"assistant",content:data.reply}
    );

    chatHistory = chatHistory.slice(-12);

  } catch(error) {
    loading.remove();
    addMessage("პასუხის მიღება ვერ მოხერხდა. შეამოწმე AI კონფიგურაცია და ინტერნეტი.","assistant");
    console.error(error);
  }
});

// 11. FOCUS ROOM

let timerInterval = null;
let remainingSeconds = 25*60;
let isRunning = false;

function renderFocus(container) {
  container.innerHTML = `
    <div class="panel" style="text-align:center;padding:40px">
      <h2>🍅 Pomodoro Focus Room</h2>
      <p class="muted">დაუთმე დრო ერთ საქმეს, შემდეგ დაისვენე.</p>
      <div id="timerDisplay" style="font-size:65px;font-weight:700;margin:30px">25:00</div>
      <input id="focusMinutes" type="number" min="1" max="120" value="25" style="width:90px;padding:12px;border:1px solid var(--border);border-radius:10px">
      <p class="muted" style="margin-top:8px">სამუშაო დრო წუთებში</p>
      <div style="margin-top:20px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap">
        <button class="primary-btn" id="timerStart">დაწყება</button>
        <button class="outline-btn" id="timerReset">თავიდან</button>
      </div>
      <p id="focusStatus" class="muted" style="margin-top:20px">შენ შეგიძლია! 🌷</p>
    </div>
  `;

  $("timerStart").addEventListener("click",() => {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      $("timerStart").textContent = "გაგრძელება";
      return;
    }

    if (remainingSeconds <= 0) {
      remainingSeconds = Number($("focusMinutes").value)*60;
    }

    isRunning = true;
    $("timerStart").textContent = "პაუზა";

    timerInterval = setInterval(() => {
      remainingSeconds--;

      const m = Math.floor(remainingSeconds/60);
      const s = remainingSeconds%60;

      $("timerDisplay").textContent =
        `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        $("timerStart").textContent = "ხელახლა დაწყება";
        $("focusStatus").textContent = "შესანიშნავია! დროა შეისვენო. 🌷";
        notify("სასწავლო დრო დასრულდა!");
      }
    },1000);
  });

  $("timerReset").addEventListener("click",() => {
    clearInterval(timerInterval);
    isRunning = false;
    remainingSeconds = Number($("focusMinutes").value)*60;
    $("timerDisplay").textContent =
      `${String(Math.floor(remainingSeconds/60)).padStart(2,"0")}:00`;
    $("timerStart").textContent = "დაწყება";
    $("focusStatus").textContent = "ახალი სესიისთვის მზად ხარ!";
  });

  $("focusMinutes").addEventListener("change",() => {
    if (!isRunning) {
      remainingSeconds = Number($("focusMinutes").value)*60;
      $("timerDisplay").textContent =
        `${String(Math.floor(remainingSeconds/60)).padStart(2,"0")}:${String(remainingSeconds%60).padStart(2,"0")}`;
    }
  });
}

// 12. CHALLENGES

function renderChallenges(container) {
  const challenge = entries.filter(e => e.type === "challenges");

  container.innerHTML = `
    <div class="panel">
      <h3>🌸 Start a new challenge</h3>
      <p class="muted" style="margin:10px 0">აირჩიე პატარა ყოველდღიური ჩვევა და მიჰყევი შენს ტემპს.</p>
      <form id="challengeForm" class="module-form">
        <input id="challengeTitle" placeholder="მაგ: English Challenge" required>
        <input id="challengeTask" placeholder="ყოველდღიური პატარა დავალება" required>
        <button class="primary-btn">გამოწვევის დაწყება</button>
      </form>
    </div>
    <div class="module-list">
      ${challenge.map(c => `
        <div class="entry-card">
          <h3>🌷 ${escapeHTML(c.title)}</h3>
          <p>${escapeHTML(c.content)}</p>
          <p class="muted">შექმნის თარიღი: ${new Date(c.created_at).toLocaleDateString("ka-GE")}</p>
        </div>
      `).join("") || '<div class="empty-state">ჯერ გამოწვევა არ აგირჩევია.</div>'}
    </div>
  `;

  $("challengeForm").addEventListener("submit",async e => {
    e.preventDefault();
    const ok = await addEntry("challenges",$("challengeTitle").value,$("challengeTask").value);
    if (ok) renderChallenges(container);
  });
}

// 13. DIGITAL CLOSET

function renderCloset(container) {
  const clothes = entries.filter(e => e.type === "closet");

  container.innerHTML = `
    <div class="panel">
      <h3>👗 Add to My Digital Closet</h3>
      <form id="closetForm" class="module-form">
        <input id="clothName" placeholder="ტანსაცმლის დასახელება" required>
        <select id="clothCategory">
          <option>ზედა ტანსაცმელი</option>
          <option>შარვლები და ქვედაბოლოები</option>
          <option>კაბები</option>
          <option>ფეხსაცმელი</option>
          <option>ჩანთები</option>
          <option>აქსესუარები</option>
        </select>
        <input type="file" id="clothPhoto" accept="image/jpeg,image/png,image/webp">
        <button class="primary-btn">გარდერობში დამატება</button>
      </form>
    </div>
    <div class="module-list">
      ${clothes.map(c => `
        <div class="entry-card">
          <h3>${escapeHTML(c.title)}</h3>
          <p>${escapeHTML(c.content)}</p>
          ${c.extra?.photo ? `<img src="${escapeHTML(c.extra.photo)}" alt="ჩემი ტანსაცმელი" style="width:100%;max-height:220px;object-fit:cover;border-radius:10px;margin-top:12px">` : ""}
          <div class="entry-actions"><button data-delete="${escapeHTML(c.id)}">წაშლა</button></div>
        </div>
      `).join("") || '<div class="empty-state">შეავსე შენი ციფრული გარდერობი! 🌷</div>'}
    </div>
  `;

  $("closetForm").addEventListener("submit",async e => {
    e.preventDefault();

    const file = $("clothPhoto").files[0];
    let photo = null;

    if (file) {
      if (!["image/jpeg","image/png","image/webp"].includes(file.type) ||
          file.size > 5*1024*1024) {
        return notify("ატვირთე JPG, PNG ან WebP ფოტო მაქსიმუმ 5MB.");
      }

      const filePath = `${currentUser.id}/${crypto.randomUUID()}.${file.name.split(".").pop().toLowerCase()}`;

      const {error:uploadError} = await db.storage
        .from("closet")
        .upload(filePath,file);

      if (uploadError) return notify("ფოტოს ატვირთვა ვერ მოხერხდა.");

      const {data:photoData} = await db.storage
        .from("closet")
        .createSignedUrl(filePath,3600);

      photo = photoData?.signedUrl || null;
    }

    const ok = await addEntry(
      "closet",
      $("clothName").value,
      $("clothCategory").value,
      {photo}
    );

    if (ok) renderCloset(container);
  });

  container.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click",() => deleteEntry(button.dataset.delete));
  });
}

// 14. NAVIGATION

$("mainNav").addEventListener("click",e => {
  const button = e.target.closest("[data-page]");
  if (button) showPage(button.dataset.page);
});

document.addEventListener("click",e => {
  const button = e.target.closest("[data-goto]");
  if (button) showPage(button.dataset.goto);
});

$("menuToggle").addEventListener("click",() => {
  $("sidebar").classList.toggle("open");
});

// 15. THEME

$("themeToggle").addEventListener("click",() => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  $("themeToggle").innerHTML = dark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';

  if (currentUser) {
    db.from("profiles").upsert({
      id:currentUser.id,
      theme:dark ? "dark":"light"
    }).then(({error}) => {
      if (error) console.error(error);
    });
  }
});

// 16. START

initializeApp();
