"use client";

import { useEffect } from "react";
import { useCarousel } from "@/components/ui/carousel";

export function CarouselDotSync({
	activeIndex,
	onIndexChange,
}: {
	activeIndex: number;
	onIndexChange: (index: number) => void;
}) {
	const { api } = useCarousel();

	useEffect(() => {
		if (!api) return;
		const onSelect = () => onIndexChange(api.selectedScrollSnap());
		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api, onIndexChange]);

	useEffect(() => {
		if (!api) return;
		api.scrollTo(activeIndex);
	}, [api, activeIndex]);

	return null;
}
