import gsap from "gsap";
import { RefObject, useEffect } from "react";

export function entrySidebarAnimation(
	menuItemsRef: RefObject<(HTMLLIElement | null)[]>,
	footerItemsRef: RefObject<(HTMLLIElement | null)[]>,
	sidebarRef: RefObject<HTMLDivElement | null>
) {
	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from(menuItemsRef.current, {
				x: -50,
				opacity: 0,
				duration: 0.5,
				stagger: 0.08,
				ease: "power2.out",
			});

			gsap.from(footerItemsRef.current, {
				x: -50,
				opacity: 0,
				duration: 0.5,
				delay: 0.5,
				stagger: 0.08,
				ease: "power2.out",
			});
		}, sidebarRef);

		return () => ctx.revert();
	}, []);
}

export function handleSidebarElementMouseEnterAnimation(e: React.MouseEvent<HTMLAnchorElement>) {
	gsap.to(e.currentTarget, {
		x: 4,
		duration: 0.1,
		ease: "power2.out",
	});
}

export function handleSidebarElementMouseLeaveAnimation(e: React.MouseEvent<HTMLAnchorElement>) {
	gsap.to(e.currentTarget, {
		x: 0,
		duration: 0.1,
		ease: "power2.out",
	});
}
