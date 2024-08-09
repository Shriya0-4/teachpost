
function toggleProfileAside() {
    var aside = document.getElementById("profileAside");
    aside.classList.toggle("active");
}

document.addEventListener('click', function(event) {
    var aside = document.getElementById("profileAside");
    var profile = document.querySelector('.profile');
    
    if (!aside.contains(event.target) && !profile.contains(event.target)) {
        aside.classList.remove("active");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newPostForm');
    const postsContainer = document.getElementById('posts');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const postContent = document.getElementById('postContent').value;
        const postImageInput = document.getElementById('postImage');
        const postImage = postImageInput.files[0];

        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const postContentElement = document.createElement('div');
        postContentElement.classList.add('post-content');

        const postTextElement = document.createElement('div');
        postTextElement.classList.add('post-text');
        postTextElement.textContent = postContent;

        if (postImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                postContentElement.appendChild(imgElement);
                postContentElement.appendChild(postTextElement);
                postElement.appendChild(postContentElement);
                postsContainer.prepend(postElement);
            };
            reader.readAsDataURL(postImage);
        } else {
            postContentElement.appendChild(postTextElement);
            postElement.appendChild(postContentElement);
            postsContainer.prepend(postElement);
        }
        form.reset();
    });
});

function openPostModal() {
    const modal = document.getElementById('postModal');
    modal.style.display = "block";
}

function closePostModal() {
    const modal = document.getElementById('postModal');
    modal.style.display = "none";
}

document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch('/feed', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Post added successfully!');
            closePostModal();
            location.reload(); 
        } else {
            console.error('Failed to add post');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


window.onclick = function(event) {
    const modal = document.getElementById('postModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function openProjectForm() {
    document.getElementById('projectForm').style.display = 'block';
}

function closeProjectForm() {
    document.getElementById('projectForm').style.display = 'none';
}

function openRequestForm(recipient) {
    const requestForm = document.getElementById('requestForm');
    requestForm.style.display = 'block';
    document.getElementById('recipient').value = recipient;
}

function closeRequestForm() {
    document.getElementById('requestForm').style.display = 'none';
}


function toggleProfileAside() {
    const profileAside = document.getElementById('profileAside');
    profileAside.classList.toggle('active');
}


