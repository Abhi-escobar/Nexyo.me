const words = ["Developer.", "Builder.", "Creator.", "Problem Solver."];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typewriterElement = document.getElementById("typewriter");

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 80 : 120;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }

        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const hamburgerIcon = document.querySelector('.hamburger i');
        const navItems = document.querySelectorAll('.nav-link');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                hamburgerIcon.classList.remove('bx-menu');
                hamburgerIcon.classList.add('bx-x');
            } else {
                hamburgerIcon.classList.remove('bx-x');
                hamburgerIcon.classList.add('bx-menu');
            }
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerIcon.classList.remove('bx-x');
                hamburgerIcon.classList.add('bx-menu');
            });
        });

        const bioText = "I'm a 1st year BCA student passionate about building real-world projects. I love Python, mobile apps, and turning ideas into working products that solve real problems.|Currently pursuing BCA at Arka Jain University, Jharkhand. I've already shipped projects like MedChain — an occupational health platform built at a 24-hour hackathon. I'm always learning, always building.";
        const bioElement = document.getElementById("bio-typewriter");
        let bioIndex = 0;
        let bioStarted = false;

        function typeBio() {
            if (bioIndex < bioText.length) {
                let char = bioText.charAt(bioIndex);
                if (char === '|') {
                    bioElement.innerHTML += '<br><br>';
                } else {
                    bioElement.innerHTML += char;
                }
                bioIndex++;
                // Variable speed between 5ms and 15ms
                const speed = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
                setTimeout(typeBio, speed);
            }
        }

        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

        const bioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !bioStarted) {
                    bioStarted = true;
                    setTimeout(typeBio, 500); // Wait half a second before typing
                }
            });
        }, { threshold: 0.5 }); // Require 50% of the text block to be visible
        bioObserver.observe(document.getElementById("bio-container"));

        revealElements.forEach(el => revealObserver.observe(el));

        const navbar = document.getElementById('navbar');
        const sections = document.querySelectorAll('section');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');

            let current = '';
            sections.forEach(section => {
                if (scrollY >= (section.offsetTop - 200)) current = section.getAttribute('id');
            });

            navItems.forEach(li => {
                li.classList.remove('active');
                if (li.getAttribute('href').includes(current)) li.classList.add('active');
            });
        });

        document.addEventListener("DOMContentLoaded", () => {
            if (typewriterElement) type();
        });