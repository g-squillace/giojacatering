import gsap from "gsap";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const animatePageIn = () => {
  const transitionElement = document.getElementById("transition-element");

  if (transitionElement) {
    const tl = gsap.timeline();

    tl.set(transitionElement, {
      y: 0,
    }).to(transitionElement, {
      y: "-100vh",
      duration: 0.75,
      ease: "power3.in",
    });
  }
};

export const animatePageOut = (href: string, router: AppRouterInstance) => {
  const animationWrapper = document.getElementById("transition-element");

  if (animationWrapper) {
    const tl = gsap.timeline();

    tl.set(animationWrapper, {
      y: "100vh",
    }).to(animationWrapper, {
      y: 0,
      duration: 0.75,
      ease: "power3.out",
      onComplete: () => {
        router.push(href);
      },
    });
  }
};
