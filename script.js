const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = siteNav
    ? Array.from(siteNav.querySelectorAll('a[href^="#"]'))
    : [];
const sectionIds = navLinks
    .map((link) => link.getAttribute("href")?.slice(1))
    .filter(Boolean);

if (menuToggle && siteNav) {
    const closeMenu = () => {
        siteNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    const setActiveLink = (sectionId) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;
            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            !siteNav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 980) {
            closeMenu();
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort(
                    (left, right) =>
                        right.intersectionRatio - left.intersectionRatio,
                )[0];

            if (visible?.target.id) {
                setActiveLink(visible.target.id);
            }
        },
        {
            rootMargin: "-35% 0px -50% 0px",
            threshold: [0.15, 0.3, 0.5, 0.75],
        },
    );

    sectionIds.forEach((id) => {
        const section = document.getElementById(id);

        if (section) {
            observer.observe(section);
        }
    });

    if (sectionIds[0]) {
        setActiveLink(sectionIds[0]);
    }
}
