const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const loadBtn = document.getElementById("load-btn");
const loadStatus = document.getElementById("load-status");
const postsList = document.getElementById("posts");

const form = document.getElementById("create-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

const setStatus = (element, text, kind) => {
    element.textContent = text;
    element.className = kind ? `status ${kind}` : "status";
};

const createPostElement = (post) => {
    const item = document.createElement("li");
    item.className = "post";

    const heading = document.createElement("h3");
    heading.textContent = post.title;

    const idSpan = document.createElement("span");
    idSpan.className = "post-id";
    idSpan.textContent = `#${post.id}`;
    heading.appendChild(idSpan);

    const text = document.createElement("p");
    text.textContent = post.body;

    item.append(heading, text);
    return item;
};

const loadPosts = async () => {
    loadBtn.disabled = true;
    setStatus(loadStatus, "Загрузка...");
    postsList.textContent = "";

    try {
        const response = await fetch(`${POSTS_URL}?_limit=5`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const posts = await response.json();
        for (const post of posts) {
            postsList.appendChild(createPostElement(post));
        }
        setStatus(loadStatus, `Загружено публикаций: ${posts.length}`, "success");
    } catch (error) {
        setStatus(
            loadStatus,
            `Не удалось загрузить публикации. ${error.message}`,
            "error"
        );
    } finally {
        loadBtn.disabled = false;
    }
};

const createPost = async (title, body) => {
    submitBtn.disabled = true;
    setStatus(formStatus, "Отправка...");

    try {
        const response = await fetch(POSTS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, userId: 1 }),
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const created = await response.json();
        setStatus(
            formStatus,
            `Публикация создана. ID: ${created.id}, заголовок: ${created.title}`,
            "success"
        );
        form.reset();
    } catch (error) {
        setStatus(formStatus, `Ошибка отправки. ${error.message}`, "error");
    } finally {
        submitBtn.disabled = false;
    }
};

loadBtn.addEventListener("click", loadPosts);

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
        setStatus(formStatus, "Заполните заголовок и текст публикации", "error");
        return;
    }

    createPost(title, body);
});
