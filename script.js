const readBtn = document.getElementById('readBtn');
const writeBtn = document.getElementById('writeBtn');
const readSection = document.getElementById('readSection');
const writeSection = document.getElementById('writeSection');
const aboutBtn = document.getElementById('aboutBtn');
const aboutSection = document.getElementById('aboutSection');


readBtn.onclick = () => {
  readSection.style.display = 'block';
  writeSection.style.display = 'none';
  aboutSection.style.display = 'none';
  fetchBlogs();
};

writeBtn.onclick = () => {
  readSection.style.display = 'none';
  writeSection.style.display = 'block';
  aboutSection.style.display = 'none';
};

aboutBtn.onclick = () => {
  readSection.style.display = 'none';
  writeSection.style.display = 'none';
  aboutSection.style.display = 'block';
  
  // Hide full blog view if it's open
  document.getElementById('fullBlogView').style.display = 'none';
  document.body.classList.remove('fullBlog');
};



const blogForm = document.getElementById('blogForm');


const blogContainer = document.getElementById("blogsContainer");


async function fetchBlogs() {
  try {
    const res = await fetch("https://blog-backend-32ch.onrender.com");
    const blogs = await res.json();
    
  const container = document.getElementById('blogsContainer');
    container.innerHTML = ""; // Clear existing blogs

    blogs.reverse().forEach(blog => {
      const card = document.createElement("div");
      card.classList.add("blog-card");

      card.innerHTML = `
        ${blog.image ? `<img src="${blog.image}" class="blog-image" />` : ""}
        <h3 class="preview-title">${blog.title}</h3>
        <p class= "preview-author"><strong>Author:</strong> ${blog.author}</p>
       
      `;
      
      card.addEventListener("click", (e) => {
        if(
          e.target.closest('.blog-image') || e.target.closest('h3') || e.target.closest('.preview-text')
        )
        {
          showFullBlog(blog);
        }
        });
   
       container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
}

fetchBlogs(); // Call this once page loads

function showFullBlog(blog) {

    // document.body.style.backgroundImage = "url(whitii.jpg)"

  const fullView =
  document.getElementById('fullBlogView');
  const blogsList =
  document.getElementById('blogsContainer');

  blogsList.style.display = 'none';
  fullView.style.display = 'block';
  document.body.classList.add('fullBlog');

  document.getElementById('fullTitle').textContent = blog.title;
  document.getElementById('fullAuthor').textContent = `Author: ${blog.author}`;
  document.getElementById('fullContent').textContent = blog.content;

  
  const img = document.getElementById('fullImage');
  if(blog.image){
    img.src = blog.image;
    img.style.display = 'block';
  }
  else{
    img.style.display = 'none';
  }

history.pushState({view: 'fullBlog'}, '', '#blog');
}



// const blogForm = document.getElementById('blogForm');
const postStatus = document.getElementById('postStatus');

blogForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(blogForm);

  postStatus.textContent = "Posting your blog...";

  try {
    const response = await fetch('https://blog-backend-32ch.onrender.com', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      postStatus.textContent = "Blog posted successfully!";
      blogForm.reset();
    } else {
      const err = await response.json();
      postStatus.textContent = '';//"Error: " + (err.message || 'Something went wrong');
    }
  } catch (error) {
    postStatus.textContent = "Failed to post blog.";
    console.error(error);
  }
});

readBtn.click();



window.addEventListener('popstate', (event)=> {
  document.getElementById('fullBlogView').style.display = 'none';
  document.getElementById('blogsContainer').style.display = '';
  document.body.classList.remove('fullBlog');
});



