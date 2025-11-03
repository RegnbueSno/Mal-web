// Select elements
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const images = document.querySelectorAll(".popup-image");
const closeBtn = document.querySelector(".close");

// Open lightbox
images.forEach(img => {
    img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("show");
    });
});

// Close lightbox
const closeLightbox = () => lightbox.classList.remove("show");

closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
});
